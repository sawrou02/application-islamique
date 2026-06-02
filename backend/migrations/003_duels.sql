-- Mode Duo (Mubara'a) : duel direct 1 contre 1
CREATE TABLE IF NOT EXISTS duels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id UUID REFERENCES users(id) ON DELETE CASCADE,
  challenged_id UUID REFERENCES users(id) ON DELETE SET NULL,
  statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente','accepte','en_cours','termine','refuse','expire')),
  config JSONB DEFAULT '{}',
  score_challenger INTEGER DEFAULT 0,
  score_challenged INTEGER DEFAULT 0,
  gagnant_id UUID REFERENCES users(id) ON DELETE SET NULL,
  invite_token VARCHAR(64) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  ended_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_duels_challenger ON duels(challenger_id);
CREATE INDEX IF NOT EXISTS idx_duels_challenged ON duels(challenged_id);
CREATE INDEX IF NOT EXISTS idx_duels_token ON duels(invite_token);

-- Score par joueur dans un duel (chaque réponse)
CREATE TABLE IF NOT EXISTS duel_reponses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  duel_id UUID REFERENCES duels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE SET NULL,
  reponse_id UUID REFERENCES reponses(id) ON DELETE SET NULL,
  est_correcte BOOLEAN NOT NULL DEFAULT FALSE,
  temps_ms INTEGER,
  xp_gagne INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
