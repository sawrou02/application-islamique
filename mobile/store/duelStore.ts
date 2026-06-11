import { create } from 'zustand';
import type { Socket } from 'socket.io-client';
import { Question } from '../types';
import { duelsApi } from '../services/api';

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000';

type DuelStatus = 'idle' | 'waiting' | 'playing' | 'finished';

interface FinalEntry {
  user_id: string;
  pseudo: string;
  score: number;
  rang: number;
}

interface AnswerResult {
  est_correcte: boolean;
  bonne_reponse_id: string;
  xp_gagne: number;
  mon_score: number;
}

interface DuelState {
  socket: Socket | null;
  duelId: string | null;
  inviteToken: string | null;
  challengerPseudo: string | null;
  challengedPseudo: string | null;
  status: DuelStatus;
  currentQuestion: Question | null;
  questionIndex: number;
  totalQuestions: number;
  scores: Record<string, number>;
  lastResult: AnswerResult | null;
  finalScores: FinalEntry[];
  gagnantId: string | null;

  createDuel: (config: { domaine?: string; niveau?: number | string; nb_questions?: number }) => Promise<{ id: string; invite_token: string; code_salle: string }>;
  acceptDuel: (token: string) => Promise<{ id: string }>;
  connect: (duelId: string, userId: string) => void;
  submitAnswer: (userId: string, question_id: string, reponse_id: string, temps_ms: number) => void;
  reset: () => void;
}

export const useDuelStore = create<DuelState>((set, get) => ({
  socket: null,
  duelId: null,
  inviteToken: null,
  challengerPseudo: null,
  challengedPseudo: null,
  status: 'idle',
  currentQuestion: null,
  questionIndex: 0,
  totalQuestions: 0,
  scores: {},
  lastResult: null,
  finalScores: [],
  gagnantId: null,

  createDuel: async (config) => {
    const res = await duelsApi.createDuel(config);
    const { id, invite_token, code_salle } = res.data.data;
    set({ duelId: id, inviteToken: invite_token, status: 'waiting' });
    return { id, invite_token, code_salle };
  },

  acceptDuel: async (token) => {
    const res = await duelsApi.acceptDuel(token);
    const d = res.data.data as { id: string };
    set({ duelId: d.id, status: 'waiting' });
    return d;
  },

  connect: async (duelId, userId) => {
    if (get().socket) return;
    const { io } = await import('socket.io-client');
    const socket = io(SOCKET_URL, { transports: ['websocket'] });

    socket.on('connect', () => {
      socket.emit('join-duel', { duel_id: duelId, user_id: userId });
    });

    socket.on('duel-player-joined', ({ challenger_pseudo, challenged_pseudo }: { challenger_pseudo: string; challenged_pseudo: string }) => {
      set({ challengerPseudo: challenger_pseudo, challengedPseudo: challenged_pseudo });
    });

    socket.on('duel-started', ({ question, index, total }: { question: Question; index: number; total: number }) => {
      set({ status: 'playing', currentQuestion: question, questionIndex: index, totalQuestions: total, lastResult: null });
    });

    socket.on('duel-question', ({ question, index, total }: { question: Question; index: number; total: number }) => {
      set({ currentQuestion: question, questionIndex: index, totalQuestions: total, lastResult: null });
    });

    socket.on('duel-answer-result', (result: AnswerResult) => {
      set({ lastResult: result });
    });

    socket.on('duel-scores', ({ scores }: { scores: Record<string, number> }) => {
      set({ scores });
    });

    socket.on('duel-over', ({ final_scores, gagnant_id }: { final_scores: FinalEntry[]; gagnant_id: string | null }) => {
      set({ status: 'finished', finalScores: final_scores, gagnantId: gagnant_id });
    });

    set({ socket, duelId });
  },

  submitAnswer: (userId, question_id, reponse_id, temps_ms) => {
    const { socket, duelId } = get();
    if (!socket || !duelId) return;
    socket.emit('duel-submit-answer', {
      duel_id: duelId,
      user_id: userId,
      question_id,
      reponse_id,
      temps_ms,
    });
  },

  reset: () => {
    const { socket } = get();
    if (socket) socket.disconnect();
    set({
      socket: null, duelId: null, inviteToken: null,
      challengerPseudo: null, challengedPseudo: null,
      status: 'idle', currentQuestion: null, questionIndex: 0, totalQuestions: 0,
      scores: {}, lastResult: null, finalScores: [], gagnantId: null,
    });
  },
}));
