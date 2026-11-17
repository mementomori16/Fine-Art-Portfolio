"use client";

import React, { useEffect, useState } from "react";
import "@/src/i18n";
import i18n from "@/src/i18n";

const LANG_KEY = "site-lang";
const SUPPORTED = ["en", "de", "fr"];

interface I18nProviderProps {
  children: React.ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const [isReady, setIsReady] = useState(i18n.isInitialized);

  useEffect(() => {
    if (i18n.isInitialized) {
      setIsReady(true);
    } else {
      const onInit = () => setIsReady(true);
      i18n.on("initialized", onInit);
      return () => i18n.off("initialized", onInit);
    }
  }, []);

  // Язык: ставится в <html lang>, запоминается после выбора и возвращается при следующем открытии
  useEffect(() => {
    const apply = (lng: string) => {
      document.documentElement.lang = (lng || "en").split("-")[0];
    };

    const onChanged = (lng: string) => {
      apply(lng);
      try {
        localStorage.setItem(LANG_KEY, lng);
      } catch {
        /* localStorage недоступен: язык просто не запоминается */
      }
    };

    // сначала подписка, потом восстановление: так сохранённый язык не пропадёт
    i18n.on("languageChanged", onChanged);

    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved && SUPPORTED.includes(saved) && saved !== i18n.language) {
        i18n.changeLanguage(saved);
      }
    } catch {
      /* не критично */
    }
    apply(i18n.language);

    return () => {
      i18n.off("languageChanged", onChanged);
    };
  }, []);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}