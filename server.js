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

// 🔥 SEND PUSH
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

// 🔥 CHECK ACHIEVEMENTS
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
  token,
  notification: {
    title: 'Achievement unlocked 🏆',
    body: a.title,
  },
  android: {
    priority: 'high',
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

// test route
app.get('/', (req, res) => {
  res.send('Push backend running 🔥');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

app.post('/register-device', (req, res) => {
  const { token, quit_date_time } = req.body;

  if (!token || !quit_date_time) {
    return res.status(400).send({ error: 'missing data' });
  }

  // check of al bestaat
  const exists = devices.find((d) => d.token === token);

  if (!exists) {
    devices.push({
      token,
      quit_date_time,
      sent: [], // opgeslagen achievements
    });
  }

  console.log('📱 DEVICES:', devices.length);

  res.send({ success: true });
});