import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import fs from 'fs';

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 Firebase init
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 🔥 SEND PUSH

    app.post('/check-achievements', async (req, res) => {
  const { token, stats } = req.body;

  if (!token || !stats) {
    return res.status(400).send({ error: 'missing data' });
  }

  try {
    // 🔥 simpele achievements (later uitbreiden)
    const achievements = [
      { id: '1_day', type: 'days', requirement: 1, title: '1 day clean' },
      { id: '3_days', type: 'days', requirement: 3, title: '3 days clean' },
      { id: '7_days', type: 'days', requirement: 7, title: '1 week clean' },
    ];

    const unlocked = achievements.filter((a) => {
      if (a.type === 'days') return stats.days >= a.requirement;
      return false;
    });

    for (const a of unlocked) {
      const message = {
        token,
        notification: {
          title: 'Achievement unlocked 🏆',
          body: a.title,
        },
        android: {
          priority: 'high',
          notification: {
            channelId: 'default',
          },
        },
      };

      await admin.messaging().send(message);
    }

    res.send({ success: true, count: unlocked.length });
  } catch (e) {
    console.error('❌ CHECK ERROR:', e);
    res.status(500).send({ error: e.message });
  }
});

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

// test route
app.get('/', (req, res) => {
  res.send('Push backend running 🔥');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});