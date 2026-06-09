import dotenv from 'dotenv';
dotenv.config();

import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import app from './app';
import { setupSocket } from './socket';
import { sendDailyReminder } from './services/notifications';
import { startTournoiAuto } from './services/tournoiAuto';
import pool from './db';

const httpServer = createServer(app);

const io = new SocketServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Socket.io
setupSocket(io);

// Daily reminder scheduler — checks once per minute, sends at 7:00 AM server time
let lastReminderDay = '';
setInterval(async () => {
  const now = new Date();
  if (now.getHours() === 7 && now.getMinutes() === 0) {
    const today = now.toISOString().slice(0, 10);
    if (lastReminderDay === today) return;
    lastReminderDay = today;

    try {
      const result = await pool.query(
        `SELECT fcm_token FROM users WHERE fcm_token IS NOT NULL AND fcm_token <> ''`
      );
      for (const row of result.rows) {
        sendDailyReminder(row.fcm_token).catch(() => {});
      }
    } catch (err) {
      console.error('Daily reminder error:', err);
    }
  }
}, 60_000);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Quiz Islamique API running on port ${PORT}`);
  startTournoiAuto();
});

export default app;
