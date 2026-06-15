"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import ViewGallery from "../ViewGallery/ViewGallery";
import "./artworkViewer.scss";

interface ImageData {
  url: string;
  title: string;
  date: string;
  thumbnail?: string;
}

interface Props {
  images: ImageData[];
}

export default function ArtworkViewer({ images }: Props) {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="viewer">
      
      {/* MASTER LUXURY DISPLAY BOUNDS */}
      <div className="main-image-exhibit-container">
        
        {/* BACK GLOW EFFECT */}
        <div className="viewer-ambient-glow" />

        {/* SPOTLIGHT BEAM */}
        <div className="viewer-spotlight-beam" />

        {/* CLICKABLE REGION / LUXURY THIN MOULDING FRAME */}
        <div className="viewer-luxury-edge" onClick={() => setOpen(true)}>
          <div className="viewer-canvas-container">
            <img 
              src={images[current].url} 
              alt="masterpiece artwork" 
              loading="eager" 
              className="viewer-masterpiece-image"
            />
          </div>
        </div>

        {/* FLOATING DEEP ANCHOR SHADOW */}
        <div className="viewer-floor-shadow" />
      </div>

      {/* THUMBNAILS COMPACT TRACK */}
      <div className="thumbnails">
        {images.map((img, i) => (
          <img
            key={i}
            src={img.thumbnail || img.url}
            className={i === current ? "active" : ""}
            onClick={() => setCurrent(i)}
            alt={`thumbnail-${i}`}
          />
        ))}
      </div>

      {/* BACK BUTTON */}
      <button className="back-button" onClick={() => router.back()}>
        ← {t("artwork.back")}
      </button>

      {/* VIEWER FULLSCREEN MODAL */}
      {open && (
        <ViewGallery
          images={images}
          currentImageId={current}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}