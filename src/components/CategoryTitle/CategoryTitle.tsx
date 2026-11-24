"use client";

import React from "react";
import { useTranslation } from "react-i18next";

interface CategoryTitleProps {
  i18nKey: string;
  fallbackTitle: string;
}

export default function CategoryTitle({ i18nKey, fallbackTitle }: CategoryTitleProps) {
  const { t } = useTranslation();

  const rawTranslated = t(i18nKey, { defaultValue: fallbackTitle });
  const text =
    typeof rawTranslated === "string" &&
    rawTranslated.trim().length > 0 &&
    !rawTranslated.startsWith("categories.") &&
    !rawTranslated.startsWith("styleCategories.")
      ? rawTranslated.trim()
      : fallbackTitle.trim();

  return (
    <header className="section-header">
      <h1 className="category-main-title">{text}</h1>
    </header>
  );
}