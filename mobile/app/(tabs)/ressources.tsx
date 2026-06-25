import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { getCurrentLang } from '../../i18n';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const RESOURCES: { icon: IconName; titleFr: string; titleAr: string; descFr: string; descAr: string; route: string; color: string; bg: string }[] = [
  {
    icon: 'book-open-variant',
    titleFr: 'Saint Coran',
    titleAr: 'القرآن الكريم',
    descFr: 'Mushaf complet • 604 pages • Audio par verset',
    descAr: 'المصحف الكامل • ٦٠٤ صفحة • صوت آية بآية',
    route: '/coran',
    color: '#1B5E20',
    bg: '#E8F5E9',
  },
  {
    icon: 'hands-pray',
    titleFr: 'Adhkâr',
    titleAr: 'الأذكار',
    descFr: 'Invocations du matin, du soir et du quotidien',
    descAr: 'أذكار الصباح والمساء واليومية',
    route: '/adhkar',
    color: '#4A148C',
    bg: '#EDE7F6',
  },
  {
    icon: 'mosque',
    titleFr: 'Horaires de prière',
    titleAr: 'مواقيت الصلاة',
    descFr: 'Heures de prière selon votre position',
    descAr: 'أوقات الصلاة حسب موقعك',
    route: '/horaires',
    color: '#01579B',
    bg: '#E3F2FD',
  },
  {
    icon: 'compass',
    titleFr: 'Direction de la Qibla',
    titleAr: 'اتجاه القبلة',
    descFr: 'Boussole pour trouver la direction de la Mecque',
    descAr: 'بوصلة لتحديد اتجاه الكعبة المشرفة',
    route: '/qibla',
    color: '#BF360C',
    bg: '#FBE9E7',
  },
  {
    icon: 'magnify',
    titleFr: 'Recherche',
    titleAr: 'بحث',
    descFr: 'Rechercher dans toutes les questions islamiques',
    descAr: 'البحث في جميع الأسئلة الإسلامية',
    route: '/search',
    color: '#37474F',
    bg: '#ECEFF1',
  },
  {
    icon: 'account-star',
    titleFr: 'Sahaba',
    titleAr: 'الصحابة',
    descFr: 'Biographies des compagnons du Prophète ﷺ',
    descAr: 'سير الصحابة الكرام رضي الله عنهم',
    route: '/sahaba',
    color: '#6A1B9A',
    bg: '#F3E5F5',
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
          {isAr ? 'القرآن والأذكار والمزيد' : lang === 'en' ? 'Quran, Supplications & more' : 'Coran, Adhkar & plus'}
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
              <MaterialCommunityIcons name={item.icon} size={28} color={item.color} />
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
            <MaterialCommunityIcons name="chevron-right" size={22} color={item.color} />
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
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#FFF' },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
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
  cardText: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '800' },
  cardTitleAr: { fontSize: 14, color: COLORS.arabicText, marginTop: 2 },
  cardDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4, lineHeight: 18 },
});
