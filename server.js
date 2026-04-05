import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// 🔥 LOAD DEVICES
const DB_FILE = './devices.json';
let devices = [];

if (fs.existsSync(DB_FILE)) {
  devices = JSON.parse(fs.readFileSync(DB_FILE));
}

// 🔥 SAVE
const saveDevices = () => {
  fs.writeFileSync(DB_FILE, JSON.stringify(devices, null, 2));
};

// 🔥 FIREBASE
let serviceAccount;

if (process.env.FIREBASE_KEY) {
  serviceAccount = JSON.parse(process.env.FIREBASE_KEY);
} else {
  serviceAccount = JSON.parse(
    fs.readFileSync('./firebase-key.json', 'utf-8')
  );
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 🔥 ACHIEVEMENTS
const achievements = [
  { id: '1_day', type: 'days', requirement: 1, title: '1 day clean' },
  { id: '3_days', type: 'days', requirement: 3, title: '3 days clean' },
  { id: '7_days', type: 'days', requirement: 7, title: '1 week clean' },

  { id: '50_joints', type: 'joints', requirement: 50, title: '50 joints avoided' },
  { id: '100_joints', type: 'joints', requirement: 100, title: '100 joints avoided' },

  { id: '50_euro', type: 'money', requirement: 50, title: '€50 saved' },
  { id: '100_euro', type: 'money', requirement: 100, title: '€100 saved' },
];

// 🔥 REGISTER DEVICE
app.post('/register-device', async (req, res) => {
  const {
    token,
    quit_date_time,
    joints_per_day,
    grams_per_day,
    price_per_gram
  } = req.body;

  if (!token || !quit_date_time) {
    return res.status(400).send({ error: 'missing data' });
  }

  let device = devices.find(d => d.token === token);

  if (!device) {
    device = {
      token,
      quit_date_time,
      joints_per_day,
      grams_per_day,
      price_per_gram,
      sent: [],
    };
    devices.push(device);
  } else {
    device.quit_date_time = quit_date_time;
    device.joints_per_day = joints_per_day;
    device.grams_per_day = grams_per_day;
    device.price_per_gram = price_per_gram;
  }

  saveDevices();
  console.log('📱 DEVICES:', devices.length);

  res.send({ success: true });
});

// 🔥 BACKGROUND CHECK (BREIN)
setInterval(async () => {
  console.log('⏱️ BACKGROUND CHECK');

  const now = new Date();

  for (const device of devices) {
    const quitDate = new Date(device.quit_date_time);
    const diff = now - quitDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const jointsAvoided = days * (device.joints_per_day || 0);
    const gramsAvoided = days * (device.grams_per_day || 0);
    const moneySaved = gramsAvoided * (device.price_per_gram || 0);

    const unlocked = achievements.filter(a => {
      if (a.type === 'days') return days >= a.requirement;
      if (a.type === 'joints') return jointsAvoided >= a.requirement;
      if (a.type === 'money') return moneySaved >= a.requirement;
      return false;
    });

    for (const a of unlocked) {
      if (device.sent.includes(a.id)) continue;

const message = {
  token: device.token,
  data: {
    title: 'Achievement unlocked 🏆',
    body: a.title,
    achievementId: a.id,
  },
};
      try {
        await admin.messaging().send(message);
        device.sent.push(a.id);
        console.log('🚀 PUSH:', a.title);
      } catch (e) {
        console.error('❌ PUSH ERROR:', e);
      }
    }
  }

  saveDevices();

}, 60000);

// 🔥 TEST PUSH (POST)
app.post('/send-achievement', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).send({ error: 'No token' });
    }

const message = {
  token,
  data: {
    title: '🔥 TEST PUSH',
    body: 'ALS JE DIT ZIET WERKT HET',
    achievementId: 'test123',
  },
};
    await admin.messaging().send(message);

    console.log('🚀 TEST PUSH SENT');
    res.send({ success: true });

  } catch (e) {
    console.error('❌ TEST PUSH ERROR:', e);
    res.status(500).send({ error: e.message });
  }
});

// 🔥 TEST ROUTE
app.get('/test-push', async (req, res) => {
  if (devices.length === 0) {
    return res.send('no device');
  }

  let success = 0;
  let failed = 0;

  for (const device of devices) {
    try {
   await admin.messaging().send({
  token: device.token,
  data: {
    title: '🔥 TEST TITEL',
    body: 'Dit is een echte notificatie 🚀',
    achievementId: 'test123',
  },
});
      success++;
    } catch (e) {
      console.error('❌ TOKEN FAILED:', device.token);
      device.invalid = true;
      failed++;
    }
  }

  devices = devices.filter(d => !d.invalid);
  saveDevices();

  console.log(`✅ SUCCESS: ${success} | ❌ FAILED: ${failed}`);

  res.send(`success: ${success}, failed: ${failed}`);
});

app.get('/', (req, res) => {
  res.send('Backend running 🔥');
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});