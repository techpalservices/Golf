import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import frCommon from './locales/fr/common.json';
import enCommon from './locales/en/common.json';

i18n
  .use(LanguageDetector)       // Detect user's language automatically
  .use(initReactI18next)       // Connect i18next to React
  .init({
    resources: {
      fr: { common: frCommon },
      en: { common: enCommon },
    },
    fallbackLng: 'fr',         // If a key is missing, show French
    defaultNS: 'common',       // Default namespace (so we don't write t('common:hello'))
    interpolation: {
      escapeValue: false,      // React already escapes, no need for i18next to do it
    },
    detection: {
      order: ['localStorage', 'navigator'],  // Check saved preference first, then browser
      caches: ['localStorage'],              // Save user's choice in localStorage
    },
  });

export default i18n;