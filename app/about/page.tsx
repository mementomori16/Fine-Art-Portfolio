"use client";

import React, { use } from "react";
import { useTranslation, Trans } from "react-i18next";
import "./page.scss";

interface PageProps {
  params?: Promise<{ slug?: string }>;
}

export default function AboutPage({ params }: PageProps) {
  const { t } = useTranslation("translation");

  if (params) {
    const _unwrappedParams = use(params);
  }

  const profileImageSrc = "https://res.cloudinary.com/dpayqcrg5/image/upload/v1779781725/detal-2021-ph2026_eu8ac6.jpg";
  const secondaryImage1Src = "https://res.cloudinary.com/dpayqcrg5/image/upload/v1769855744/Ily500kb_yvswlt.jpg"; 

  const exhibitionsList = t("about.exhibitionsList", { returnObjects: true });
  const exhibitions = Array.isArray(exhibitionsList) ? exhibitionsList : [];

  return (
    <main className="about-page">
      <div className="about-ambient-glow" />

      <div className="about-editorial-grid">
        
        <header className="grid-full-width section-header">
          <h1 className="category-main-title">{t("about.title")}</h1>
        </header>

        <div className="grid-item main-lead-block">
          <p className="lead-paragraph">{t("about.bioParagraph")}</p>
        </div>

        <div className="grid-item primary-portrait-block">
          <div className="image-wrapper">
            <img src={profileImageSrc} alt="Primary Portrait" loading="eager" />
          </div>
        </div>

        <div className="grid-item bio-text-block-one">
          <section className="bio-section">
            <h2>{t("about.section1Title")}</h2>
            <p>{t("about.section1Text1")}</p>
            <p>{t("about.section1Text2")}</p>
          </section>
          
          <section className="bio-section">
            <h2>{t("about.section2Title")}</h2>
            <p>{t("about.section2Text")}</p>
          </section>
        </div>

        <div className="grid-item secondary-image-block-one">
          <div className="image-wrapper">
            <img src={secondaryImage1Src} alt="Studio Detailed View" loading="lazy" />
          </div>
        </div>

        <div className="grid-item bio-text-block-two">
          <section className="bio-section">
            <h2>{t("about.section3Title")}</h2>
            <p>{t("about.section3Text")}</p>
          </section>

          <section className="bio-section">
            <h2>{t("about.section4Title")}</h2>
            <p>{t("about.section4Text1")}</p>
            <p>{t("about.section4Text2")}</p>
            <p>{t("about.section4Text3")}</p>
            <p>
              <Trans
                i18nKey="about.section4Text4"
                defaults='Alongside a prolific studio archive of over one thousand professional works, Medvedev channels this technical and academic heritage into an intensive private educational project, <a href="https://profineart.ch" target="_blank" rel="noopener noreferrer">Profineart Studio Basel</a>, providing specialized fine art mentorship across the Basel region.'
                components={{
                  a: <a className="inline-text-link" />
                }}
              />
            </p>
          </section>
        </div>

        {/* Exhibitions Block with integrated Artfacts Reference Link */}
        <div className="grid-item exhibitions-block">
          <hr className="grid-separator" />
          <section className="bio-section exhibitions-section">
            
            <div className="exhibitions-header-group">
              <h2>{t("about.exhibitionsTitle")}</h2>
              <a 
                href="https://artfacts.net/artist/ilya-medvedev-1981-ch" 
                target="_blank" 
                rel="noopener noreferrer"
                className="artfacts-external-link"
              >
                {t("about.viewOnArtfacts", "Complete Registry on Artfacts")} ↗
              </a>
            </div>

            <div className="exhibitions-list">
              {exhibitions.map((item: any, index: number) => (
                <div key={index} className="exhibition-item">
                  <span className="exhibition-year">{item.year}</span>
                  <div className="exhibition-info">
                    <span className="exhibition-title">{item.title}</span>
                    <span className="exhibition-location">{item.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>
    </main>
  );
}