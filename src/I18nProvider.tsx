"use client";

import React, { useEffect, useState } from "react";
import "@/src/i18n";
import i18n from "@/src/i18n";

interface I18nProviderProps {
  children: React.ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (i18n.isInitialized) {
      setIsReady(true);
    } else {
      i18n.on("initialized", () => setIsReady(true));
    }
  }, []);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}