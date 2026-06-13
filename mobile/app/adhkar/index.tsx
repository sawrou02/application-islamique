import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IslamicIcon } from '../../components/IslamicIcon';
import { COLORS } from '../../constants/colors';
import { getCurrentLang } from '../../i18n';
import { ADHKAR_CATEGORIES } from '../../data/adhkar';

export default function AdhkarIndex() {
  const lang = getCurrentLang();
  const isAr = lang === 'ar';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IslamicIcon name="back" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isAr ? 'الأذكار' : lang === 'en' ? 'Adhkar' : 'Adhkar'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={styles.intro}>
          {isAr
            ? 'من حصن المسلم — أذكار صحيحة ثابتة عن النبي ﷺ.'
            : lang === 'en'
              ? 'From Hisn al-Muslim — authentic remembrances of the Prophet ﷺ.'
              : 'Tirés de Hisn al-Muslim — invocations authentiques du Prophète ﷺ.'}
        </Text>

        {ADHKAR_CATEGORIES.map((cat) => {
          const name = isAr ? cat.name_ar : lang === 'en' ? cat.name_en : cat.name_fr;
          const desc = isAr ? cat.description_ar : lang === 'en' ? cat.description_en : cat.description_fr;
          return (
            <TouchableOpacity
              key={cat.id}
              style={styles.card}
              onPress={() => router.push(`/adhkar/${cat.id}`)}
              activeOpacity={0.8}
            >
              <Text style={styles.icon}>{cat.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{name}</Text>
                <Text style={styles.cardSub}>{desc}</Text>
                <Text style={styles.cardCount}>{cat.dhikrs.length} adhkar</Text>
              </View>
              <IslamicIcon name="next" size={22} color={COLORS.primary} />
            </TouchableOpacity>
          );
        })}
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  intro: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 18, fontStyle: 'italic' },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.surface, padding: 14, borderRadius: 14,
    marginBottom: 10, borderWidth: 1, borderColor: COLORS.border,
  },
  icon: { fontSize: 32 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  cardSub: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  cardCount: { fontSize: 11, color: COLORS.primary, marginTop: 4, fontWeight: '700' },
});
