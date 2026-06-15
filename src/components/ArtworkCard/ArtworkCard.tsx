"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import "./artworkCard.scss";

interface ArtworkCardProps {
  id: string | number;
  category: string;
  image: string;
  title: string;
  index?: number;
}

export default function ArtworkCard({
  id,
  category,
  image,
  title,
  index = 0
}: ArtworkCardProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const handleClick = () => {
    router.push(`/artwork/${category}/${id}`);
  };

  return (
    <div className="artwork-card" onClick={handleClick}>
      <div className="category-frame-wrapper">
        
        {/* BACK GLOW EFFECT */}
        <div className="category-ambient-glow" />

        {/* SPOTLIGHT BEAM */}
        <div className="category-spotlight-beam" />

        {/* LUXURY GOLD MOLDING BOUNDS */}
        <div className="category-luxury-edge">
          <div className="category-canvas-container">
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 600px) 90vw, (max-width: 1100px) 45vw, 320px"
                className="category-masterpiece-image"
                priority={index < 3} // Optimization rule loading top canvas images instantly
              />
            ) : (
              <div className="artwork-missing-canvas">{t("common.missingImage", "Canvas Missing")}</div>
            )}
          </div>
        </div>

        {/* SYSTEM SHADOW PLANE */}
        <div className="category-floor-shadow" />
      </div>

      {/* CURATORIAL LABELS STACK */}
      <div className="category-curatorial-details">
        <h3 className="category-artwork-title">{title}</h3>
        <span className="category-curatorial-meta">
          {t("common.viewArtwork", "View Artwork")}
        </span>
      </div>
    </div>
  );
}