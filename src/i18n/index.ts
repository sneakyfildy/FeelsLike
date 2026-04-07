import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en';
import es from './locales/es';
import { loadLanguagePreference, saveLanguagePreference } from '../storage/preferencesStorage';

export const SUPPORTED_LANGUAGES = ['en', 'es'] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Maps every supported language to its explicit i18n translation key.
 * Use this instead of dynamic template literals like t(`languages.${code}`)
 * so static analysis can verify all keys exist.
 */
export const LANGUAGE_TRANSLATION_KEYS = {
  en: 'languages.en',
  es: 'languages.es',
} as const satisfies Record<AppLanguage, string>;

let initPromise: Promise<typeof i18n> | null = null;

function normalizeLanguage(value?: string | null): AppLanguage | null {
  if (!value) {
    return null;
  }

  const normalizedCode = value.toLowerCase().split('-')[0];

  if (SUPPORTED_LANGUAGES.includes(normalizedCode as AppLanguage)) {
    return normalizedCode as AppLanguage;
  }

  return null;
}

function resolveDeviceLanguage(): AppLanguage {
  const [locale] = getLocales();
  const normalizedCode = normalizeLanguage(
    locale?.languageCode ?? locale?.languageTag?.split('-')[0]
  );

  if (normalizedCode) {
    return normalizedCode;
  }

  return 'en';
}

export function getCurrentLanguage(): AppLanguage {
  return normalizeLanguage(i18n.resolvedLanguage ?? i18n.language) ?? 'en';
}

export function getCurrentLocaleTag(): string {
  const activeLanguage = getCurrentLanguage();
  const matchingLocale = getLocales().find((locale) => {
    const normalizedCode = normalizeLanguage(
      locale.languageCode ?? locale.languageTag?.split('-')[0]
    );
    return normalizedCode === activeLanguage;
  });

  return matchingLocale?.languageTag ?? (activeLanguage === 'es' ? 'es-ES' : 'en-US');
}

export function formatLocalizedDate(
  value: string | number | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString(getCurrentLocaleTag(), options);
}

export async function initializeI18n(): Promise<typeof i18n> {
  if (!initPromise) {
    initPromise = (async () => {
      if (!i18n.isInitialized) {
        await i18n.use(initReactI18next).init({
          compatibilityJSON: 'v4',
          resources: {
            en: { translation: en },
            es: { translation: es },
          },
          lng: resolveDeviceLanguage(),
          fallbackLng: 'en',
          supportedLngs: SUPPORTED_LANGUAGES,
          interpolation: {
            escapeValue: false,
          },
          react: {
            useSuspense: false,
          },
        });
      } else {
        // i18n singleton persists across Fast Refresh hot-reloads, but the
        // module is re-evaluated so initPromise resets to null and this block
        // runs again. addResourceBundle ensures any keys added to locale files
        // after the first initialization are picked up immediately without a
        // full reload.
        i18n.addResourceBundle('en', 'translation', en, true, true);
        i18n.addResourceBundle('es', 'translation', es, true, true);
      }

      const savedLanguage = normalizeLanguage(await loadLanguagePreference());

      if (savedLanguage && savedLanguage !== getCurrentLanguage()) {
        await i18n.changeLanguage(savedLanguage);
      }

      return i18n;
    })();
  }

  return initPromise;
}

export async function setAppLanguage(language: AppLanguage): Promise<void> {
  await initializeI18n();
  await i18n.changeLanguage(language);
  await saveLanguagePreference(language);
}

void initializeI18n();

export default i18n;

