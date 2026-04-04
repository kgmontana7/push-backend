import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import fs from 'fs';

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 Firebase init
const serviceAccount = JSON.parse(
  fs.readFileSync('./firebase-key.json', 'utf8')
);

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