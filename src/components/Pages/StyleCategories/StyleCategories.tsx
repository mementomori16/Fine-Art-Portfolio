"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { STYLE_CATEGORIES } from "../../../../app/data/paintings";
import englishData from "../../../../public/locales/english.json";
import "./styleCategories.scss";

const StyleCategories: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="home-categories-section">
      <header className="home-categories-header">
        <p className="home-categories-subtitle">
          {String((englishData as any)?.styleCategories?.subtitle || "Paintings by Categories")}
        </p>
        <div className="home-categories-divider" />
      </header>

      <div className="home-categories-grid style-grid-three">
        {STYLE_CATEGORIES.map((item: any, index: number) => {
          const imageSrc = item.coverImage;
          if (!imageSrc) return null;

          const rawKey = String(item.titleKey || item.slug || "")
            .replace(/^styleCategories\./, "")
            .replace(/^styles\./, "");

          let titleValue: any = (englishData as any)?.styleCategories?.[rawKey] || item.name;

          if (!titleValue) {
            const fallback = item.slug === "landscape-still-life" 
              ? "Landscape & Still Life" 
              : item.slug === "memento-mori" 
                ? "Memento Mori & Mortality" 
                : item.slug === "heritage-antiques"
                  ? "Heritage & Antiques"
                  : item.slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
            
            titleValue = t(item.titleKey, fallback);
          }

          const translatedTitle = String(titleValue);
          const href = item.isUpcoming ? "#" : `/stylecategories/${item.slug}`;

          return (
            <Link
              href={href}
              key={item.id || index}
              className={`home-category-card ${item.isUpcoming ? "is-upcoming" : ""}`}
            >
              <div className="home-category-frame-wrap">
                <div className="home-category-glow" />
                <div className="home-category-spotlight" />

                <div className="home-category-gold-edge">
                  <div className="home-category-img-box">
                    <Image
                      src={imageSrc}
                      alt={translatedTitle}
                      fill
                      className="home-category-img"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                      priority={index < 3}
                    />
                    {item.isUpcoming && (
                      <div className="home-upcoming-badge">
                        <span>{String((englishData as any)?.styleCategories?.comingSoon || "Coming Soon")}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="home-category-shadow" />
              </div>

              <div className="home-category-info">
                <h3 className="home-category-title">{translatedTitle}</h3>
                <span className="home-category-meta">
                  {item.isUpcoming
                    ? String((englishData as any)?.styleCategories?.inPreparation || "In Preparation")
                    : String(t("common.viewGallery", "View Gallery"))}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default StyleCategories;