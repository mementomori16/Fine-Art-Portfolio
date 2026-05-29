'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import englishData from '../public/locales/english.json';

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          translation: englishData // Stores data inside the default 'translation' bucket
        }
      },
      lng: 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;