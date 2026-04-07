/**
 * HistoryScreen.tsx
 *
 * Shows a scrollable list of all past weather entries, newest first.
 */
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { formatLocalizedDate } from '../i18n';
import { FEELING_TRANSLATION_KEYS, WeatherEntry, WeatherStore } from '../types/weather';
import { loadAllEntries, deleteEntry } from '../storage/weatherStorage';

export default function HistoryScreen() {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<WeatherEntry[]>([]);

  // Reload entries every time the user navigates to this tab
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const all: WeatherStore = await loadAllEntries();
        const sorted = Object.values(all).sort((a, b) =>
          b.date.localeCompare(a.date)
        );
        setEntries(sorted);
      })();
    }, [])
  );

  function confirmDelete(date: string) {
    const formattedDate = formatLocalizedDate(new Date(date + 'T12:00:00'), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    Alert.alert(
      t('history.deleteTitle'),
      t('history.deleteMessage', { date: formattedDate }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            await deleteEntry(date);
            setEntries((prev) => prev.filter((e) => e.date !== date));
          },
        },
      ]
    );
  }

  if (entries.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>📅</Text>
        <Text style={styles.emptyText}>{t('history.emptyTitle')}</Text>
        <Text style={styles.emptySubtext}>
          {t('history.emptySubtitle')}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={entries}
      keyExtractor={(item) => item.date}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardDate}>
              {formatLocalizedDate(new Date(item.date + 'T12:00:00'), {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
            <TouchableOpacity onPress={() => confirmDelete(item.date)}>
              <Text style={styles.deleteBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.weatherIndicator}>
            {item.feeling
              ? t('history.feelingValue', { feeling: t(FEELING_TRANSLATION_KEYS[item.feeling]) })
              : t('history.feelingMissing')}
          </Text>

          {item.note ? (
            <Text style={styles.note}>{item.note}</Text>
          ) : (
            <Text style={styles.noNote}>{t('history.noNote')}</Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    backgroundColor: '#f5f8ff',
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f8ff',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  emptySubtext: {
    color: '#888',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  deleteBtn: {
    color: '#ccc',
    fontSize: 16,
    padding: 4,
  },
  weatherIndicator: {
    fontSize: 13,
    color: '#888',
    marginBottom: 6,
  },
  note: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  noNote: {
    fontSize: 14,
    color: '#bbb',
    fontStyle: 'italic',
  },
});

