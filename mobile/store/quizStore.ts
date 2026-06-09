import { create } from 'zustand';
import { Question, QuizConfig, PlayerAnswer, QuizResult } from '../types';
import { questionsApi, quizApi, srsApi } from '../services/api';
import { offlineCache } from '../services/offlineCache';
import { checkOnline } from '../hooks/useNetworkStatus';

interface QuizState {
  config: QuizConfig | null;
  questions: Question[];
  currentIndex: number;
  answers: PlayerAnswer[];
  score: number;
  xpGained: number;
  result: QuizResult | null;
  isLoading: boolean;
  isOffline: boolean;
  status: 'idle' | 'loading' | 'playing' | 'finished';
  questionStartTime: number;

  startQuiz: (config: QuizConfig) => Promise<void>;
  answerQuestion: (reponse_id: string) => void;
  nextQuestion: () => void;
  finishQuiz: () => Promise<void>;
  resetQuiz: () => void;
  syncPending: () => Promise<void>;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  config: null,
  questions: [],
  currentIndex: 0,
  answers: [],
  score: 0,
  xpGained: 0,
  result: null,
  isLoading: false,
  isOffline: false,
  status: 'idle',
  questionStartTime: 0,

  startQuiz: async (config) => {
    set({ isLoading: true, status: 'loading', config, answers: [], currentIndex: 0, score: 0, xpGained: 0, result: null, isOffline: false });

    const online = await checkOnline();

    // Mode murajaah et quotidien : pas de cache offline (données personnalisées)
    const canUsCache = config.mode !== 'murajaah';

    if (!online && canUsCache) {
      const cached = await offlineCache.loadQuestions(
        config.mode,
        config.domaine,
        config.niveau,
      );
      if (cached.length > 0) {
        set({ questions: cached, isLoading: false, status: 'playing', isOffline: true, questionStartTime: Date.now() });
        return;
      }
      set({ isLoading: false, status: 'idle' });
      throw new Error('offline_no_cache');
    }

    try {
      let response;
      if (config.mode === 'quotidien') {
        response = await questionsApi.getDailyQuestions();
      } else if (config.mode === 'murajaah') {
        response = await quizApi.getMistakes(config.nb_questions);
      } else if (config.mode === 'talallum') {
        response = await srsApi.getDue(config.nb_questions);
        if (response.data.data.length === 0) {
          response = await questionsApi.getQuestions({
            domaine: config.domaine,
            niveau: typeof config.niveau === 'number' ? config.niveau : undefined,
            limit: config.nb_questions,
          });
        }
      } else {
        response = await questionsApi.getQuestions({
          domaine: config.domaine,
          niveau: typeof config.niveau === 'number' ? config.niveau : undefined,
          madhab: config.madhab,
          limit: config.nb_questions,
        });
      }

      const questions: Question[] = response.data.data;
      set({ questions, isLoading: false, status: 'playing', questionStartTime: Date.now() });

      // Mise en cache pour usage hors-ligne
      if (canUsCache) {
        offlineCache.saveQuestions(questions, config.mode, config.domaine, config.niveau);
      }
    } catch (err) {
      // Fallback cache si réseau défaillant
      if (canUsCache) {
        const cached = await offlineCache.loadQuestions(config.mode, config.domaine, config.niveau);
        if (cached.length > 0) {
          set({ questions: cached, isLoading: false, status: 'playing', isOffline: true, questionStartTime: Date.now() });
          return;
        }
      }
      set({ isLoading: false, status: 'idle' });
      throw err;
    }
  },

  answerQuestion: (reponse_id) => {
    const { questions, currentIndex, answers, questionStartTime } = get();
    const question = questions[currentIndex];
    if (!question) return;
    const answer: PlayerAnswer = {
      question_id: question.id,
      reponse_id,
      temps_ms: Date.now() - questionStartTime,
    };
    set({ answers: [...answers, answer] });
  },

  nextQuestion: () => {
    const { currentIndex, questions } = get();
    if (currentIndex + 1 < questions.length) {
      set({ currentIndex: currentIndex + 1, questionStartTime: Date.now() });
    } else {
      get().finishQuiz();
    }
  },

  finishQuiz: async () => {
    const { answers, config, isOffline } = get();
    if (answers.length === 0) {
      set({ status: 'finished' });
      return;
    }

    const payload = answers.map(a => ({
      question_id: a.question_id,
      reponse_id: a.reponse_id,
      temps_ms: a.temps_ms,
    }));

    // Si hors-ligne : mettre en file d'attente et terminer sans score serveur
    if (isOffline) {
      await offlineCache.enqueuePendingResult(payload);
      set({ status: 'finished', result: null });
      return;
    }

    try {
      const response = await quizApi.submitQuiz({ answers: payload });

      if (config?.mode === 'talallum' && response.data.data.answers_detail) {
        await Promise.all(
          response.data.data.answers_detail.map((d) => {
            const answer = answers.find(a => a.question_id === d.question_id);
            const quality = !d.est_correcte ? 0 : (answer && answer.temps_ms < 5000 ? 3 : 2);
            return srsApi.review(d.question_id, quality).catch(() => {});
          })
        );
      }

      set({ result: response.data.data, status: 'finished' });
    } catch {
      // Réseau coupé en fin de quiz : sauvegarder pour sync ultérieure
      await offlineCache.enqueuePendingResult(payload);
      set({ status: 'finished', result: null });
    }
  },

  // Envoie les résultats mis en attente quand le réseau revient
  syncPending: async () => {
    const online = await checkOnline();
    if (!online) return;
    const pending = await offlineCache.flushPendingResults();
    for (const p of pending) {
      try {
        await quizApi.submitQuiz({ answers: p.answers });
      } catch {
        // Re-enqueue si toujours en échec
        await offlineCache.enqueuePendingResult(p.answers);
      }
    }
    if (pending.length > 0) {
      await offlineCache.saveLastSync();
    }
  },

  resetQuiz: () => {
    set({
      config: null,
      questions: [],
      currentIndex: 0,
      answers: [],
      score: 0,
      xpGained: 0,
      result: null,
      status: 'idle',
      isOffline: false,
    });
  },
}));
