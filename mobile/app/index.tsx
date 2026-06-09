import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router, useRootNavigationState } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { COLORS } from '../constants/colors';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const rootState = useRootNavigationState();

  useEffect(() => {
    if (!rootState?.key) return;
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [isAuthenticated, isLoading, rootState?.key]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.gold} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
