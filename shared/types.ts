// Enums
export type Madhab = 'hanafi' | 'maliki' | 'shafii' | 'hanbali' | 'general';

export type Domaine =
  | 'fiqh'
  | 'aqida'
  | 'tafsir'
  | 'hadith'
  | 'sirah'
  | 'akhlaq'
  | 'quran'
  | 'usul_fiqh'
  | 'tasawwuf'
  | 'tarikh';

export type UserLevel = 1 | 2 | 3 | 4 | 5 | 6;

export const USER_LEVEL_NAMES: Record<UserLevel, { fr: string; ar: string }> = {
  1: { fr: "Mubtadi'", ar: 'مبتدئ' },
  2: { fr: "Muta'allim", ar: 'متعلم' },
  3: { fr: 'Mutawassit', ar: 'متوسط' },
  4: { fr: 'Mutaqaddim', ar: 'متقدم' },
  5: { fr: "'Alim", ar: 'عالم' },
  6: { fr: 'Mufti', ar: 'مفتي' },
};

export const XP_THRESHOLDS: Record<UserLevel, number> = {
  1: 0,
  2: 500,
  3: 2000,
  4: 5000,
  5: 10000,
  6: 20000,
};

export type GameMode =
  | 'solo'
  | 'quotidien'
  | 'talallum'
  | 'murajaah'
  | 'prive'
  | 'tournoi'
  | 'halaqat'
  | 'duo';

export type QuestionType = 'qcm' | 'vrai_faux' | 'classement';
export type QuestionStatut = 'valide' | 'en_attente' | 'rejete';
export type PartieStatut = 'en_attente' | 'en_cours' | 'terminee';

// Core entities
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
  type: QuestionType;
  dalil_ref?: string;
  dalil_texte_ar?: string;
  dalil_texte_fr?: string;
  explication?: string;
  savant_reference?: string;
  grade_hadith?: string;
  statut: QuestionStatut;
  created_at: string;
  reponses?: Reponse[];
}

export interface Partie {
  id: string;
  mode: GameMode;
  hote_id?: string;
  code_salle?: string;
  config: QuizConfig;
  statut: PartieStatut;
  score_final?: Record<string, number>;
  created_at: string;
  ended_at?: string;
}

export interface JoueurPartie {
  id: string;
  partie_id: string;
  user_id: string;
  score: number;
  rang?: number;
  temps_moyen_ms?: number;
  user?: Pick<User, 'id' | 'pseudo' | 'niveau' | 'pays'>;
}

export interface Badge {
  id: string;
  nom: string;
  nom_ar?: string;
  description?: string;
  icone?: string;
  condition_json?: Record<string, unknown>;
}

export interface UserBadge {
  user_id: string;
  badge_id: string;
  date_obtention: string;
  badge?: Badge;
}

// Quiz config
export interface QuizConfig {
  domaine?: Domaine;
  sous_domaine?: string;
  niveau?: number | 'mixed';
  madhab?: Madhab;
  nb_questions?: number;
  temps_par_question?: number;
  mode?: GameMode;
}

// Game state (frontend)
export interface PlayerAnswer {
  question_id: string;
  reponse_id: string;
  temps_ms: number;
  est_correcte?: boolean;
}

export interface GameState {
  partie_id?: string;
  config: QuizConfig;
  questions: Question[];
  current_index: number;
  answers: PlayerAnswer[];
  score: number;
  started_at?: number;
  finished_at?: number;
  status: 'idle' | 'loading' | 'playing' | 'review' | 'finished';
}

// Multiplayer room state
export interface RoomPlayer {
  user_id: string;
  pseudo: string;
  niveau: UserLevel;
  score: number;
  answered: boolean;
  is_host: boolean;
}

export interface RoomState {
  room_id: string;
  code: string;
  host_id: string;
  players: RoomPlayer[];
  config: QuizConfig;
  status: PartieStatut;
  current_question_index: number;
  current_question?: Question;
  question_start_time?: number;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface QuizSubmitBody {
  partie_id?: string;
  answers: Array<{
    question_id: string;
    reponse_id: string;
    temps_ms: number;
  }>;
}

export interface QuizSubmitResult {
  score: number;
  xp_gained: number;
  correct_count: number;
  total: number;
  new_level?: UserLevel;
  badges_earned?: Badge[];
  answers_detail: Array<{
    question_id: string;
    reponse_id: string;
    est_correcte: boolean;
    correct_reponse_id: string;
    xp: number;
  }>;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  pseudo: string;
  xp_total: number;
  niveau: UserLevel;
  pays?: string;
  streak_days: number;
}

export interface UserStats {
  total_parties: number;
  total_correct: number;
  total_questions: number;
  win_rate: number;
  avg_score: number;
  best_streak: number;
  by_domain: Record<Domaine, { correct: number; total: number }>;
}

// Socket events
export interface SocketJoinRoom {
  room_id: string;
  user_id: string;
}

export interface SocketSubmitAnswer {
  room_id: string;
  question_id: string;
  reponse_id: string;
  temps_ms: number;
}

export interface SocketAnswerResult {
  user_id: string;
  est_correcte: boolean;
  score: number;
  xp: number;
}
