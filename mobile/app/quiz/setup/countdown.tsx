import { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useQuizSetupStore, SETUP_MODES } from '../../../store/quizSetupStore';
import { useQuizStore } from '../../../store/quizStore';
import { QuizConfig } from '../../../types';

const SEQUENCE: (string | number)[] = [3, 2, 1, 'TOP'];

export default function Countdown() {
  const setup = useQuizSetupStore();
  const { startQuiz } = useQuizStore();
  const [idx, setIdx] = useState(0);
  const [loadFailed, setLoadFailed] = useState(false);
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const bgPulse = useRef(new Animated.Value(0)).current;
  const startedRef = useRef(false);
  const navigatedRef = useRef(false);

  const modeMeta = SETUP_MODES.find(m => m.id === setup.setup_mode);
  const backendMode = modeMeta?.backendMode || 'solo';

  // Kick off quiz loading immediately
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const niveau: QuizConfig['niveau'] =
      setup.setup_niveau === 'mixte' || setup.setup_niveau === null
        ? 'mixte'
        : (setup.setup_niveau as number);

    const domaine = setup.setup_domaine
      ? (setup.setup_domaine as QuizConfig['domaine'])
      : undefined;

    const nb = backendMode === 'quotidien' ? 5 : (setup.setup_nb || 10);

    const config: QuizConfig = {
      mode: backendMode,
      domaine,
      niveau,
      nb_questions: nb,
      temps_par_question: 30,
    };

    startQuiz(config).catch((err) => {
      if (err?.message === 'offline_no_cache') {
        Alert.alert(
          'Hors-ligne',
          'Aucune question en cache. Connectez-vous une première fois pour jouer hors-ligne.',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)/quiz') }],
        );
      } else {
        setLoadFailed(true);
      }
    });
  }, []);

  // Background pulse
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgPulse, { toValue: 1, duration: 1400, useNativeDriver: false }),
        Animated.timing(bgPulse, { toValue: 0, duration: 1400, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  // Sequence runner
  useEffect(() => {
    if (idx >= SEQUENCE.length) {
      // After TOP, navigate
      if (navigatedRef.current) return;
      navigatedRef.current = true;
      const qs = useQuizStore.getState();
      if (qs.questions.length === 0 || loadFailed) {
        Alert.alert(
          'Aucune question',
          backendMode === 'murajaah'
            ? "Vous n'avez aucune erreur à réviser. Continuez à jouer pour en accumuler !"
            : 'Aucune question disponible pour ces critères.',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)/quiz') }],
        );
        return;
      }
      router.replace({ pathname: '/quiz/[mode]', params: { mode: backendMode } });
      return;
    }

    scale.setValue(0);
    opacity.setValue(0);
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();

    const t = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => {
        setIdx(i => i + 1);
      });
    }, 850);
    return () => clearTimeout(t);
  }, [idx, loadFailed]);

  const value = SEQUENCE[idx];
  const isTop = value === 'TOP';

  const overlayOpacity = bgPulse.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.35] });

  return (
    <View style={styles.root}>
      <View style={styles.bgBase} />
      <Animated.View style={[styles.bgPulse, { opacity: overlayOpacity }]} />
      <View style={styles.bgVignette} />

      <Text style={styles.bismi}>﷽</Text>

      <Animated.View
        style={{
          opacity,
          transform: [
            { scale: scale.interpolate({ inputRange: [0, 1], outputRange: [0, 1.2] }) },
          ],
        }}
      >
        <Text style={[styles.number, isTop && styles.topText]}>
          {value}
        </Text>
      </Animated.View>

      <Text style={styles.tag}>Bismillah · في أمان الله</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#0F3D12', overflow: 'hidden',
  },
  bgBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1B5E20',
  },
  bgPulse: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2E7D32',
  },
  bgVignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    opacity: 0.18,
  },
  bismi: {
    position: 'absolute',
    top: '18%',
    fontSize: 72,
    color: '#FFD700',
    opacity: 0.18,
  },
  number: {
    fontSize: 200,
    fontWeight: '900',
    color: '#FFD700',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 6 },
    textShadowRadius: 16,
  },
  topText: {
    fontSize: 110,
    letterSpacing: 6,
  },
  tag: {
    position: 'absolute',
    bottom: '12%',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontStyle: 'italic',
    letterSpacing: 1,
  },
});
