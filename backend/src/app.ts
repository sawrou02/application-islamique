import express from 'express';
import cors from 'cors';
import path from 'path';

import authRoutes from './routes/auth';
import questionsRoutes from './routes/questions';
import quizRoutes from './routes/quiz';
import roomsRoutes from './routes/rooms';
import usersRoutes from './routes/users';
import leaderboardRoutes from './routes/leaderboard';
import badgesRoutes from './routes/badges';
import duelsRoutes from './routes/duels';
import signalementsRoutes from './routes/signalements';
import tournoisRoutes from './routes/tournois';
import halaqatRoutes from './routes/halaqat';
import adminRoutes from './routes/admin';
import progressionRoutes from './routes/progression';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/badges', badgesRoutes);
app.use('/api/duels', duelsRoutes);
app.use('/api/signalements', signalementsRoutes);
app.use('/api/tournois', tournoisRoutes);
app.use('/api/halaqat', halaqatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/progression', progressionRoutes);

// Panel admin web (fichiers statiques)
app.use('/admin', express.static(path.join(__dirname, '../../admin')));

export default app;
