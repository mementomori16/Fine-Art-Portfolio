"use client";

import React, { useEffect, useState } from "react";
import "@/src/i18n"; // Ensures the i18n engine initializes on the client side
import i18n from "@/src/i18n";

interface I18nProviderProps {
  children: React.ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait until i18next is fully initialized and loaded
    if (i18n.isInitialized) {
      setIsReady(true);
    } else {
      i18n.on("initialized", () => setIsReady(true));
    }
  }, []);

  // Prevent rendering raw keys during the initialization phase
  if (!isReady) {
    return null; 
  }

  return <>{children}</>;
}