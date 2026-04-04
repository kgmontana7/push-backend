import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';

const devices = [];

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 Firebase init
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 🔥 SEND PUSH (vanuit app)
app.post('/send-achievement', async (req, res) => {
  const { token, title, body } = req.body;

  try {
    const message = {
      token,
      notification: {
        title,
        body,
      },
      android: {
        priority: 'high',
        notification: {
          channelId: 'default',
          sound: 'default',
        },
      },
    };

    const response = await admin.messaging().send(message);

    res.send({ success: true, response });
  } catch (e) {
    console.error('❌ FIREBASE ERROR:', e);
    res.status(500).send({ error: e.message });
  }
});

// 🔥 CHECK ACHIEVEMENTS (real-time vanuit app)
app.post('/check-achievements', async (req, res) => {
  console.log('🔥 CHECK CALLED:', req.body);

  const { token, stats } = req.body;

  if (!token || !stats) {
    return res.status(400).send({ error: 'missing data' });
  }

  try {
    const achievements = [
      { id: '1_day', requirement: 1, title: '1 day clean' },
      { id: '3_days', requirement: 3, title: '3 days clean' },
      { id: '7_days', requirement: 7, title: '1 week clean' },
    ];

    const unlocked = achievements.filter((a) => stats.days >= a.requirement);

    for (const a of unlocked) {
      const message = {
        token: token,
        notification: {
          title: 'Achievement unlocked 🏆',
          body: a.title,
        },
        data: {
          achievementId: a.id,
        },
        android: {
          priority: 'high',
          notification: {
            channelId: 'default',
            sound: 'default',
          },
        },
      };

      const response = await admin.messaging().send(message);
      console.log('✅ PUSH SENT:', response);
    }

    res.send({ success: true, count: unlocked.length });
  } catch (e) {
    console.error('❌ CHECK ERROR:', e);
    res.status(500).send({ error: e.message });
  }
});

// 🔥 BACKGROUND CHECK (werkt als app dicht is)
setInterval(async () => {
  console.log('⏱️ RUNNING BACKGROUND CHECK');

  const now = new Date();

  for (const device of devices) {
    const quitDate = new Date(device.quit_date_time);
    const diff = now - quitDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    const achievements = [
      { id: '1_day', requirement: 1, title: '1 day clean' },
      { id: '3_days', requirement: 3, title: '3 days clean' },
      { id: '7_days', requirement: 7, title: '1 week clean' },
    ];

    const unlocked = achievements.filter(a => days >= a.requirement);

    for (const a of unlocked) {
      // 🔥 voorkom dubbele pushes
      if (device.sent.includes(a.id)) continue;

      const message = {
        token: device.token,
        notification: {
          title: 'Achievement unlocked 🏆',
          body: a.title,
        },
        data: {
          achievementId: a.id,
        },
        android: {
          priority: 'high',
          notification: {
            channelId: 'default',
            sound: 'default',
          },
        },
      };

      try {
        await admin.messaging().send(message);
        console.log('🚀 AUTO PUSH:', a.title);

        device.sent.push(a.id);
      } catch (e) {
        console.error('❌ AUTO PUSH ERROR:', e);
      }
    }
  }
}, 15000); // elke 15 sec

// 🔥 REGISTER DEVICE
app.post('/register-device', async (req, res) => {
  const { token, quit_date_time } = req.body;

  console.log('📱 REGISTER TOKEN:', token);

  if (!token || !quit_date_time) {
    return res.status(400).send({ error: 'missing data' });
  }

  // 🔥 altijd nieuwste token gebruiken
const existing = devices.find(d => d.token === token);

if (!existing) {
  devices.push({
    token,
    quit_date_time,
    sent: [],
  });
} else {
  // 🔥 update alleen datum, NIET sent resetten
  existing.quit_date_time = quit_date_time;
}

// 🔥 TEST PUSH DIRECT NA REGISTRATIE
try {
  await admin.messaging().send({
    token,
    notification: {
      title: '🔥 TEST NA REGISTER',
      body: 'ALS JE DIT ZIET WERKT BACKEND DIRECT',
    },
    android: {
      priority: 'high',
      notification: {
        channelId: 'default',
        sound: 'default',
      },
    },
  });

  console.log('🚀 DIRECT PUSH NA REGISTER');
} catch (e) {
  console.error('❌ DIRECT PUSH ERROR:', e);
}

  console.log('📱 DEVICES:', devices.length);

  res.send({ success: true });
});

// test route
app.get('/', (req, res) => {
  res.send('Push backend running 🔥');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});