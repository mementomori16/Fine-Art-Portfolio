"use client";

import { useTranslation } from "react-i18next";
import "./artworkInfo.scss";

interface PaintingData {
  id: string;
  category: string;
  titleKey: string;
  descriptionKey?: string;
  images?: {
    large?: string;
    medium?: string;
    thumbnail?: string;
  };
}

interface Props {
  painting: PaintingData;
}

export default function ArtworkInfo({ painting }: Props) {
  const { t, i18n } = useTranslation();

  const baseKey = painting.titleKey.replace(".title", "");
  
  const descriptionKey = painting.descriptionKey || `${baseKey}.description`;
  const hasDescription = i18n.exists(descriptionKey) && t(descriptionKey) !== descriptionKey;

  // FIXED: Checked type safety constraints explicitly across runtime environments
  const isShareSupported = typeof window !== "undefined" && !!navigator.share;

  const handleShare = async () => {
    if (!isShareSupported) return;
    try {
      await navigator.share({
        title: t(painting.titleKey),
        url: window.location.href,
      });
    } catch {
      // Silently catch manual cancellation exceptions safely
    }
  };

  return (
    <div className="artwork-info">
      <div className="info-header">
        <h1>{t(painting.titleKey)}</h1>
        <div className="divider-line" />
      </div>

      <div className="meta-specifications">
        <div className="meta-group">
          <span className="label">{t("artwork.medium") || "Medium"}</span>
          <p className="value">{t(`${baseKey}.medium`)}</p>
        </div>
        
        <div className="meta-group">
          <span className="label">{t("artwork.dimensions") || "Dimensions"}</span>
          <p className="value">{t(`${baseKey}.size`)}</p>
        </div>
      </div>

      {hasDescription && (
        <div className="description-block">
          <div className="divider-line mini" />
          <p className="description-text">{t(descriptionKey)}</p>
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