import { create } from 'zustand';

export type SetupModeId = 'rapide' | 'thematique' | 'quotidien' | 'murajaah' | 'talallum';

export interface SetupModeMeta {
  id: SetupModeId;
  // Maps to backend / quizStore mode
  backendMode: 'solo' | 'quotidien' | 'murajaah' | 'talallum';
  name: string;
  nameAr: string;
  description: string;
  icon: string; // Unicode symbol
  color: string;
}

export const SETUP_MODES: SetupModeMeta[] = [
  { id: 'rapide', backendMode: 'solo', name: 'Rapide', nameAr: 'سريع', description: 'Tous domaines mélangés, rythme libre', icon: '❋', color: '#1B5E20' },
  { id: 'thematique', backendMode: 'solo', name: 'Thématique', nameAr: 'موضوعي', description: 'Concentré sur une science', icon: '✧', color: '#01579B' },
  { id: 'quotidien', backendMode: 'quotidien', name: 'Quotidien', nameAr: 'يومي', description: '5 questions du jour', icon: '☪', color: '#F57C00' },
  { id: 'murajaah', backendMode: 'murajaah', name: "Muraja'ah", nameAr: 'مراجعة', description: 'Révisez vos erreurs', icon: '⟲', color: '#4A148C' },
  { id: 'talallum', backendMode: 'talallum', name: "Ta'allum", nameAr: 'تعلم', description: 'Apprentissage espacé (SRS)', icon: '▲', color: '#BF360C' },
];

export const SETUP_DOMAINS = [
  { id: 'fiqh',   name: 'Fiqh',          nameAr: 'فقه',    icon: '⚖', color: '#1B5E20', desc: 'Jurisprudence islamique' },
  { id: 'aqida',  name: 'Aqida',         nameAr: 'عقيدة',  icon: '☪', color: '#1A237E', desc: 'Croyance authentique' },
  { id: 'tafsir', name: 'Tafsir / Coran',nameAr: 'تفسير',  icon: '۩', color: '#4A148C', desc: 'Exégèse du Coran' },
  { id: 'hadith', name: 'Hadith',        nameAr: 'حديث',   icon: '◉', color: '#BF360C', desc: 'Sciences du hadith' },
  { id: 'sirah',  name: 'Sirah',         nameAr: 'سيرة',   icon: '✦', color: '#01579B', desc: 'Vie du Prophète ﷺ' },
  { id: 'akhlaq', name: 'Akhlaq',        nameAr: 'أخلاق',  icon: '✧', color: '#006064', desc: 'Comportement & éthique' },
];

export const SETUP_LEVELS = [
  { id: 1, name: "Mubtadi'", nameAr: 'مبتدئ', desc: 'Débutant' },
  { id: 2, name: "Muta'allim", nameAr: 'متعلم', desc: 'Initié' },
  { id: 3, name: 'Mutawassit', nameAr: 'متوسط', desc: 'Intermédiaire' },
  { id: 4, name: 'Mutaqaddim', nameAr: 'متقدم', desc: 'Avancé' },
  { id: 5, name: "'Alim", nameAr: 'عالم', desc: 'Expert' },
];

export const SETUP_NB_QUESTIONS = [5, 10, 15, 20, 30];

interface QuizSetupState {
  setup_mode: SetupModeId | null;
  setup_domaine: string | null;
  setup_niveau: number | 'mixte' | null;
  setup_nb: number | null;
  setMode: (m: SetupModeId | null) => void;
  setDomaine: (d: string | null) => void;
  setNiveau: (n: number | 'mixte' | null) => void;
  setNb: (n: number | null) => void;
  reset: () => void;
}

export const useQuizSetupStore = create<QuizSetupState>((set) => ({
  setup_mode: null,
  setup_domaine: null,
  setup_niveau: null,
  setup_nb: null,
  setMode: (m) => set({ setup_mode: m }),
  setDomaine: (d) => set({ setup_domaine: d }),
  setNiveau: (n) => set({ setup_niveau: n }),
  setNb: (n) => set({ setup_nb: n }),
  reset: () => set({ setup_mode: null, setup_domaine: null, setup_niveau: null, setup_nb: null }),
}));
