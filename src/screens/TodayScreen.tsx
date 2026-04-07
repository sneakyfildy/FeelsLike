/**
 * TodayScreen.tsx
 *
 * The main screen — lets the user record how the weather felt today.
 * V1 keeps the interaction simple: choose one feeling, optionally add a note,
 * and save a single entry for today.
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { formatLocalizedDate } from '../i18n';
import { WEATHER_FEELINGS, WeatherEntry, WeatherFeeling } from '../types/weather';
import { loadEntry, saveEntry, todayKey } from '../storage/weatherStorage';

export default function TodayScreen() {
  const { t } = useTranslation();
  const date = todayKey();
  const [feeling, setFeeling] = useState<WeatherFeeling | null>(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  // Load any existing entry for today when the screen mounts
  useEffect(() => {
    (async () => {
      const existing = await loadEntry(date);
      if (existing) {
        setFeeling(existing.feeling ?? null);
        setNote(existing.note ?? '');
        setSaved(true);
      }
    })();
  }, [date]);

  async function handleSave() {
    if (!feeling) {
      Alert.alert(t('today.alerts.missingFeelingTitle'), t('today.alerts.missingFeelingMessage'));
      return;
    }

    const entry: WeatherEntry = {
      date,
      feeling,
      note,
      updatedAt: Date.now(),
    };
    await saveEntry(entry);
    setSaved(true);
    Alert.alert(t('today.alerts.savedTitle'), t('today.alerts.savedMessage'));
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.dateLabel}>
          {formatLocalizedDate(new Date(date + 'T12:00:00'), {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>{t('today.heroTitle')}</Text>
          <Text style={styles.heroSubtitle}>
            {t('today.heroSubtitle')}
          </Text>
        </View>

        <Text style={styles.label}>{t('today.feelingLabel')}</Text>
        <View style={styles.feelingsRow}>
          {WEATHER_FEELINGS.map((option) => {
            const isSelected = feeling === option;

            return (
              <TouchableOpacity
                key={option}
                style={[styles.feelingChip, isSelected && styles.feelingChipSelected]}
                onPress={() => {
                  setFeeling(option);
                  setSaved(false);
                }}
              >
                <Text
                  style={[styles.feelingChipText, isSelected && styles.feelingChipTextSelected]}
                >
                  {t(`feelings.${option}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>{t('today.noteLabel')}</Text>
        <TextInput
          style={styles.noteInput}
          multiline
          placeholder={t('today.notePlaceholder')}
          value={note}
          onChangeText={(text) => {
            setNote(text);
            setSaved(false);
          }}
        />

        <TouchableOpacity
          style={[
            styles.saveButton,
            !feeling && styles.saveButtonDisabled,
            saved && styles.saveButtonSaved,
          ]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>
            {saved ? t('today.saved') : t('today.save')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8ff',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  dateLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  heroCard: {
    backgroundColor: '#e8efff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#21315b',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#666',
    lineHeight: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  feelingsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  feelingChip: {
    backgroundColor: '#fff',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#ccd7f6',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  feelingChipSelected: {
    backgroundColor: '#4a7fff',
    borderColor: '#4a7fff',
  },
  feelingChipText: {
    color: '#3f4f7b',
    fontWeight: '600',
  },
  feelingChipTextSelected: {
    color: '#fff',
  },
  noteInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#4a7fff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonSaved: {
    backgroundColor: '#34c76f',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

