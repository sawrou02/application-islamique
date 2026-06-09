import { Tabs } from 'expo-router';
import { IslamicIcon } from '../../components/IslamicIcon';
import { COLORS } from '../../constants/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => (
            <IslamicIcon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: 'Quiz',
          tabBarIcon: ({ color, size }) => (
            <IslamicIcon name="quiz" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="multi"
        options={{
          title: 'Multi',
          tabBarIcon: ({ color, size }) => (
            <IslamicIcon name="multi" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="classement"
        options={{
          title: 'Classement',
          tabBarIcon: ({ color, size }) => (
            <IslamicIcon name="leaderboard" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <IslamicIcon name="profile" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
