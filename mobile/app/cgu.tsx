import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IslamicIcon } from '../components/IslamicIcon';
import { COLORS } from '../constants/colors';
import { getCurrentLang } from '../i18n';

export default function CGU() {
  const lang = getCurrentLang();
  const isAr = lang === 'ar';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IslamicIcon name="back" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isAr ? 'الشروط والخصوصية' : lang === 'en' ? 'Terms & Privacy' : 'CGU & Confidentialité'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 40 }}>
        <Text style={styles.h1}>1. Objet</Text>
        <Text style={styles.p}>
          Cette application est un outil éducatif islamique gratuit proposant des quiz sur les sciences
          islamiques (fiqh, aqida, tafsir, hadith, sirah, akhlaq), le Saint Coran et les invocations
          authentiques (adhkar) tirées du Hisn al-Muslim. Toutes les questions et dalils ont été
          vérifiés selon les sources reconnues de l’islam sunnite.
        </Text>

        <Text style={styles.h1}>2. Données collectées</Text>
        <Text style={styles.p}>
          Nous collectons uniquement :
          {'\n'}• votre pseudo et adresse email (pour créer votre compte)
          {'\n'}• votre progression et XP (pour le suivi pédagogique)
          {'\n'}• votre langue préférée et fuseau horaire (pour les notifications)
          {'\n'}• vos réponses aux quiz (pour le mode Muraja’ah et statistiques)
          {'\n\n'}
          Aucune donnée n’est revendue à des tiers. Aucune publicité n’est diffusée.
        </Text>

        <Text style={styles.h1}>3. Géolocalisation</Text>
        <Text style={styles.p}>
          Si vous activez les horaires de prière ou la boussole Qibla, votre position est utilisée
          uniquement sur l’appareil (calcul local) ou envoyée à l’API d’aladhan.com (horaires).
          Elle n’est jamais stockée sur nos serveurs.
        </Text>

        <Text style={styles.h1}>4. Notifications</Text>
        <Text style={styles.p}>
          Les rappels (prières, adhkar matin/soir, streak quotidien) sont planifiés localement
          sur votre appareil. Vous pouvez les désactiver à tout moment depuis votre profil.
        </Text>

        <Text style={styles.h1}>5. Multijoueur et classements</Text>
        <Text style={styles.p}>
          Lorsque vous participez à un tournoi ou à un classement, votre pseudo et votre score sont
          visibles par les autres utilisateurs. Les salons privés (halaqat) ne sont visibles que par
          les participants invités.
        </Text>

        <Text style={styles.h1}>6. Suppression de compte</Text>
        <Text style={styles.p}>
          Vous pouvez demander la suppression de votre compte et de toutes vos données en envoyant
          un email à l’adresse de contact indiquée dans votre profil. La suppression est définitive
          et effectuée sous 30 jours.
        </Text>

        <Text style={styles.h1}>7. Sources religieuses</Text>
        <Text style={styles.p}>
          Les contenus proviennent de sources reconnues : Coran (Mushaf Uthmani), Sahih al-Bukhari,
          Sahih Muslim, Sunan d’Abu Dawud, Tirmidhi, Nasai, Ibn Majah, Musnad d’Ahmad, ainsi que des
          tafsirs classiques (Ibn Kathir, Tabari) et œuvres de savants reconnus.
          {'\n\n'}
          La traduction française du Coran est celle de Muhammad Hamidullah ; la traduction anglaise
          est celle de Sahih International. Les horaires de prière proviennent de aladhan.com.
          {'\n\n'}
          Si vous repérez une erreur dans une question, vous pouvez la signaler depuis l’écran de
          quiz : votre signalement sera examiné par notre équipe.
        </Text>

        <Text style={styles.h1}>8. Limitation de responsabilité</Text>
        <Text style={styles.p}>
          Cette application ne remplace pas l’enseignement d’un savant ou d’un imam. Pour les
          questions juridiques personnelles complexes, consultez un savant qualifié de votre madhab.
        </Text>

        <Text style={styles.footer}>
          ✦ Qu’Allah ﷻ accepte de nous et de vous nos efforts. ✦
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.primary, padding: 14 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#FFF' },
  h1: { fontSize: 16, fontWeight: '800', color: COLORS.primary, marginTop: 16, marginBottom: 6 },
  p: { fontSize: 14, color: COLORS.text, lineHeight: 22 },
  footer: { fontSize: 13, color: COLORS.textSecondary, fontStyle: 'italic', textAlign: 'center', marginTop: 28 },
});
