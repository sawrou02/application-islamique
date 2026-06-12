import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  ActivityIndicator, Alert, Share,
} from 'react-native';
import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IslamicIcon } from '../../components/IslamicIcon';
import { COLORS } from '../../constants/colors';
import { halaqatApi } from '../../services/api';
import { getCurrentLang } from '../../i18n';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

interface Halaqa {
  id: string;
  nom: string;
  role: string;
  code_acces: string;
  nb_membres: number;
}

export default function HalaqatScreen() {
  const [halaqat, setHalaqat] = useState<Halaqa[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNom, setNewNom] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [busy, setBusy] = useState(false);
  const lang = getCurrentLang();
  const isAr = lang === 'ar';

  const load = async () => {
    try {
      const res = await halaqatApi.getMy();
      setHalaqat(res.data.data);
    } catch {
      // silencieux
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (newNom.trim().length < 2) {
      Alert.alert(isAr ? 'تنبيه' : 'Attention', isAr ? 'أدخل اسماً للحلقة.' : 'Donnez un nom à votre halaqa.');
      return;
    }
    setBusy(true);
    try {
      const res = await halaqatApi.create({ nom: newNom.trim() });
      setNewNom('');
      Alert.alert(isAr ? 'تم إنشاء الحلقة' : 'Halaqa créée', isAr ? `رمز الدخول: ${res.data.data.code_acces}` : `Code d'accès : ${res.data.data.code_acces}`);
      await load();
    } catch {
      Alert.alert(isAr ? 'خطأ' : 'Erreur', isAr ? 'تعذر الإنشاء.' : 'Création impossible.');
    } finally {
      setBusy(false);
    }
  };

  const handleJoin = async () => {
    if (joinCode.trim().length < 4) {
      Alert.alert(isAr ? 'تنبيه' : 'Attention', isAr ? 'أدخل رمز الدخول.' : "Entrez le code d'accès.");
      return;
    }
    setBusy(true);
    try {
      await halaqatApi.join(joinCode.trim());
      setJoinCode('');
      Alert.alert(isAr ? 'أهلاً بك' : 'Bienvenue', isAr ? 'انضممت إلى الحلقة.' : 'Vous avez rejoint la halaqa.');
      await load();
    } catch {
      Alert.alert(isAr ? 'خطأ' : 'Erreur', isAr ? 'الحلقة غير موجودة.' : 'Halaqa introuvable.');
    } finally {
      setBusy(false);
    }
  };

  const shareCode = (code: string, nom: string) => {
    Share.share({
      message: `Rejoins ma halaqa "${nom}" sur Quiz Islamique avec le code : ${code}`,
    }).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IslamicIcon name="back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isAr ? 'نمط الحلقات' : lang === 'en' ? 'Halaqat Mode' : 'Mode Halaqat'}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.introCard}>
          <Text style={styles.introIcon}>🕌</Text>
          <Text style={styles.introText}>
            {isAr
              ? 'حلقة دراسة إسلامية. يُنشئ المعلمون الحلقة ويلتحق بها الطلاب برمز الدخول للتعلم معاً.'
              : lang === 'en'
              ? 'Islamic study circle. Teachers create a halaqa, students join with a code to learn together.'
              : "Cercle d'étude islamique. Les enseignants créent une halaqa, les élèves la rejoignent avec un code pour apprendre ensemble."}
          </Text>
        </View>

        {/* Créer */}
        <Text style={styles.sectionTitle}>{isAr ? 'إنشاء حلقة (معلم)' : lang === 'en' ? 'Create a halaqa (teacher)' : 'Créer une halaqa (enseignant)'}</Text>
        <TextInput
          style={styles.input}
          placeholder={isAr ? 'اسم الحلقة' : 'Nom de la halaqa'}
          placeholderTextColor={COLORS.textLight}
          value={newNom}
          onChangeText={setNewNom}
          maxLength={150}
        />
        <TouchableOpacity style={[styles.btn, busy && styles.disabled]} onPress={handleCreate} disabled={busy}>
          <IslamicIcon name="add" size={16} color="#FFFFFF" />
          <Text style={styles.btnText}>{isAr ? 'إنشاء' : lang === 'en' ? 'Create' : 'Créer'}</Text>
        </TouchableOpacity>

        {/* Rejoindre */}
        <Text style={styles.sectionTitle}>{isAr ? 'الانضمام (طالب)' : lang === 'en' ? 'Join (student)' : 'Rejoindre (élève)'}</Text>
        <TextInput
          style={[styles.input, styles.codeInput]}
          placeholder="CODE"
          placeholderTextColor={COLORS.textLight}
          value={joinCode}
          onChangeText={(t) => setJoinCode(t.toUpperCase())}
          maxLength={6}
          autoCapitalize="characters"
        />
        <TouchableOpacity style={[styles.btn, styles.btnSecondary, busy && styles.disabled]} onPress={handleJoin} disabled={busy}>
          <IslamicIcon name="enter" size={18} color="#FFFFFF" />
          <Text style={styles.btnText}>{isAr ? 'انضمام' : lang === 'en' ? 'Join' : 'Rejoindre'}</Text>
        </TouchableOpacity>

        {/* Mes halaqat */}
        <Text style={styles.sectionTitle}>{isAr ? 'حلقاتي' : lang === 'en' ? 'My halaqat' : 'Mes halaqat'}</Text>
        {loading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : halaqat.length === 0 ? (
          <Text style={styles.empty}>{isAr ? 'لا توجد لديك أي حلقة بعد.' : lang === 'en' ? 'You have no halaqa yet.' : "Vous n'avez encore aucune halaqa."}</Text>
        ) : (
          halaqat.map((h) => (
            <View key={h.id} style={styles.halaqaCard}>
              <View style={styles.halaqaInfo}>
                <Text style={styles.halaqaNom}>{h.nom}</Text>
                <Text style={styles.halaqaMeta}>
                  {h.role === 'enseignant' ? '👨‍🏫 Enseignant' : '🧑‍🎓 Élève'} • {h.nb_membres} membre(s)
                </Text>
              </View>
              {h.role === 'enseignant' && (
                <View style={styles.enseignantActions}>
                  <TouchableOpacity style={styles.codeBadge} onPress={() => shareCode(h.code_acces, h.nom)}>
                    <Text style={styles.codeBadgeText}>{h.code_acces}</Text>
                    <IslamicIcon name="share" size={14} color={COLORS.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rapportBtn}
                    onPress={() => Linking.openURL(`${API_BASE_URL}/halaqat/${h.id}/rapport-pdf`)}
                  >
                    <Text style={styles.rapportBtnText}>📄 Rapport PDF</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.primary, padding: 16,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  scroll: { padding: 16, paddingBottom: 40 },
  introCard: {
    flexDirection: 'row', gap: 12, alignItems: 'center',
    backgroundColor: 'rgba(27,94,32,0.07)', borderRadius: 12, padding: 14, marginBottom: 20,
  },
  introIcon: { fontSize: 28 },
  introText: { flex: 1, fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginTop: 12, marginBottom: 8 },
  input: {
    backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1.5,
    borderColor: COLORS.border, padding: 14, fontSize: 15, color: COLORS.text, marginBottom: 8,
  },
  codeInput: { textAlign: 'center', letterSpacing: 4, fontWeight: 'bold', fontSize: 18 },
  btn: {
    backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 13,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 4,
  },
  btnSecondary: { backgroundColor: COLORS.primaryLight },
  btnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  disabled: { opacity: 0.6 },
  empty: { fontSize: 13, color: COLORS.textSecondary, fontStyle: 'italic' },
  halaqaCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: COLORS.border,
  },
  halaqaInfo: { flex: 1 },
  halaqaNom: { fontSize: 15, fontWeight: 'bold', color: COLORS.text },
  halaqaMeta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  codeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#F1F8E9', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6,
  },
  codeBadgeText: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary, letterSpacing: 2 },
  enseignantActions: { alignItems: 'flex-end', gap: 6 },
  rapportBtn: {
    backgroundColor: '#E8F5E9', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: COLORS.primary,
  },
  rapportBtnText: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
});
