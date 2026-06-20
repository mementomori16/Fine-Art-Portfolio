"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { PAINTINGS } from "../../../data/paintings";
import ArtworkViewer from "../../../../src/components/ArtworkViewer/ArtworkViewer";
import ArtworkInfo from "../../../../src/components/ArtworkInfo/ArtworkInfo";
import SimilarProducts from "../../../../src/components/SimilarProducts/SimilarProducts";
import "./page.scss";

interface ImageData {
  url: string;
  title: string;
  date: string;
}

export default function ArtworkPage() {
  const { t } = useTranslation();
  const params = useParams();
  
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const category = Array.isArray(params.category) ? params.category[0] : params.category;

  const painting = PAINTINGS.find(
    (p) => p.id === slug && p.category === category
  );

  if (!painting) return <div>Artwork not found</div>;

  const titleTranslation = t(`artwork.items.${painting.id}.title`);
  const sizeTranslation = t(`artwork.items.${painting.id}.size`);

  const mainImage = painting.images?.large || painting.images?.medium || painting.images?.small || "";
  
  const collectedUrls: string[] = [mainImage];
  if (painting.thumbnail) {
    collectedUrls.push(painting.thumbnail);
  }

  const images: ImageData[] = collectedUrls.map((url) => ({
    url,
    title: titleTranslation,
    date: sizeTranslation,
  }));

  const optimizedPaintingData = {
    ...painting,
    allImages: images.map((img) => img.url),
    hasValidThumbnails: !!painting.thumbnail,
  };

  return (
  <main className="artwork-page">
    <div className="artwork-container">
      <div className="artwork-layout">
        <ArtworkViewer 
          painting={optimizedPaintingData} 
          currentImageIndex={currentImageIndex} 
        />
        <ArtworkInfo 
          painting={optimizedPaintingData} 
          currentImageIndex={currentImageIndex} 
          setCurrentImageIndex={setCurrentImageIndex} 
        />
      </div>
      
      {/* Similar Products added here, appearing below the viewer/info components */}
      <SimilarProducts currentPaintingId={painting.id} />
    </div>
  </main>
);
}
