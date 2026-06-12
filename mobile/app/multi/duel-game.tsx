import { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { useDuelStore } from '../../store/duelStore';
import { useAuthStore } from '../../store/authStore';
import { getCurrentLang } from '../../i18n';

const TIME_PER_Q_MS = 30000;

export default function DuelGame() {
  const lang = getCurrentLang();
  const isAr = lang === 'ar';
  const { user } = useAuthStore();
  const {
    status, currentQuestion, questionIndex, totalQuestions,
    scores, challengerPseudo, challengedPseudo, lastResult,
    finalScores, gagnantId, submitAnswer, reset,
  } = useDuelStore();

  const [selected, setSelected] = useState<string | null>(null);
  const [remainingMs, setRemainingMs] = useState(TIME_PER_Q_MS);
  const tStart = useRef<number>(Date.now());

  useEffect(() => {
    setSelected(null);
    tStart.current = Date.now();
    setRemainingMs(TIME_PER_Q_MS);
  }, [currentQuestion?.id]);

  useEffect(() => {
    if (status !== 'playing') return;
    const interval = setInterval(() => {
      const elapsed = Date.now() - tStart.current;
      const left = Math.max(0, TIME_PER_Q_MS - elapsed);
      setRemainingMs(left);
      if (left === 0 && !selected && currentQuestion && user) {
        const wrong = currentQuestion.reponses?.find(r => !r.est_correcte);
        if (wrong) {
          setSelected(wrong.id);
          submitAnswer(user.id, currentQuestion.id, wrong.id, TIME_PER_Q_MS);
        }
      }
    }, 200);
    return () => clearInterval(interval);
  }, [status, currentQuestion?.id, selected, user, submitAnswer]);

  function handleAnswer(repId: string) {
    if (selected || !currentQuestion || !user) return;
    setSelected(repId);
    const elapsed = Date.now() - tStart.current;
    submitAnswer(user.id, currentQuestion.id, repId, elapsed);
  }

  function getColor(repId: string): string {
    if (!lastResult) return selected === repId ? COLORS.primary + '20' : COLORS.surface;
    if (repId === lastResult.bonne_reponse_id) return '#C8E6C9';
    if (repId === selected && !lastResult.est_correcte) return '#FFCDD2';
    return COLORS.surface;
  }

  // ─────── End screen ───────
  if (status === 'finished') {
    const won = user?.id === gagnantId;
    const draw = gagnantId === null;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.endBody}>
          <Text style={styles.endEmoji}>{draw ? '🤝' : won ? '🏆' : '⚔️'}</Text>
          <Text style={styles.endTitle}>
            {draw
              ? (isAr ? 'تعادل' : 'Match nul')
              : won
                ? (isAr ? 'فزت!' : 'Victoire !')
                : (isAr ? 'هزيمة' : 'Défaite')}
          </Text>
          <View style={styles.scoresBox}>
            {finalScores.map(s => (
              <View key={s.user_id} style={styles.scoreRow}>
                <Text style={styles.rang}>#{s.rang}</Text>
                <Text style={styles.scorePseudo}>{s.pseudo}</Text>
                <Text style={styles.scoreValue}>{s.score} XP</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={styles.exitBtn}
            onPress={() => { reset(); router.replace('/(tabs)/multi'); }}
          >
            <Text style={styles.exitBtnText}>
              {isAr ? 'العودة' : 'Retour au multi'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─────── Waiting screen ───────
  if (status !== 'playing' || !currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.waitingBody}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.waitingText}>
            {isAr ? 'في انتظار الخصم…' : 'En attente de l’adversaire…'}
          </Text>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => { reset(); router.back(); }}
          >
            <Text style={styles.cancelBtnText}>
              {isAr ? 'إلغاء' : 'Annuler'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─────── Game screen ───────
  const myScore = user ? scores[user.id] || 0 : 0;
  const oppScores = Object.entries(scores).filter(([id]) => id !== user?.id);
  const oppScore = oppScores[0]?.[1] || 0;
  const oppPseudo = (user?.id === user?.id ? challengedPseudo : challengerPseudo) || '—';
  const seconds = Math.ceil(remainingMs / 1000);
  const isLowTime = seconds <= 5;

  return (
    <SafeAreaView style={styles.container}>
      {/* Scoreboard */}
      <View style={styles.scoreboard}>
        <View style={styles.playerBox}>
          <Text style={styles.playerLabel}>{isAr ? 'أنا' : 'Toi'}</Text>
          <Text style={styles.playerPseudo}>{user?.pseudo}</Text>
          <Text style={styles.playerScore}>{myScore}</Text>
        </View>
        <View style={[styles.timerBox, isLowTime && styles.timerLow]}>
          <Text style={[styles.timerText, isLowTime && { color: '#FFF' }]}>{seconds}s</Text>
          <Text style={[styles.timerSub, isLowTime && { color: '#FFFFFFCC' }]}>
            {questionIndex + 1}/{totalQuestions}
          </Text>
        </View>
        <View style={styles.playerBox}>
          <Text style={styles.playerLabel}>{isAr ? 'الخصم' : 'Adv.'}</Text>
          <Text style={styles.playerPseudo}>{oppPseudo}</Text>
          <Text style={styles.playerScore}>{oppScore}</Text>
        </View>
      </View>

      {/* Question */}
      <View style={styles.questionCard}>
        <Text style={styles.domainBadge}>{currentQuestion.domaine?.toUpperCase()}</Text>
        <Text style={styles.questionText}>
          {isAr ? currentQuestion.texte_ar : currentQuestion.texte_fr}
        </Text>
      </View>

      {/* Answers */}
      <View style={styles.answers}>
        {currentQuestion.reponses?.map(r => (
          <TouchableOpacity
            key={r.id}
            style={[styles.answerBtn, { backgroundColor: getColor(r.id) }]}
            onPress={() => handleAnswer(r.id)}
            disabled={!!selected}
            activeOpacity={0.85}
          >
            <Text style={styles.answerText}>
              {isAr ? r.texte_ar : r.texte_fr}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {lastResult && (
        <View style={styles.feedback}>
          <Text style={[styles.feedbackText, { color: lastResult.est_correcte ? '#2E7D32' : '#C62828' }]}>
            {lastResult.est_correcte
              ? (isAr ? `✅ صحيح! +${lastResult.xp_gagne} XP` : `✅ Bonne réponse ! +${lastResult.xp_gagne} XP`)
              : (isAr ? '❌ خطأ' : '❌ Mauvaise réponse')}
          </Text>
          <Text style={styles.feedbackHint}>
            {isAr ? 'في انتظار الخصم…' : 'En attente de l’adversaire…'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scoreboard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 14, gap: 8,
  },
  playerBox: { flex: 1, alignItems: 'center' },
  playerLabel: { fontSize: 10, color: '#FFFFFF99', fontWeight: '600' },
  playerPseudo: { fontSize: 12, color: '#FFF', fontWeight: '600', marginTop: 2 },
  playerScore: { fontSize: 20, color: COLORS.gold, fontWeight: '800', marginTop: 2 },
  timerBox: {
    backgroundColor: '#FFFFFF22', borderRadius: 30,
    width: 60, height: 60, alignItems: 'center', justifyContent: 'center',
  },
  timerLow: { backgroundColor: '#C62828' },
  timerText: { fontSize: 18, fontWeight: '800', color: COLORS.gold },
  timerSub: { fontSize: 10, color: '#FFFFFF99', marginTop: 2 },
  questionCard: {
    backgroundColor: COLORS.surface, margin: 16, padding: 18,
    borderRadius: 14, borderWidth: 1, borderColor: COLORS.border,
  },
  domainBadge: {
    fontSize: 10, fontWeight: '700', color: COLORS.primary,
    backgroundColor: COLORS.primary + '15', alignSelf: 'flex-start',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 10,
  },
  questionText: { fontSize: 16, color: COLORS.text, lineHeight: 24, fontWeight: '600' },
  answers: { paddingHorizontal: 16, gap: 10 },
  answerBtn: {
    paddingVertical: 14, paddingHorizontal: 14,
    borderRadius: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  answerText: { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  feedback: { alignItems: 'center', marginTop: 16 },
  feedbackText: { fontSize: 16, fontWeight: '700' },
  feedbackHint: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  waitingBody: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  waitingText: { fontSize: 15, color: COLORS.textSecondary },
  cancelBtn: { marginTop: 20, padding: 12 },
  cancelBtnText: { color: COLORS.error, fontWeight: '700' },
  endBody: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  endEmoji: { fontSize: 80 },
  endTitle: { fontSize: 28, fontWeight: '800', color: COLORS.text, marginTop: 12, marginBottom: 20 },
  scoresBox: {
    width: '100%', backgroundColor: COLORS.surface, borderRadius: 14,
    padding: 16, borderWidth: 1, borderColor: COLORS.border, gap: 10,
  },
  scoreRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 6,
  },
  rang: { fontSize: 16, fontWeight: '800', color: COLORS.gold, width: 32 },
  scorePseudo: { flex: 1, fontSize: 14, color: COLORS.text, fontWeight: '600' },
  scoreValue: { fontSize: 14, color: COLORS.primary, fontWeight: '700' },
  exitBtn: {
    backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 14,
    borderRadius: 12, marginTop: 24,
  },
  exitBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});
