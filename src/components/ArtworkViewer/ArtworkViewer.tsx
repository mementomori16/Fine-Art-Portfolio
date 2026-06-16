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
  allImages?: string[];
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

  const activeImageSrc = painting.allImages?.[currentImageIndex] || painting.images?.large || "";

  // FIXED: Removed old titleKey.replace framework logic to use the new ID path system
// Update the layout conversion maps inside ArtworkViewer:
const galleryImagesFormatted = (painting.allImages || [activeImageSrc]).map((url) => ({
  url,
  title: t(`artwork.${painting.id}.title`),
  date: t(`artwork.${painting.id}.size`),
}));

  const handleBackClick = () => {
    if (onBackAction) {
      onBackAction();
    } else if (typeof window !== "undefined") {
      window.history.back();
    }
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

      <button 
        className="back-button" 
        onClick={handleBackClick}
        type="button"
      >
        ← {t("artwork.back") || "Back to Gallery"}
      </button>

      {open && (
        <ViewGallery
          images={galleryImagesFormatted}
          currentImageId={currentImageIndex}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}