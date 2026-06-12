import { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { getCurrentLang } from '../i18n';

interface Props {
  visible: boolean;
}

export function OfflineBanner({ visible }: Props) {
  const translateY = useRef(new Animated.Value(-60)).current;
  const lang = getCurrentLang();

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : -60,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const label =
    lang === 'ar' ? 'وضع بدون اتصال — ستُحفظ النتائج عند العودة' :
    lang === 'en' ? 'Offline mode — results will sync when back online' :
    'Mode hors-ligne — résultats synchronisés au retour';

  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY }] }]}>
      <Text style={styles.text}>📵 {label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#B71C1C',
    paddingVertical: 10,
    paddingHorizontal: 16,
    zIndex: 999,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
});
