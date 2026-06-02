-- Suivi XP hebdomadaire pour les tournois et classements
ALTER TABLE users ADD COLUMN IF NOT EXISTS xp_semaine INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS semaine_ref DATE;

-- Tournois (Munafasa) hebdomadaires
CREATE TABLE IF NOT EXISTS tournois (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(150) NOT NULL,
  nom_ar VARCHAR(150),
  theme VARCHAR(50),
  description TEXT,
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  statut VARCHAR(20) DEFAULT 'ouvert' CHECK (statut IN ('a_venir','ouvert','termine')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tournoi_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournoi_id UUID REFERENCES tournois(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  rang INTEGER,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (tournoi_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_tournoi_part_tournoi ON tournoi_participants(tournoi_id);
CREATE INDEX IF NOT EXISTS idx_tournoi_part_points ON tournoi_participants(tournoi_id, points DESC);
