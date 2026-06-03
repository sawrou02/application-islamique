import { View, Text, StyleSheet } from 'react-native';
import { UserLevel } from '../types';
import { LEVELS } from '../constants/islamic';

interface Props {
  niveau: UserLevel;
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
}

export default function LevelBadge({ niveau, size = 'medium', showName = true }: Props) {
  const level = LEVELS.find(l => l.id === niveau) || LEVELS[0];
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  return (
    <View style={[
      styles.container,
      { backgroundColor: level.color },
      isSmall && styles.containerSmall,
      isLarge && styles.containerLarge,
    ]}>
      <Text style={[styles.arabicText, isSmall && styles.arabicTextSmall, isLarge && styles.arabicTextLarge]}>
        {level.nameAr}
      </Text>
      {showName && (
        <Text style={[styles.nameText, isSmall && styles.nameTextSmall]}>
          {level.name}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  containerSmall: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  containerLarge: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  arabicText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  arabicTextSmall: { fontSize: 11 },
  arabicTextLarge: { fontSize: 18 },
  nameText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 1,
  },
  nameTextSmall: { fontSize: 9 },
});
