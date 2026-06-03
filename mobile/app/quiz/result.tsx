import { useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useQuizStore } from '../../store/quizStore';
import { MOTIVATION_HADITHS } from '../../constants/islamic';

function getMotivationHadith(score: number) {
  if (score >= 80) return MOTIVATION_HADITHS[0];
  if (score >= 50) return MOTIVATION_HADITHS[1];
  return MOTIVATION_HADITHS[2];
}

export default function QuizResult() {
  const { result, questions, answers, resetQuiz, config } = useQuizStore();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const hadith = getMotivationHadith(result?.score || 0);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, []);

  const score = result?.score || 0;
  const correctCount = result?.correct_count || 0;
  const total = result?.total || answers.length;
  const xpGained = result?.xp_gained || 0;

  const scoreColor = score >= 80 ? COLORS.success : score >= 50 ? COLORS.warning : COLORS.error;

  const handlePlayAgain = () => {
    resetQuiz();
    router.replace('/(tabs)/quiz');
  };

  const handleGoHome = () => {
    resetQuiz();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Score Circle */}
        <View style={styles.scoreSection}>
          <Animated.View style={[styles.scoreCircle, { borderColor: scoreColor, transform: [{ scale: scaleAnim }] }]}>
            <Text style={[styles.scoreValue, { color: scoreColor }]}>{score}%</Text>
            <Text style={styles.scoreLabel}>Score</Text>
          </Animated.View>

          <Text style={styles.correctText}>{correctCount}/{total} correctes</Text>

          {/* XP gained */}
          <View style={styles.xpBadge}>
            <Ionicons name="star" size={16} color={COLORS.gold} />
            <Text style={styles.xpText}>+{xpGained} XP gagnés</Text>
          </View>

          {result?.level_up && (
            <View style={styles.levelUpBadge}>
              <Text style={styles.levelUpText}>🎉 Niveau supérieur !</Text>
            </View>
          )}
        </View>

        {/* Hadith de motivation */}
        <View style={styles.hadithCard}>
          <Text style={styles.hadithAr}>{hadith.textAr}</Text>
          <Text style={styles.hadithFr}>"{hadith.text}"</Text>
          <Text style={styles.hadithSource}>— {hadith.source}</Text>
        </View>

        {/* Answers review */}
        <View style={styles.reviewSection}>
          <Text style={styles.reviewTitle}>Révision des réponses</Text>
          {answers.map((answer, index) => {
            const question = questions[index];
            const detail = result?.answers_detail[index];
            if (!question) return null;

            return (
              <View key={answer.question_id} style={[styles.reviewItem, detail?.est_correcte ? styles.reviewCorrect : styles.reviewIncorrect]}>
                <View style={styles.reviewHeader}>
                  {detail?.est_correcte
                    ? <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                    : <Ionicons name="close-circle" size={18} color={COLORS.error} />
                  }
                  <Text style={styles.reviewQ} numberOfLines={2}>{question.texte_fr}</Text>
                </View>
                {!detail?.est_correcte && question.explication && (
                  <Text style={styles.reviewExplication}>{question.explication}</Text>
                )}
              </View>
            );
          })}
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.playAgainButton} onPress={handlePlayAgain} activeOpacity={0.85}>
            <Ionicons name="refresh" size={18} color="#FFFFFF" />
            <Text style={styles.playAgainText}>Rejouer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeButton} onPress={handleGoHome} activeOpacity={0.85}>
            <Ionicons name="home" size={18} color={COLORS.primary} />
            <Text style={styles.homeText}>Accueil</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, paddingBottom: 40 },
  scoreSection: { alignItems: 'center', paddingVertical: 24 },
  scoreCircle: {
    width: 140, height: 140, borderRadius: 70, borderWidth: 6,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: COLORS.surface,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
    marginBottom: 16,
  },
  scoreValue: { fontSize: 40, fontWeight: 'bold' },
  scoreLabel: { fontSize: 13, color: COLORS.textSecondary },
  correctText: { fontSize: 16, color: COLORS.text, fontWeight: '600', marginBottom: 12 },
  xpBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,215,0,0.15)', borderRadius: 20,
    paddingVertical: 8, paddingHorizontal: 16, marginBottom: 8,
  },
  xpText: { fontSize: 15, fontWeight: 'bold', color: COLORS.goldDark },
  levelUpBadge: {
    backgroundColor: COLORS.primary, borderRadius: 20,
    paddingVertical: 8, paddingHorizontal: 16,
  },
  levelUpText: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF' },
  hadithCard: {
    backgroundColor: COLORS.surface, borderRadius: 14, padding: 16,
    marginBottom: 20, borderLeftWidth: 3, borderLeftColor: COLORS.gold,
  },
  hadithAr: {
    fontSize: 16, color: COLORS.arabicText, textAlign: 'right',
    writingDirection: 'rtl', marginBottom: 8, lineHeight: 24,
  },
  hadithFr: { fontSize: 13, color: COLORS.textSecondary, fontStyle: 'italic', marginBottom: 4 },
  hadithSource: { fontSize: 11, color: COLORS.textLight },
  reviewSection: { marginBottom: 24 },
  reviewTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 },
  reviewItem: {
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 14,
    marginBottom: 8, borderLeftWidth: 3,
  },
  reviewCorrect: { borderLeftColor: COLORS.success },
  reviewIncorrect: { borderLeftColor: COLORS.error },
  reviewHeader: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  reviewQ: { flex: 1, fontSize: 13, color: COLORS.text },
  reviewExplication: { fontSize: 12, color: COLORS.textSecondary, marginTop: 6, fontStyle: 'italic' },
  buttonsContainer: { flexDirection: 'row', gap: 12 },
  playAgainButton: {
    flex: 1, backgroundColor: COLORS.primary, borderRadius: 14,
    paddingVertical: 16, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
  },
  playAgainText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  homeButton: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 14,
    paddingVertical: 16, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    borderWidth: 1.5, borderColor: COLORS.primary,
  },
  homeText: { fontSize: 16, fontWeight: '600', color: COLORS.primary },
});
