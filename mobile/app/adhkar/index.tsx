import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { getCurrentLang } from '../../i18n';
import { ADHKAR_CATEGORIES } from '../../data/adhkar';

const { width } = Dimensions.get('window');

const CATEGORY_STYLES: Record<string, { color: string; bg: string }> = {
  matin:        { color: '#E65100', bg: '#FFF3E0' },
  soir:         { color: '#4527A0', bg: '#EDE7F6' },
  apres_priere: { color: '#1B5E20', bg: '#E8F5E9' },
  sommeil:      { color: '#1A237E', bg: '#E8EAF6' },
  reveil:       { color: '#F57F17', bg: '#FFFDE7' },
  avant_repas:  { color: '#BF360C', bg: '#FBE9E7' },
  apres_repas:  { color: '#004D40', bg: '#E0F2F1' },
  maison:       { color: '#4E342E', bg: '#EFEBE9' },
  mosquee:      { color: '#006064', bg: '#E0F7FA' },
  wc:           { color: '#37474F', bg: '#ECEFF1' },
  voyage:       { color: '#0D47A1', bg: '#E3F2FD' },
  detresse:     { color: '#6A1B9A', bg: '#F3E5F5' },
  maladie:      { color: '#C62828', bg: '#FFEBEE' },
  pluie:        { color: '#01579B', bg: '#E1F5FE' },
  istikfar:     { color: '#2E7D32', bg: '#E8F5E9' },
  salat_nabi:   { color: '#827717', bg: '#F9FBE7' },
};

function getStyle(id: string) {
  return CATEGORY_STYLES[id] || { color: COLORS.primary, bg: '#E8F5E9' };
}

export default function AdhkarIndex() {
  const lang = getCurrentLang();
  const isAr = lang === 'ar';

  // Split into 2 columns
  const pairs: typeof ADHKAR_CATEGORIES[] = [];
  for (let i = 0; i < ADHKAR_CATEGORIES.length; i += 2) {
    pairs.push(ADHKAR_CATEGORIES.slice(i, i + 2) as any);
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle}>{isAr ? 'الأذكار' : 'Adhkar'}</Text>
          <Text style={styles.headerSub}>{isAr ? 'حصن المسلم' : 'Hisn al-Muslim'}</Text>
        </View>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>
          {isAr
            ? 'أذكار صحيحة ثابتة عن النبي ﷺ'
            : 'Invocations authentiques du Prophète ﷺ'}
        </Text>

        {/* 2-column grid */}
        {(pairs as any[]).map((pair, pi) => (
          <View key={pi} style={styles.row}>
            {(pair as typeof ADHKAR_CATEGORIES).map((cat) => {
              const st = getStyle(cat.id);
              const name = isAr ? cat.name_ar : cat.name_fr;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.card, { borderTopColor: st.color }]}
                  onPress={() => router.push(`/adhkar/${cat.id}` as any)}
                  activeOpacity={0.82}
                >
                  <View style={[styles.iconCircle, { backgroundColor: st.bg }]}>
                    <Text style={styles.iconEmoji}>{cat.icon}</Text>
                  </View>
                  <Text style={[styles.cardTitle, { color: st.color }]} numberOfLines={2}>
                    {name}
                  </Text>
                  <Text style={styles.cardCount}>{cat.dhikrs.length} invocations</Text>
                </TouchableOpacity>
              );
            })}
            {/* Fill empty slot if odd */}
            {pair.length === 1 && <View style={styles.cardEmpty} />}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_W = (width - 48) / 2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 14,
  },
  backBtn: { width: 34, height: 34, justifyContent: 'center' },
  backArrow: { fontSize: 28, color: '#FFF', fontWeight: '300', lineHeight: 32 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 1 },
  scroll: { padding: 16, paddingBottom: 40 },
  intro: {
    fontSize: 13, color: COLORS.textSecondary, textAlign: 'center',
    marginBottom: 20, fontStyle: 'italic',
  },
  row: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  card: {
    width: CARD_W, backgroundColor: COLORS.surface, borderRadius: 16,
    padding: 16, alignItems: 'center',
    borderTopWidth: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  cardEmpty: { width: CARD_W },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  iconEmoji: { fontSize: 32 },
  cardTitle: {
    fontSize: 14, fontWeight: '800', textAlign: 'center', lineHeight: 20, marginBottom: 6,
  },
  cardCount: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
});
