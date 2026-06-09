-- Migration 012 : questions spéciales tournoi
ALTER TABLE questions ADD COLUMN IF NOT EXISTS is_tournoi BOOLEAN NOT NULL DEFAULT FALSE;
CREATE INDEX IF NOT EXISTS idx_questions_tournoi ON questions (is_tournoi) WHERE is_tournoi = TRUE;
