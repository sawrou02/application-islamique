import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { getCurrentLang } from '../../i18n';

const RESOURCES = [
  {
    icon: '📖',
    titleFr: 'Saint Coran',
    titleAr: 'القرآن الكريم',
    descFr: 'Mushaf complet • 604 pages • Audio par verset',
    descAr: 'المصحف الكامل • ٦٠٤ صفحة • صوت آية بآية',
    route: '/coran',
    color: '#1B5E20',
    bg: '#E8F5E9',
  },
  {
    icon: '🤲',
    titleFr: 'Adhkâr',
    titleAr: 'الأذكار',
    descFr: 'Invocations du matin, du soir et du quotidien',
    descAr: 'أذكار الصباح والمساء واليومية',
    route: '/adhkar',
    color: '#4A148C',
    bg: '#EDE7F6',
  },
];

export default function RessourcesScreen() {
  const lang = getCurrentLang();
  const isAr = lang === 'ar';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {isAr ? 'المصادر' : lang === 'en' ? 'Resources' : 'Ressources'}
        </Text>
        <Text style={styles.headerSub}>
          {isAr ? 'القرآن والأذكار' : lang === 'en' ? 'Quran & Supplications' : 'Coran & Invocations'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {RESOURCES.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={[styles.card, { borderLeftColor: item.color }]}
            onPress={() => router.push(item.route as any)}
            activeOpacity={0.85}
          >
            <View style={[styles.iconWrap, { backgroundColor: item.bg }]}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, { color: item.color }]}>
                {isAr ? item.titleAr : item.titleFr}
              </Text>
              {!isAr && <Text style={styles.cardTitleAr}>{item.titleAr}</Text>}
              <Text style={styles.cardDesc}>
                {isAr ? item.descAr : item.descFr}
              </Text>
            </View>
            <Text style={[styles.arrow, { color: item.color }]}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: 26, fontWeight: '800', color: '#FFF',
  },
  headerSub: {
    fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4,
  },
  scroll: { padding: 16, gap: 14 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 16, padding: 18,
    borderLeftWidth: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  iconWrap: {
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
  },
  icon: { fontSize: 28 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: '800' },
  cardTitleAr: { fontSize: 14, color: COLORS.arabicText, marginTop: 2 },
  cardDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4, lineHeight: 18 },
  arrow: { fontSize: 28, fontWeight: '300' },
});
