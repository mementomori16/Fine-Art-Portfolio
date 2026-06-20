"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import "../legal/page.scss";

export default function TermsPage() {
  const { t } = useTranslation("translation");

  return (
    <main className="legal-terms-page">
      <div className="about-ambient-glow" />
      <div className="content-container">
        <header className="section-header">
          <h1>{t("terms_of_use.title")}</h1>
        </header>

        <section className="bio-section">
          <h2>{t("terms_of_use.intellectual_property.title")}</h2>
          <p>{t("terms_of_use.intellectual_property.content")}</p>
        </section>

        <section className="bio-section">
          <h2>{t("terms_of_use.no_unauthorized_use.title")}</h2>
          <p>{t("terms_of_use.no_unauthorized_use.content")}</p>
        </section>

        <section className="bio-section">
          <h2>{t("terms_of_use.liability.title")}</h2>
          <p>{t("terms_of_use.liability.content")}</p>
        </section>

        <section className="bio-section">
          <h2>{t("terms_of_use.governing_law.title")}</h2>
          <p>{t("terms_of_use.governing_law.content")}</p>
        </section>
      </div>
    </main>
  );
}