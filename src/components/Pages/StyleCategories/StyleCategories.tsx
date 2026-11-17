"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { STYLE_CATEGORIES } from "../../../../app/data/paintings";
import "./styleCategories.scss";

const slugToTitle = (slug: string) =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());

const StyleCategories: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="home-categories-section">
      <header className="home-categories-header">
        <p className="home-categories-subtitle">
          {String(t("styleCategories.subtitle", "Paintings by Genre"))}
        </p>
        <div className="home-categories-divider" />
      </header>

      <div className="home-categories-grid style-grid-three">
        {STYLE_CATEGORIES.map((item: any, index: number) => {
          const imageSrc = item.coverImage;
          if (!imageSrc) return null;

          // ключ жанра: из titleKey (или slug), без префиксов
          const rawKey = String(item.titleKey || item.slug || "")
            .replace(/^styleCategories\./, "")
            .replace(/^styles\./, "");

          // название берётся из выбранного языка; английский из данных только запасной вариант
          const translatedTitle = String(
            t(`styleCategories.${rawKey}`, {
              defaultValue: item.name || slugToTitle(String(item.slug || rawKey)),
            })
          ).trim();

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
                        <span>{String(t("styleCategories.comingSoon", "Coming Soon"))}</span>
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
                    ? String(t("styleCategories.inPreparation", "In Preparation"))
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