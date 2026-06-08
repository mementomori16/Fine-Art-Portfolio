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
      {/* MAIN IMAGE */}
      <div className="main-image" onClick={() => setOpen(true)}>
        {/* loading="eager" forces the raw HTML img element to fetch instantly with text */}
        <img src={images[current].url} alt="artwork" loading="eager" />
      </div>

      {/* THUMBNAILS (NOW USING thumbnail) */}
      <div className="thumbnails">
        {images.map((img, i) => (
          <img
            key={i}
            src={img.thumbnail || img.url}   // ✅ FIXED
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

      {/* VIEWER MODAL */}
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