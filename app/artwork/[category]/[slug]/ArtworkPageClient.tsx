"use client";

import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ArtworkViewer from "../../../../src/components/ArtworkViewer/ArtworkViewer";
import ArtworkInfo from "../../../../src/components/ArtworkInfo/ArtworkInfo";
import SimilarProducts from "../../../../src/components/SimilarProducts/SimilarProducts";
import MoreWorks from "../../../../src/components/MoreWorks/MoreWorks";
import "./page.scss";

const resolveLocalizedField = (
  t: (key: string, options?: Record<string, unknown>) => unknown,
  key: string,
  fallback: string
): string => {
  const translated = t(key, { defaultValue: fallback });
  const text = typeof translated === "string" ? translated : String(translated ?? "");
  if (!text || text === key || text.startsWith("artwork.")) {
    return fallback;
  }
  return text;
};

export default function ArtworkPageClient({ painting }: { painting: any }) {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const layoutRef = useRef<HTMLDivElement>(null);

  const descriptionKey = painting.descriptionKey || `artwork.${painting.id}.description`;

  // Название, материал, размер и описание приходят с сервера на английском (из english.json).
  // Здесь они заменяются на язык посетителя; английский остаётся запасным
  const localized = {
    ...painting,
    title: resolveLocalizedField(t, `artwork.${painting.id}.title`, painting.title || ""),
    medium: resolveLocalizedField(t, `artwork.${painting.id}.medium`, painting.medium || ""),
    size: resolveLocalizedField(t, `artwork.${painting.id}.size`, painting.size || ""),
    description: resolveLocalizedField(t, descriptionKey, painting.description || ""),
  };

  // Выбор тумбнейла: меняем картину и, если блок с ней ушёл выше начала экрана
  // (или под шапку сайта), плавно возвращаемся к нему
  const handleSelectImage: React.Dispatch<React.SetStateAction<number>> = (value) => {
    setCurrentImageIndex(value);

    const el = layoutRef.current;
    if (!el) return;

    const offset = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    if (el.getBoundingClientRect().top < offset - 1) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="artwork-page">
      <div className="artwork-container">
        <div
          ref={layoutRef}
          className="artwork-layout"
          style={{ scrollMarginTop: "calc(var(--nav-height, 0px) + 1rem)" }}
        >
          <ArtworkViewer painting={localized} currentImageIndex={currentImageIndex} />
          <ArtworkInfo
            painting={localized}
            currentImageIndex={currentImageIndex}
            setCurrentImageIndex={handleSelectImage}
          />
        </div>

        <SimilarProducts currentPaintingId={painting.id} />
        <MoreWorks currentPaintingId={painting.id} />
      </div>
    </main>
  );
}