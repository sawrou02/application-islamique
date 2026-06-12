import { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { t } from '../../i18n';

const { width } = Dimensions.get('window');

export default function QuizHome() {
  const params = useLocalSearchParams();
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(20)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(rise, { toValue: 0, friction: 7, tension: 60, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.04, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // If we arrive with preset params, auto-jump into the wizard
  useEffect(() => {
    if (params.presetMode || params.presetDomain) {
      const t = setTimeout(() => {
        router.push({
          pathname: '/quiz/setup/mode',
          params: {
            presetMode: (params.presetMode as string) || '',
            presetDomain: (params.presetDomain as string) || '',
          },
        });
      }, 80);
      return () => clearTimeout(t);
    }
  }, [params.presetMode, params.presetDomain]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />

      <Animated.View style={[styles.inner, { opacity: fade, transform: [{ translateY: rise }] }]}>
        <Text style={styles.bismi}>﷽</Text>

        <View style={styles.crest}>
          <Text style={styles.crestIcon}>✦</Text>
        </View>

        <Text style={styles.title}>Quiz du Savoir</Text>
        <Text style={styles.titleAr}>اختبار العِلم</Text>

        <Text style={styles.subtitle}>
          Choisissez votre mode, votre domaine, et lancez-vous dans un parcours adapté à votre niveau.
        </Text>

        <Animated.View style={{ transform: [{ scale: pulse }], width: '100%', marginTop: 36 }}>
          <TouchableOpacity
            style={styles.startBtn}
            activeOpacity={0.85}
            onPress={() => router.push('/quiz/setup/mode')}
          >
            <Text style={styles.startIcon}>▶</Text>
            <Text style={styles.startTxt}>{t('commencer_quiz')}</Text>
            <Text style={styles.startArrow}>›</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.featureRow}>
          <Feature icon="❋" label="5 modes" />
          <Feature icon="✧" label="7 sciences" />
          <Feature icon="◆" label="5 niveaux" />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

function Feature({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.feat}>
      <Text style={styles.featIcon}>{icon}</Text>
      <Text style={styles.featLbl}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1B5E20' },
  bgTop: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '60%',
    backgroundColor: '#1B5E20',
  },
  bgBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
    backgroundColor: '#2E7D32', opacity: 0.7,
  },
  inner: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 28,
  },
  bismi: { fontSize: 40, color: '#FFD700', opacity: 0.85, marginBottom: 22 },
  crest: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,215,0,0.12)',
    borderWidth: 2, borderColor: '#FFD700',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  crestIcon: { fontSize: 36, color: '#FFD700' },
  title: { fontSize: 32, fontWeight: '900', color: '#FFFFFF', textAlign: 'center' },
  titleAr: { fontSize: 18, color: '#FFD700', marginTop: 6, fontWeight: '600' },
  subtitle: {
    color: 'rgba(255,255,255,0.85)', fontSize: 14, textAlign: 'center',
    marginTop: 18, lineHeight: 20, maxWidth: 320,
  },
  startBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
    backgroundColor: '#FFD700', paddingVertical: 20, borderRadius: 24,
    shadowColor: '#FFD700', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5, shadowRadius: 16, elevation: 10,
  },
  startIcon: { fontSize: 16, color: '#1B5E20', fontWeight: '900' },
  startTxt: { color: '#1B5E20', fontWeight: '900', fontSize: 18, letterSpacing: 0.5 },
  startArrow: { color: '#1B5E20', fontSize: 24, fontWeight: '900', marginLeft: 2 },
  featureRow: {
    flexDirection: 'row', marginTop: 36, gap: 26,
  },
  feat: { alignItems: 'center' },
  featIcon: { fontSize: 24, color: '#FFD700' },
  featLbl: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 4, fontWeight: '600' },
});
