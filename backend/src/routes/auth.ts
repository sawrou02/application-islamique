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

function generateToken(user: { id: string; email: string; pseudo: string; niveau: number }): string {
  const secret = process.env.JWT_SECRET || 'default_secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(
    { id: user.id, email: user.email, pseudo: user.pseudo, niveau: user.niveau },
    secret,
    { expiresIn } as jwt.SignOptions
  );
}

router.post('/register', async (req: Request, res: Response) => {
  try {
    const body = registerSchema.parse(req.body);

    const existing = await pool.query('SELECT id FROM users WHERE email = $1 OR pseudo = $2', [
      body.email,
      body.pseudo,
    ]);
    if (existing.rows.length > 0) {
      res.status(409).json({ success: false, error: 'Email ou pseudo déjà utilisé' });
      return;
    }

    const password_hash = await bcrypt.hash(body.password, 12);

    const result = await pool.query(
      `INSERT INTO users (pseudo, email, password_hash, madhab, pays, langue)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, pseudo, email, pays, langue, madhab, niveau, xp_total, streak_days, created_at, updated_at`,
      [
        body.pseudo,
        body.email,
        password_hash,
        body.madhab || 'general',
        body.pays || null,
        body.langue || 'fr',
      ]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    res.status(201).json({ success: true, data: { token, user } });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: err.errors });
      return;
    }
    console.error(err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const body = loginSchema.parse(req.body);

    const result = await pool.query(
      `SELECT id, pseudo, email, password_hash, pays, langue, madhab, niveau, xp_total, streak_days, created_at, updated_at
       FROM users WHERE email = $1`,
      [body.email]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ success: false, error: 'Email ou mot de passe incorrect' });
      return;
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(body.password, user.password_hash);

    if (!valid) {
      res.status(401).json({ success: false, error: 'Email ou mot de passe incorrect' });
      return;
    }

    const { password_hash: _ph, ...safeUser } = user;
    const token = generateToken(safeUser);

    res.json({ success: true, data: { token, user: safeUser } });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: err.errors });
      return;
    }
    console.error(err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
