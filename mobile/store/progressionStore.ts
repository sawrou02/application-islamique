import { create } from 'zustand';
import { progressionApi, ProgressionData } from '../services/api';

interface ProgressionState {
  data: ProgressionData | null;
  loading: boolean;
  load: () => Promise<void>;
  reset: () => void;
}

const EMPTY: ProgressionData = {
  domains: {},
  can_tournament: false,
  can_mixte: false,
};

export const useProgressionStore = create<ProgressionState>((set) => ({
  data: null,
  loading: false,
  load: async () => {
    set({ loading: true });
    try {
      const res = await progressionApi.getMine();
      set({ data: res.data.data, loading: false });
    } catch {
      set({ data: EMPTY, loading: false });
    }
  },
  reset: () => set({ data: null, loading: false }),
}));

export function isLevelUnlocked(data: ProgressionData | null, domaine: string, niveau: number): boolean {
  if (!data) return niveau === 1;
  const d = data.domains[domaine];
  if (!d) return niveau === 1;
  return niveau <= d.unlocked_max;
}

export function getLevelStat(data: ProgressionData | null, domaine: string, niveau: number) {
  if (!data) return { answered: 0, total: 0, completed: false };
  return data.domains[domaine]?.levels[niveau] || { answered: 0, total: 0, completed: false };
}
