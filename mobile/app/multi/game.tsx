import { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { useGameStore } from '../../store/gameStore';
import { useAuthStore } from '../../store/authStore';
import { Reponse } from '../../types';

const ANSWER_LABELS = ['A', 'B', 'C', 'D'];

export default function MultiGame() {
  const {
    currentQuestion, questionIndex, totalQuestions,
    scores, players, status, finalScores,
    submitAnswer, lastAnswerResult,
  } = useGameStore();
  const { user } = useAuthStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const questionStart = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dalilAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status === 'finished') return;
    setSelectedId(null);
    setTimeLeft(30);
    questionStart.current = Date.now();
    dalilAnim.setValue(0);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [questionIndex]);

  useEffect(() => {
    if (lastAnswerResult) {
      Animated.timing(dalilAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }
  }, [lastAnswerResult]);

  const handleAnswer = (reponse_id: string) => {
    if (selectedId || !currentQuestion || !user) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedId(reponse_id);
    const temps_ms = Date.now() - questionStart.current;
    submitAnswer(currentQuestion.id, reponse_id, temps_ms);
  };

  if (status === 'finished') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.podiumContainer}>
          <Text style={styles.podiumTitle}>Résultats finaux</Text>
          <Text style={styles.podiumTitleAr}>النتائج النهائية</Text>
          {finalScores.map((s) => (
            <View key={s.user_id} style={[styles.podiumRow, s.user_id === user?.id && styles.podiumRowMe]}>
              <Text style={styles.podiumRank}>#{s.rang}</Text>
              <Text style={styles.podiumPseudo}>{s.pseudo}</Text>
              <Text style={styles.podiumScore}>{s.score} XP</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/(tabs)') } activeOpacity={0.85}>
            <Text style={styles.homeBtnText}>Retour à l'accueil</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>En attente...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const reponses = currentQuestion.reponses || [];
  const timerColor = timeLeft > 15 ? COLORS.primary : timeLeft > 7 ? COLORS.warning : COLORS.error;

  return (
    <SafeAreaView style={styles.container}>
      {/* Live scores */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scoresRow} contentContainerStyle={styles.scoresContent}>
        {players.map((p) => (
          <View key={p.user_id} style={[styles.scoreChip, p.user_id === user?.id && styles.scoreChipMe]}>
            <Text style={styles.scoreChipName} numberOfLines={1}>{p.pseudo}</Text>
            <Text style={styles.scoreChipValue}>{scores[p.user_id] || 0}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Progress */}
      <View style={styles.progressRow}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((questionIndex + 1) / totalQuestions) * 100}%` }]} />
        </View>
        <View style={[styles.timerBadge, { borderColor: timerColor }]}>
          <Text style={[styles.timerText, { color: timerColor }]}>{timeLeft}s</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Question */}
        <Text style={styles.questionNum}>Question {questionIndex + 1}/{totalQuestions}</Text>
        {currentQuestion.texte_ar && (
          <Text style={styles.questionAr}>{currentQuestion.texte_ar}</Text>
        )}
        <Text style={styles.questionFr}>{currentQuestion.texte_fr}</Text>

        {/* Answers */}
        <View style={styles.answersContainer}>
          {reponses.map((r: Reponse, i: number) => {
            let btnStyle = {};
            if (selectedId) {
              if (lastAnswerResult) {
                if (r.id === lastAnswerResult.bonne_reponse_id) btnStyle = styles.answerCorrect;
                else if (r.id === selectedId) btnStyle = styles.answerIncorrect;
              } else if (r.id === selectedId) btnStyle = styles.answerSelected;
            }

            return (
              <TouchableOpacity
                key={r.id}
                style={[styles.answerBtn, btnStyle]}
                onPress={() => handleAnswer(r.id)}
                disabled={!!selectedId}
                activeOpacity={0.85}
              >
                <Text style={styles.answerLabel}>{ANSWER_LABELS[i]}</Text>
                <Text style={styles.answerText}>{r.texte_fr}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {lastAnswerResult && (
          <Animated.View style={[styles.resultBadge, { opacity: dalilAnim }]}>
            {lastAnswerResult.est_correcte
              ? <Text style={styles.resultCorrect}>✓ Correct ! +{lastAnswerResult.xp_gagnes} XP</Text>
              : <Text style={styles.resultIncorrect}>✗ Incorrect</Text>
            }
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: COLORS.textSecondary },
  scoresRow: { maxHeight: 64, backgroundColor: COLORS.primary },
  scoresContent: { padding: 12, gap: 8 },
  scoreChip: {
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 20,
    paddingVertical: 6, paddingHorizontal: 14, alignItems: 'center',
  },
  scoreChipMe: { backgroundColor: COLORS.gold },
  scoreChipName: { fontSize: 11, color: '#FFFFFF', maxWidth: 70 },
  scoreChipValue: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },
  progressRow: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
  progressBar: { flex: 1, height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  timerBadge: { borderWidth: 2, borderRadius: 12, paddingVertical: 3, paddingHorizontal: 8 },
  timerText: { fontSize: 13, fontWeight: 'bold' },
  scroll: { padding: 16 },
  questionNum: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 8 },
  questionAr: {
    fontSize: 18, color: COLORS.arabicText, textAlign: 'right',
    writingDirection: 'rtl', marginBottom: 8, lineHeight: 28,
  },
  questionFr: { fontSize: 17, color: COLORS.text, lineHeight: 24, fontWeight: '500', marginBottom: 16 },
  answersContainer: { gap: 10 },
  answerBtn: {
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  answerCorrect: { borderColor: COLORS.success, backgroundColor: 'rgba(46,125,50,0.08)' },
  answerIncorrect: { borderColor: COLORS.error, backgroundColor: 'rgba(198,40,40,0.08)' },
  answerSelected: { borderColor: COLORS.primary },
  answerLabel: {
    width: 28, height: 28, borderRadius: 6, backgroundColor: COLORS.border,
    textAlign: 'center', lineHeight: 28, fontSize: 13, fontWeight: 'bold', color: COLORS.text,
  },
  answerText: { flex: 1, fontSize: 14, color: COLORS.text },
  resultBadge: {
    marginTop: 16, borderRadius: 12, padding: 14, alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  resultCorrect: { fontSize: 16, fontWeight: 'bold', color: COLORS.success },
  resultIncorrect: { fontSize: 16, fontWeight: 'bold', color: COLORS.error },
  podiumContainer: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  podiumTitle: { fontSize: 26, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
  podiumTitleAr: { fontSize: 16, color: COLORS.primary, marginBottom: 24 },
  podiumRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
    borderRadius: 12, padding: 16, marginBottom: 10, gap: 12, width: '100%',
    borderWidth: 1, borderColor: COLORS.border,
  },
  podiumRowMe: { borderColor: COLORS.primary },
  podiumRank: { fontSize: 20, fontWeight: 'bold', color: COLORS.textSecondary, width: 36 },
  podiumPseudo: { flex: 1, fontSize: 16, fontWeight: '600', color: COLORS.text },
  podiumScore: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary },
  homeBtn: {
    backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 16,
    paddingHorizontal: 40, marginTop: 24,
  },
  homeBtnText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
});
