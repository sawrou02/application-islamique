import dotenv from 'dotenv';
dotenv.config();

import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import app from './app';
import { setupSocket } from './socket';
import { sendDailyReminder, sendStreakReminder } from './services/notifications';
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

// Daily reminder (7h) + Streak reminder (20h si pas joué aujourd'hui)
let lastReminderDay = '';
let lastStreakDay = '';
setInterval(async () => {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const h = now.getHours();
  const m = now.getMinutes();

  // 7h00 — rappel quotidien avec hadith du jour
  if (h === 7 && m === 0 && lastReminderDay !== today) {
    lastReminderDay = today;
    try {
      const result = await pool.query(
        `SELECT fcm_token, langue FROM users WHERE fcm_token IS NOT NULL AND fcm_token <> ''`
      );
      for (const row of result.rows) {
        sendDailyReminder(row.fcm_token, row.langue || 'fr').catch(() => {});
      }
    } catch (err) {
      console.error('Daily reminder error:', err);
    }
  }

  // 20h00 — rappel streak si l'utilisateur n'a pas joué aujourd'hui
  if (h === 20 && m === 0 && lastStreakDay !== today) {
    lastStreakDay = today;
    try {
      const result = await pool.query(
        `SELECT u.fcm_token, u.langue, u.streak_days
         FROM users u
         WHERE u.fcm_token IS NOT NULL AND u.fcm_token <> ''
           AND u.streak_days > 0
           AND NOT EXISTS (
             SELECT 1 FROM quiz_results qr
             WHERE qr.user_id = u.id
               AND qr.created_at::date = CURRENT_DATE
           )`
      );
      for (const row of result.rows) {
        sendStreakReminder(row.fcm_token, row.streak_days, row.langue || 'fr').catch(() => {});
      }
    } catch (err) {
      console.error('Streak reminder error:', err);
    }
  }
}, 60_000);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Quiz Islamique API running on port ${PORT}`);
  startTournoiAuto();
});

export default app;
