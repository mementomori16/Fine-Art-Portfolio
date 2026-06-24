"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ViewGallery from "../ViewGallery/ViewGallery";
import "./artworkViewer.scss";

interface PaintingData {
  id: string;
  category: string;
  images?: {
    small?: string;
    medium?: string;
    large?: string;
  };
  thumbnail?: string;
  thumbnail2?: string;
  thumbnail3?: string;
}

interface ArtworkViewerProps {
  painting?: PaintingData;
  currentImageIndex: number;
  onBackAction?: () => void;
}

export default function ArtworkViewer({ painting, currentImageIndex, onBackAction }: ArtworkViewerProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);

  if (!painting) {
    return (
      <div className="viewer">
        <div className="main-image-exhibit-container">
          <div className="viewer-fallback-placeholder" />
        </div>
      </div>
    );
  }

  // Standardized list of all available images
  const galleryArray = [
    painting.images?.large,
    painting.thumbnail,
    painting.thumbnail2,
    painting.thumbnail3
  ].filter((url): url is string => !!url);

  const activeImageSrc = galleryArray[currentImageIndex] || galleryArray[0] || "";

  const galleryImagesFormatted = galleryArray.map((url) => ({
    url,
    title: t(`artwork.${painting.id}.title`),
    date: t(`artwork.${painting.id}.size`),
    thumbnail: url
  }));

  const handleBackClick = () => {
    if (onBackAction) {
      onBackAction();
    } else if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  const handleScrollToSimilar = () => {
    document.getElementById("similar-works-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="viewer">
      <div className="main-image-exhibit-container">
        <div className="viewer-ambient-glow" />
        <div className="viewer-spotlight-beam" />
        
        <div className="viewer-luxury-edge" onClick={() => setOpen(true)}>
          <div className="viewer-canvas-container">
            {activeImageSrc ? (
              <img
                src={activeImageSrc}
                alt={t(`artwork.items.${painting.id}.title`)}
                className="viewer-masterpiece-image"
                loading="eager"
              />
            ) : (
              <div className="viewer-fallback-placeholder" />
            )}
          </div>
        </div>

        <div className="viewer-floor-shadow" />
      </div>

      <div className="navigation-actions">
        <button className="back-button" onClick={handleBackClick} type="button">
          ← {t("artwork.back") || "Back to Gallery"}
        </button>
        <button className="explore-button" onClick={handleScrollToSimilar} type="button">
          {t("artwork.more_works") || "Explore Similar"} ↓
        </button>
      </div>

      {open && (
        <ViewGallery
          images={galleryImagesFormatted}
          currentImageId={currentImageIndex >= galleryArray.length ? 0 : currentImageIndex}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}