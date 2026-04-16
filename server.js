import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import fs from 'fs';
import dotenv from 'dotenv';
import {
  DEFAULT_CURRENCY,
  DEFAULT_LANGUAGE,
  extractLegacyProfile,
  getAppDefinition,
  normalizeCurrency,
  normalizeLanguage,
} from './appDefinitions.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT || 3000);
const DB_FILE = './devices.json';
const DEFAULT_TEST_TITLE = 'Backend test';
const DEFAULT_TEST_BODY = 'Unified push flow is active.';
const ACHIEVEMENT_CHECK_INTERVAL_MS = 30_000;

function loadDevices() {
  if (!fs.existsSync(DB_FILE)) return [];

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeStoredDevice).filter(Boolean) : [];
  } catch (error) {
    console.error('failed to load devices', error);
    return [];
  }
}

let devices = loadDevices();

function saveDevices() {
  fs.writeFileSync(DB_FILE, JSON.stringify(devices, null, 2), 'utf-8');
}

function inferAppIdFromProfile(profile = {}) {
  if (
    profile?.drinks_per_day != null ||
    profile?.units_per_day != null ||
    profile?.price_per_drink != null
  ) {
    return 'alcoholstop';
  }

  return 'thcstop';
}

function buildProfile(appId, body = {}) {
  if (body?.profile && typeof body.profile === 'object') {
    return body.profile;
  }

  return extractLegacyProfile(appId, body) || {};
}

function normalizeStoredDevice(device) {
  if (!device?.token) return null;

  const appId = String(device.appId || inferAppIdFromProfile(device.profile || device)).toLowerCase();
  const definition = getAppDefinition(appId);
  if (!definition) return null;

  const profile = buildProfile(appId, device);
  const sentAchievements = Array.isArray(device.sentAchievements)
    ? device.sentAchievements
    : Array.isArray(device.sent)
      ? device.sent
      : [];

  const normalizedDevice = {
    token: String(device.token),
    appId,
    language: normalizeLanguage(device.language || DEFAULT_LANGUAGE),
    currency: normalizeCurrency(device.currency || DEFAULT_CURRENCY),
    profile,
    sentAchievements: [...new Set(sentAchievements.map(String))],
    createdAt: device.createdAt || new Date().toISOString(),
    updatedAt: device.updatedAt || new Date().toISOString(),
  };

  reconcileSentAchievements(normalizedDevice);
  return normalizedDevice;
}

function normalizeRegistration(body = {}) {
  const appId = String(body.appId || inferAppIdFromProfile(body.profile || body)).toLowerCase();
  const definition = getAppDefinition(appId);

  if (!definition) {
    return {
      error: `unsupported appId: ${appId}`,
    };
  }

  const token = typeof body.token === 'string' ? body.token.trim() : '';
  const profile = buildProfile(appId, body);

  return {
    token,
    appId,
    language: normalizeLanguage(body.language || DEFAULT_LANGUAGE),
    currency: normalizeCurrency(body.currency || DEFAULT_CURRENCY),
    profile,
  };
}

function getDeviceIndex(token, appId) {
  return devices.findIndex((device) => device.token === token && device.appId === appId);
}

function isInvalidTokenError(error) {
  const code = error?.code || '';
  return (
    code === 'messaging/registration-token-not-registered' ||
    code === 'messaging/invalid-registration-token'
  );
}

function buildPushPayload(device, achievement) {
  const definition = getAppDefinition(device.appId);
  const message = definition.buildMessage(achievement, device.language, device.currency);

  return {
    type: 'achievement_unlocked',
    appId: definition.appId,
    achievementId: achievement.id,
    targetPage: definition.routePage,
    title: message.title,
    body: message.body,
    emoji: message.emoji,
  };
}

function buildFirebaseMessage({ token, payload }) {
  return {
    token,
    notification: {
      title: payload.title,
      body: payload.body,
    },
    data: Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [key, String(value ?? '')]),
    ),
    android: {
      priority: 'high',
      notification: {
        channelId: 'default',
        sound: 'default',
      },
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
        },
      },
    },
  };
}

function getUnlockedAchievementIds(definition, profile, now = new Date()) {
  if (!definition?.isProfileComplete(profile)) {
    return [];
  }

  const stats = definition.getStats(profile, now);

  return definition.achievements
    .filter((achievement) => (Number(stats[achievement.type]) || 0) >= achievement.requirement)
    .map((achievement) => achievement.id);
}

function reconcileSentAchievements(device, now = new Date()) {
  const definition = getAppDefinition(device.appId);
  if (!definition) return false;

  const unlockedIds = new Set(getUnlockedAchievementIds(definition, device.profile, now));
  const nextSentAchievements = device.sentAchievements.filter((achievementId) =>
    unlockedIds.has(achievementId),
  );

  if (nextSentAchievements.length === device.sentAchievements.length) {
    return false;
  }

  device.sentAchievements = nextSentAchievements;
  device.updatedAt = new Date().toISOString();
  return true;
}

async function sendAchievementPush(device, achievement) {
  const payload = buildPushPayload(device, achievement);
  const message = buildFirebaseMessage({
    token: device.token,
    payload,
  });

  await admin.messaging().send(message);
  return payload;
}

