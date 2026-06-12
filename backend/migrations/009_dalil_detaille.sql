-- 009_dalil_detaille.sql
-- Enrichit la table questions avec des colonnes structurées pour le dalil détaillé :
-- verset coranique, hadith, parole de savant, explication détaillée.
-- Toutes les colonnes sont optionnelles : les questions existantes restent valides.

ALTER TABLE questions ADD COLUMN IF NOT EXISTS verset_ref TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS verset_ar TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS verset_fr TEXT;

ALTER TABLE questions ADD COLUMN IF NOT EXISTS hadith_texte_ar TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS hadith_texte_fr TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS hadith_ref TEXT;

ALTER TABLE questions ADD COLUMN IF NOT EXISTS parole_savant_texte TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS parole_savant_ref TEXT;

ALTER TABLE questions ADD COLUMN IF NOT EXISTS explication_detaillee TEXT;
