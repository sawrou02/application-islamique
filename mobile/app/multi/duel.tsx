import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, Alert,
  ScrollView, Share,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IslamicIcon } from '../../components/IslamicIcon';
import { COLORS } from '../../constants/colors';
import { useDuelStore } from '../../store/duelStore';
import { useAuthStore } from '../../store/authStore';
import { getCurrentLang } from '../../i18n';

const DOMAINS: { id: string; label: string; ar: string }[] = [
  { id: 'fiqh',   label: 'Fiqh',   ar: 'الفقه' },
  { id: 'aqida',  label: 'Aqida',  ar: 'العقيدة' },
  { id: 'tafsir', label: 'Tafsir', ar: 'التفسير' },
  { id: 'hadith', label: 'Hadith', ar: 'الحديث' },
  { id: 'sirah',  label: 'Sirah',  ar: 'السيرة' },
  { id: 'akhlaq', label: 'Akhlaq', ar: 'الأخلاق' },
];

export default function DuelLobby() {
  const lang = getCurrentLang();
  const isAr = lang === 'ar';
  const { user } = useAuthStore();
  const { createDuel, acceptDuel, connect, reset } = useDuelStore();

  const [domaine, setDomaine] = useState<string>('fiqh');
  const [niveau, setNiveau] = useState<number>(1);
  const [nbQuestions, setNbQuestions] = useState<number>(10);
  const [tokenInput, setTokenInput] = useState('');
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleCreate() {
    if (!user) return;
    setBusy(true);
    try {
      reset();
      const { id, invite_token } = await createDuel({ domaine, niveau, nb_questions: nbQuestions });
      setInviteToken(invite_token);
      connect(id, user.id);
    } catch {
      Alert.alert('Erreur', 'Impossible de créer le duel');
    } finally {
      setBusy(false);
    }
  }

  async function handleAccept() {
    if (!user || !tokenInput.trim()) {
      Alert.alert(isAr ? 'خطأ' : 'Erreur', isAr ? 'أدخل رمز الدعوة' : 'Entrez le code d’invitation');
      return;
    }
    setBusy(true);
    try {
      reset();
      const d = await acceptDuel(tokenInput.trim());
      connect(d.id, user.id);
      router.push('/multi/duel-game');
    } catch {
      Alert.alert(isAr ? 'خطأ' : 'Erreur', isAr ? 'دعوة غير صالحة' : 'Invitation invalide ou expirée');
    } finally {
      setBusy(false);
    }
  }

  function shareInvite() {
    if (!inviteToken) return;
    Share.share({
      message: (isAr
        ? `تحدّاك في مبارزة على تطبيق الإسلام! استخدم هذا الرمز: ${inviteToken}`
        : `Je te défie en duel sur Quiz Islamique ! Utilise ce code: ${inviteToken}`),
    });
  }

  if (inviteToken) {
    // Waiting screen
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { reset(); setInviteToken(null); }} style={styles.backBtn}>
            <IslamicIcon name="back" size={26} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isAr ? 'مبارزة ١ ضد ١' : 'Duel 1 vs 1'}
          </Text>
        </View>
        <View style={styles.waitingBody}>
          <Text style={styles.waitingEmoji}>⚔️</Text>
          <Text style={styles.waitingTitle}>
            {isAr ? 'في انتظار خصمك…' : 'En attente d’un adversaire…'}
          </Text>
          <Text style={styles.waitingHint}>
            {isAr ? 'شارك الرمز مع صديق لبدء المبارزة' : 'Partage le code avec un ami pour démarrer'}
          </Text>
          <View style={styles.tokenBox}>
            <Text style={styles.tokenLabel}>
              {isAr ? 'رمز الدعوة' : 'Code d’invitation'}
            </Text>
            <Text style={styles.token} numberOfLines={1}>{inviteToken.substring(0, 16)}…</Text>
          </View>
          <TouchableOpacity style={styles.shareBtn} onPress={shareInvite}>
            <Text style={styles.shareBtnText}>
              {isAr ? '📤 مشاركة' : '📤 Partager le code'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.goBtn} onPress={() => router.push('/multi/duel-game')}>
            <Text style={styles.goBtnText}>
              {isAr ? 'دخول قاعة المبارزة' : 'Entrer dans la salle'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IslamicIcon name="back" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isAr ? 'مبارزة ١ ضد ١' : 'Duel 1 vs 1'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={styles.intro}>
          {isAr
            ? 'تنافس مع صديق في الوقت الحقيقي. ١٠ أسئلة، الأسرع يفوز.'
            : 'Affronte un ami en temps réel. 10 questions, le plus rapide gagne.'}
        </Text>

        {/* Create section */}
        <Text style={styles.sectionTitle}>
          {isAr ? '⚔️ إنشاء تحدّي' : '⚔️ Créer un défi'}
        </Text>

        <Text style={styles.label}>{isAr ? 'المجال' : 'Domaine'}</Text>
        <View style={styles.chips}>
          {DOMAINS.map(d => {
            const active = domaine === d.id;
            return (
              <TouchableOpacity
                key={d.id}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setDomaine(d.id)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {isAr ? d.ar : d.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>{isAr ? 'المستوى' : 'Niveau'}</Text>
        <View style={styles.chips}>
          {[1, 2, 3, 4, 5].map(n => {
            const active = niveau === n;
            return (
              <TouchableOpacity
                key={n}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setNiveau(n)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{n}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>{isAr ? 'عدد الأسئلة' : 'Questions'}</Text>
        <View style={styles.chips}>
          {[5, 10, 15, 20].map(n => {
            const active = nbQuestions === n;
            return (
              <TouchableOpacity
                key={n}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setNbQuestions(n)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{n}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.primaryBtn, busy && styles.disabled]}
          onPress={handleCreate}
          disabled={busy}
        >
          <Text style={styles.primaryBtnText}>
            {busy ? '…' : isAr ? '⚔️ إنشاء المبارزة' : '⚔️ Créer le duel'}
          </Text>
        </TouchableOpacity>

        {/* Accept section */}
        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>
          {isAr ? '🤝 قبول تحدّي' : '🤝 Accepter un défi'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={isAr ? 'الصق رمز الدعوة' : 'Colle le code d’invitation'}
          placeholderTextColor={COLORS.textLight}
          value={tokenInput}
          onChangeText={setTokenInput}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={[styles.secondaryBtn, busy && styles.disabled]}
          onPress={handleAccept}
          disabled={busy}
        >
          <Text style={styles.secondaryBtnText}>
            {isAr ? 'الانضمام' : 'Rejoindre le duel'}
          </Text>
        </TouchableOpacity>
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
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  intro: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 16, lineHeight: 19 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  label: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, marginTop: 12, marginBottom: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18,
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  chipTextActive: { color: '#FFF' },
  primaryBtn: {
    backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 12,
    alignItems: 'center', marginTop: 20,
  },
  primaryBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  secondaryBtn: {
    backgroundColor: COLORS.gold, paddingVertical: 14, borderRadius: 12,
    alignItems: 'center', marginTop: 10,
  },
  secondaryBtnText: { color: '#1A1A1A', fontSize: 15, fontWeight: '700' },
  input: {
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12,
    fontSize: 13, color: COLORS.text,
  },
  disabled: { opacity: 0.5 },
  waitingBody: { flex: 1, alignItems: 'center', padding: 32, gap: 12 },
  waitingEmoji: { fontSize: 64, marginTop: 32 },
  waitingTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 8 },
  waitingHint: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 16 },
  tokenBox: {
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: COLORS.border, width: '100%', alignItems: 'center',
  },
  tokenLabel: { fontSize: 11, color: COLORS.textSecondary, marginBottom: 6 },
  token: { fontSize: 14, fontFamily: 'monospace', color: COLORS.primary, fontWeight: '700' },
  shareBtn: {
    backgroundColor: COLORS.primary, paddingVertical: 12, paddingHorizontal: 24,
    borderRadius: 10, marginTop: 8,
  },
  shareBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  goBtn: {
    backgroundColor: COLORS.gold, paddingVertical: 12, paddingHorizontal: 24,
    borderRadius: 10, marginTop: 8,
  },
  goBtnText: { color: '#1A1A1A', fontSize: 14, fontWeight: '700' },
});
