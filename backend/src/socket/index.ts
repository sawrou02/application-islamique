import { Server as SocketServer } from 'socket.io';
import pool from '../db';

interface RoomPlayer {
  user_id: string;
  pseudo: string;
  score: number;
  answered: boolean;
}

const rooms = new Map<string, { players: RoomPlayer[]; questionIndex: number; questions: unknown[] }>();

export function setupSocket(io: SocketServer): void {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // join-room
    socket.on('join-room', async ({ room_id, user_id }: { room_id: string; user_id: string }) => {
      try {
        const userResult = await pool.query('SELECT pseudo FROM users WHERE id = $1', [user_id]);
        if (userResult.rows.length === 0) return;

        const pseudo = userResult.rows[0].pseudo;
        socket.join(room_id);

        if (!rooms.has(room_id)) {
          rooms.set(room_id, { players: [], questionIndex: 0, questions: [] });
        }

        const room = rooms.get(room_id)!;
        const existing = room.players.find(p => p.user_id === user_id);
        if (!existing) {
          room.players.push({ user_id, pseudo, score: 0, answered: false });
        }

        io.to(room_id).emit('player-joined', {
          players: room.players,
          user_id,
          pseudo,
        });
      } catch (err) {
        console.error('join-room error:', err);
      }
    });

    // start-game
    socket.on('start-game', async ({ room_id }: { room_id: string }) => {
      try {
        const partieResult = await pool.query(
          'SELECT * FROM parties WHERE id = $1',
          [room_id]
        );
        if (partieResult.rows.length === 0) return;

        const config = partieResult.rows[0].config || {};
        const domaine = config.domaine || null;
        const niveau = config.niveau || null;
        const nb = config.nb_questions || 10;

        const conditions = ["q.statut = 'valide'"];
        const params: unknown[] = [];
        let idx = 1;

        if (domaine) { conditions.push(`q.domaine = $${idx++}`); params.push(domaine); }
        if (niveau) { conditions.push(`q.niveau = $${idx++}`); params.push(niveau); }
        params.push(nb);

        const questionsResult = await pool.query(
          `SELECT q.*, json_agg(json_build_object(
            'id', r.id, 'texte_fr', r.texte_fr, 'texte_ar', r.texte_ar, 'est_correcte', r.est_correcte
          ) ORDER BY r.id) AS reponses
          FROM questions q
          LEFT JOIN reponses r ON r.question_id = q.id
          WHERE ${conditions.join(' AND ')}
          GROUP BY q.id
          ORDER BY RANDOM()
          LIMIT $${idx}`,
          params
        );

        const room = rooms.get(room_id);
        if (room) {
          room.questions = questionsResult.rows;
          room.questionIndex = 0;
          room.players.forEach(p => { p.score = 0; p.answered = false; });
        }

        await pool.query(
          "UPDATE parties SET statut = 'en_cours' WHERE id = $1",
          [room_id]
        );

        io.to(room_id).emit('game-started', {
          total_questions: questionsResult.rows.length,
        });

        // Send first question
        if (questionsResult.rows.length > 0) {
          const firstQ = { ...questionsResult.rows[0] };
          // Hide correct answers
          if (firstQ.reponses) {
            firstQ.reponses = firstQ.reponses.map((r: { id: string; texte_fr: string; texte_ar?: string; est_correcte: boolean }) => ({
              id: r.id, texte_fr: r.texte_fr, texte_ar: r.texte_ar,
            }));
          }

          io.to(room_id).emit('question-received', {
            question: firstQ,
            index: 0,
            total: questionsResult.rows.length,
          });
        }
      } catch (err) {
        console.error('start-game error:', err);
      }
    });

    // submit-answer
    socket.on('submit-answer', async ({
      room_id, user_id, question_id, reponse_id, temps_ms,
    }: {
      room_id: string; user_id: string; question_id: string; reponse_id: string; temps_ms: number;
    }) => {
      try {
        const room = rooms.get(room_id);
        if (!room) return;

        const q = room.questions[room.questionIndex] as {
          id: string; niveau: number; reponses?: { id: string; est_correcte: boolean }[];
        };
        if (!q || q.id !== question_id) return;

        const correctReponse = q.reponses?.find(r => r.est_correcte);
        const est_correcte = correctReponse?.id === reponse_id;

        let xp = 0;
        if (est_correcte) {
          xp = q.niveau * 10;
          if (temps_ms < 5000) xp = Math.round(xp * 1.5);
        }

        const player = room.players.find(p => p.user_id === user_id);
        if (player && !player.answered) {
          player.score += xp;
          player.answered = true;
        }

        const scores: Record<string, number> = {};
        room.players.forEach(p => { scores[p.user_id] = p.score; });

        socket.emit('answer-result', {
          est_correcte,
          bonne_reponse_id: correctReponse?.id,
          xp_gagnes: xp,
          scores,
        });

        // Check if all answered
        const allAnswered = room.players.every(p => p.answered);
        if (allAnswered) {
          setTimeout(() => {
            room.questionIndex++;
            room.players.forEach(p => { p.answered = false; });

            if (room.questionIndex < room.questions.length) {
              const rawNextQ = room.questions[room.questionIndex] as Record<string, unknown>;
              const nextQ: Record<string, unknown> = { ...rawNextQ };
              if (Array.isArray(nextQ.reponses)) {
                nextQ.reponses = (nextQ.reponses as { id: string; texte_fr: string; texte_ar?: string }[]).map(r => ({
                  id: r.id, texte_fr: r.texte_fr, texte_ar: r.texte_ar,
                }));
              }

              io.to(room_id).emit('question-received', {
                question: nextQ,
                index: room.questionIndex,
                total: room.questions.length,
              });
            } else {
              // Game over
              const finalScores = room.players
                .sort((a, b) => b.score - a.score)
                .map((p, i) => ({ ...p, rang: i + 1 }));

              io.to(room_id).emit('game-over', { final_scores: finalScores });

              pool.query(
                "UPDATE parties SET statut = 'terminee', ended_at = NOW(), score_final = $1 WHERE id = $2",
                [JSON.stringify(scores), room_id]
              ).catch(console.error);
            }
          }, 2000);
        }
      } catch (err) {
        console.error('submit-answer error:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}
