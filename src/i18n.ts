'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

// Initialize i18next only once
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../public/locales/${language}.json`)
      )
    )
    .init({
      fallbackLng: 'english', // matches public/locales/english.json
      lng: 'english',
      interpolation: {
        escapeValue: false, // React already safeguards against XSS
      },
    });
}

export default i18n;