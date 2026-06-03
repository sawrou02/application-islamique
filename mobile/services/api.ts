import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { User, Question, QuizConfig, QuizResult, LeaderboardEntry, Badge, Room } from '../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// JWT interceptor
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      SecureStore.deleteItemAsync('auth_token').catch(() => {});
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  register: (data: { pseudo: string; email: string; password: string; madhab?: string; pays?: string; langue?: string }) =>
    api.post<{ success: boolean; data: { token: string; user: User } }>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<{ success: boolean; data: { token: string; user: User } }>('/auth/login', data),
};

// Questions
export const questionsApi = {
  getQuestions: (params: Partial<QuizConfig> & { limit?: number; offset?: number }) =>
    api.get<{ success: boolean; data: Question[] }>('/questions', { params }),

  getDailyQuestions: () =>
    api.get<{ success: boolean; data: Question[] }>('/questions/daily'),

  getQuestion: (id: string) =>
    api.get<{ success: boolean; data: Question }>(`/questions/${id}`),
};

// Quiz
export const quizApi = {
  submitQuiz: (data: {
    partie_id?: string;
    answers: Array<{ question_id: string; reponse_id: string; temps_ms: number }>;
  }) => api.post<{ success: boolean; data: QuizResult }>('/quiz/submit', data),

  getMistakes: (limit = 10) =>
    api.get<{ success: boolean; data: Question[] }>('/quiz/mistakes', { params: { limit } }),
};

// Rooms
export const roomsApi = {
  createRoom: (config: Partial<QuizConfig>) =>
    api.post<{ success: boolean; data: Room }>('/rooms', { config }),

  joinRoom: (code: string) =>
    api.post<{ success: boolean; data: Room }>('/rooms/join', { code }),

  getRoom: (id: string) =>
    api.get<{ success: boolean; data: Room }>(`/rooms/${id}`),
};

// Users
export const usersApi = {
  getProfile: () =>
    api.get<{ success: boolean; data: User & { badges: Badge[]; total_parties: number } }>('/users/profile'),

  updateProfile: (data: { madhab?: string; pays?: string; langue?: string; ville?: string; fcm_token?: string }) =>
    api.put<{ success: boolean; data: User }>('/users/profile', data),

  getStats: () =>
    api.get<{ success: boolean; data: unknown }>('/users/stats'),
};

// Leaderboard
export const leaderboardApi = {
  getLeaderboard: (params: { type?: string; period?: string; pays?: string }) =>
    api.get<{ success: boolean; data: LeaderboardEntry[] }>('/leaderboard', { params }),
};

// Duels
export const duelsApi = {
  createDuel: (config: Partial<{ domaine: string; niveau: number | string; nb_questions: number; temps_par_question: number }>) =>
    api.post<{ success: boolean; data: { id: string; invite_token: string; code_salle: string } }>('/duels', { config }),

  acceptDuel: (token: string) =>
    api.post<{ success: boolean; data: unknown }>('/duels/accept', { token }),

  getMyDuels: () =>
    api.get<{ success: boolean; data: unknown[] }>('/duels/my'),

  getDuel: (id: string) =>
    api.get<{ success: boolean; data: unknown }>(`/duels/${id}`),
};

// Signalements
export const signalementsApi = {
  signaler: (data: { question_id: string; motif: string; detail?: string }) =>
    api.post<{ success: boolean; message: string }>('/signalements', data),
};

// Tournois
export const tournoisApi = {
  getActif: () =>
    api.get<{ success: boolean; data: { id: string; nom: string; nom_ar: string; theme: string; description: string; date_debut: string; date_fin: string } }>('/tournois/actif'),

  join: (id: string) =>
    api.post<{ success: boolean; message: string }>(`/tournois/${id}/join`),

  getClassement: (id: string) =>
    api.get<{ success: boolean; data: Array<{ rang: number; user_id: string; pseudo: string; pays: string; points: number; xp_total: number; ligue: { id: string; nom: string; nom_ar: string } }> }>(`/tournois/${id}/classement`),
};

// Halaqat
export const halaqatApi = {
  create: (data: { nom: string; description?: string }) =>
    api.post<{ success: boolean; data: { id: string; nom: string; code_acces: string } }>('/halaqat', data),

  join: (code: string) =>
    api.post<{ success: boolean; data: { id: string; nom: string } }>('/halaqat/join', { code }),

  getMy: () =>
    api.get<{ success: boolean; data: Array<{ id: string; nom: string; role: string; code_acces: string; nb_membres: number }> }>('/halaqat/my'),

  getHalaqa: (id: string) =>
    api.get<{ success: boolean; data: unknown }>(`/halaqat/${id}`),
};

// SRS — répétition espacée
export const srsApi = {
  getDue: (limit = 10) =>
    api.get<{ success: boolean; data: Question[] }>('/quiz/srs/due', { params: { limit } }),

  review: (question_id: string, quality: number) =>
    api.post<{ success: boolean; data: { next_review: string; interval_days: number } }>('/quiz/srs/review', { question_id, quality }),
};

// Badges
export const badgesApi = {
  getAllBadges: () =>
    api.get<{ success: boolean; data: Badge[] }>('/badges'),

  getMyBadges: () =>
    api.get<{ success: boolean; data: Badge[] }>('/badges/my'),
};

export default api;