async function processAchievementPushes() {
  const invalidTokens = new Set();
  let changed = false;
  const now = new Date();

  for (const device of devices) {
    const definition = getAppDefinition(device.appId);
    if (!definition) continue;
    if (reconcileSentAchievements(device, now)) {
      changed = true;
    }
    if (!definition.isProfileComplete(device.profile)) continue;

    const stats = definition.getStats(device.profile, now);

    const unlockedAchievements = definition.achievements.filter((achievement) => {
      const currentValue = Number(stats[achievement.type]) || 0;
      return currentValue >= achievement.requirement;
    });

    for (const achievement of unlockedAchievements) {
      if (device.sentAchievements.includes(achievement.id)) continue;

      try {
        const payload = await sendAchievementPush(device, achievement);
        device.sentAchievements.push(achievement.id);
        device.updatedAt = new Date().toISOString();
        changed = true;
        console.log(
          `push sent: ${device.appId} ${achievement.id} -> ${device.token.slice(0, 12)}...`,
          payload,
        );
      } catch (error) {
        console.error(`push failed for ${device.appId}:${achievement.id}`, error);

        if (isInvalidTokenError(error)) {
          invalidTokens.add(`${device.appId}:${device.token}`);
        }
      }
    }
  }

  if (invalidTokens.size > 0) {
    devices = devices.filter((device) => !invalidTokens.has(`${device.appId}:${device.token}`));
    changed = true;
  }

  if (changed) {
    saveDevices();
  }
}

function triggerAchievementProcessing(reason) {
  processAchievementPushes().catch((error) => {
    console.error(`achievement processing failed (${reason})`, error);
  });
}

let serviceAccount;

function parseServiceAccountFromEnv(rawValue) {
  try {
    return JSON.parse(rawValue);
  } catch {
    const placeholder = '__FIREBASE_PRIVATE_KEY_NEWLINE__';
    const normalized = String(rawValue)
      .trim()
      .replace(/\\\\n/g, placeholder)
      .replace(/\\"/g, '"')
      .replace(/\\r/g, '')
      .replace(/\\n/g, '')
      .replace(new RegExp(placeholder, 'g'), '\\n');

    return JSON.parse(normalized);
  }
}

if (process.env.FIREBASE_KEY) {
  serviceAccount = parseServiceAccountFromEnv(process.env.FIREBASE_KEY);
} else {
  serviceAccount = JSON.parse(fs.readFileSync('./firebase-key.json', 'utf-8'));
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

app.post('/register-device', (req, res) => {
  const registration = normalizeRegistration(req.body);

  if (registration.error) {
    return res.status(400).send({ error: registration.error });
  }

  if (!registration.token) {
    return res.status(400).send({ error: 'missing token' });
  }

  const existingIndex = getDeviceIndex(registration.token, registration.appId);
  const timestamp = new Date().toISOString();

  if (existingIndex === -1) {
    devices.push({
      ...registration,
      sentAchievements: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  } else {
    const existing = devices[existingIndex];
    devices[existingIndex] = {
      ...existing,
      ...registration,
      sentAchievements: Array.isArray(existing.sentAchievements) ? existing.sentAchievements : [],
      updatedAt: timestamp,
    };
    reconcileSentAchievements(devices[existingIndex]);
  }

  saveDevices();

  triggerAchievementProcessing(`register-device:${registration.appId}`);

  const definition = getAppDefinition(registration.appId);
  return res.send({
    success: true,
    appId: registration.appId,
    profileComplete: definition.isProfileComplete(registration.profile),
  });
});

app.post('/unregister-device', (req, res) => {
  const registration = normalizeRegistration(req.body);

  if (registration.error) {
    return res.status(400).send({ error: registration.error });
  }

  if (!registration.token) {
    return res.status(400).send({ error: 'missing token' });
  }

  const before = devices.length;
  devices = devices.filter(
    (device) => !(device.token === registration.token && device.appId === registration.appId),
  );

  if (devices.length !== before) {
    saveDevices();
  }

  return res.send({
    success: true,
    removed: before !== devices.length,
  });
});

app.post('/send-achievement', async (req, res) => {
  try {
    const registration = normalizeRegistration(req.body);
    const achievementId = String(req.body?.achievementId || '').trim();

    if (registration.error) {
      return res.status(400).send({ error: registration.error });
    }

    if (!registration.token || !achievementId) {
      return res.status(400).send({ error: 'missing token or achievementId' });
    }

    const definition = getAppDefinition(registration.appId);
    const achievement = definition.achievements.find((item) => item.id === achievementId);

    if (!achievement) {
      return res.status(404).send({ error: `unknown achievementId: ${achievementId}` });
    }

    const payload = buildPushPayload(registration, achievement);

    await admin.messaging().send(
      buildFirebaseMessage({
        token: registration.token,
        payload,
      }),
    );

    return res.send({ success: true, payload });
  } catch (error) {
    console.error('manual achievement push failed', error);
    return res.status(500).send({ error: error.message });
  }
});

app.get('/test-push', async (_req, res) => {
  let success = 0;
  let failed = 0;
  const invalidTokens = new Set();

  for (const device of devices) {
    try {
      await admin.messaging().send(
        buildFirebaseMessage({
          token: device.token,
          payload: {
            type: 'test_push',
            appId: device.appId,
            achievementId: 'test_push',
            targetPage: 'Achievements',
            title: DEFAULT_TEST_TITLE,
            body: DEFAULT_TEST_BODY,
          },
        }),
      );
      success += 1;
    } catch (error) {
      failed += 1;
      console.error(`test push failed for ${device.appId}`, error);

      if (isInvalidTokenError(error)) {
        invalidTokens.add(`${device.appId}:${device.token}`);
      }
    }
  }

  if (invalidTokens.size > 0) {
    devices = devices.filter((device) => !invalidTokens.has(`${device.appId}:${device.token}`));
    saveDevices();
  }

  return res.send({ success, failed, total: devices.length });
});

app.get('/devices', (_req, res) => {
  res.send({
    total: devices.length,
    devices,
  });
});

app.get('/', (_req, res) => {
  res.send('Unified push backend running');
});

triggerAchievementProcessing('startup');

setInterval(() => {
  triggerAchievementProcessing('interval');
}, ACHIEVEMENT_CHECK_INTERVAL_MS);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
