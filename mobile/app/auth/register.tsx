import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { COLORS } from '../../constants/colors';
import { MADHABS } from '../../constants/islamic';

export default function Register() {
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pays, setPays] = useState('');
  const [selectedMadhab, setSelectedMadhab] = useState('general');
  const { register, isLoading } = useAuthStore();

  const handleRegister = async () => {
    if (!pseudo.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    try {
      await register({ pseudo: pseudo.trim(), email: email.trim().toLowerCase(), password, madhab: selectedMadhab, pays: pays.trim() });
      router.replace('/(tabs)');
    } catch (err: unknown) {
      const e = err as any;
      const debug = `msg:${e?.message}\ncode:${e?.code}\nstatus:${e?.response?.status}\ndata:${JSON.stringify(e?.response?.data)}\nurl:${e?.config?.baseURL}${e?.config?.url}`;
      console.log('[register] error:', debug);
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        `Erreur lors de l'inscription.\n\n${debug}`;
      Alert.alert('Inscription échouée', message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.bismillah}>بِسْمِ اللَّهِ</Text>
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Rejoignez la communauté</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pseudo *</Text>
              <TextInput
                style={styles.input}
                value={pseudo}
                onChangeText={setPseudo}
                placeholder="Votre pseudo"
                placeholderTextColor={COLORS.textLight}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="votre@email.com"
                placeholderTextColor={COLORS.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mot de passe *</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Min. 6 caractères"
                placeholderTextColor={COLORS.textLight}
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pays</Text>
              <TextInput
                style={styles.input}
                value={pays}
                onChangeText={setPays}
                placeholder="France, Maroc, Algérie..."
                placeholderTextColor={COLORS.textLight}
              />
            </View>

            {/* Madhab Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Madhab (École juridique)</Text>
              <View style={styles.madhabGrid}>
                {MADHABS.map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    style={[styles.madhabButton, selectedMadhab === m.id && styles.madhabButtonActive]}
                    onPress={() => setSelectedMadhab(m.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.madhabText, selectedMadhab === m.id && styles.madhabTextActive]}>
                      {m.name}
                    </Text>
                    <Text style={[styles.madhabAr, selectedMadhab === m.id && styles.madhabTextActive]}>
                      {m.nameAr}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? 'Inscription...' : "S'inscrire"}
              </Text>
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Déjà un compte ? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginLink}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, padding: 24 },
  header: { alignItems: 'center', paddingVertical: 32 },
  bismillah: { fontSize: 20, color: COLORS.primary, marginBottom: 12, textAlign: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: COLORS.text, marginBottom: 6 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary },
  form: { flex: 1 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  madhabGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  madhabButton: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  madhabButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  madhabText: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  madhabAr: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  madhabTextActive: { color: '#FFFFFF' },
  registerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: { opacity: 0.6 },
  registerButtonText: { fontSize: 17, fontWeight: 'bold', color: '#FFFFFF' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginText: { fontSize: 15, color: COLORS.textSecondary },
  loginLink: { fontSize: 15, fontWeight: '600', color: COLORS.primary },
});
