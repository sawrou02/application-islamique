import { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Vibration, Animated,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { IslamicIcon } from '../components/IslamicIcon';
import { COLORS } from '../constants/colors';
import { getCurrentLang } from '../i18n';

// Coordonnées de la Ka'ba (Mecque)
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function computeQiblaDirection(lat: number, lng: number): number {
  // Formule de la grande boucle (great-circle) — direction depuis le nord en degrés
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const dLng = toRad(KAABA_LNG - lng);
  const lat1 = toRad(lat);
  const lat2 = toRad(KAABA_LAT);
  const y = Math.sin(dLng);
  const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(dLng);
  let brng = toDeg(Math.atan2(y, x));
  if (brng < 0) brng += 360;
  return brng;
}

export default function Qibla() {
  const [heading, setHeading] = useState<number | null>(null);
  const [qibla, setQibla] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aligned, setAligned] = useState(false);
  const wasAligned = useRef(false);
  const bgAnim = useRef(new Animated.Value(0)).current;
  const lang = getCurrentLang();
  const isAr = lang === 'ar';

  useEffect(() => {
    let sub: { remove: () => void } | null = null;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError(isAr ? 'يرجى السماح بالوصول إلى الموقع' : 'Autorise la géolocalisation pour afficher la Qibla');
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        setQibla(computeQiblaDirection(loc.coords.latitude, loc.coords.longitude));
        Magnetometer.setUpdateInterval(100);
        sub = Magnetometer.addListener(({ x, y }) => {
          let angle = Math.atan2(y, x) * (180 / Math.PI);
          if (angle < 0) angle += 360;
          setHeading(angle);
        });

      } catch {
        setError(isAr ? 'تعذّر تحميل البوصلة' : 'Impossible de charger la boussole');
      }
    })();
    return () => { sub?.remove(); };
  }, []);

  const rotation = heading !== null && qibla !== null ? qibla - heading : 0;
  const isAligned = heading !== null && qibla !== null && Math.abs(((qibla - heading + 540) % 360) - 180) < 5;

  useEffect(() => {
    if (isAligned && !wasAligned.current) {
      wasAligned.current = true;
      setAligned(true);
      Vibration.vibrate([0, 200, 100, 200]);
      Animated.sequence([
        Animated.timing(bgAnim, { toValue: 1, duration: 400, useNativeDriver: false }),
      ]).start();
    } else if (!isAligned && wasAligned.current) {
      wasAligned.current = false;
      setAligned(false);
      Animated.timing(bgAnim, { toValue: 0, duration: 600, useNativeDriver: false }).start();
    }
  }, [isAligned]);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.background, '#1B5E20'],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IslamicIcon name="back" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isAr ? 'القبلة' : 'Qibla'}
        </Text>
      </View>

      <View style={styles.body}>
        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : heading === null || qibla === null ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <>
            <View style={styles.compass}>
              <View style={[styles.compassDial, { transform: [{ rotate: `${-heading}deg` }] }]}>
                <Text style={[styles.dialN]}>N</Text>
                <Text style={[styles.dialE]}>E</Text>
                <Text style={[styles.dialS]}>S</Text>
                <Text style={[styles.dialW]}>W</Text>
              </View>
              <View style={[styles.qiblaArrow, { transform: [{ rotate: `${rotation}deg` }] }]}>
                <Text style={styles.qiblaIcon}>🕋</Text>
                <View style={[styles.qiblaLine, aligned && { backgroundColor: ‘#FFD700’ }]} />
              </View>
            </View>

            <Text style={[styles.bearing, aligned && { color: ‘#FFD700’ }]}>
              {Math.round(qibla)}°
            </Text>
            <Text style={[styles.bearingLabel, aligned && { color: ‘#FFF’, fontWeight: ‘800’ }]}>
              {aligned
                ? (isAr ? ‘✓ أنت متجه نحو القبلة’ : lang === ‘en’ ? ‘✓ Aligned with the Qibla’ : ‘✓ Aligné avec la Qibla’)
                : (isAr ? ‘وجّه الهاتف نحو الكعبة’ : lang === ‘en’ ? "Point your phone toward the Ka’ba" : "Oriente ton téléphone vers la Ka’ba")}
            </Text>
            <Text style={styles.hint}>
              {isAr ? 'دقّق المعايرة بتحريك الهاتف في شكل ٨' : 'Calibre en bougeant ton téléphone en forme de 8.'}
            </Text>
          </>
        )}
      </View>
    </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.primary, padding: 14 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  error: { fontSize: 14, color: COLORS.error, textAlign: 'center' },
  compass: {
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center',
    borderWidth: 4, borderColor: COLORS.primary, marginBottom: 30,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
  },
  compassDial: {
    position: 'absolute', width: 260, height: 260, justifyContent: 'center', alignItems: 'center',
  },
  dialN: { position: 'absolute', top: 8, fontSize: 18, fontWeight: '800', color: COLORS.error },
  dialE: { position: 'absolute', right: 8, fontSize: 16, fontWeight: '700', color: COLORS.text },
  dialS: { position: 'absolute', bottom: 8, fontSize: 16, fontWeight: '700', color: COLORS.text },
  dialW: { position: 'absolute', left: 8, fontSize: 16, fontWeight: '700', color: COLORS.text },
  qiblaArrow: {
    width: 240, height: 240, justifyContent: 'flex-start', alignItems: 'center',
    position: 'absolute',
  },
  qiblaIcon: { fontSize: 38, marginTop: 4 },
  qiblaLine: { width: 4, height: 90, backgroundColor: COLORS.primary, marginTop: 4, borderRadius: 2 },
  bearing: { fontSize: 48, fontWeight: '800', color: COLORS.primary, fontVariant: ['tabular-nums'] },
  bearingLabel: { fontSize: 15, fontWeight: '600', color: COLORS.text, textAlign: 'center', marginTop: 8 },
  hint: { fontSize: 12, color: COLORS.textSecondary, marginTop: 14, textAlign: 'center', fontStyle: 'italic' },
});
