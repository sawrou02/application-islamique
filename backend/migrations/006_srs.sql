-- SRS — Répétition espacée (méthode inspirée de SM-2 / Ebbinghaus)
-- Mode Ta'allum : chaque question révisée possède une carte de planification.
CREATE TABLE IF NOT EXISTS srs_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  ease_factor NUMERIC(4,2) DEFAULT 2.50,
  interval_days INTEGER DEFAULT 0,
  repetitions INTEGER DEFAULT 0,
  due_date DATE DEFAULT CURRENT_DATE,
  last_reviewed TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_srs_due ON srs_cards(user_id, due_date);
