-- Migration 010 : support anglais pour les dalils et questions
ALTER TABLE questions ADD COLUMN IF NOT EXISTS verset_en TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS hadith_texte_en TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS parole_savant_en TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS explication_en TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS texte_en TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS reponses_en JSONB;
