import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { registerForPushNotifications, setupNotificationHandlers } from '../services/notifications';
import { usersApi } from '../services/api';
import { loadLang, setLang, type Lang } from '../i18n';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useQuizStore } from '../store/quizStore';
import { OfflineBanner } from '../components/OfflineBanner';
import { QuranMiniPlayer } from '../components/QuranMiniPlayer';
import * as Notifications from 'expo-notifications';
import {
  loadPrayerPrefs, schedulePrayerNotifications,
  loadAdhkarPrefs, scheduleAdhkarNotifications,
} from '../services/notifications';

setupNotificationHandlers();

export default function RootLayout() {
  const { loadUser, isAuthenticated, isLoading, user } = useAuthStore();
  const isOnline = useNetworkStatus();
  const { syncPending } = useQuizStore();

  useEffect(() => {
    loadLang()
      .then(() => loadUser())
      .catch(() => {
        useAuthStore.setState({ isLoading: false, isAuthenticated: false });
      });
  }, []);

  useEffect(() => {
    if (user?.langue && (user.langue === 'fr' || user.langue === 'ar' || user.langue === 'en')) {
      setLang(user.langue as Lang);
    }
  }, [user?.langue]);

  useEffect(() => {
    if (isOnline) {
      syncPending().catch(() => {});
    }
  }, [isOnline]);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as any;
      if (!data) return;
      switch (data.type) {
        case 'daily': router.push('/quiz/setup/mode'); break;
        case 'streak': router.push('/quiz/setup/mode'); break;
        case 'duel': router.push('/(tabs)/multi'); break;
        case 'tournoi': router.push('/(tabs)/multi'); break;
        case 'badge': router.push('/(tabs)/profil'); break;
        case 'adhkar': router.push('/adhkar'); break;
      }
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.langue) {
      const lng = user.langue || 'fr';
      loadPrayerPrefs().then(p => schedulePrayerNotifications(p, lng).catch(() => {}));
      loadAdhkarPrefs().then(p => scheduleAdhkarNotifications(p, lng).catch(() => {}));
    }
  }, [isAuthenticated, user?.langue]);

  useEffect(() => {
    registerForPushNotifications().then((token) => {
      if (token) {
        usersApi.updateProfile({ fcm_token: token }).catch(() => {});
      }
    });
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else {
      router.replace('/onboarding');
    }
  }, [isLoading, isAuthenticated]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="#1B5E20" />
        <View style={{ flex: 1 }}>
          <QuranMiniPlayer />
          <OfflineBanner visible={!isOnline} />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="quiz" />
            <Stack.Screen name="multi" />
            <Stack.Screen name="evenement" />
            <Stack.Screen name="coran" />
            <Stack.Screen name="adhkar" />
            <Stack.Screen name="horaires" />
            <Stack.Screen name="qibla" />
            <Stack.Screen name="cgu" />
            <Stack.Screen name="stats" />
            <Stack.Screen name="search" />
            <Stack.Screen name="sahaba" />
          </Stack>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
