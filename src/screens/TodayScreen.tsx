/**
 * TodayScreen.tsx
 *
 * The main screen — lets the user record how the weather felt today.
 * V1 keeps the interaction simple: choose one feeling, optionally add a note,
 * and save a single entry for today.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
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
import { FEELING_TRANSLATION_KEYS, WEATHER_FEELINGS, WeatherEntry, WeatherFeeling } from '../types/weather';
import { loadEntry, saveEntry, todayKey } from '../storage/weatherStorage';

/** How long the user must hold a feeling chip (ms) to trigger an auto-save */
const LONG_PRESS_DURATION = 1300;

// ---------------------------------------------------------------------------
// FeelingChip
// ---------------------------------------------------------------------------

interface FeelingChipProps {
  option: WeatherFeeling;
  isSelected: boolean;
  onSelect: (feeling: WeatherFeeling) => void;
  onSaveWithFeeling: (feeling: WeatherFeeling) => void;
}

function FeelingChip({ option, isSelected, onSelect, onSaveWithFeeling }: FeelingChipProps) {
  const { t } = useTranslation();
  const fillAnim = useRef(new Animated.Value(0)).current;
  const longPressTriggered = useRef(false);

  function handlePressIn() {
    longPressTriggered.current = false;
    fillAnim.stopAnimation();
    fillAnim.setValue(0);
    Animated.timing(fillAnim, {
      toValue: 1,
      duration: LONG_PRESS_DURATION,
      useNativeDriver: false,
    }).start(({ finished }) => {
      // Drive the action from animation completion — not from a separate timer.
      // finished = true  → user held long enough, animation ran to the end
      // finished = false → user released early, stopAnimation() was called
      if (finished) {
        longPressTriggered.current = true;
        onSelect(option);
        onSaveWithFeeling(option);
      }
    });
  }

  function handlePressOut() {
    // Stopping the animation triggers the start() callback with { finished: false },
    // which prevents the save action from firing.
    fillAnim.stopAnimation();
    Animated.timing(fillAnim, {
      toValue: 0,
      duration: longPressTriggered.current ? 350 : 120,
      useNativeDriver: false,
    }).start();
  }

  function handlePress() {
    // Skip regular select if the long-press action already fired.
    if (!longPressTriggered.current) {
      onSelect(option);
    }
  }

  const fillWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <TouchableOpacity
      style={[styles.feelingChip, isSelected && styles.feelingChipSelected]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.85}
    >
      {/* Animated green fill — only shown when chip is not already selected */}
      {!isSelected && (
        <Animated.View
          style={[styles.feelingChipFill, { width: fillWidth }]}
          pointerEvents="none"
        />
      )}
      <Text style={[styles.feelingChipText, isSelected && styles.feelingChipTextSelected]}>
        {t(FEELING_TRANSLATION_KEYS[option])}
      </Text>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// TodayScreen
// ---------------------------------------------------------------------------

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
  }

  /** Called by FeelingChip on long press — selects and immediately saves */
  async function handleSaveWithFeeling(selectedFeeling: WeatherFeeling) {
    setFeeling(selectedFeeling);
    const entry: WeatherEntry = {
      date,
      feeling: selectedFeeling,
      note,
      updatedAt: Date.now(),
    };
    await saveEntry(entry);
    setSaved(true);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
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

        <Text style={styles.label}>{t('today.feelingLabel')}</Text>
        <View style={styles.feelingsRow}>
          {WEATHER_FEELINGS.map((option) => (
            <FeelingChip
              key={option}
              option={option}
              isSelected={feeling === option}
              onSelect={(f) => { setFeeling(f); setSaved(false); }}
              onSaveWithFeeling={handleSaveWithFeeling}
            />
          ))}
        </View>
      </ScrollView>

      {/* Sticky bottom CTA — stays in thumb reach regardless of scroll position */}
      <View style={styles.stickyFooter}>
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
      </View>
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
    paddingBottom: 36,
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
    overflow: 'hidden',
    // Padding lives on feelingChipText, not here, so width:'100%' on the
    // absolute fill resolves to the full chip width rather than the content width.
  },
  feelingChipFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#d6f5e3',
  },
  feelingChipSelected: {
    backgroundColor: '#4a7fff',
    borderColor: '#4a7fff',
  },
  feelingChipText: {
    color: '#3f4f7b',
    fontWeight: '600',
    paddingHorizontal: 14,
    paddingVertical: 10,
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
  stickyFooter: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 20,
    backgroundColor: '#f5f8ff',
    borderTopWidth: 1,
    borderTopColor: '#e4eaff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -3 },
    elevation: 6,
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
