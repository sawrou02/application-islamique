import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');

// Islamic geometric pattern using pure View shapes
function GeometricPattern() {
  return (
    <View style={styles.patternContainer}>
      {Array.from({ length: 6 }).map((_, row) =>
        Array.from({ length: 5 }).map((__, col) => (
          <View
            key={`${row}-${col}`}
            style={[
              styles.diamond,
              {
                top: row * 60 - 10,
                left: col * 70 + (row % 2 === 0 ? 0 : 35),
                opacity: 0.08,
              },
            ]}
          />
        ))
      )}
    </View>
  );
}

export default function Onboarding() {
  return (
    <SafeAreaView style={styles.container}>
      <GeometricPattern />

      <View style={styles.content}>
        {/* Bismillah */}
        <Text style={styles.bismillah}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</Text>
        <View style={styles.divider} />

        {/* Crescent and star decoration */}
        <View style={styles.iconRow}>
          <Text style={styles.crescentIcon}>☽</Text>
          <Text style={styles.starIcon}>✦</Text>
          <Text style={styles.crescentIcon}>☽</Text>
        </View>

        {/* App name */}
        <Text style={styles.appName}>Quiz Islamique</Text>
        <Text style={styles.appNameAr}>الاختبار الإسلامي</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>Élevez votre savoir islamique</Text>
        <Text style={styles.taglineAr}>ارتقِ بعلمك الإسلامي</Text>

        {/* Ayah */}
        <View style={styles.ayahContainer}>
          <Text style={styles.ayahAr}>وَقُل رَّبِّ زِدْنِي عِلْمًا</Text>
          <Text style={styles.ayahFr}>"Dis : Seigneur, accrois ma science"</Text>
          <Text style={styles.ayahRef}>— Ta-Ha 20:114</Text>
        </View>

        {/* Start button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push('/auth/login')}
          activeOpacity={0.85}
        >
          <Text style={styles.startButtonText}>Commencer</Text>
          <Text style={styles.startButtonTextAr}>ابدأ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push('/auth/register')}
          activeOpacity={0.85}
        >
          <Text style={styles.registerButtonText}>Créer un compte</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  patternContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  diamond: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: COLORS.gold,
    transform: [{ rotate: '45deg' }],
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  bismillah: {
    fontSize: 22,
    color: COLORS.gold,
    textAlign: 'center',
    fontFamily: 'System',
    letterSpacing: 1,
  },
  divider: {
    width: 80,
    height: 2,
    backgroundColor: COLORS.gold,
    marginVertical: 16,
    opacity: 0.6,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  crescentIcon: {
    fontSize: 24,
    color: COLORS.gold,
  },
  starIcon: {
    fontSize: 16,
    color: COLORS.gold,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
  },
  appNameAr: {
    fontSize: 20,
    color: COLORS.gold,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  taglineAr: {
    fontSize: 14,
    color: 'rgba(255,215,0,0.7)',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 32,
  },
  ayahContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    width: '100%',
  },
  ayahAr: {
    fontSize: 22,
    color: COLORS.gold,
    textAlign: 'center',
    marginBottom: 8,
    writingDirection: 'rtl',
  },
  ayahFr: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  ayahRef: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 48,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryDark,
  },
  startButtonTextAr: {
    fontSize: 13,
    color: COLORS.primaryDark,
    marginTop: 2,
  },
  registerButton: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 48,
    width: '100%',
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
});
