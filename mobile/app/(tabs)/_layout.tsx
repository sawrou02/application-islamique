import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { t } from '../../i18n';

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
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home-variant" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: t('quiz'),
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="head-question-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="multi"
        options={{
          title: t('multi'),
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-group" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ressources"
        options={{
          title: 'Ressources',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="bookshelf" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="classement"
        options={{
          title: t('classement'),
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="trophy" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: t('profil'),
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-circle" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
