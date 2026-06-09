import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IslamicIcon } from '../../components/IslamicIcon';
import { COLORS } from '../../constants/colors';
import { getCurrentLang } from '../../i18n';
import { fetchSurah, SurahFull } from '../../services/quran';

export default function CoranSurah() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [surah, setSurah] = useState<SurahFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const lang = getCurrentLang();
  const isAr = lang === 'ar';

  useEffect(() => {
    const n = Number(id);
    if (!n || n < 1 || n > 114) { setError(true); setLoading(false); return; }
    fetchSurah(n)
      .then(setSurah)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

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
});
