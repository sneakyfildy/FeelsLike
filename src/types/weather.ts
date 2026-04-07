/**
 * A single daily weather entry, as perceived by the user.
 * The exact UI controls (mood icons, sliders, chips, etc.) are TBD —
 * this type will grow as features are defined.
 */
export const WEATHER_FEELINGS = [
  'cold',
  'cool',
  'comfortable',
  'warm',
  'hot',
] as const;

export type WeatherFeeling = (typeof WEATHER_FEELINGS)[number];

export interface WeatherEntry {
  /** ISO date string, e.g. "2026-04-07" — used as the unique key per day */
  date: string;

  /** Primary daily feeling selected on the Today screen, stored as a stable ID */
  feeling?: WeatherFeeling;

  /** Free-form note the user can attach to the day */
  note?: string;

  /** Unix timestamp (ms) when the entry was last saved */
  updatedAt: number;
}

/** Shape of the full storage object: a map from date string → entry */
export type WeatherStore = Record<string, WeatherEntry>;

