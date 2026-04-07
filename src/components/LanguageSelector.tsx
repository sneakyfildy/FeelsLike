import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppLanguage, LANGUAGE_TRANSLATION_KEYS, SUPPORTED_LANGUAGES, getCurrentLanguage, setAppLanguage } from '../i18n';

export default function LanguageSelector() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const currentLanguage = getCurrentLanguage();

  async function handleSelect(language: AppLanguage) {
	setIsOpen(false);

	if (language !== currentLanguage) {
	  await setAppLanguage(language);
	}
  }

  return (
	<>
	  <TouchableOpacity
		accessibilityRole="button"
		accessibilityLabel={t('languageSelector.buttonLabel')}
		style={styles.trigger}
		onPress={() => setIsOpen(true)}
	  >
		<Text style={styles.triggerText}>{currentLanguage.toUpperCase()} ▾</Text>
	  </TouchableOpacity>

	  <Modal transparent visible={isOpen} animationType="fade" onRequestClose={() => setIsOpen(false)}>
		<Pressable style={styles.backdrop} onPress={() => setIsOpen(false)}>
		  <View style={styles.menuCard}>
			<Text style={styles.menuTitle}>{t('languageSelector.title')}</Text>

			{SUPPORTED_LANGUAGES.map((language) => {
			  const isSelected = language === currentLanguage;

			  return (
				<TouchableOpacity
				  key={language}
				  style={[styles.option, isSelected && styles.optionSelected]}
				  onPress={() => void handleSelect(language)}
				>
				  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {t(LANGUAGE_TRANSLATION_KEYS[language])}
				  </Text>
				  {isSelected ? <Text style={styles.checkmark}>✓</Text> : null}
				</TouchableOpacity>
			  );
			})}
		  </View>
		</Pressable>
	  </Modal>
	</>
  );
}

const styles = StyleSheet.create({
  trigger: {
	marginRight: 12,
	paddingHorizontal: 10,
	paddingVertical: 6,
	borderRadius: 999,
	backgroundColor: 'rgba(255,255,255,0.18)',
  },
  triggerText: {
	color: '#fff',
	fontWeight: '700',
	fontSize: 12,
	letterSpacing: 0.4,
  },
  backdrop: {
	flex: 1,
	backgroundColor: 'rgba(0,0,0,0.18)',
	justifyContent: 'flex-start',
	alignItems: 'flex-end',
	paddingTop: 88,
	paddingHorizontal: 12,
  },
  menuCard: {
	width: 180,
	backgroundColor: '#fff',
	borderRadius: 14,
	padding: 12,
	shadowColor: '#000',
	shadowOpacity: 0.16,
	shadowRadius: 12,
	shadowOffset: { width: 0, height: 8 },
	elevation: 8,
  },
  menuTitle: {
	fontSize: 13,
	fontWeight: '700',
	color: '#415177',
	marginBottom: 8,
  },
  option: {
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'space-between',
	borderRadius: 10,
	paddingHorizontal: 12,
	paddingVertical: 10,
  },
  optionSelected: {
	backgroundColor: '#edf3ff',
  },
  optionText: {
	color: '#33415f',
	fontSize: 14,
	fontWeight: '600',
  },
  optionTextSelected: {
	color: '#2f66f2',
  },
  checkmark: {
	color: '#2f66f2',
	fontWeight: '700',
  },
});

