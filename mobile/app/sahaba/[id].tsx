import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IslamicIcon } from '../../components/IslamicIcon';
import { COLORS } from '../../constants/colors';
import { getCurrentLang } from '../../i18n';
import { getById } from '../../data/sahaba';

export default function SahabaDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lang = getCurrentLang();
  const isAr = lang === 'ar';
  const p = getById(String(id));

  if (!p) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <IslamicIcon name="back" size={26} color="#FFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.notFound}>
          {isAr ? 'غير موجود' : lang === 'en' ? 'Not found' : 'Introuvable'}
        </Text>
      </SafeAreaView>
    );
  }

  const bio = isAr ? p.bio.ar : lang === 'en' ? p.bio.en : p.bio.fr;
  const eraLabel = p.era === 'sahabi'
    ? (isAr ? 'صحابي' : lang === 'en' ? 'Companion' : 'Compagnon')
    : (isAr ? 'تابعي' : lang === 'en' ? 'Successor' : 'Successeur');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IslamicIcon name="back" size={26} color="#FFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{eraLabel}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View style={styles.hero}>
          <Text style={styles.nameAr}>{p.nameAr}</Text>
          <Text style={styles.nameFr}>{isAr ? p.nameAr : lang === 'en' ? p.nameEn : p.nameFr}</Text>
          {p.laqabFr && (
            <View style={styles.laqabPill}>
              <Text style={styles.laqabAr}>{p.laqab}</Text>
              <Text style={styles.laqabFr}>{isAr ? p.laqab : lang === 'en' ? p.laqab : p.laqabFr}</Text>
            </View>
          )}
          <Text style={styles.category}>{isAr ? p.categoryAr : p.category}</Text>
        </View>

        <View style={styles.infoCard}>
          {p.kunya && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{isAr ? 'الكنية' : lang === 'en' ? 'Kunya' : 'Kunya'}</Text>
              <Text style={styles.rowValue}>{p.kunya}</Text>
            </View>
          )}
          {p.born && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{isAr ? 'الميلاد' : lang === 'en' ? 'Born' : 'Naissance'}</Text>
              <Text style={styles.rowValue}>{p.born}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>{isAr ? 'الوفاة' : lang === 'en' ? 'Died' : 'Décès'}</Text>
            <Text style={styles.rowValue}>{p.died}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          {isAr ? 'السيرة' : lang === 'en' ? 'Biography' : 'Biographie'}
        </Text>
        <Text style={styles.bio}>{bio}</Text>

        {p.hadith && (
          <View style={styles.hadithBox}>
            <Text style={styles.hadithLabel}>
              ﷺ {isAr ? 'قال رسول الله' : lang === 'en' ? 'The Messenger ﷺ said' : 'Le Messager ﷺ a dit'}
            </Text>
            <Text style={styles.hadithAr}>« {p.hadith.ar} »</Text>
            <Text style={styles.hadithFr}>« {p.hadith.fr} »</Text>
            <Text style={styles.hadithSource}>— {p.hadith.source}</Text>
          </View>
        )}

        <Text style={styles.disclaimer}>
          {isAr
            ? 'المصادر: صحيح البخاري، صحيح مسلم، سير أعلام النبلاء، الإصابة في تمييز الصحابة.'
            : lang === 'en'
              ? "Sources: Sahih al-Bukhari, Sahih Muslim, Siyar A'lam an-Nubala', Al-Isaba."
              : 'Sources : Sahih al-Bukhari, Sahih Muslim, Siyar A’lam an-Nubala’, Al-Isaba.'}
        </Text>
      </ScrollView>
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
  headerTitle: { fontSize: 15, fontWeight: '700', color: '#FFF' },
  notFound: { textAlign: 'center', marginTop: 40, color: COLORS.textSecondary },
  hero: {
    alignItems: 'center', paddingVertical: 20,
    borderBottomWidth: 1, borderBottomColor: COLORS.border, marginBottom: 16,
  },
  nameAr: { fontSize: 30, fontWeight: '800', color: COLORS.primary, textAlign: 'center' },
  nameFr: { fontSize: 18, fontWeight: '600', color: COLORS.text, marginTop: 6 },
  laqabPill: {
    backgroundColor: COLORS.gold + '22', borderRadius: 16,
    paddingVertical: 6, paddingHorizontal: 14, marginTop: 10, alignItems: 'center',
  },
  laqabAr: { fontSize: 14, fontWeight: '700', color: '#B8860B' },
  laqabFr: { fontSize: 11, color: '#B8860B', fontStyle: 'italic', marginTop: 2 },
  category: { fontSize: 12, color: COLORS.textSecondary, marginTop: 8 },
  infoCard: {
    backgroundColor: COLORS.surface, borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 18,
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  rowLabel: { fontSize: 13, color: COLORS.textSecondary },
  rowValue: { fontSize: 13, color: COLORS.text, fontWeight: '600' },
  sectionTitle: {
    fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 8,
  },
  bio: { fontSize: 15, lineHeight: 24, color: COLORS.text, marginBottom: 18 },
  hadithBox: {
    backgroundColor: '#FFF8E1', borderRadius: 12, padding: 14,
    borderLeftWidth: 3, borderLeftColor: COLORS.gold, marginBottom: 18,
  },
  hadithLabel: { fontSize: 11, fontWeight: '700', color: '#B8860B', marginBottom: 6 },
  hadithAr: { fontSize: 18, color: '#5D4037', textAlign: 'right', lineHeight: 30, marginBottom: 6 },
  hadithFr: { fontSize: 13, color: '#5D4037', fontStyle: 'italic', lineHeight: 20 },
  hadithSource: { fontSize: 11, color: '#8D6E63', marginTop: 6 },
  disclaimer: {
    fontSize: 10, color: COLORS.textSecondary,
    fontStyle: 'italic', textAlign: 'center', marginTop: 10,
  },
});
