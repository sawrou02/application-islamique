import { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, Pressable, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IslamicIcon } from '../../components/IslamicIcon';
import { DalilDetaille } from '../../components/DalilDetaille';
import { COLORS } from '../../constants/colors';
import { useQuizStore } from '../../store/quizStore';
import { getCurrentLang } from '../../i18n';
import { Reponse } from '../../types';

const { width } = Dimensions.get('window');
const ANSWER_LABELS = ['A', 'B', 'C', 'D'];

type AnswerState = 'default' | 'selected' | 'correct' | 'incorrect';

export default function ActiveQuiz() {
  const {
    questions, currentIndex, answers, config,
    answerQuestion, nextQuestion, status,
  } = useQuizStore();

  const [selectedReponseId, setSelectedReponseId] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [showDalil, setShowDalil] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config?.temps_par_question || 30);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionStartRef = useRef<number>(Date.now());
  const dalilAnim = useRef(new Animated.Value(0)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;
  const questionAnim = useRef(new Animated.Value(0)).current;

  const lang = getCurrentLang();
  const isAr = lang === 'ar';

  const question = questions[currentIndex];
  const reponses = question?.reponses || [];
  const correctReponse = reponses.find((r: Reponse) => r.est_correcte);
  const hasAnswered = selectedReponseId !== null;

  useEffect(() => {
    if (status === 'finished') {
      router.replace('/quiz/result');
    }
  }, [status]);

  useEffect(() => {
    setSelectedReponseId(null);
    setTimedOut(false);
    setShowDalil(false);
    setTimeLeft(config?.temps_par_question || 30);
    questionStartRef.current = Date.now();
    dalilAnim.setValue(0);
    questionAnim.setValue(0);
    Animated.spring(questionAnim, { toValue: 1, friction: 6, tension: 90, useNativeDriver: true }).start();

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          if (!selectedReponseId) {
            handleTimeOut();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex]);

  const handleTimeOut = () => {
    if (hasAnswered) return;
    // Choisit une mauvaise réponse pour marquer la question comme perdue côté backend
    const wrong = reponses.find((r: Reponse) => !r.est_correcte);
    if (!wrong) return;
    setTimedOut(true);
    setSelectedReponseId(wrong.id);
    answerQuestion(wrong.id);

    Animated.sequence([
      Animated.timing(flashAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(flashAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      setShowDalil(true);
      Animated.timing(dalilAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }, 300);
  };

  const handleAnswer = (reponse_id: string) => {
    if (hasAnswered) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedReponseId(reponse_id);
    answerQuestion(reponse_id);

    const isCorrect = correctReponse?.id === reponse_id;

    Animated.sequence([
      Animated.timing(flashAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(flashAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      setShowDalil(true);
      Animated.timing(dalilAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }, 500);
  };

  const handleNext = () => {
    nextQuestion();
  };

  const getAnswerState = (reponse: Reponse): AnswerState => {
    if (!hasAnswered) return 'default';
    if (reponse.id === correctReponse?.id) return 'correct';
    if (reponse.id === selectedReponseId && !timedOut) return 'incorrect';
    return 'default';
  };

  const getAnswerStyle = (state: AnswerState) => {
    switch (state) {
      case 'correct': return styles.answerCorrect;
      case 'incorrect': return styles.answerIncorrect;
      case 'selected': return styles.answerSelected;
      default: return {};
    }
  };

  const timerProgress = timeLeft / (config?.temps_par_question || 30);
  const timerColor = timerProgress > 0.5 ? COLORS.primary : timerProgress > 0.25 ? COLORS.warning : COLORS.error;

  if (!question) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{isAr ? 'جارٍ التحميل...' : lang === 'en' ? 'Loading...' : 'Chargement...'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with progress and timer */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IslamicIcon name="close" size={22} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${((currentIndex + 1) / questions.length) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{currentIndex + 1}/{questions.length}</Text>
        </View>
        <View style={[styles.timerCircle, { borderColor: timerColor }]}>
          <Text style={[styles.timerText, { color: timerColor }]}>{timeLeft}</Text>
        </View>
      </View>

      {/* Domaine badge */}
      <View style={styles.domainRow}>
        <View style={styles.domainBadge}>
          <Text style={styles.domainText}>{question.domaine.toUpperCase()} • {isAr ? `المستوى ${question.niveau}` : lang === 'en' ? `Level ${question.niveau}` : `Niveau ${question.niveau}`}</Text>
        </View>
        {timedOut && (
          <View style={styles.timeoutBadge}>
            <Text style={styles.timeoutText}>
              ⏰ {isAr ? 'انتهى الوقت' : lang === 'en' ? 'Time out' : 'Temps écoulé'}
            </Text>
          </View>
        )}
      </View>

      {/* Question */}
      <Animated.View style={[styles.questionContainer, {
        opacity: questionAnim,
        transform: [{ scale: questionAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }],
      }]}>
        {isAr ? (
          <Text style={[styles.questionAr, { fontSize: 20 }]}>{question.texte_ar || question.texte_fr}</Text>
        ) : (
          <>
            {question.texte_ar && <Text style={styles.questionAr}>{question.texte_ar}</Text>}
            <Text style={styles.questionFr}>{question.texte_fr}</Text>
          </>
        )}
      </Animated.View>

      {/* Answers + Dalil + Next in a scrollable area */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Answers */}
        <View style={styles.answersContainer}>
          {reponses.map((reponse: Reponse, index: number) => {
            const state = getAnswerState(reponse);
            return (
              <TouchableOpacity
                key={reponse.id}
                style={[styles.answerButton, getAnswerStyle(state)]}
                onPress={() => handleAnswer(reponse.id)}
                disabled={hasAnswered}
                activeOpacity={0.85}
              >
                <View style={[styles.answerLabel, state === 'correct' && styles.answerLabelCorrect, state === 'incorrect' && styles.answerLabelIncorrect]}>
                  <Text style={styles.answerLabelText}>{ANSWER_LABELS[index]}</Text>
                </View>
                <View style={styles.answerTextContainer}>
                  <Text style={[styles.answerText, state !== 'default' && styles.answerTextAnswered, isAr && { textAlign: 'right', writingDirection: 'rtl' }]}>
                    {isAr && reponse.texte_ar ? reponse.texte_ar : reponse.texte_fr}
                  </Text>
                </View>
                {state === 'correct' && <IslamicIcon name="check" size={22} color={COLORS.success} />}
                {state === 'incorrect' && <IslamicIcon name="close" size={22} color={COLORS.error} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Dalil détaillé */}
        {showDalil && (
          <Animated.View style={{ opacity: dalilAnim }}>
            <DalilDetaille question={question} initialOpen={true} />
            <Pressable
              style={styles.signalerBtn}
              onPress={() => router.push({
                pathname: '/quiz/signaler',
                params: { question_id: question.id, question_fr: question.texte_fr },
              })}
            >
              <IslamicIcon name="flag" size={13} color={COLORS.textLight} />
              <Text style={styles.signalerText}>{isAr ? 'الإبلاغ عن خطأ' : lang === 'en' ? 'Report an error' : 'Signaler une erreur'}</Text>
            </Pressable>
          </Animated.View>
        )}

        {/* Next button */}
        {hasAnswered && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.85}>
            <Text style={styles.nextButtonText}>
              {currentIndex + 1 < questions.length
                ? (isAr ? 'السؤال التالي' : lang === 'en' ? 'Next question' : 'Question suivante')
                : (isAr ? 'عرض النتائج' : lang === 'en' ? 'See results' : 'Voir les résultats')}
            </Text>
            <IslamicIcon name="next" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: COLORS.textSecondary },
  header: {
    flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12,
  },
  backButton: { padding: 4 },
  progressContainer: { flex: 1, gap: 4 },
  progressBar: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  progressText: { fontSize: 11, color: COLORS.textSecondary, textAlign: 'right' },
  timerCircle: {
    width: 44, height: 44, borderRadius: 22, borderWidth: 3,
    justifyContent: 'center', alignItems: 'center',
  },
  timerText: { fontSize: 14, fontWeight: 'bold' },
  domainRow: { paddingHorizontal: 16, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  timeoutBadge: {
    backgroundColor: 'rgba(198,40,40,0.12)', borderRadius: 8,
    paddingVertical: 4, paddingHorizontal: 10,
  },
  timeoutText: { fontSize: 11, fontWeight: '700', color: COLORS.error },
  domainBadge: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(27,94,32,0.1)',
    borderRadius: 8, paddingVertical: 4, paddingHorizontal: 10,
  },
  domainText: { fontSize: 11, fontWeight: '600', color: COLORS.primary },
  questionContainer: {
    paddingHorizontal: 16, paddingBottom: 16,
  },
  questionAr: {
    fontSize: 18, color: COLORS.arabicText, textAlign: 'right',
    writingDirection: 'rtl', marginBottom: 8, lineHeight: 28,
  },
  questionFr: { fontSize: 17, color: COLORS.text, lineHeight: 24, fontWeight: '500' },
  answersContainer: { paddingHorizontal: 16, gap: 10 },
  answerButton: {
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  answerCorrect: { borderColor: COLORS.success, backgroundColor: 'rgba(46,125,50,0.08)' },
  answerIncorrect: { borderColor: COLORS.error, backgroundColor: 'rgba(198,40,40,0.08)' },
  answerSelected: { borderColor: COLORS.primary },
  answerLabel: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: COLORS.border, justifyContent: 'center', alignItems: 'center',
  },
  answerLabelCorrect: { backgroundColor: COLORS.success },
  answerLabelIncorrect: { backgroundColor: COLORS.error },
  answerLabelText: { fontSize: 13, fontWeight: 'bold', color: COLORS.text },
  answerTextContainer: { flex: 1 },
  answerText: { fontSize: 14, color: COLORS.text, lineHeight: 20 },
  answerTextAnswered: { fontWeight: '500' },
  dalilCard: {
    marginHorizontal: 16, marginTop: 12,
    backgroundColor: 'rgba(27,94,32,0.07)',
    borderRadius: 12, padding: 14,
    borderLeftWidth: 3, borderLeftColor: COLORS.gold,
  },
  dalilAr: {
    fontSize: 16, color: COLORS.arabicText, textAlign: 'right',
    writingDirection: 'rtl', marginBottom: 6, lineHeight: 24,
  },
  dalilFr: { fontSize: 13, color: COLORS.textSecondary, fontStyle: 'italic', marginBottom: 4 },
  dalilRef: { fontSize: 12, color: COLORS.textLight, fontWeight: '500' },
  signalerBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginTop: 10, marginHorizontal: 16, alignSelf: 'flex-start',
  },
  signalerText: { fontSize: 11, color: COLORS.textLight },
  nextButton: {
    margin: 16, backgroundColor: COLORS.primary,
    borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  nextButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
});
