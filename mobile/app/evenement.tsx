import { useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { getTodayEvent, getTodayChallenge } from '../constants/islamic';
import { useQuizSetupStore } from '../store/quizSetupStore';
import { t, getCurrentLang } from '../i18n';

// Rich content per event key
const EVENT_DETAILS: Record<string, {
  verset_ar?: string;
  verset_fr?: string;
  verset_ref?: string;
  hadith_ar?: string;
  hadith_fr?: string;
  hadith_ref?: string;
  explication: string;
  vertus?: string[];
  amals?: string[];
}> = {
  ramadan: {
    verset_ar: 'شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ وَبَيِّنَاتٍ مِّنَ الْهُدَىٰ وَالْفُرْقَانِ',
    verset_fr: "Le mois de Ramadan est celui durant lequel le Coran a été révélé, guide pour les gens et preuves de la bonne direction et du Discernement.",
    verset_ref: 'Sourate Al-Baqara (2:185)',
    hadith_ar: 'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ',
    hadith_fr: "Celui qui jeûne le Ramadan par foi sincère et dans l'espoir de la récompense, ses péchés passés lui seront pardonnés.",
    hadith_ref: 'Bukhari 2014, Muslim 760',
    explication: "Ramadan est le 9e mois du calendrier hégirien, mois sacré durant lequel le Coran a été révélé. Le jeûne est l'un des cinq piliers de l'Islam. Il comprend l'abstention de nourriture, de boisson et de relations conjugales de l'aube (Fajr) jusqu'au coucher du soleil (Maghrib). C'est un mois de purification de l'âme, d'intensification du dhikr, de la prière nocturne (Qiyam al-Layl), et de générosité envers les autres.",
    vertus: ["Pardon des péchés passés", "Les portes du Paradis sont ouvertes", "Les portes de l'Enfer sont fermées", "Les shayatins sont enchaînés", "Laylat al-Qadr : meilleure que 1000 mois"],
    amals: ["Jeûner chaque jour", "Prier les Tarawih", "Réciter et mémoriser le Coran", "Donner la Zakat al-Fitr", "Faire I'tikaf (les 10 dernières nuits)"],
  },
  dhul_hijjah: {
    verset_ar: 'وَالْفَجْرِ ۝ وَلَيَالٍ عَشْرٍ',
    verset_fr: "Par l'aube, et les dix nuits.",
    verset_ref: "Sourate Al-Fajr (89:1-2)",
    hadith_ar: 'مَا مِنْ أَيَّامٍ الْعَمَلُ الصَّالِحُ فِيهَا أَحَبُّ إِلَى اللَّهِ مِنْ هَذِهِ الْأَيَّامِ',
    hadith_fr: "Il n'y a pas de jours où les bonnes actions sont plus aimées d'Allah que ces jours-là (les dix premiers de Dhul Hijjah).",
    hadith_ref: 'Bukhari 969',
    explication: "Dhul Hijjah est le 12e mois hégirien, mois sacré du Hajj. Les dix premiers jours sont parmi les jours les plus bénis de l'année. Le 9e jour est le jour d'Arafat, le meilleur jour de l'année selon de nombreux savants. Le 10e jour est l'Aïd al-Adha et le début des jours de Tashriq.",
    vertus: ["Les 10 premiers jours : actes les plus aimés d'Allah", "Jour d'Arafat : expiation des péchés de 2 ans", "Aïd al-Adha : Sunnah du Prophète Ibrahim (AS)", "Qurbani : rapprochement vers Allah"],
    amals: ["Jeûner le jour d'Arafat (pour les non-pèlerins)", "Multiplier le Takbir (Allahu Akbar)", "Offrir le sacrifice (Qurbani)", "Réciter le Coran", "Faire l'Aïd avec la communauté"],
  },
  muharram: {
    verset_ar: 'إِنَّ عِدَّةَ الشُّهُورِ عِندَ اللَّهِ اثْنَا عَشَرَ شَهْرًا فِي كِتَابِ اللَّهِ',
    verset_fr: "Le nombre de mois, selon Allah, est de douze mois dans le Livre d'Allah.",
    verset_ref: 'Sourate At-Tawbah (9:36)',
    hadith_ar: 'أَفْضَلُ الصِّيَامِ بَعْدَ رَمَضَانَ شَهْرُ اللَّهِ الْمُحَرَّمُ',
    hadith_fr: "Le meilleur jeûne après Ramadan est le mois d'Allah, Muharram.",
    hadith_ref: 'Muslim 1163',
    explication: "Muharram est le 1er mois du calendrier islamique et l'un des quatre mois sacrés. Le 10e jour, Achoura, est un jour de grande importance. Le Prophète ﷺ jeûnait ce jour en reconnaissance de la délivrance de Moussa (AS) de Pharaon. Il est recommandé de jeûner le 9e et le 10e, ou le 10e et le 11e.",
    vertus: ["Mois d'Allah — plus de récompense pour les actes", "Jour d'Achoura : expiation des péchés de l'année précédente", "Nouvelle année islamique"],
    amals: ["Jeûner le 9 et 10 Muharram (Achoura)", "Augmenter les actes d'adoration", "Se repentir en ce début d'année"],
  },
  rabi_awwal: {
    verset_ar: 'لَقَدْ جَاءَكُمْ رَسُولٌ مِّنْ أَنفُسِكُمْ عَزِيزٌ عَلَيْهِ مَا عَنِتُّمْ',
    verset_fr: "Il vous est certes venu un Messager pris d'entre vous, auquel pèse ce que vous souffrez.",
    verset_ref: 'Sourate At-Tawbah (9:128)',
    hadith_ar: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى أَكُونَ أَحَبَّ إِلَيْهِ مِنْ وَالِدِهِ وَوَلَدِهِ',
    hadith_fr: "Aucun d'entre vous ne croit vraiment jusqu'à ce que je sois plus cher à son cœur que son père, son fils et tous les hommes.",
    hadith_ref: 'Bukhari 15, Muslim 44',
    explication: "Rabi' al-Awwal est le 3e mois hégirien, connu pour être le mois de naissance du Prophète Muhammad ﷺ (selon l'opinion la plus répandue, le 12 Rabi' al-Awwal). C'est un moment pour renouveler l'amour du Prophète, étudier sa Sirah, et augmenter la salawat.",
    vertus: ["Mois de naissance du Sceau des Prophètes ﷺ", "Occasion de renouveler l'amour prophétique"],
    amals: ["Augmenter la Salawat sur le Prophète ﷺ", "Lire la Sirah Nabawiyya", "Enseigner la vie du Prophète aux enfants"],
  },
  jumuah: {
    verset_ar: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ',
    verset_fr: "Ô vous qui croyez ! Quand on appelle à la prière le jour du Vendredi, empressez-vous vers le rappel d'Allah.",
    verset_ref: 'Sourate Al-Jumu\'ah (62:9)',
    hadith_ar: 'خَيْرُ يَوْمٍ طَلَعَتْ عَلَيْهِ الشَّمْسُ يَوْمُ الْجُمُعَةِ',
    hadith_fr: "Le meilleur jour sur lequel le soleil s'est levé est le Vendredi.",
    hadith_ref: 'Muslim 854',
    explication: "Al-Jumu'ah (le Vendredi) est le seigneur des jours en Islam. La prière du Vendredi est obligatoire pour les hommes libres, adultes, sains et résidents. Il est recommandé ce jour-là de se purifier, de se parfumer, de réciter Sourate Al-Kahf, d'envoyer beaucoup de Salawat sur le Prophète ﷺ et de chercher l'heure d'exaucement des du'as.",
    vertus: ["Seigneur des jours", "Une heure bénie où toute du'a est exaucée", "Adam (AS) a été créé ce jour", "La Résurrection aura lieu un Vendredi"],
    amals: ['Prière du Vendredi (Jumu\'ah)', 'Réciter Sourate Al-Kahf', 'Envoyer beaucoup de Salawat', 'Se purifier et se parfumer'],
  },
  shaban: {
    verset_ar: 'وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ',
    verset_fr: "Je n'ai créé les djinns et les hommes que pour qu'ils M'adorent.",
    verset_ref: 'Sourate Adh-Dhariyat (51:56)',
    hadith_ar: 'ذَلِكَ شَهْرٌ يَغْفُلُ النَّاسُ عَنْهُ بَيْنَ رَجَبٍ وَرَمَضَانَ',
    hadith_fr: "C'est un mois dont les gens sont inattentifs, entre Rajab et Ramadan.",
    hadith_ref: 'An-Nasa\'i 2357, sahih',
    explication: "Sha'ban est le 8e mois du calendrier islamique. Le Prophète ﷺ jeûnait beaucoup durant ce mois, plus que tout autre mois en dehors du Ramadan. La nuit du 15 Sha'ban (Laylat al-Bara'a) est mentionnée dans certains ahadith comme une nuit de pardon. C'est un mois de préparation spirituelle pour Ramadan.",
    vertus: ["Mois préféré du Prophète ﷺ pour le jeûne volontaire", "Les actes remontent à Allah durant ce mois", "Nuit du 15 Sha'ban : nuit de pardon selon certains ahadith"],
    amals: ["Jeûner fréquemment (surtout lundi/jeudi)", "Réciter le Coran", "Préparer son cœur pour Ramadan"],
  },
  hadith_du_jour: {
    explication: "Le savoir islamique est le fondement de tout acte d'adoration. Chaque jour est une occasion de grandir dans la connaissance de cette religion. Le Prophète ﷺ a dit : « Rechercher le savoir est une obligation pour tout musulman. » (Ibn Majah 224). Profite de ce jour pour apprendre, réviser, et progresser.",
    amals: ["Lire un hadith et son explication", "Pratiquer ce que tu as appris", "Partager le savoir avec un proche"],
  },
};

export default function EvenementScreen() {
  const params = useLocalSearchParams<{ type?: string }>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const todayEvent = getTodayEvent();
  const todayChallenge = getTodayChallenge();
  const isChallenge = params.type === 'challenge';
  const lang = getCurrentLang();
  const { setMode, setDomaine, setNb, reset } = useQuizSetupStore();

  // Challenge uses its own domain info; event uses calendar event
  const DOMAIN_LABELS: Record<string, { name: string; nameAr: string; icon: string; color: string }> = {
    fiqh: { name: 'Fiqh', nameAr: 'فقه', icon: '⚖', color: '#1B5E20' },
    aqida: { name: 'Aqida', nameAr: 'عقيدة', icon: '☪', color: '#1A237E' },
    tafsir: { name: 'Tafsir / Coran', nameAr: 'تفسير', icon: '۩', color: '#4A148C' },
    hadith: { name: 'Hadith', nameAr: 'حديث', icon: '◉', color: '#BF360C' },
    sirah: { name: 'Sirah', nameAr: 'سيرة', icon: '✦', color: '#01579B' },
    akhlaq: { name: 'Akhlaq', nameAr: 'أخلاق', icon: '✧', color: '#006064' },
    general: { name: 'Général', nameAr: 'عام', icon: '۞', color: '#1B5E20' },
  };

  const challengeDomainInfo = DOMAIN_LABELS[todayChallenge.domaine] || DOMAIN_LABELS['general'];
  const event = todayEvent;
  const details = EVENT_DETAILS[event.key] || EVENT_DETAILS['hadith_du_jour'];

  const heroColor = isChallenge ? challengeDomainInfo.color : event.color;
  const heroIcon = isChallenge ? challengeDomainInfo.icon : event.icon;
  const heroName = isChallenge ? todayChallenge.title : event.name;
  const heroNameAr = isChallenge ? todayChallenge.titleAr : event.nameAr;
  const heroDesc = isChallenge ? todayChallenge.desc : event.description;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleStartQuiz = () => {
    const domaine = isChallenge ? todayChallenge.domaine : (event.quizDomaine || 'general');
    const nb = isChallenge ? todayChallenge.nb : 10;
    reset();
    setMode(isChallenge ? 'thematique' : 'quotidien');
    setDomaine(domaine);
    setNb(nb);
    router.push('/quiz/setup/recap');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.headerBar, { backgroundColor: heroColor }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isChallenge ? t('defi_quotidien') : t('evenement_du_jour')}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Hero card */}
        <Animated.View style={[styles.heroCard, {
          borderColor: heroColor,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }]}>
          <View style={[styles.heroIconWrap, { backgroundColor: `${heroColor}22` }]}>
            <Text style={styles.heroIcon}>{heroIcon}</Text>
          </View>
          <Text style={styles.heroName}>{heroName}</Text>
          <Text style={styles.heroNameAr}>{heroNameAr}</Text>
          <Text style={styles.heroDesc}>{heroDesc}</Text>
        </Animated.View>

        {/* Verset */}
        {details.verset_ar && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionIcon, { color: COLORS.gold }]}>۩</Text>
              <Text style={styles.sectionTitle}>{lang === 'ar' ? 'الآية الكريمة' : lang === 'en' ? 'Quranic Verse' : 'Verset Coranique'}</Text>
            </View>
            <Text style={styles.ar}>{details.verset_ar}</Text>
            {lang !== 'ar' && details.verset_fr && <Text style={styles.fr}>« {details.verset_fr} »</Text>}
            {details.verset_ref && <Text style={styles.ref}>— {details.verset_ref}</Text>}
          </View>
        )}

        {/* Hadith */}
        {details.hadith_ar && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionIcon, { color: '#BF360C' }]}>◉</Text>
              <Text style={styles.sectionTitle}>{lang === 'ar' ? 'الحديث الشريف' : lang === 'en' ? 'Hadith' : 'Hadith'}</Text>
            </View>
            <Text style={styles.ar}>{details.hadith_ar}</Text>
            {lang !== 'ar' && details.hadith_fr && <Text style={styles.fr}>« {details.hadith_fr} »</Text>}
            {details.hadith_ref && <Text style={styles.ref}>— {details.hadith_ref}</Text>}
          </View>
        )}

        {/* Explication — masquée en arabe car texte en français */}
        {lang !== 'ar' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionIcon, { color: COLORS.primary }]}>✦</Text>
              <Text style={styles.sectionTitle}>{lang === 'en' ? 'Explanation' : 'Explication'}</Text>
            </View>
            <Text style={styles.explication}>{details.explication}</Text>
          </View>
        )}

        {/* Vertus — masquées en arabe car textes en français */}
        {lang !== 'ar' && details.vertus && details.vertus.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionIcon, { color: COLORS.gold }]}>★</Text>
              <Text style={styles.sectionTitle}>{lang === 'ar' ? 'الفضائل' : lang === 'en' ? 'Virtues' : 'Vertus'}</Text>
            </View>
            {details.vertus.map((v, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={[styles.bulletDot, { color: event.color }]}>◆</Text>
                <Text style={styles.bulletText}>{v}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Amals recommandés — masqués en arabe car textes en français */}
        {lang !== 'ar' && details.amals && details.amals.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionIcon, { color: COLORS.primary }]}>❋</Text>
              <Text style={styles.sectionTitle}>{lang === 'ar' ? 'الأعمال المستحبة' : lang === 'en' ? 'Recommended Acts' : "Actes recommandés"}</Text>
            </View>
            {details.amals.map((a, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={[styles.bulletDot, { color: COLORS.primary }]}>✓</Text>
                <Text style={styles.bulletText}>{a}</Text>
              </View>
            ))}
          </View>
        )}

        {/* CTA Quiz */}
        <TouchableOpacity
          style={[styles.quizBtn, { backgroundColor: event.color }]}
          onPress={handleStartQuiz}
          activeOpacity={0.85}
        >
          <Text style={styles.quizBtnText}>
            {lang === 'ar' ? 'ابدأ الاختبار' : lang === 'en' ? 'Start Quiz' : 'Commencer le Quiz'}
          </Text>
          <Text style={styles.quizBtnSub}>
            {isChallenge
              ? `${todayChallenge.nb} ${lang === 'en' ? 'questions' : 'questions'} — ${todayChallenge.domaine}`
              : `${lang === 'en' ? 'Quiz on this topic' : 'Quiz sur ce thème'}`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backIcon: { fontSize: 28, color: '#FFF', fontWeight: '300', marginTop: -4 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#FFF', letterSpacing: 0.3 },
  scroll: { padding: 16, paddingBottom: 40 },

  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  heroIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroIcon: { fontSize: 36 },
  heroName: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  heroNameAr: { fontSize: 17, color: COLORS.arabicText, fontWeight: '600', marginBottom: 10 },
  heroDesc: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20 },

  section: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gold,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionIcon: { fontSize: 16 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  ar: {
    fontSize: 18,
    color: COLORS.arabicText,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 30,
    marginBottom: 10,
    fontWeight: '500',
  },
  fr: {
    fontSize: 13.5,
    color: COLORS.text,
    fontStyle: 'italic',
    lineHeight: 21,
    marginBottom: 6,
  },
  ref: {
    fontSize: 11.5,
    color: COLORS.textLight,
    fontWeight: '600',
    marginTop: 4,
  },
  explication: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  bulletDot: { fontSize: 10, marginTop: 5 },
  bulletText: { flex: 1, fontSize: 13.5, color: COLORS.text, lineHeight: 20 },

  quizBtn: {
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  quizBtnText: { fontSize: 17, fontWeight: '800', color: '#FFF', marginBottom: 4 },
  quizBtnSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
});
