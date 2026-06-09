import { Router, Request, Response } from 'express';
import pool from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { userCanTournament } from './progression';

const router = Router();

// Ligues islamiques basées sur le XP total
export function getLigue(xp: number): { id: string; nom: string; nom_ar: string } {
  if (xp >= 20000) return { id: 'mufti', nom: 'Mufti', nom_ar: 'مفتي' };
  if (xp >= 10000) return { id: 'savant', nom: 'Savant', nom_ar: 'عالم' };
  if (xp >= 5000) return { id: 'diamant', nom: 'Diamant', nom_ar: 'ماسي' };
  if (xp >= 2000) return { id: 'or', nom: 'Or', nom_ar: 'ذهبي' };
  if (xp >= 500) return { id: 'argent', nom: 'Argent', nom_ar: 'فضي' };
  return { id: 'bronze', nom: 'Bronze', nom_ar: 'برونزي' };
}

// GET /api/tournois/actif — tournoi en cours (le crée si nécessaire pour la semaine)
router.get('/actif', async (_req: Request, res: Response): Promise<void> => {
  try {
    const existing = await pool.query(
      "SELECT * FROM tournois WHERE statut = 'ouvert' AND CURRENT_DATE BETWEEN date_debut AND date_fin ORDER BY date_debut DESC LIMIT 1"
    );

    if (existing.rows.length > 0) {
      res.json({ success: true, data: existing.rows[0] });
      return;
    }

    // Crée automatiquement le tournoi de la semaine courante (lundi → dimanche)
    const now = new Date();
    const day = now.getDay(); // 0=dim
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const themes = [
      { theme: 'fiqh', nom: 'Munafasa Fiqh', nom_ar: 'منافسة الفقه' },
      { theme: 'aqida', nom: 'Munafasa Aqida', nom_ar: 'منافسة العقيدة' },
      { theme: 'hadith', nom: 'Munafasa Hadith', nom_ar: 'منافسة الحديث' },
      { theme: 'sirah', nom: 'Munafasa Sirah', nom_ar: 'منافسة السيرة' },
    ];
    const weekNum = Math.floor(monday.getTime() / (7 * 24 * 3600 * 1000));
    const t = themes[weekNum % themes.length];

    const created = await pool.query(
      `INSERT INTO tournois (nom, nom_ar, theme, description, date_debut, date_fin, statut)
       VALUES ($1, $2, $3, $4, $5, $6, 'ouvert') RETURNING *`,
      [
        t.nom, t.nom_ar, t.theme,
        `Tournoi hebdomadaire sur le thème : ${t.theme}`,
        monday.toISOString().slice(0, 10),
        sunday.toISOString().slice(0, 10),
      ]
    );

    res.json({ success: true, data: created.rows[0] });
  } catch (err) {
    console.error('Tournoi actif error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// ============================================================
// Tournoi public mondial automatique
// ============================================================

// GET /api/tournois/public/actif — tournoi public en cours
router.get('/public/actif', async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT t.*,
              (SELECT COUNT(*)::int FROM tournoi_participants WHERE tournoi_id = t.id) AS nb_participants
       FROM tournois t
       WHERE t.est_public = true
         AND t.date_debut <= NOW()
         AND t.date_fin   >  NOW()
       ORDER BY t.date_debut DESC LIMIT 1`
    );
    if (result.rows.length === 0) {
      res.json({ success: true, data: null });
      return;
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Tournoi public actif error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST /api/tournois/public/rejoindre — inscrit l'utilisateur courant
router.post('/public/rejoindre', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user_id = req.user!.id;
    if (!(await userCanTournament(user_id))) {
      res.status(403).json({ success: false, error: 'Tournoi verrouillé : atteignez le niveau 5 dans les 6 domaines.' });
      return;
    }
    const t = await pool.query(
      `SELECT id FROM tournois
       WHERE est_public = true AND date_debut <= NOW() AND date_fin > NOW()
       ORDER BY date_debut DESC LIMIT 1`
    );
    if (t.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Aucun tournoi public actif' });
      return;
    }
    const tournoi_id = t.rows[0].id;
    await pool.query(
      `INSERT INTO tournoi_participants (tournoi_id, user_id, points)
       VALUES ($1, $2, 0) ON CONFLICT (tournoi_id, user_id) DO NOTHING`,
      [tournoi_id, user_id]
    );
    res.json({ success: true, message: 'Inscription confirmée', tournoi_id });
  } catch (err) {
    console.error('Tournoi public rejoindre error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/tournois/public/classement — top 100 du tournoi public actif
router.get('/public/classement', async (_req: Request, res: Response): Promise<void> => {
  try {
    const t = await pool.query(
      `SELECT id FROM tournois
       WHERE est_public = true AND date_debut <= NOW() AND date_fin > NOW()
       ORDER BY date_debut DESC LIMIT 1`
    );
    if (t.rows.length === 0) {
      res.json({ success: true, data: [] });
      return;
    }
    const result = await pool.query(
      `SELECT
         ROW_NUMBER() OVER (ORDER BY tp.points DESC) AS rang,
         tp.user_id, tp.points, u.pseudo, u.pays, u.niveau, u.xp_total
       FROM tournoi_participants tp
       JOIN users u ON u.id = tp.user_id
       WHERE tp.tournoi_id = $1
       ORDER BY tp.points DESC
       LIMIT 100`,
      [t.rows[0].id]
    );
    const data = result.rows.map(r => ({ ...r, ligue: getLigue(r.xp_total) }));
    res.json({ success: true, data });
  } catch (err) {
    console.error('Tournoi public classement error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST /api/tournois/:id/join
router.post('/:id/join', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user_id = req.user!.id;
    if (!(await userCanTournament(user_id))) {
      res.status(403).json({ success: false, error: 'Tournoi verrouillé : atteignez le niveau 5 dans les 6 domaines.' });
      return;
    }

    const t = await pool.query("SELECT id FROM tournois WHERE id = $1 AND statut = 'ouvert'", [id]);
    if (t.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Tournoi non disponible' });
      return;
    }

    await pool.query(
      `INSERT INTO tournoi_participants (tournoi_id, user_id, points)
       VALUES ($1, $2, 0) ON CONFLICT (tournoi_id, user_id) DO NOTHING`,
      [id, user_id]
    );

    res.json({ success: true, message: 'Inscription confirmée' });
  } catch (err) {
    console.error('Tournoi join error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET /api/tournois/:id/classement
router.get('/:id/classement', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
         ROW_NUMBER() OVER (ORDER BY tp.points DESC) AS rang,
         tp.user_id, tp.points, u.pseudo, u.pays, u.niveau, u.xp_total
       FROM tournoi_participants tp
       JOIN users u ON u.id = tp.user_id
       WHERE tp.tournoi_id = $1
       ORDER BY tp.points DESC
       LIMIT 100`,
      [id]
    );

    const data = result.rows.map(r => ({ ...r, ligue: getLigue(r.xp_total) }));
    res.json({ success: true, data });
  } catch (err) {
    console.error('Tournoi classement error:', err);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
