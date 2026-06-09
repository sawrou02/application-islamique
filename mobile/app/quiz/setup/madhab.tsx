import { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { QuizSetupShell, SelectCard } from '../../../components/QuizSetupShell';
import { useQuizSetupStore, SETUP_MADHABS } from '../../../store/quizSetupStore';
import { COLORS } from '../../../constants/colors';

const { width } = Dimensions.get('window');
const CARD_W = (width - 16 * 2 - 12) / 2;

export default function StepMadhab() {
  const { setup_madhab, setMadhab } = useQuizSetupStore();

  const anims = useRef(SETUP_MADHABS.map(() => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(60, anims.map(a =>
      Animated.spring(a, { toValue: 1, useNativeDriver: true, friction: 7, tension: 70 })
    )).start();
  }, []);

  return (
    <QuizSetupShell
      step={4} total={6}
      title="École juridique"
      titleAr="المذهب الفقهي"
      subtitle="Selon quelle école souhaitez-vous être interrogé ?"
      canNext={!!setup_madhab}
      onNext={() => router.push('/quiz/setup/questions')}
    >
      <View style={styles.grid}>
        {SETUP_MADHABS.map((m, i) => (
          <Animated.View
            key={m.id}
            style={{
              opacity: anims[i],
              transform: [
                { scale: anims[i].interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) },
              ],
              width: CARD_W,
            }}
          >
            <SelectCard
              selected={setup_madhab === m.id}
              accent="#1B5E20"
              onPress={() => setMadhab(m.id)}
              style={{ minHeight: 110 }}
            >
              <Text style={styles.name}>{m.name}</Text>
              <Text style={styles.nameAr}>{m.nameAr}</Text>
            </SelectCard>
          </Animated.View>
        ))}
      </View>
    </QuizSetupShell>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  name: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  nameAr: { fontSize: 22, color: COLORS.arabicText, marginTop: 6, fontWeight: '600' },
});
