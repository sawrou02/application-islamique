import request from 'supertest';
import jwt from 'jsonwebtoken';

// Mock the db pool before importing app
jest.mock('../db', () => {
  const mockQuery = jest.fn();
  return { query: mockQuery, default: { query: mockQuery } };
});

// Mock firebase-admin
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  credential: { cert: jest.fn() },
  messaging: jest.fn(() => ({ send: jest.fn() })),
}));

// Mock the notifications service
jest.mock('../services/notifications', () => ({
  initFirebase: jest.fn(),
  sendNotification: jest.fn(),
  sendDailyReminder: jest.fn(),
  sendDuelInvite: jest.fn(),
  sendStreakReminder: jest.fn(),
  sendTournoiStart: jest.fn(),
}));

import app from '../app';
import pool from '../db';

const mockPool = pool as jest.Mocked<typeof pool>;
const JWT_SECRET = 'test-secret';

function makeToken(user = { id: 'user-uuid-1', email: 'test@example.com', pseudo: 'TestUser' }) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
}

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = JWT_SECRET;
});

describe('GET /api/questions', () => {
  it('returns an array of questions', async () => {
    const fakeQuestions = [
      { id: 'q-1', texte_fr: 'Question 1', niveau: 1, reponses: [] },
      { id: 'q-2', texte_fr: 'Question 2', niveau: 2, reponses: [] },
    ];

    mockPool.query.mockResolvedValueOnce({ rows: fakeQuestions, rowCount: 2 } as any);

    const res = await request(app).get('/api/questions');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(2);
  });

  it('returns empty array when no questions match', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 } as any);

    const res = await request(app).get('/api/questions?domaine=aqida&niveau=5');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(0);
  });
});

describe('POST /api/quiz/submit', () => {
  it('returns 401 when no auth token provided', async () => {
    const res = await request(app)
      .post('/api/quiz/submit')
      .send({
        answers: [
          { question_id: 'q-uuid-1', reponse_id: 'r-uuid-1', temps_ms: 3000 },
        ],
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns quiz result with valid auth and answers', async () => {
    const token = makeToken();

    // Mock: questions query
    mockPool.query
      .mockResolvedValueOnce({
        rows: [
          { id: 'q-uuid-1', niveau: 2, correct_reponse_id: 'r-uuid-1' },
        ],
        rowCount: 1,
      } as any)
      // Mock: insert historique_reponses
      .mockResolvedValueOnce({ rows: [], rowCount: 1 } as any)
      // Mock: get user xp/streak
      .mockResolvedValueOnce({
        rows: [{
          xp_total: 100,
          niveau: 1,
          streak_days: 3,
          last_daily_challenge: null,
          xp_semaine: 0,
          semaine_ref: null,
        }],
        rowCount: 1,
      } as any)
      // Mock: update user
      .mockResolvedValueOnce({ rows: [], rowCount: 1 } as any)
      // Mock: update tournoi points
      .mockResolvedValueOnce({ rows: [], rowCount: 0 } as any);

    const res = await request(app)
      .post('/api/quiz/submit')
      .set('Authorization', `Bearer ${token}`)
      .send({
        answers: [
          { question_id: 'q-uuid-1', reponse_id: 'r-uuid-1', temps_ms: 3000 },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('score');
    expect(res.body.data).toHaveProperty('xp_gained');
    expect(res.body.data).toHaveProperty('correct_count');
    expect(res.body.data.correct_count).toBe(1);
  });

  it('returns 400 when answers array is empty', async () => {
    const token = makeToken();

    const res = await request(app)
      .post('/api/quiz/submit')
      .set('Authorization', `Bearer ${token}`)
      .send({ answers: [] });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
