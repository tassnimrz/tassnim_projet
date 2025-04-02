import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations from './translations'; // Import du fichier unique

i18n
  .use(initReactI18next)
  .init({
    resources: {
        en: { translation: translations.en },
        fr: { translation: translations.fr }
      }, // Utilisation du fichier unique
    lng: 'fr', // Langue par défaut
    fallbackLng: 'en', // Langue de secours
    interpolation: {
      escapeValue: false, // React protège déjà contre les injections
    },
  });

export default i18n;
