import { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { IslamicIcon } from '../../components/IslamicIcon';
import { COLORS } from '../../constants/colors';
import { getCurrentLang } from '../../i18n';
import { fetchSurah, fetchSurahTafsir, SurahFull, Ayah, surahAudioUrl } from '../../services/quran';

export default function CoranSurah() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [surah, setSurah] = useState<SurahFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [showTafsir, setShowTafsir] = useState(false);
  const [tafsirAyahs, setTafsirAyahs] = useState<Ayah[] | null>(null);
  const [tafsirLoading, setTafsirLoading] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const lang = getCurrentLang();
  const isAr = lang === 'ar';

  useEffect(() => {
    const n = Number(id);
    if (!n || n < 1 || n > 114) { setError(true); setLoading(false); return; }
    fetchSurah(n)
      .then(setSurah)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
    return () => { soundRef.current?.unloadAsync().catch(() => {}); };
  }, [id]);

  function toggleTafsir() {
    if (!surah) return;
    if (tafsirAyahs === null) {
      setTafsirLoading(true);
      fetchSurahTafsir(surah.number)
        .then(setTafsirAyahs)
        .catch(() => {})
        .finally(() => setTafsirLoading(false));
    }
    setShowTafsir(prev => !prev);
  }

  async function togglePlay() {
    if (!surah) return;
    try {
      if (soundRef.current) {
        if (playing) { await soundRef.current.pauseAsync(); setPlaying(false); }
        else { await soundRef.current.playAsync(); setPlaying(true); }
        return;
      }
      setAudioLoading(true);
      const { sound } = await Audio.Sound.createAsync(
        { uri: surahAudioUrl(surah.number) },
        { shouldPlay: true },
        (status) => {
          if ('didJustFinish' in status && status.didJustFinish) { setPlaying(false); }
        }
      );
      soundRef.current = sound;
      setPlaying(true);
    } catch { /* silencieux */ }
    finally { setAudioLoading(false); }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IslamicIcon name="back" size={26} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>
            {surah ? surah.englishName : isAr ? 'سورة' : 'Sourate'}
          </Text>
          {surah && <Text style={styles.headerSub}>{surah.englishNameTranslation}</Text>}
        </View>
        {surah && (
          <TouchableOpacity
            onPress={toggleTafsir}
            style={[styles.tafsirBtn, showTafsir && styles.tafsirBtnActive]}
            disabled={tafsirLoading}
          >
            {tafsirLoading
              ? <ActivityIndicator size="small" color="#FFD700" />
              : <Text style={styles.tafsirBtnText}>📖</Text>}
          </TouchableOpacity>
        )}
        {surah && (
          <TouchableOpacity onPress={togglePlay} style={styles.playBtn} disabled={audioLoading}>
            {audioLoading
              ? <ActivityIndicator color="#FFD700" />
              : <Text style={styles.playIcon}>{playing ? '⏸' : '▶'}</Text>}
          </TouchableOpacity>
        )}
        {surah && <Text style={styles.headerAr}>{surah.name}</Text>}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={COLORS.primary} />
      ) : error || !surah ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            {isAr ? 'تعذّر التحميل. تحقق من اتصالك.' : lang === 'en' ? 'Unable to load. Check your connection.' : 'Impossible de charger. Vérifie ta connexion.'}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {surah.number !== 1 && surah.number !== 9 && (
            <Text style={styles.basmala}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
          )}
          {surah.ayahs_ar.map((ayah, i) => {
            const trad = lang === 'en'
              ? surah.ayahs_en[i]?.text
              : surah.ayahs_fr[i]?.text;
            // Le texte arabe inclut souvent la basmala dans le 1er verset (sauf At-Tawba) → nettoyage
            const arText = i === 0 && surah.number !== 1 && surah.number !== 9
              ? ayah.text.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, '')
              : ayah.text;
            return (
              <View key={ayah.number} style={styles.ayah}>
                <View style={styles.ayahHeader}>
                  <View style={styles.ayahBadge}>
                    <Text style={styles.ayahBadgeText}>{ayah.numberInSurah}</Text>
                  </View>
                </View>
                <Text style={styles.ayahAr}>{arText}</Text>
                {!isAr && trad && <Text style={styles.ayahTrad}>{trad}</Text>}
                {showTafsir && tafsirAyahs && tafsirAyahs[i] && (
                  <View style={styles.tafsirBox}>
                    <Text style={styles.tafsirLabel}>📖 Tafsir</Text>
                    <Text style={styles.tafsirText}>{tafsirAyahs[i].text}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 14,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  headerSub: { fontSize: 11, color: '#FFFFFF99' },
  headerAr: { fontSize: 22, color: '#FFF', fontWeight: '700' },
  playBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF22',
    justifyContent: 'center', alignItems: 'center',
  },
  playIcon: { fontSize: 18, color: '#FFD700' },
  errorBox: { padding: 40, alignItems: 'center' },
  errorText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
  basmala: {
    fontSize: 24, color: COLORS.primary, textAlign: 'center',
    marginBottom: 18, fontWeight: '700',
  },
  ayah: {
    backgroundColor: COLORS.surface, padding: 14, borderRadius: 12, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  ayahHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  ayahBadge: {
    backgroundColor: COLORS.primary + '20', borderRadius: 16,
    width: 32, height: 32, alignItems: 'center', justifyContent: 'center',
  },
  ayahBadgeText: { fontSize: 12, fontWeight: '800', color: COLORS.primary },
  ayahAr: {
    fontSize: 22, color: COLORS.arabicText, textAlign: 'right',
    writingDirection: 'rtl', lineHeight: 40,
  },
  ayahTrad: {
    fontSize: 14, color: COLORS.textSecondary, marginTop: 10,
    lineHeight: 22, fontStyle: 'italic',
  },
  tafsirBox: {
    marginTop: 10, padding: 10, backgroundColor: '#FFF8E1',
    borderRadius: 8, borderLeftWidth: 3, borderLeftColor: '#FFD700',
  },
  tafsirLabel: { fontSize: 11, fontWeight: '700', color: '#B8860B', marginBottom: 4 },
  tafsirText: { fontSize: 13, color: '#5D4037', lineHeight: 20, fontStyle: 'italic' },
  tafsirBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF22',
    justifyContent: 'center', alignItems: 'center',
  },
  tafsirBtnText: { fontSize: 16 },
  tafsirBtnActive: { backgroundColor: '#FFD70044' },
});
