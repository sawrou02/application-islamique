import { create } from 'zustand';

interface QuranAudioState {
  isPlaying: boolean;
  isPaused: boolean;
  surahName: string;
  surahNumber: number;
  ayahIdx: number;
  totalAyahs: number;
  // Callbacks enregistrés par le lecteur actif
  onPauseResume: (() => void) | null;
  onStop: (() => void) | null;
  setPlaying: (val: boolean) => void;
  setPaused: (val: boolean) => void;
  setSurah: (num: number, name: string, total: number) => void;
  setAyah: (idx: number) => void;
  registerControls: (pause: () => void, stop: () => void) => void;
  unregisterControls: () => void;
}

export const useQuranAudioStore = create<QuranAudioState>((set) => ({
  isPlaying: false,
  isPaused: false,
  surahName: '',
  surahNumber: 0,
  ayahIdx: 0,
  totalAyahs: 0,
  onPauseResume: null,
  onStop: null,
  setPlaying: (val) => set({ isPlaying: val }),
  setPaused: (val) => set({ isPaused: val }),
  setSurah: (num, name, total) => set({ surahNumber: num, surahName: name, totalAyahs: total }),
  setAyah: (idx) => set({ ayahIdx: idx }),
  registerControls: (pause, stop) => set({ onPauseResume: pause, onStop: stop }),
  unregisterControls: () => set({ onPauseResume: null, onStop: null }),
}));
