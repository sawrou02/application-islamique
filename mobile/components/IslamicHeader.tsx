import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS } from '../constants/colors';

interface Props {
  title: string;
  titleAr?: string;
  showBack?: boolean;
  rightAction?: { icon: string; onPress: () => void };
}

export default function IslamicHeader({ title, titleAr, showBack = false, rightAction }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        {!showBack && <View style={styles.bismillahContainer}>
          <Text style={styles.bismillah}>☽</Text>
        </View>}
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {titleAr && <Text style={styles.titleAr}>{titleAr}</Text>}
      </View>

      <View style={styles.rightSection}>
        {rightAction ? (
          <TouchableOpacity onPress={rightAction.onPress} style={styles.rightButton}>
            <Ionicons name={rightAction.icon as 'settings'} size={22} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  leftSection: { width: 40 },
  bismillahContainer: { alignItems: 'center' },
  bismillah: { fontSize: 20, color: COLORS.gold },
  backButton: { padding: 2 },
  titleContainer: { flex: 1, alignItems: 'center' },
  title: { fontSize: 17, fontWeight: 'bold', color: '#FFFFFF' },
  titleAr: { fontSize: 12, color: COLORS.gold, marginTop: 1 },
  rightSection: { width: 40, alignItems: 'flex-end' },
  rightButton: { padding: 2 },
  placeholder: {},
});
