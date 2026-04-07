import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_STORAGE_KEY = '@feels_like:language';

export async function loadLanguagePreference(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch (error) {
    console.error('preferencesStorage.loadLanguagePreference error:', error);
    return null;
  }
}

export async function saveLanguagePreference(language: string): Promise<void> {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    console.error('preferencesStorage.saveLanguagePreference error:', error);
  }
}

