import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import frCommon from './locales/fr/common.json';
import enCommon from './locales/en/common.json';
import frLanding from './locales/fr/landing.json';
import enLanding from './locales/en/landing.json';
import frClubs from './locales/fr/clubs.json';
import enClubs from './locales/en/clubs.json';

i18n
  .use(LanguageDetector)       // Detect user's language automatically
  .use(initReactI18next)       // Connect i18next to React
  .init({
    resources: {
      fr: { common: frCommon, landing: frLanding, clubs: frClubs },  // French translations
      en: { common: enCommon, landing: enLanding, clubs: enClubs },
    },
    fallbackLng: 'fr',         // If a key is missing, show French
    defaultNS: 'common',       // Default namespace (so we don't write t('common:hello'))
    ns: ['common', 'landing', 'clubs'],  // Namespaces for different parts of the app
    interpolation: {
      escapeValue: false,      // React already escapes, no need for i18next to do it
    },
    detection: {
      order: ['localStorage', 'navigator'],  // Check saved preference first, then browser
      caches: ['localStorage'],              // Save user's choice in localStorage
    },
  });

export default i18n;