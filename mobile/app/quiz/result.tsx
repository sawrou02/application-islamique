import { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IslamicIcon } from '../../components/IslamicIcon';
import { ShareButton } from '../../components/ShareButton';
import { COLORS } from '../../constants/colors';
import { useQuizStore } from '../../store/quizStore';
import { MOTIVATION_HADITHS } from '../../constants/islamic';
import { getCurrentXpBoost } from '../../services/islamicBoosts';
import { getCurrentLang } from '../../i18n';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { progressionApi } from '../../services/api';

function getMotivationHadith(score: number) {
  if (score >= 80) return MOTIVATION_HADITHS[0];
  if (score >= 50) return MOTIVATION_HADITHS[1];
  return MOTIVATION_HADITHS[2];
}

export default function QuizResult() {
  const { result, questions, answers, resetQuiz, restartBatch, config } = useQuizStore();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const congratsAnim = useRef(new Animated.Value(0)).current;
  const hadith = getMotivationHadith(result?.score || 0);
  const lang = getCurrentLang();
  const isAr = lang === 'ar';
  const isOnline = useNetworkStatus();
  const wasOffline = !result && answers.length > 0;
  const [domainCompleted, setDomainCompleted] = useState(false);
  const [domainGrade, setDomainGrade] = useState(0);
  const [nextLevelNum, setNextLevelNum] = useState<number | null>(null);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, []);

  // Check if the user has completed all 30 questions in this domain/level batch
  useEffect(() => {
    const domaine = config?.domaine;
    const niveau = typeof config?.niveau === 'number' ? config.niveau : null;
    if (!domaine || niveau === null) return;
    progressionApi.getMine().then(res => {
      const data = res.data.data;
      const lvl = data.domains[domaine]?.levels[niveau];
      if (!lvl) return;
      const poolCap = Math.min(lvl.total, 30);
      if (poolCap > 0 && lvl.answered >= poolCap) {
        const grade = Math.round((lvl.answered / poolCap) * 100);
        setDomainGrade(grade);
        const unlockedMax = data.domains[domaine]?.unlocked_max || niveau;
        setNextLevelNum(unlockedMax > niveau ? unlockedMax : (niveau < 5 ? niveau + 1 : null));
        setDomainCompleted(true);
        Animated.spring(congratsAnim, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
      }
    }).catch(() => {});
  }, []);

  const score = result?.score || 0;
  const correctCount = result?.correct_count || 0;
  const total = result?.total || answers.length;
  const xpGained = result?.xp_gained || 0;
  const xpBoost = getCurrentXpBoost();

  const scoreColor = score >= 80 ? COLORS.success : score >= 50 ? COLORS.warning : COLORS.error;

  const handlePlayAgain = () => {
    if (!domainCompleted && config?.domaine && typeof config?.niveau === 'number') {
      // Continue le lot — même domaine/niveau, 5 prochaines questions non répondues
      restartBatch();
      router.replace({ pathname: '/quiz/[mode]', params: { mode: config.mode || 'solo' } });
    } else {
      // Lot terminé ou mode non thématique → retour au setup quiz
      resetQuiz();
      router.replace('/(tabs)/quiz');
    }
  };

  const handleGoHome = () => {
    resetQuiz();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Bannière hors-ligne */}
        {wasOffline && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>
              📵 {isAr ? 'وضع بدون اتصال — ستُرسل النتائج تلقائياً عند العودة للإنترنت' :
                lang === 'en' ? 'Offline mode — results will sync when back online' :
                'Mode hors-ligne — résultats envoyés dès le retour en ligne'}
            </Text>
          </View>
        )}

        {/* Score Circle */}
        <View style={styles.scoreSection}>
          <Animated.View style={[styles.scoreCircle, { borderColor: scoreColor, transform: [{ scale: scaleAnim }] }]}>
            <Text style={[styles.scoreValue, { color: scoreColor }]}>{score}%</Text>
            <Text style={styles.scoreLabel}>Score</Text>
          </Animated.View>

          <Text style={styles.correctText}>
            {correctCount}/{total} {isAr ? 'إجابات صحيحة' : lang === 'en' ? 'correct' : 'correctes'}
          </Text>

          {/* XP gained */}
          <View style={styles.xpBadge}>
            <IslamicIcon name="star" size={16} color={COLORS.gold} />
            <Text style={styles.xpText}>+{xpGained} {isAr ? 'نقطة مكتسبة' : lang === 'en' ? 'XP earned' : 'XP gagnés'}</Text>
          </View>

          {xpBoost.multiplier > 1 && (
            <View style={styles.boostBadge}>
              <Text style={styles.boostBadgeText}>
                {isAr
                  ? `تعزيز ${xpBoost.label} نشط: +${Math.round((xpBoost.multiplier - 1) * 100)}% نقاط`
                  : `Boost ${xpBoost.label} actif : +${Math.round((xpBoost.multiplier - 1) * 100)}% XP`}
              </Text>
            </View>
          )}

          {result?.level_up && (
            <View style={styles.levelUpBadge}>
              <Text style={styles.levelUpText}>
                {isAr ? '🎉 مستوى أعلى!' : lang === 'en' ? '🎉 Level up!' : '🎉 Niveau supérieur !'}
              </Text>
            </View>
          )}
        </View>

        {/* Congratulations banner when 30-question batch is complete */}
        {domainCompleted && (
          <Animated.View style={[styles.congratsCard, { transform: [{ scale: congratsAnim }] }]}>
            <Text style={styles.congratsEmoji}>🎉</Text>
            <Text style={styles.congratsTitle}>
              {isAr ? 'مبروك! أكملت هذا المستوى' : lang === 'en' ? 'Congratulations! Level complete!' : 'Félicitations ! Niveau terminé !'}
            </Text>
            <Text style={styles.congratsGrade}>
              {isAr ? `نتيجتك في هذا المجال: ${domainGrade}%` :
               lang === 'en' ? `Your grade in this domain: ${domainGrade}%` :
               `Ta note sur ce domaine : ${domainGrade}%`}
            </Text>
            {nextLevelNum && (
              <View style={styles.nextLevelBadge}>
                <IslamicIcon name="star" size={14} color={COLORS.gold} />
                <Text style={styles.nextLevelText}>
                  {isAr ? `🔓 المستوى ${nextLevelNum} مفتوح الآن!` :
                   lang === 'en' ? `🔓 Level ${nextLevelNum} is now unlocked!` :
                   `🔓 Niveau ${nextLevelNum} débloqué !`}
                </Text>
              </View>
            )}
          </Animated.View>
        )}

        {/* Hadith de motivation */}
        <View style={styles.hadithCard}>
          <Text style={styles.hadithAr}>{hadith.textAr}</Text>
          {!isAr && <Text style={styles.hadithFr}>"{hadith.text}"</Text>}
          <Text style={styles.hadithSource}>— {hadith.source}</Text>
        </View>

        {/* Answers review */}
        <View style={styles.reviewSection}>
          <Text style={styles.reviewTitle}>
            {isAr ? 'مراجعة الإجابات' : lang === 'en' ? 'Answers review' : 'Révision des réponses'}
          </Text>
          {answers.map((answer, index) => {
            const question = questions[index];
            const detail = result?.answers_detail[index];
            if (!question) return null;

            return (
              <View key={answer.question_id} style={[styles.reviewItem, detail?.est_correcte ? styles.reviewCorrect : styles.reviewIncorrect]}>
                <View style={styles.reviewHeader}>
                  {detail?.est_correcte
                    ? <IslamicIcon name="check-circle" size={18} color={COLORS.success} />
                    : <IslamicIcon name="close-circle" size={18} color={COLORS.error} />
                  }
                  <Text style={styles.reviewQ} numberOfLines={2}>
                    {isAr && question.texte_ar ? question.texte_ar : question.texte_fr}
                  </Text>
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
          <TouchableOpacity style={styles.homeButton} onPress={handleGoHome} activeOpacity={0.85}>
            <IslamicIcon name="home" size={18} color={COLORS.primary} />
            <Text style={styles.homeText}>{isAr ? 'الرئيسية' : lang === 'en' ? 'Home' : 'Accueil'}</Text>
          </TouchableOpacity>
          {!domainCompleted && config?.domaine && typeof config?.niveau === 'number' ? (
            <TouchableOpacity style={styles.playAgainButton} onPress={handlePlayAgain} activeOpacity={0.85}>
              <IslamicIcon name="right" size={18} color="#FFFFFF" />
              <Text style={styles.playAgainText}>
                {isAr ? 'الدفعة التالية' : lang === 'en' ? 'Next batch' : 'Lot suivant'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.playAgainButton} onPress={handlePlayAgain} activeOpacity={0.85}>
              <IslamicIcon name="refresh" size={18} color="#FFFFFF" />
              <Text style={styles.playAgainText}>{isAr ? 'إعادة اللعب' : lang === 'en' ? 'Play again' : 'Rejouer'}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Share Button */}
        <View style={{ marginTop: 12 }}>
          <ShareButton
            label="Partager mon score"
            url="https://quizislamique.app"
            message={`🕌 Quiz Islamique\n\nJ'ai obtenu ${correctCount}/${total} (${score}%) en ${config?.mode || 'quiz'} sur ${config?.domaine || 'Islam'} !\nXP gagnés : +${xpGained}\n\n"${hadith.text}"\n\nRejoins-moi sur Quiz Islamique 📱`}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, paddingBottom: 40 },
  offlineBanner: {
    backgroundColor: '#B71C1C', borderRadius: 10, padding: 12, marginBottom: 12,
  },
  offlineText: { color: '#FFF', fontSize: 12, fontWeight: '700', textAlign: 'center' },
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
  boostBadge: {
    backgroundColor: COLORS.gold,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  boostBadgeText: { fontSize: 13, fontWeight: '800', color: '#3D2A00' },
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
  congratsCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  congratsEmoji: { fontSize: 40, marginBottom: 8 },
  congratsTitle: {
    fontSize: 18, fontWeight: '800', color: '#FFFFFF',
    textAlign: 'center', marginBottom: 10,
  },
  congratsGrade: {
    fontSize: 28, fontWeight: 'bold', color: COLORS.gold,
    marginBottom: 12,
  },
  nextLevelBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16,
  },
  nextLevelText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
});
