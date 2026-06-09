import { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { QuizSetupShell, SelectCard } from '../../../components/QuizSetupShell';
import { useQuizSetupStore, SETUP_NB_QUESTIONS } from '../../../store/quizSetupStore';
import { COLORS } from '../../../constants/colors';

const { width } = Dimensions.get('window');
const CARD_W = (width - 16 * 2 - 12) / 2;

export default function StepQuestions() {
  const { setup_nb, setNb } = useQuizSetupStore();

  const anims = useRef(SETUP_NB_QUESTIONS.map(() => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(50, anims.map(a =>
      Animated.spring(a, { toValue: 1, useNativeDriver: true, friction: 7, tension: 70 })
    )).start();
  }, []);

  return (
    <QuizSetupShell
      step={5} total={6}
      title="Nombre de questions"
      titleAr="عدد الأسئلة"
      subtitle="Combien de questions souhaitez-vous ?"
      canNext={!!setup_nb}
      onNext={() => router.push('/quiz/setup/recap')}
    >
      <View style={styles.grid}>
        {SETUP_NB_QUESTIONS.map((n, i) => (
          <Animated.View
            key={n}
            style={{
              opacity: anims[i],
              transform: [
                { scale: anims[i].interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) },
              ],
              width: CARD_W,
            }}
          >
            <SelectCard
              selected={setup_nb === n}
              accent="#FFD700"
              onPress={() => setNb(n)}
              style={{ minHeight: 110, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={styles.num}>{n}</Text>
              <Text style={styles.lbl}>questions</Text>
            </SelectCard>
          </Animated.View>
        ))}
      </View>
    </QuizSetupShell>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  num: { fontSize: 38, fontWeight: '900', color: COLORS.primary },
  lbl: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600', marginTop: 2 },
});
