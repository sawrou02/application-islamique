import AsyncStorage from '@react-native-async-storage/async-storage';
import { Question } from '../types';

const TTL_MS = 24 * 60 * 60 * 1000; // 24 heures

interface CacheEntry<T> {
  data: T;
  savedAt: number;
}

interface PendingResult {
  answers: { question_id: string; reponse_id: string; temps_ms: number }[];
  savedAt: number;
}

const KEYS = {
  questions: (key: string) => `offline_questions_${key}`,
  PENDING_RESULTS: 'offline_pending_results',
  LAST_SYNC: 'offline_last_sync',
};

function cacheKey(mode: string, domaine?: string, niveau?: string | number): string {
  return [mode, domaine || 'all', niveau || 'mixte'].join('_');
}

export const offlineCache = {
  // ── Questions ─────────────────────────────────────────────────────────────
  async saveQuestions(
    questions: Question[],
    mode: string,
    domaine?: string,
    niveau?: string | number,
  ): Promise<void> {
    if (questions.length === 0) return;
    try {
      const key = KEYS.questions(cacheKey(mode, domaine, niveau));
      const entry: CacheEntry<Question[]> = { data: questions, savedAt: Date.now() };
      await AsyncStorage.setItem(key, JSON.stringify(entry));
    } catch (e) {
      console.warn('[offlineCache] saveQuestions:', e);
    }
  },

  async loadQuestions(
    mode: string,
    domaine?: string,
    niveau?: string | number,
  ): Promise<Question[]> {
    try {
      const key = KEYS.questions(cacheKey(mode, domaine, niveau));
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return [];
      const entry: CacheEntry<Question[]> = JSON.parse(raw);
      if (Date.now() - entry.savedAt > TTL_MS) return []; // expiré
      return entry.data;
    } catch (e) {
      console.warn('[offlineCache] loadQuestions:', e);
      return [];
    }
  },

  // ── File d'attente résultats ────────────────────────────────────────────
  async enqueuePendingResult(
    answers: { question_id: string; reponse_id: string; temps_ms: number }[],
  ): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.PENDING_RESULTS);
      const queue: PendingResult[] = raw ? JSON.parse(raw) : [];
      queue.push({ answers, savedAt: Date.now() });
      await AsyncStorage.setItem(KEYS.PENDING_RESULTS, JSON.stringify(queue));
    } catch (e) {
      console.warn('[offlineCache] enqueuePendingResult:', e);
    }
  },

  async flushPendingResults(): Promise<PendingResult[]> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.PENDING_RESULTS);
      if (!raw) return [];
      const queue: PendingResult[] = JSON.parse(raw);
      await AsyncStorage.removeItem(KEYS.PENDING_RESULTS);
      return queue;
    } catch (e) {
      console.warn('[offlineCache] flushPendingResults:', e);
      return [];
    }
  },

  async hasPendingResults(): Promise<boolean> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.PENDING_RESULTS);
      if (!raw) return false;
      const queue: PendingResult[] = JSON.parse(raw);
      return queue.length > 0;
    } catch {
      return false;
    }
  },

  // ── Sync timestamp ─────────────────────────────────────────────────────
  async saveLastSync(): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.LAST_SYNC, new Date().toISOString());
    } catch {}
  },

  async loadLastSync(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.LAST_SYNC);
    } catch {
      return null;
    }
  },
};
