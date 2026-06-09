-- Tournoi public mondial automatique
ALTER TABLE tournois ADD COLUMN IF NOT EXISTS est_public BOOLEAN DEFAULT false;
ALTER TABLE tournois ADD COLUMN IF NOT EXISTS auto_genere BOOLEAN DEFAULT false;
-- Note: theme column already exists in 004_tournois.sql as VARCHAR(50); keep idempotent ADD
ALTER TABLE tournois ADD COLUMN IF NOT EXISTS theme TEXT;
-- Promotion vers TIMESTAMP pour gérer des tournois sub-journaliers (24h glissantes)
ALTER TABLE tournois ALTER COLUMN date_debut TYPE TIMESTAMP USING date_debut::timestamp;
ALTER TABLE tournois ALTER COLUMN date_fin   TYPE TIMESTAMP USING date_fin::timestamp;

CREATE INDEX IF NOT EXISTS idx_tournois_public_actif ON tournois(est_public, date_debut) WHERE est_public = true;
