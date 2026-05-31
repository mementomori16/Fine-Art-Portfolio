"use client";

import React, { use } from "react";
import { notFound } from "next/navigation";
import { useTranslation } from "react-i18next";
import { PAINTINGS, CATEGORY_COVERS } from "../../data/paintings";
import ArtworkCard from "../../../src/components/ArtworkCard/ArtworkCard";
import "./page.scss";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: PageProps) {
  const { t } = useTranslation();
  const { slug } = use(params);

  const currentCategory = CATEGORY_COVERS.find((c) => c.slug === slug);
  if (!currentCategory) notFound();

  const filteredPaintings = PAINTINGS.filter(
    (p) => p.category === slug
  ).filter((p) => {
    if (!p.images) {
      console.warn("Missing images:", p.id);
      return false;
    }
    return true;
  });

  return (
    <main className="category-gallery-page">
      {/* ✅ IMPORTANT: no global .container */}
      <div className="category-container">

        <header className="section-header">
          <h1 className="category-main-title">
            {t(currentCategory.titleKey)}
          </h1>
        </header>

        <div className="artwork-grid">
          {filteredPaintings.map((painting) => (
            <ArtworkCard
              key={painting.id}
              id={painting.id}
              slug={painting.slug}
              category={painting.category}
              image={painting.images.large}
              title={t(painting.titleKey)}
              medium=""
              size=""
            />
          ))}
        </div>

      </div>
    </main>
  );
}