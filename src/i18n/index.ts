import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en';
import es from './locales/es';

const SUPPORTED_LANGUAGES = ['en', 'es'] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

function resolveDeviceLanguage(): SupportedLanguage {
  const [locale] = getLocales();
  const languageCode = locale?.languageCode?.toLowerCase();
  const normalizedCode = languageCode ?? locale?.languageTag?.split('-')[0]?.toLowerCase();

  if (normalizedCode && SUPPORTED_LANGUAGES.includes(normalizedCode as SupportedLanguage)) {
    return normalizedCode as SupportedLanguage;
  }

  return 'en';
}

export function getCurrentLocaleTag(): string {
  const activeLanguage = (i18n.resolvedLanguage ?? i18n.language ?? 'en').toLowerCase();
  const matchingLocale = getLocales().find((locale) => {
    const languageCode = locale.languageCode?.toLowerCase();
    const normalizedCode = languageCode ?? locale.languageTag?.split('-')[0]?.toLowerCase();
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

void i18n.use(initReactI18next).init({
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

export default i18n;

