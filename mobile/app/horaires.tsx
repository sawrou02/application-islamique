import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, TextInput, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { IslamicIcon } from '../components/IslamicIcon';
import { COLORS } from '../constants/colors';
import { getCurrentLang } from '../i18n';
import {
  fetchPrayerTimesByCoords, fetchPrayerTimesByCity,
  PrayerResponse, nextPrayer, formatRemaining,
} from '../services/prayerTimes';

const PRAYER_NAMES: Record<string, { fr: string; ar: string; en: string; icon: string }> = {
  Fajr:    { fr: 'Fajr',    ar: 'الفجر',   en: 'Fajr',    icon: '🌅' },
  Sunrise: { fr: 'Shuruq',  ar: 'الشروق',  en: 'Sunrise', icon: '☀️' },
  Dhuhr:   { fr: 'Dhuhr',   ar: 'الظهر',   en: 'Dhuhr',   icon: '🕛' },
  Asr:     { fr: 'Asr',     ar: 'العصر',   en: 'Asr',     icon: '🕒' },
  Maghrib: { fr: 'Maghrib', ar: 'المغرب',  en: 'Maghrib', icon: '🌇' },
  Isha:    { fr: 'Isha',    ar: 'العشاء',  en: 'Isha',    icon: '🌙' },
};

export default function Horaires() {
  const [data, setData] = useState<PrayerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [now, setNow] = useState(Date.now());
  const lang = getCurrentLang();
  const isAr = lang === 'ar';

  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => { loadInitial(); }, []);

  async function loadInitial() {
    setLoading(true);
    setError(null);
    try {
      const saved = await AsyncStorage.getItem('prayer_location');
      if (saved) {
        const { city, country } = JSON.parse(saved);
        setCity(city); setCountry(country);
        const res = await fetchPrayerTimesByCity(city, country);
        setData(res); setLoading(false); return;
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError(isAr ? 'يرجى إدخال المدينة' : lang === 'en' ? 'Please enter a city' : 'Veuillez entrer une ville');
        setLoading(false); return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const res = await fetchPrayerTimesByCoords(loc.coords.latitude, loc.coords.longitude);
      setData(res);
    } catch {
      setError(isAr ? 'تعذّر التحميل' : 'Erreur de chargement');
    } finally { setLoading(false); }
  }

  async function searchCity() {
    if (!city || !country) { Alert.alert(isAr ? 'حقول ناقصة' : 'Champs requis', isAr ? 'يرجى إدخال المدينة والبلد' : 'Entre la ville et le pays.'); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetchPrayerTimesByCity(city, country);
      setData(res);
      await AsyncStorage.setItem('prayer_location', JSON.stringify({ city, country }));
    } catch {
      setError(isAr ? 'مدينة غير موجودة' : 'Ville introuvable');
    } finally { setLoading(false); }
  }

  const next = data ? nextPrayer(data.timings) : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IslamicIcon name="back" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isAr ? 'مواقيت الصلاة' : lang === 'en' ? 'Prayer times' : 'Horaires de prière'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View style={styles.searchRow}>
          <TextInput
            style={[styles.input, { flex: 2 }]}
            placeholder={isAr ? 'المدينة' : lang === 'en' ? 'City' : 'Ville'}
            placeholderTextColor={COLORS.textLight}
            value={city} onChangeText={setCity}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder={isAr ? 'البلد' : lang === 'en' ? 'Country' : 'Pays'}
            placeholderTextColor={COLORS.textLight}
            value={country} onChangeText={setCountry}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={searchCity}>
            <Text style={styles.searchBtnText}>🔍</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 30 }} size="large" color={COLORS.primary} />
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : data ? (
          <>
            <View style={styles.locationBox}>
              <Text style={styles.locationDate}>{data.date.readable}</Text>
              <Text style={styles.locationHijri}>
                {data.date.hijri.date} {isAr ? data.date.hijri.month.ar : data.date.hijri.month.en} {data.date.hijri.year} H
              </Text>
            </View>

            {next && (
              <View style={styles.nextCard}>
                <Text style={styles.nextLabel}>
                  {isAr ? 'الصلاة القادمة' : lang === 'en' ? 'Next prayer' : 'Prochaine prière'}
                </Text>
                <Text style={styles.nextName}>
                  {PRAYER_NAMES[next.name].icon} {isAr ? PRAYER_NAMES[next.name].ar : PRAYER_NAMES[next.name].fr}
                </Text>
                <Text style={styles.nextTime}>{next.time}</Text>
                <Text style={styles.nextRemaining}>
                  {isAr ? 'بعد' : lang === 'en' ? 'in' : 'dans'} {formatRemaining(next.remainingMs - (now - now))}
                </Text>
              </View>
            )}

            {Object.entries(data.timings)
              .filter(([k]) => PRAYER_NAMES[k])
              .map(([k, time]) => {
                const meta = PRAYER_NAMES[k];
                const isNext = next?.name === k;
                return (
                  <View key={k} style={[styles.row, isNext && styles.rowNext]}>
                    <Text style={styles.rowIcon}>{meta.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowName}>{isAr ? meta.ar : meta.fr}</Text>
                      {isAr ? null : <Text style={styles.rowNameSub}>{meta.ar}</Text>}
                    </View>
                    <Text style={styles.rowTime}>{time}</Text>
                  </View>
                );
              })}
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.primary, padding: 14 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  input: {
    backgroundColor: COLORS.surface, borderRadius: 10, paddingHorizontal: 12,
    paddingVertical: 10, fontSize: 14, color: COLORS.text,
    borderWidth: 1, borderColor: COLORS.border,
  },
  searchBtn: {
    backgroundColor: COLORS.primary, borderRadius: 10,
    paddingHorizontal: 16, justifyContent: 'center',
  },
  searchBtnText: { fontSize: 16, color: '#FFF' },
  errorBox: { padding: 30, alignItems: 'center' },
  errorText: { fontSize: 14, color: COLORS.error, textAlign: 'center' },
  locationBox: { alignItems: 'center', marginBottom: 14 },
  locationDate: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  locationHijri: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  nextCard: {
    backgroundColor: COLORS.primary, padding: 18, borderRadius: 16,
    alignItems: 'center', marginBottom: 14,
  },
  nextLabel: { fontSize: 11, color: '#FFFFFFAA', fontWeight: '700', letterSpacing: 1 },
  nextName: { fontSize: 26, fontWeight: '800', color: '#FFD700', marginTop: 4 },
  nextTime: { fontSize: 32, fontWeight: '800', color: '#FFF', marginTop: 2, fontVariant: ['tabular-nums'] },
  nextRemaining: { fontSize: 13, color: '#FFFFFFCC', marginTop: 4 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.surface, padding: 14, borderRadius: 12,
    marginBottom: 8, borderWidth: 1, borderColor: COLORS.border,
  },
  rowNext: { borderColor: COLORS.primary, borderWidth: 2 },
  rowIcon: { fontSize: 22 },
  rowName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  rowNameSub: { fontSize: 11, color: COLORS.arabicText, marginTop: 1 },
  rowTime: { fontSize: 18, fontWeight: '800', color: COLORS.primary, fontVariant: ['tabular-nums'] },
});
