import AsyncStorage from '@react-native-async-storage/async-storage';
import { Question } from '../types';

const KEYS = {
  OFFLINE_QUESTIONS: 'offline_questions',
  LAST_SYNC: 'offline_last_sync',
};

export const offlineCache = {
  async saveQuestions(questions: Question[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.OFFLINE_QUESTIONS, JSON.stringify(questions));
    } catch (error) {
      console.warn('[offlineCache] saveQuestions failed:', error);
    }
  },

  async loadQuestions(): Promise<Question[]> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.OFFLINE_QUESTIONS);
      if (!raw) return [];
      return JSON.parse(raw) as Question[];
    } catch (error) {
      console.warn('[offlineCache] loadQuestions failed:', error);
      return [];
    }
  },

  async saveLastSync(date: string): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.LAST_SYNC, date);
    } catch (error) {
      console.warn('[offlineCache] saveLastSync failed:', error);
    }
  },

  async loadLastSync(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.LAST_SYNC);
    } catch (error) {
      console.warn('[offlineCache] loadLastSync failed:', error);
      return null;
    }
  },
};
