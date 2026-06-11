import { create } from 'zustand';
import { Room, Question, RoomPlayer } from '../types';
import { roomsApi } from '../services/api';

const SOCKET_URL = (process.env.EXPO_PUBLIC_API_URL || 'https://application-islamique-production.up.railway.app/api')
  .replace('/api', '')
  .replace('https://', 'wss://')
  .replace('http://', 'ws://');

interface GameState {
  room: Room | null;
  ws: WebSocket | null;
  currentQuestion: Question | null;
  questionIndex: number;
  totalQuestions: number;
  scores: Record<string, number>;
  players: RoomPlayer[];
  status: 'idle' | 'waiting' | 'playing' | 'finished';
  finalScores: Array<{ user_id: string; pseudo: string; score: number; rang: number }>;
  lastAnswerResult: { est_correcte: boolean; bonne_reponse_id: string; xp_gagnes: number } | null;

  createRoom: (config: object) => Promise<Room>;
  joinRoom: (code: string) => Promise<Room>;
  connectSocket: (roomId: string, userId: string) => void;
  startGame: () => void;
  submitAnswer: (question_id: string, reponse_id: string, temps_ms: number) => void;
  disconnect: () => void;
}

function send(ws: WebSocket | null, event: string, data: object) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ event, data }));
  }
}

export const useGameStore = create<GameState>((set, get) => ({
  room: null,
  ws: null,
  currentQuestion: null,
  questionIndex: 0,
  totalQuestions: 0,
  scores: {},
  players: [],
  status: 'idle',
  finalScores: [],
  lastAnswerResult: null,

  createRoom: async (config) => {
    const response = await roomsApi.createRoom(config);
    const room = response.data.data;
    set({ room, status: 'waiting' });
    return room;
  },

  joinRoom: async (code) => {
    const response = await roomsApi.joinRoom(code);
    const room = response.data.data;
    set({ room, status: 'waiting' });
    return room;
  },

  connectSocket: (roomId, userId) => {
    const ws = new WebSocket(`${SOCKET_URL}/socket.io/?transport=websocket`);

    ws.onopen = () => {
      send(ws, 'join-room', { room_id: roomId, user_id: userId });
    };

    ws.onmessage = (e) => {
      try {
        const { event, data } = JSON.parse(e.data);
        switch (event) {
          case 'player-joined':
            set({ players: data.players });
            break;
          case 'game-started':
            set({ status: 'playing', totalQuestions: data.total_questions });
            break;
          case 'question-received':
            set({ currentQuestion: data.question, questionIndex: data.index, lastAnswerResult: null });
            break;
          case 'answer-result':
            set({ lastAnswerResult: data, scores: data.scores });
            break;
          case 'game-over':
            set({ status: 'finished', finalScores: data.final_scores });
            break;
        }
      } catch {}
    };

    ws.onerror = () => {};
    ws.onclose = () => {};

    set({ ws });
  },

  startGame: () => {
    const { ws, room } = get();
    send(ws, 'start-game', { room_id: room?.id });
  },

  submitAnswer: (question_id, reponse_id, temps_ms) => {
    const { ws, room } = get();
    send(ws, 'submit-answer', { room_id: room?.id, question_id, reponse_id, temps_ms });
  },

  disconnect: () => {
    const { ws } = get();
    if (ws) ws.close();
    set({ ws: null, room: null, status: 'idle', currentQuestion: null, finalScores: [], players: [] });
  },
}));
