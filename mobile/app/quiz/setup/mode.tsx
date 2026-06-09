import { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { QuizSetupShell, SelectCard } from '../../../components/QuizSetupShell';
import { useQuizSetupStore, SETUP_MODES, madhabApplicable } from '../../../store/quizSetupStore';
import { COLORS } from '../../../constants/colors';

const { width } = Dimensions.get('window');
const CARD_W = (width - 16 * 2 - 12) / 2;

export default function StepMode() {
  const params = useLocalSearchParams();
  const { setup_mode, setMode, setDomaine, reset } = useQuizSetupStore();

  // Reset whole setup when arriving at step 1
  useEffect(() => {
    reset();
    if (params.presetMode) {
      const m = params.presetMode as string;
      if (SETUP_MODES.find(x => x.id === m)) setMode(m as any);
    }
    if (params.presetDomain) {
      setDomaine(params.presetDomain as string);
    }
  }, []);

  const anims = useRef(SETUP_MODES.map(() => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(70, anims.map(a =>
      Animated.spring(a, { toValue: 1, useNativeDriver: true, friction: 7, tension: 60 })
    )).start();
  }, []);

  const handleNext = () => {
    if (!setup_mode) return;
    // For quotidien & murajaah, skip directly to recap (no domain/level/nb choice)
    if (setup_mode === 'quotidien' || setup_mode === 'murajaah') {
      router.push('/quiz/setup/recap');
      return;
    }
    // If a presetDomain was provided, skip domain step
    const { setup_domaine } = useQuizSetupStore.getState();
    if (setup_domaine) {
      router.push('/quiz/setup/niveau');
    } else {
      router.push('/quiz/setup/domaine');
    }
  };

  return (
    <QuizSetupShell
      step={1} total={6}
      title="Mode de jeu"
      titleAr="نمط اللعب"
      subtitle="Choisissez la manière dont vous souhaitez réviser."
      canNext={!!setup_mode}
      onNext={handleNext}
      onBack={() => router.replace('/(tabs)/quiz')}
    >
      <View style={styles.grid}>
        {SETUP_MODES.map((m, i) => (
          <Animated.View
            key={m.id}
            style={{
              opacity: anims[i],
              transform: [
                { scale: anims[i].interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) },
                { translateY: anims[i].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
              ],
              width: CARD_W,
            }}
          >
            <SelectCard
              selected={setup_mode === m.id}
              accent={m.color}
              onPress={() => setMode(m.id)}
              style={{ minHeight: 150 }}
            >
              <Text style={[styles.icon, { color: m.color }]}>{m.icon}</Text>
              <Text style={styles.name}>{m.name}</Text>
              <Text style={styles.nameAr}>{m.nameAr}</Text>
              <Text style={styles.desc}>{m.description}</Text>
            </SelectCard>
          </Animated.View>
        ))}
      </View>
    </QuizSetupShell>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  icon: { fontSize: 38, marginBottom: 8 },
  name: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  nameAr: { fontSize: 12, color: COLORS.arabicText, marginTop: 2 },
  desc: { fontSize: 11.5, color: COLORS.textSecondary, marginTop: 6, lineHeight: 16 },
});
