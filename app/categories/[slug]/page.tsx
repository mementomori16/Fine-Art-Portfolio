"use client";

import React, { useState, use } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { PAINTINGS, CATEGORY_COVERS } from '../../data/paintings';
import ViewGallery from '../../../src/components/ViewGallery/ViewGallery'; // Adjust path to your ViewGallery file


interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: PageProps) {
  const { t } = useTranslation();
  const { slug } = use(params);

  const currentCategory = CATEGORY_COVERS.find((cat) => cat.slug === slug);
  if (!currentCategory) {
    notFound();
  }

  const filteredPaintings = PAINTINGS.filter((p) => p.category === slug);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const formattedImagesForModal = filteredPaintings.map((p) => ({
    url: p.cloudinaryId,
    title: t(p.titleKey),
    date: t(`${p.titleKey}_date`) || "" 
  }));

  return (
    <main className="category-gallery-page" style={{ padding: "4rem 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        <header style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 300 }}>{t(currentCategory.titleKey)}</h1>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
          {filteredPaintings.map((painting, index) => (
            <div 
              key={painting.id} 
              style={{ cursor: "pointer" }}
              onClick={() => setActiveImageIndex(index)} 
            >
              <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
                <Image
                  src={painting.cloudinaryId}
                  alt={t(painting.titleKey)}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ padding: "1rem 0" }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 400 }}>{t(painting.titleKey)}</h3>
              </div>
            </div>
          ))}
        </div>

        {filteredPaintings.length === 0 && (
          <p style={{ textAlign: "center", color: "#666" }}>No artwork added yet.</p>
        )}
      </div>

      {activeImageIndex !== null && (
        <ViewGallery
          images={formattedImagesForModal}
          currentImageId={activeImageIndex}
          onClose={() => setActiveImageIndex(null)}
        />
      )}
    </main>
  );
}