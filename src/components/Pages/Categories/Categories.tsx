"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { CATEGORY_COVERS } from "../../../../app/data/paintings";
import "./categories.scss";

const Categories: React.FC = () => {
  const { t } = useTranslation();
  const featuredCategories = CATEGORY_COVERS.slice(0, 4);

  return (
    <section className="home-categories-section">
      <header className="home-categories-header">
        <p className="home-categories-subtitle">
          {t("categories.subtitle", "Categories")}
        </p>
        <div className="home-categories-divider" />
      </header>

      <div className="home-categories-grid style-grid-three">
        {featuredCategories.map((category) => {
          return (
            <Link
              href={`/categories/${category.slug}`}
              key={category.id}
              className="home-category-card"
            >
              <div className="home-category-frame-wrap">
                <div className="home-category-glow" />
                <div className="home-category-spotlight" />

                <div className="home-category-gold-edge">
                  <div className="home-category-img-box">
                    <Image
                      src={category.cloudinaryId}
                      alt={t(category.titleKey, {
                        defaultValue: category.slug === "tempera" ? "Tempera" : "",
                      })}
                      fill
                      className="home-category-img"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                      priority
                    />
                  </div>
                </div>

                <div className="home-category-shadow" />
              </div>

              <div className="home-category-info">
                <h3 className="home-category-title">
                  {t(category.titleKey, {
                    defaultValue: category.slug === "tempera" ? "Tempera" : "",
                  })}
                </h3>
                <span className="home-category-meta">
                  {t("common.viewGallery", "View Gallery")}
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