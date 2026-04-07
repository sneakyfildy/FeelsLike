/**
 * weatherStorage.ts
 *
 * Thin wrapper around AsyncStorage for reading/writing weather entries.
 * All data is stored under a single key as a JSON object.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WEATHER_FEELINGS, WeatherEntry, WeatherFeeling, WeatherStore } from '../types/weather';

const STORAGE_KEY = '@feels_like:entries';

const LEGACY_FEELING_MAP: Record<string, WeatherFeeling> = {
  Cold: 'cold',
  Cool: 'cool',
  Comfortable: 'comfortable',
  Warm: 'warm',
  Hot: 'hot',
};

function normalizeFeeling(feeling: unknown): WeatherFeeling | undefined {
  if (typeof feeling !== 'string') {
    return undefined;
  }

  if (WEATHER_FEELINGS.includes(feeling as WeatherFeeling)) {
    return feeling as WeatherFeeling;
  }

  return LEGACY_FEELING_MAP[feeling];
}

function normalizeEntry(entry: WeatherEntry): WeatherEntry {
  return {
    ...entry,
    feeling: normalizeFeeling(entry.feeling),
  };
}

/** Load all entries from storage. Returns an empty object if nothing saved yet. */
export async function loadAllEntries(): Promise<WeatherStore> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as WeatherStore;
    let didNormalize = false;

    const normalizedEntries = Object.fromEntries(
      Object.entries(parsed).map(([date, entry]) => {
        const normalizedEntry = normalizeEntry(entry);

        if (normalizedEntry.feeling !== entry.feeling) {
          didNormalize = true;
        }

        return [date, normalizedEntry];
      })
    ) as WeatherStore;

    if (didNormalize) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedEntries));
    }

    return normalizedEntries;
  } catch (e) {
    console.error('weatherStorage.loadAllEntries error:', e);
    return {};
  }
}

/** Save (create or overwrite) a single entry for the given date. */
export async function saveEntry(entry: WeatherEntry): Promise<void> {
  try {
    const all = await loadAllEntries();
    all[entry.date] = normalizeEntry(entry);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('weatherStorage.saveEntry error:', e);
  }
}

/** Load a single entry by date string (e.g. "2026-04-07"). Returns null if not found. */
export async function loadEntry(date: string): Promise<WeatherEntry | null> {
  const all = await loadAllEntries();
  return all[date] ?? null;
}

/** Delete a single entry by date. */
export async function deleteEntry(date: string): Promise<void> {
  try {
    const all = await loadAllEntries();
    delete all[date];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('weatherStorage.deleteEntry error:', e);
  }
}

/** Helper: return today's date as an ISO string (YYYY-MM-DD). */
export function todayKey(): string {
  return new Date().toISOString().split('T')[0];
}

