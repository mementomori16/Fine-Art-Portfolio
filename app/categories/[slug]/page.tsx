"use client";

import React, { use } from "react";
import { notFound } from "next/navigation";
import { useTranslation } from "react-i18next";

import { PAINTINGS, CATEGORY_COVERS } from "../../data/paintings";
import ArtworkCard from "../../../src/components/ArtworkCard/ArtworkCard";
import DrawingsSubgallery from "../../../src/components/DrawingsSubgallery/DrawingSubGallery";

import "./page.scss";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: PageProps) {
  const { t } = useTranslation();
  const { slug } = use(params);

  const currentCategory = CATEGORY_COVERS.find((c) => c.slug === slug);
  if (!currentCategory) notFound();

  const isDrawingsCategory = slug === "drawings";
  const categoryPaintings = PAINTINGS.filter((p) => p.category === slug && p.images);

  return (
    <main className="category-gallery-page">
      <div className="category-container">
        
        <header className="section-header">
          <h1 className="category-main-title">
            {t(currentCategory.titleKey)}
          </h1>
        </header>

        {isDrawingsCategory ? (
          <DrawingsSubgallery paintings={categoryPaintings} />
        ) : (
          <div className="artwork-grid">
            {categoryPaintings.map((painting, index) => (
              <ArtworkCard
                key={painting.id}
                id={painting.id}
                category={painting.category}
                image={painting.images.large} // Uses your original buildResponsiveImage large string
                title={t(painting.titleKey)}
                index={index} // Provided here to manage top row preloads
              />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}