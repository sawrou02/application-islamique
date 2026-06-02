import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';

dotenv.config();

import authRoutes from './routes/auth';
import questionsRoutes from './routes/questions';
import quizRoutes from './routes/quiz';
import roomsRoutes from './routes/rooms';
import usersRoutes from './routes/users';
import leaderboardRoutes from './routes/leaderboard';
import badgesRoutes from './routes/badges';
import { setupSocket } from './socket';

const app = express();
const httpServer = createServer(app);

const io = new SocketServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

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

// Socket.io
setupSocket(io);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Quiz Islamique API running on port ${PORT}`);
});

export default app;
