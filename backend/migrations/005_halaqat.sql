-- Mode Halaqat : cercle d'étude piloté par un enseignant
CREATE TABLE IF NOT EXISTS halaqat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(150) NOT NULL,
  description TEXT,
  enseignant_id UUID REFERENCES users(id) ON DELETE CASCADE,
  code_acces VARCHAR(10) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS halaqat_membres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  halaqa_id UUID REFERENCES halaqat(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'eleve' CHECK (role IN ('enseignant','eleve')),
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (halaqa_id, user_id)
);

CREATE TABLE IF NOT EXISTS halaqat_quiz (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  halaqa_id UUID REFERENCES halaqat(id) ON DELETE CASCADE,
  titre VARCHAR(200) NOT NULL,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS halaqat_resultats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  halaqa_quiz_id UUID REFERENCES halaqat_quiz(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  completed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_halaqat_code ON halaqat(code_acces);
CREATE INDEX IF NOT EXISTS idx_halaqat_membres_halaqa ON halaqat_membres(halaqa_id);
