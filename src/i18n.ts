'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import englishData from '../public/locales/english.json';
import germanData from '../public/locales/german.json';
import frenchData from '../public/locales/french.json';

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          translation: englishData,
        },
        de: {
          translation: germanData,
        },
        fr: {
          translation: frenchData,
        },
      },
      lng: 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;