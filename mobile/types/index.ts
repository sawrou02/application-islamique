export type Madhab = 'hanafi' | 'maliki' | 'shafii' | 'hanbali' | 'general';
export type UserLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type Domaine = 'fiqh' | 'aqida' | 'tafsir' | 'hadith' | 'sirah' | 'akhlaq';
export type GameMode = 'solo' | 'quotidien' | 'talallum' | 'murajaah' | 'prive' | 'tournoi' | 'halaqat' | 'duo';

export interface User {
  id: string;
  pseudo: string;
  email: string;
  pays?: string;
  ville?: string;
  madhab: Madhab;
  langue: string;
  niveau: UserLevel;
  xp_total: number;
  streak_days: number;
  last_daily_challenge?: string;
  created_at: string;
  updated_at: string;
}

export interface Reponse {
  id: string;
  question_id: string;
  texte_fr: string;
  texte_ar?: string;
  texte_en?: string;
  est_correcte: boolean;
}

export interface Question {
  id: string;
  domaine: Domaine;
  sous_domaine?: string;
  niveau: number;
  madhab: Madhab;
  texte_fr: string;
  texte_ar?: string;
  texte_en?: string;
  dalil_ref?: string;
  dalil_texte_ar?: string;
  dalil_texte_fr?: string;
  explication?: string;
  savant_reference?: string;
  grade_hadith?: string;
  // Dalil détaillé (migration 009)
  verset_ref?: string;
  verset_ar?: string;
  verset_fr?: string;
  verset_en?: string;
  hadith_texte_ar?: string;
  hadith_texte_fr?: string;
  hadith_texte_en?: string;
  hadith_ref?: string;
  parole_savant_texte?: string;
  parole_savant_en?: string;
  parole_savant_ref?: string;
  explication_detaillee?: string;
  explication_en?: string;
  reponses?: Reponse[];
  reponses_en?: unknown;
}

export interface Badge {
  id: string;
  nom: string;
  nom_ar?: string;
  description?: string;
  icone?: string;
  date_obtention?: string;
}

export interface QuizConfig {
  domaine?: Domaine;
  niveau?: number | 'mixte';
  nb_questions: number;
  temps_par_question: number;
  mode: GameMode;
}

export interface PlayerAnswer {
  question_id: string;
  reponse_id: string;
  temps_ms: number;
  est_correcte?: boolean;
}

export interface QuizResult {
  score: number;
  xp_gained: number;
  correct_count: number;
  total: number;
  level_up?: boolean;
  new_level?: UserLevel;
  answers_detail: Array<{
    question_id: string;
    reponse_id: string;
    est_correcte: boolean;
    bonne_reponse_id: string;
    xp: number;
  }>;
}

export interface RoomPlayer {
  user_id: string;
  pseudo: string;
  niveau: UserLevel;
  score: number;
  answered: boolean;
  is_host: boolean;
}

export interface Room {
  id: string;
  code_salle: string;
  hote_id: string;
  config: QuizConfig;
  statut: 'en_attente' | 'en_cours' | 'terminee';
  players: RoomPlayer[];
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  pseudo: string;
  pays?: string;
  niveau: UserLevel;
  xp_total: number;
  streak_days: number;
}
