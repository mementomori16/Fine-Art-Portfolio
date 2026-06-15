"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { CATEGORY_COVERS } from "../../../../app/data/paintings";
import "./categories.scss";

const Categories: React.FC = () => {
  const { t } = useTranslation();

  // Slice exactly the top 4 structural categories for the master showcase row
  const featuredCategories = CATEGORY_COVERS.slice(0, 4);

  return (
    <section className="categories-section">
      <header className="categories-header">
        <h2 className="categories-title">
          {t("categories.title", "Fine Art by Ilya Medvedev")}
        </h2>
        
        <div className="categories-line-divider" />

        <p className="categories-subtitle">
          {t("categories.subtitle", "Categories")}
        </p>
      </header>

      <div className="categories-museum-grid">
        {featuredCategories.map((category) => {
          return (
            <Link
              href={`/categories/${category.slug}`}
              key={category.id}
              className="category-museum-card"
            >
              {/* Aspect ratio is safely handled via global stylesheet variables to prevent TS errors */}
              <div className="category-frame-wrapper">
                
                {/* BACK GLOW (From WelcomeHero) */}
                <div className="category-ambient-glow" />

                {/* SPOTLIGHT BEAM (From WelcomeHero) */}
                <div className="category-spotlight-beam" />

                {/* CSS GENERATED LUXURY THIN GOLD FRAME */}
                <div className="category-luxury-edge">
                  <div className="category-canvas-container">
                    <Image
                      src={category.cloudinaryId}
                      alt={t(category.titleKey)}
                      fill
                      className="category-masterpiece-image"
                      sizes="(max-width: 600px) 90vw, (max-width: 1100px) 45vw, 320px"
                      priority
                    />
                  </div>
                </div>

                {/* SHADOW BASE (From WelcomeHero) */}
                <div className="category-floor-shadow" />
              </div>

              {/* UNIFIED DESIGN TYPOGRAPHY LABELS */}
              <div className="category-curatorial-details">
                <h3 className="category-artwork-title">
                  {t(category.titleKey)}
                </h3>
                <span className="category-curatorial-meta">
                  {t("common.viewGallery")}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Categories;