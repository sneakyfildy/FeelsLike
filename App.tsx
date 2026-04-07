/**
 * App.tsx — entry point
 *
 * Sets up a bottom-tab navigation with two tabs:
 *   • Today  — record today's perceived weather
 *   • History — browse past entries
 */
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

import LanguageSelector from './src/components/LanguageSelector';
import { initializeI18n } from './src/i18n';
import TodayScreen from './src/screens/TodayScreen';
import HistoryScreen from './src/screens/HistoryScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [isI18nReady, setIsI18nReady] = React.useState(false);
  const { t } = useTranslation();

  React.useEffect(() => {
    let isMounted = true;

    void initializeI18n().finally(() => {
      if (isMounted) {
        setIsI18nReady(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isI18nReady) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="auto" />
        <ActivityIndicator size="large" color="#4a7fff" />
      </View>
    );
  }

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
          headerRight: () => <LanguageSelector />,
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f8ff',
  },
});
