import { View, Text, StyleSheet } from 'react-native';
import { Badge } from '../types';
import { COLORS } from '../constants/colors';

interface Props {
  badge: Badge;
  size?: 'small' | 'medium' | 'large';
  showDescription?: boolean;
}

export default function BadgeCard({ badge, size = 'medium', showDescription = false }: Props) {
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  return (
    <View style={[styles.container, isSmall && styles.containerSmall, isLarge && styles.containerLarge]}>
      <Text style={[styles.icon, isSmall && styles.iconSmall, isLarge && styles.iconLarge]}>
        {badge.icone || '🏅'}
      </Text>
      <Text style={[styles.name, isSmall && styles.nameSmall]} numberOfLines={2}>
        {badge.nom}
      </Text>
      {badge.nom_ar && !isSmall && (
        <Text style={styles.nameAr}>{badge.nom_ar}</Text>
      )}
      {showDescription && badge.description && (
        <Text style={styles.description} numberOfLines={3}>{badge.description}</Text>
      )}
      {badge.date_obtention && !isSmall && (
        <Text style={styles.date}>
          {new Date(badge.date_obtention).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    width: 100,
  },
  containerSmall: {
    width: 72,
    padding: 10,
    borderRadius: 10,
  },
  containerLarge: {
    width: 140,
    padding: 20,
  },
  icon: {
    fontSize: 32,
    marginBottom: 6,
  },
  iconSmall: {
    fontSize: 24,
    marginBottom: 4,
  },
  iconLarge: {
    fontSize: 44,
    marginBottom: 10,
  },
  name: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  nameSmall: {
    fontSize: 10,
  },
  nameAr: {
    fontSize: 11,
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 2,
  },
  description: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 16,
  },
  date: {
    fontSize: 10,
    color: COLORS.textLight,
    marginTop: 6,
  },
});
