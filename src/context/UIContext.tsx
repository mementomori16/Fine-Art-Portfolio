"use client";

import React, { createContext, useContext, useState } from "react";

interface UIContextType {
  isCurtainOpened: boolean;
  setCurtainOpened: (val: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCurtainOpened, setCurtainOpened] = useState(false);

  return (
    <UIContext.Provider value={{ isCurtainOpened, setCurtainOpened }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};