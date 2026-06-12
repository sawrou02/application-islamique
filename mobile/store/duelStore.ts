import { create } from 'zustand';
import { Question } from '../types';
import { duelsApi } from '../services/api';

const SOCKET_URL = (process.env.EXPO_PUBLIC_API_URL || 'https://application-islamique-production.up.railway.app/api')
  .replace('/api', '')
  .replace('https://', 'wss://')
  .replace('http://', 'ws://');

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
  ws: WebSocket | null;
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

function send(ws: WebSocket | null, event: string, data: object) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ event, data }));
  }
}

export const useDuelStore = create<DuelState>((set, get) => ({
  ws: null,
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

  connect: (duelId, userId) => {
    if (get().ws) return;
    const ws = new WebSocket(`${SOCKET_URL}/socket.io/?transport=websocket`);

    ws.onopen = () => {
      send(ws, 'join-duel', { duel_id: duelId, user_id: userId });
    };

    ws.onmessage = (e) => {
      try {
        const { event, data } = JSON.parse(e.data);
        switch (event) {
          case 'duel-player-joined':
            set({ challengerPseudo: data.challenger_pseudo, challengedPseudo: data.challenged_pseudo });
            break;
          case 'duel-started':
            set({ status: 'playing', currentQuestion: data.question, questionIndex: data.index, totalQuestions: data.total, lastResult: null });
            break;
          case 'duel-question':
            set({ currentQuestion: data.question, questionIndex: data.index, totalQuestions: data.total, lastResult: null });
            break;
          case 'duel-answer-result':
            set({ lastResult: data });
            break;
          case 'duel-scores':
            set({ scores: data.scores });
            break;
          case 'duel-over':
            set({ status: 'finished', finalScores: data.final_scores, gagnantId: data.gagnant_id });
            break;
        }
      } catch {}
    };

    ws.onerror = () => {};
    ws.onclose = () => {};

    set({ ws, duelId });
  },

  submitAnswer: (userId, question_id, reponse_id, temps_ms) => {
    const { ws, duelId } = get();
    send(ws, 'duel-submit-answer', { duel_id: duelId, user_id: userId, question_id, reponse_id, temps_ms });
  },

  reset: () => {
    const { ws } = get();
    if (ws) ws.close();
    set({
      ws: null, duelId: null, inviteToken: null,
      challengerPseudo: null, challengedPseudo: null,
      status: 'idle', currentQuestion: null, questionIndex: 0, totalQuestions: 0,
      scores: {}, lastResult: null, finalScores: [], gagnantId: null,
    });
  },
}));
