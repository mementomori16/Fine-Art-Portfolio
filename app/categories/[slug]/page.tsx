"use client";

import React, { useState, use } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { PAINTINGS, CATEGORY_COVERS } from '../../data/paintings';
import ViewGallery from '../../../src/components/ViewGallery/ViewGallery';
import './page.scss'; 

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

  const formattedImagesForModal = filteredPaintings.map((p) => {
    const baseKey = p.titleKey.replace('.title', ''); 
    const mediumKey = `${baseKey}.medium`;
    const sizeKey = `${baseKey}.size`;
    
    return {
      url: p.cloudinaryId,
      title: t(p.titleKey),
      date: `${t(mediumKey)} — ${t(sizeKey)}` 
    };
  });

  return (
    <main className="category-gallery-page">
      <div className="container">
        
        <header className="section-header">
          <h1 className="category-main-title">
            {t(currentCategory.titleKey)}
          </h1>
        </header>

        {/* Updated semantic layout wrapper class name identifier */}
        <div className="artwork-grid">
          {filteredPaintings.map((painting, index) => {
            const baseKey = painting.titleKey.replace('.title', '');
            const mediumKey = `${baseKey}.medium`;
            const sizeKey = `${baseKey}.size`;

            return (
              <div 
                key={painting.id} 
                className="artwork-card"
                onClick={() => setActiveImageIndex(index)} 
              >
                <div className="image-wrapper">
                  <Image
                    src={painting.cloudinaryId}
                    alt={t(painting.titleKey)}
                    fill
                    // Optimized viewport calculations target 33vw instead of 25vw max boundaries
                    sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 33vw"
                    className="gallery-img"
                  />
                </div>
                <div className="metadata-side">
                  <h3 className="artwork-title">{t(painting.titleKey)}</h3>
                  <span className="artwork-medium">{t(mediumKey)}</span>
                  <span className="artwork-size">{t(sizeKey)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPaintings.length === 0 && (
          <p className="empty-notice">No artwork added yet.</p>
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