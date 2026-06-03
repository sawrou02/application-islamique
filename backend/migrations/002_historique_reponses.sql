-- Historique des réponses : permet le mode Muraja'ah (révision des erreurs)
-- et le calcul de statistiques détaillées par domaine.

CREATE TABLE IF NOT EXISTS historique_reponses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  reponse_id UUID REFERENCES reponses(id) ON DELETE SET NULL,
  est_correcte BOOLEAN NOT NULL DEFAULT FALSE,
  temps_ms INTEGER,
  partie_id UUID REFERENCES parties(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_historique_user ON historique_reponses(user_id);
CREATE INDEX IF NOT EXISTS idx_historique_question ON historique_reponses(question_id);
CREATE INDEX IF NOT EXISTS idx_historique_user_correct ON historique_reponses(user_id, est_correcte);
