import { create } from 'zustand';
import type { Socket } from 'socket.io-client';
import { Room, Question, RoomPlayer } from '../types';
import { roomsApi } from '../services/api';

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000';

interface GameState {
  room: Room | null;
  socket: Socket | null;
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

export const useGameStore = create<GameState>((set, get) => ({
  room: null,
  socket: null,
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

  connectSocket: async (roomId, userId) => {
    const { io } = await import('socket.io-client');
    const socket = io(SOCKET_URL, { transports: ['websocket'] });

    socket.on('connect', () => {
      socket.emit('join-room', { room_id: roomId, user_id: userId });
    });

    socket.on('player-joined', ({ players }: { players: RoomPlayer[] }) => {
      set({ players });
    });

    socket.on('game-started', ({ total_questions }: { total_questions: number }) => {
      set({ status: 'playing', totalQuestions: total_questions });
    });

    socket.on('question-received', ({ question, index }: { question: Question; index: number }) => {
      set({ currentQuestion: question, questionIndex: index, lastAnswerResult: null });
    });

    socket.on('answer-result', (result: { est_correcte: boolean; bonne_reponse_id: string; xp_gagnes: number; scores: Record<string, number> }) => {
      set({ lastAnswerResult: result, scores: result.scores });
    });

    socket.on('game-over', ({ final_scores }: { final_scores: Array<{ user_id: string; pseudo: string; score: number; rang: number }> }) => {
      set({ status: 'finished', finalScores: final_scores });
    });

    set({ socket });
  },

  startGame: () => {
    const { socket, room } = get();
    if (socket && room) {
      socket.emit('start-game', { room_id: room.id });
    }
  },

  submitAnswer: (question_id, reponse_id, temps_ms) => {
    const { socket, room } = get();
    if (socket && room) {
      socket.emit('submit-answer', {
        room_id: room.id,
        question_id,
        reponse_id,
        temps_ms,
      });
    }
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) socket.disconnect();
    set({ socket: null, room: null, status: 'idle', currentQuestion: null, finalScores: [], players: [] });
  },
}));
