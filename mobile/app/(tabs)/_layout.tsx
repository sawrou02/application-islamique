import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { COLORS } from '../../constants/colors';
import { t } from '../../i18n';

function TabIcon({ symbol, color }: { symbol: string; color: string }) {
  return (
    <Text style={{ fontSize: 22, color, lineHeight: 26 }}>{symbol}</Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: 'rgba(0,0,0,0.08)',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('accueil'),
          tabBarIcon: ({ color }) => <TabIcon symbol="۞" color={color} />,
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: t('quiz'),
          tabBarIcon: ({ color }) => <TabIcon symbol="❋" color={color} />,
        }}
      />
      <Tabs.Screen
        name="multi"
        options={{
          title: t('multi'),
          tabBarIcon: ({ color }) => <TabIcon symbol="✦" color={color} />,
        }}
      />
      <Tabs.Screen
        name="ressources"
        options={{
          title: 'Ressources',
          tabBarIcon: ({ color }) => <TabIcon symbol="📚" color={color} />,
        }}
      />
      <Tabs.Screen
        name="classement"
        options={{
          title: t('classement'),
          tabBarIcon: ({ color }) => <TabIcon symbol="★" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: t('profil'),
          tabBarIcon: ({ color }) => <TabIcon symbol="◈" color={color} />,
        }}
      />
    </Tabs>
  );
}
