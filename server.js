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

// 🔥 LOAD DEVICES FROM FILE
const DB_FILE = './devices.json';

let devices = [];

if (fs.existsSync(DB_FILE)) {
  devices = JSON.parse(fs.readFileSync(DB_FILE));
}

// 🔥 SAVE DEVICES
const saveDevices = () => {
  fs.writeFileSync(DB_FILE, JSON.stringify(devices, null, 2));
};

// 🔥 FIREBASE INIT
import serviceAccount from './firebase-key.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 🔥 ACHIEVEMENTS
const achievements = [
  { id: '1_day', requirement: 1, title: '1 day clean' },
  { id: '3_days', requirement: 3, title: '3 days clean' },
  { id: '7_days', requirement: 7, title: '1 week clean' },
];

// 🔥 REGISTER DEVICE
app.post('/register-device', async (req, res) => {
  const { token, quit_date_time } = req.body;

  if (!token || !quit_date_time) {
    return res.status(400).send({ error: 'missing data' });
  }

  let device = devices.find(d => d.token === token);

  if (!device) {
    device = {
      token,
      quit_date_time,
      sent: [],
    };
    devices.push(device);
  } else {
    device.quit_date_time = quit_date_time;
  }

  saveDevices();

  console.log('📱 DEVICES:', devices.length);

  res.send({ success: true });
});

// 🔥 CHECK ACHIEVEMENTS (VEILIG)
app.post('/check-achievements', async (req, res) => {
  const { token, stats } = req.body;

  if (!token || !stats) {
    return res.status(400).send({ error: 'missing data' });
  }

  const device = devices.find(d => d.token === token);

  if (!device) {
    return res.status(404).send({ error: 'device not found' });
  }

  const unlocked = achievements.filter(a => stats.days >= a.requirement);

  let sentCount = 0;

  for (const a of unlocked) {
    if (device.sent.includes(a.id)) continue;

    const message = {
      token,
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
      device.sent.push(a.id);
      sentCount++;
    } catch (e) {
      console.error('❌ PUSH ERROR:', e);
    }
  }

  saveDevices();

  res.send({ success: true, sent: sentCount });
});

// 🔥 BACKGROUND CHECK (ELKE 1 MIN)
setInterval(async () => {
  console.log('⏱️ BACKGROUND CHECK');

  const now = new Date();

  for (const device of devices) {
    const quitDate = new Date(device.quit_date_time);
    const diff = now - quitDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    const unlocked = achievements.filter(a => days >= a.requirement);

    for (const a of unlocked) {
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
        device.sent.push(a.id);
        console.log('🚀 AUTO PUSH:', a.title);
      } catch (e) {
        console.error('❌ AUTO PUSH ERROR:', e);
      }
    }
  }

  saveDevices();

}, 60000);

// TEST
app.get('/', (req, res) => {
  res.send('Backend running 🔥');
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});