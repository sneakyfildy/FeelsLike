/**
 * App.tsx — entry point
 *
 * Sets up a bottom-tab navigation with two tabs:
 *   • Today  — record today's perceived weather
 *   • History — browse past entries
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

import './src/i18n';
import TodayScreen from './src/screens/TodayScreen';
import HistoryScreen from './src/screens/HistoryScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const { t } = useTranslation();

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#4a7fff' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
          tabBarActiveTintColor: '#4a7fff',
          tabBarInactiveTintColor: '#aaa',
        }}
      >
        <Tab.Screen
          name="Today"
          component={TodayScreen}
          options={{
            title: t('navigation.today'),
            tabBarLabel: t('navigation.today'),
            tabBarIcon: ({ color }) => (
              // Simple emoji icon — will be replaced with proper icons later
              <TabIcon emoji="☀️" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{
            title: t('navigation.weatherHistory'),
            tabBarLabel: t('navigation.history'),
            tabBarIcon: ({ color }) => (
              <TabIcon emoji="📅" color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

/** Temporary emoji tab icon — will be swapped for a real icon library later */
function TabIcon({ emoji, color }: { emoji: string; color: string }) {
  const { Text } = require('react-native');
  return <Text style={{ fontSize: 20, opacity: color === '#aaa' ? 0.4 : 1 }}>{emoji}</Text>;
}
