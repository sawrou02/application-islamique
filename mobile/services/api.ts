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

  updateProfile: (data: { madhab?: string; pays?: string; langue?: string; ville?: string }) =>
    api.put<{ success: boolean; data: User }>('/users/profile', data),

  getStats: () =>
    api.get<{ success: boolean; data: unknown }>('/users/stats'),
};

// Leaderboard
export const leaderboardApi = {
  getLeaderboard: (params: { type?: string; period?: string; pays?: string }) =>
    api.get<{ success: boolean; data: LeaderboardEntry[] }>('/leaderboard', { params }),
};

// Badges
export const badgesApi = {
  getAllBadges: () =>
    api.get<{ success: boolean; data: Badge[] }>('/badges'),

  getMyBadges: () =>
    api.get<{ success: boolean; data: Badge[] }>('/badges/my'),
};

export default api;
