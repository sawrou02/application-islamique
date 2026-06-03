import request from 'supertest';
import bcrypt from 'bcryptjs';

// Mock the db pool before importing app
jest.mock('../db', () => {
  const mockQuery = jest.fn();
  return { query: mockQuery, default: { query: mockQuery } };
});

// Mock firebase-admin to avoid initialization errors in tests
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

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = 'test-secret';
});

describe('POST /api/auth/register', () => {
  it('returns token and user on valid registration', async () => {
    const fakeUser = {
      id: 'uuid-1',
      pseudo: 'TestUser',
      email: 'test@example.com',
      pays: null,
      madhab: 'general',
      langue: 'fr',
      niveau: 1,
      xp_total: 0,
      streak_days: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // First query: check if user exists
    mockPool.query
      .mockResolvedValueOnce({ rows: [], rowCount: 0 } as any)
      // Second query: insert user
      .mockResolvedValueOnce({ rows: [fakeUser], rowCount: 1 } as any);

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        pseudo: 'TestUser',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user.email).toBe('test@example.com');
  });

  it('returns 409 when email or pseudo already exists', async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [{ id: 'existing-id' }],
      rowCount: 1,
    } as any);

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        pseudo: 'ExistingUser',
        email: 'existing@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 on invalid data (short password)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        pseudo: 'AB',
        email: 'bad-email',
        password: '123',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/auth/login', () => {
  it('returns token on valid credentials', async () => {
    const password = 'correctpassword';
    const password_hash = await bcrypt.hash(password, 1);

    const fakeUser = {
      id: 'uuid-1',
      pseudo: 'TestUser',
      email: 'test@example.com',
      password_hash,
      pays: null,
      madhab: 'general',
      langue: 'fr',
      niveau: 1,
      xp_total: 0,
      streak_days: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockPool.query.mockResolvedValueOnce({ rows: [fakeUser], rowCount: 1 } as any);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user).not.toHaveProperty('password_hash');
  });

  it('returns 401 on wrong password', async () => {
    const password_hash = await bcrypt.hash('correctpassword', 1);

    mockPool.query.mockResolvedValueOnce({
      rows: [{
        id: 'uuid-1',
        pseudo: 'TestUser',
        email: 'test@example.com',
        password_hash,
      }],
      rowCount: 1,
    } as any);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('returns 401 when user not found', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 } as any);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'password123' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
