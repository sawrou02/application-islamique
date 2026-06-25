import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IslamicIcon } from '../../components/IslamicIcon';
import { COLORS } from '../../constants/colors';
import { getCurrentLang } from '../../i18n';
import { fetchSurahList, SurahMeta } from '../../services/quran';

export default function CoranIndex() {
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const lang = getCurrentLang();
  const isAr = lang === 'ar';

  useEffect(() => {
    fetchSurahList()
      .then(setSurahs)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = surahs.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.englishName.toLowerCase().includes(q) ||
      s.englishNameTranslation.toLowerCase().includes(q) ||
      s.name.includes(q) ||
      String(s.number).includes(q)
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IslamicIcon name="back" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isAr ? 'القرآن الكريم' : lang === 'en' ? 'The Noble Qur’an' : 'Le Saint Coran'}
        </Text>
      </View>

      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder={isAr ? 'بحث...' : lang === 'en' ? 'Search...' : 'Rechercher...'}
          placeholderTextColor={COLORS.textLight}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={COLORS.primary} />
      ) : error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            {isAr ? 'تعذّر التحميل. تحقق من اتصالك.' : lang === 'en' ? 'Unable to load. Check your connection.' : 'Impossible de charger. Vérifie ta connexion.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.number)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              onPress={() => router.push(`/coran/${item.number}`)}
              activeOpacity={0.7}
            >
              <View style={styles.numBadge}>
                <Text style={styles.numText}>{item.number}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.surahName}>{item.englishName}</Text>
                <Text style={styles.surahSub}>
                  {item.englishNameTranslation} · {item.numberOfAyahs} {isAr ? 'آية' : 'versets'} · {item.revelationType}
                </Text>
              </View>
              <Text style={styles.surahAr}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  searchBox: { padding: 12 },
  searchInput: {
    backgroundColor: COLORS.surface, borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 10, fontSize: 14, color: COLORS.text,
    borderWidth: 1, borderColor: COLORS.border,
  },
  errorBox: { padding: 40, alignItems: 'center' },
  errorText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.surface, padding: 12, borderRadius: 12,
    marginBottom: 8, borderWidth: 1, borderColor: COLORS.border,
  },
  numBadge: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: COLORS.primary + '20', alignItems: 'center', justifyContent: 'center',
  },
  numText: { fontSize: 14, fontWeight: '800', color: COLORS.primary },
  surahName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  surahSub: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  surahAr: { fontSize: 20, color: COLORS.arabicText, fontWeight: '700' },
});
