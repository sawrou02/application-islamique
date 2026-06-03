-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pseudo VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  pays VARCHAR(100),
  ville VARCHAR(100),
  madhab VARCHAR(20) DEFAULT 'general' CHECK (madhab IN ('hanafi','maliki','shafii','hanbali','general')),
  langue VARCHAR(10) DEFAULT 'fr',
  niveau INTEGER DEFAULT 1 CHECK (niveau BETWEEN 1 AND 6),
  xp_total INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_daily_challenge DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domaine VARCHAR(50) NOT NULL,
  sous_domaine VARCHAR(100),
  niveau INTEGER NOT NULL CHECK (niveau BETWEEN 1 AND 6),
  madhab VARCHAR(20) DEFAULT 'general',
  texte_fr TEXT NOT NULL,
  texte_ar TEXT,
  type VARCHAR(20) DEFAULT 'qcm',
  dalil_ref VARCHAR(200),
  dalil_texte_ar TEXT,
  dalil_texte_fr TEXT,
  explication TEXT,
  savant_reference VARCHAR(200),
  grade_hadith VARCHAR(20),
  statut VARCHAR(20) DEFAULT 'valide' CHECK (statut IN ('valide','en_attente','rejete')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reponses (answer options)
CREATE TABLE IF NOT EXISTS reponses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  texte_fr TEXT NOT NULL,
  texte_ar TEXT,
  est_correcte BOOLEAN NOT NULL DEFAULT FALSE
);

-- Parties
CREATE TABLE IF NOT EXISTS parties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mode VARCHAR(30) NOT NULL CHECK (mode IN ('solo','quotidien','talallum','murajaah','prive','tournoi','halaqat','duo')),
  hote_id UUID REFERENCES users(id),
  code_salle VARCHAR(10),
  config JSONB DEFAULT '{}',
  statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente','en_cours','terminee')),
  score_final JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP
);

-- Joueurs par partie
CREATE TABLE IF NOT EXISTS joueurs_partie (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partie_id UUID REFERENCES parties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  score INTEGER DEFAULT 0,
  rang INTEGER,
  temps_moyen_ms INTEGER
);

-- Badges
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(100) NOT NULL,
  nom_ar VARCHAR(100),
  description TEXT,
  icone VARCHAR(100),
  condition_json JSONB
);

-- User Badges
CREATE TABLE IF NOT EXISTS user_badges (
  user_id UUID REFERENCES users(id),
  badge_id UUID REFERENCES badges(id),
  date_obtention TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

-- Signalements
CREATE TABLE IF NOT EXISTS signalements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES questions(id),
  user_id UUID REFERENCES users(id),
  motif TEXT,
  statut VARCHAR(20) DEFAULT 'en_attente',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_questions_domaine ON questions(domaine);
CREATE INDEX IF NOT EXISTS idx_questions_niveau ON questions(niveau);
CREATE INDEX IF NOT EXISTS idx_questions_madhab ON questions(madhab);
CREATE INDEX IF NOT EXISTS idx_questions_statut ON questions(statut);
CREATE INDEX IF NOT EXISTS idx_users_xp ON users(xp_total DESC);
CREATE INDEX IF NOT EXISTS idx_parties_code ON parties(code_salle);
