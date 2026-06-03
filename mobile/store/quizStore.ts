import { create } from 'zustand';
import { Question, QuizConfig, PlayerAnswer, QuizResult } from '../types';
import { questionsApi, quizApi, srsApi } from '../services/api';
import { offlineCache } from '../services/offlineCache';

interface QuizState {
  config: QuizConfig | null;
  questions: Question[];
  currentIndex: number;
  answers: PlayerAnswer[];
  score: number;
  xpGained: number;
  result: QuizResult | null;
  isLoading: boolean;
  status: 'idle' | 'loading' | 'playing' | 'finished';
  questionStartTime: number;

  startQuiz: (config: QuizConfig) => Promise<void>;
  answerQuestion: (reponse_id: string) => void;
  nextQuestion: () => void;
  finishQuiz: () => Promise<void>;
  resetQuiz: () => void;
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
  status: 'idle',
  questionStartTime: 0,

  startQuiz: async (config) => {
    set({ isLoading: true, status: 'loading', config, answers: [], currentIndex: 0, score: 0, xpGained: 0, result: null });
    try {
      let response;
      if (config.mode === 'quotidien') {
        response = await questionsApi.getDailyQuestions();
      } else if (config.mode === 'murajaah') {
        response = await quizApi.getMistakes(config.nb_questions);
      } else if (config.mode === 'talallum') {
        // Mode Ta'allum : priorité aux cartes SRS échues, sinon nouvelles questions
        response = await srsApi.getDue(config.nb_questions);
        if (response.data.data.length === 0) {
          response = await questionsApi.getQuestions({
            domaine: config.domaine,
            niveau: typeof config.niveau === 'number' ? config.niveau : undefined,
            madhab: config.madhab,
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
      set({
        questions: response.data.data,
        isLoading: false,
        status: 'playing',
        questionStartTime: Date.now(),
      });
      offlineCache.saveQuestions(response.data.data);
    } catch (err) {
      if (config.mode !== 'quotidien' && config.mode !== 'murajaah') {
        const cached = await offlineCache.loadQuestions();
        if (cached.length > 0) {
          set({ questions: cached, status: 'playing', isLoading: false });
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

    const temps_ms = Date.now() - questionStartTime;
    const answer: PlayerAnswer = {
      question_id: question.id,
      reponse_id,
      temps_ms,
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
    const { answers } = get();
    if (answers.length === 0) {
      set({ status: 'finished' });
      return;
    }
    try {
      const response = await quizApi.submitQuiz({
        answers: answers.map(a => ({
          question_id: a.question_id,
          reponse_id: a.reponse_id,
          temps_ms: a.temps_ms,
        })),
      });

      // Mode Ta'allum : reprogramme chaque question via le SRS
      const { config } = get();
      if (config?.mode === 'talallum' && response.data.data.answers_detail) {
        await Promise.all(
          response.data.data.answers_detail.map((d) => {
            // qualité : 0 = faux, 2 = correct, 3 = correct & rapide (< 5s)
            const answer = answers.find(a => a.question_id === d.question_id);
            const quality = !d.est_correcte ? 0 : (answer && answer.temps_ms < 5000 ? 3 : 2);
            return srsApi.review(d.question_id, quality).catch(() => {});
          })
        );
      }

      set({ result: response.data.data, status: 'finished' });
    } catch {
      set({ status: 'finished' });
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
    });
  },
}));
