"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import "./artworkInfo.scss";

interface PaintingData {
  id: string;
  category: string;
  descriptionKey?: string;
  images?: {
    small?: string;
    medium?: string;
    large?: string;
  };
  allImages?: string[]; 
  hasValidThumbnails?: boolean;
}

interface Props {
  painting?: PaintingData;
  currentImageIndex?: number;
  setCurrentImageIndex?: (index: number) => void;
}

export default function ArtworkInfo({ painting, currentImageIndex = 0, setCurrentImageIndex }: Props) {
  const { t, i18n } = useTranslation();

  if (!painting) {
    return <div className="artwork-info-loading-skeleton" />;
  }

const titleKey = `artwork.${painting.id}.title`;
const mediumKey = `artwork.${painting.id}.medium`;
const sizeKey = `artwork.${painting.id}.size`;
const descriptionKey = painting.descriptionKey || `artwork.${painting.id}.description`;
  
  const hasDescription = i18n.exists(descriptionKey) && t(descriptionKey) !== descriptionKey;
  const isShareSupported = typeof window !== "undefined" && !!navigator.share;
  const renderingThumbnails = painting.allImages || [];

  const handleShare = async () => {
    if (!isShareSupported) return;
    try {
      await navigator.share({
        title: t(titleKey),
        url: window.location.href,
      });
    } catch {
      // Catch exceptions gracefully
    }
  };

  return (
    <div className="artwork-info">
      <div className="info-header">
        <h1>{t(titleKey)}</h1>
        <div className="divider-line" />
      </div>

      <div className="meta-specifications">
        <div className="meta-group">
          <span className="label">{t("artwork.medium") || "Medium"}</span>
          <p className="value">{t(mediumKey)}</p>
        </div>
        
        <div className="meta-group">
          <span className="label">{t("artwork.dimensions") || "Dimensions"}</span>
          <p className="value">{t(sizeKey)}</p>
        </div>
      </div>

      {hasDescription && (
        <div className="description-block">
          <div className="divider-line mini" />
          <p className="description-text">{t(descriptionKey)}</p>
        </div>
      )}

      {painting.hasValidThumbnails && renderingThumbnails.length > 1 && (
        <div className="info-panel-thumbnails">
          {renderingThumbnails.map((thumbUrl, idx) => (
            <img
              key={idx}
              src={thumbUrl}
              alt={`View thumbnail option ${idx + 1}`}
              className={currentImageIndex === idx ? "active" : ""}
              onClick={() => setCurrentImageIndex && setCurrentImageIndex(idx)}
            />
          ))}
        </div>
      )}

      {isShareSupported && (
        <div className="actions-panel">
          <button className="share-action-button" onClick={handleShare}>
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="share-icon"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            <span>{t("artwork.share") || "Share Piece"}</span>
          </button>
        </div>
      )}
    </div>
  );
}