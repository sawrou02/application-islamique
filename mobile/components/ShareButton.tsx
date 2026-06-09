import { useRef } from 'react';
import { Animated, Share, StyleSheet, Text, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';

interface Props {
  message: string;
  url?: string;
  label?: string;
  style?: ViewStyle;
  compact?: boolean;
}

export function ShareButton({ message, url, label = 'Partager', style, compact = false }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateIn = () => {
    Animated.spring(scale, { toValue: 0.97, friction: 5, tension: 80, useNativeDriver: true }).start();
  };
  const animateOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: url ? `${message}\n\n${url}` : message,
      });
    } catch {}
  };

  if (compact) {
    return (
      <TouchableWithoutFeedback
        onPressIn={animateIn}
        onPressOut={animateOut}
        onPress={handleShare}
      >
        <Animated.View style={[styles.compact, { transform: [{ scale }] }, style]}>
          <Text style={styles.compactIcon}>⤴</Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <TouchableWithoutFeedback
      onPressIn={animateIn}
      onPressOut={animateOut}
      onPress={handleShare}
    >
      <Animated.View style={[styles.button, { transform: [{ scale }] }, style]}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>⤴</Text>
        </View>
        <Text style={styles.label}>{label}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1B5E20',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 16, color: '#1B5E20', fontWeight: '900', lineHeight: 18 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#FFD700' },
  compact: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,215,0,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactIcon: { fontSize: 14, color: '#B8860B', fontWeight: '900', lineHeight: 16 },
});

export default ShareButton;
