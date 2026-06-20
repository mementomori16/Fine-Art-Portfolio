"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import "./page.scss";

export default function LegalPage() {
  const { t } = useTranslation("translation");

  return (
    <main className="legal-terms-page">
      <div className="about-ambient-glow" />
      <div className="content-container">
        <header className="section-header">
          <h1>{t("legal_info.title")}</h1>
        </header>

        <section className="bio-section">
          <h2>{t("legal_info.data_protection.title")}</h2>
          <p>{t("legal_info.data_protection.content")}</p>
        </section>

        <section className="bio-section">
          <h2>{t("legal_info.hosting.title")}</h2>
          <p>{t("legal_info.hosting.content")}</p>
        </section>

        <section className="bio-section">
          <h2>{t("legal_info.user_rights.title")}</h2>
          <p>{t("legal_info.user_rights.content")}</p>
        </section>
      </div>
    </main>
  );
}