import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import pool from '../db';

const router = Router();

const registerSchema = z.object({
  pseudo: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  madhab: z.enum(['hanafi', 'maliki', 'shafii', 'hanbali', 'general']).optional(),
  pays: z.string().optional(),
  langue: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const body = registerSchema.parse(req.body);
    const { pseudo, email, password, madhab = 'general', pays, langue = 'fr' } = body;

    const exists = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR pseudo = $2',
      [email, pseudo]
    );
    if (exists.rows.length > 0) {
      res.status(409).json({ success: false, error: 'Email ou pseudo déjà utilisé' });
      return;
    }

    const password_hash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO users (pseudo, email, password_hash, madhab, pays, langue)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, pseudo, email, pays, madhab, langue, niveau, xp_total, streak_days, created_at, updated_at`,
      [pseudo, email, password_hash, madhab, pays, langue]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, pseudo: user.pseudo },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as import('jsonwebtoken').SignOptions['expiresIn'] }
    );

    res.status(201).json({ success: true, data: { token, user } });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Données invalides', details: err.errors });
      return;
    }
    console.error('Register error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const body = loginSchema.parse(req.body);
    const { email, password } = body;

    const result = await pool.query(
      `SELECT id, pseudo, email, password_hash, pays, madhab, langue, niveau, xp_total, streak_days, role, created_at, updated_at
       FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ success: false, error: 'Email ou mot de passe incorrect' });
      return;
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ success: false, error: 'Email ou mot de passe incorrect' });
      return;
    }

    const { password_hash: _pw, ...userPublic } = user;

    const token = jwt.sign(
      { id: user.id, email: user.email, pseudo: user.pseudo, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as import('jsonwebtoken').SignOptions['expiresIn'] }
    );

    res.json({ success: true, data: { token, user: userPublic } });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Données invalides', details: err.errors });
      return;
    }
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
