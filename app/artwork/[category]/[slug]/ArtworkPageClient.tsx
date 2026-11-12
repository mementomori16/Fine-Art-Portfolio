"use client";

import React, { useRef, useState } from "react";
import ArtworkViewer from "../../../../src/components/ArtworkViewer/ArtworkViewer";
import ArtworkInfo from "../../../../src/components/ArtworkInfo/ArtworkInfo";
import SimilarProducts from "../../../../src/components/SimilarProducts/SimilarProducts";
import "./page.scss";

export default function ArtworkPageClient({ painting }: { painting: any }) {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const layoutRef = useRef<HTMLDivElement>(null);

  // Выбор тумбнейла: меняем картину и, если блок с ней ушёл выше начала экрана
  // (или под шапку сайта), плавно возвращаемся к нему. Работает на десктопе и на мобильном.
  const handleSelectImage: React.Dispatch<React.SetStateAction<number>> = (value) => {
    setCurrentImageIndex(value);

    const el = layoutRef.current;
    if (!el) return;

    // тот же отступ, что задан ниже в scrollMarginTop: учитывает высоту шапки
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
          // отступ сверху, чтобы картину не закрывала фиксированная шапка сайта
          style={{ scrollMarginTop: "calc(var(--nav-height, 0px) + 1rem)" }}
        >
          <ArtworkViewer
            painting={painting}
            currentImageIndex={currentImageIndex}
          />
          <ArtworkInfo
            painting={painting}
            currentImageIndex={currentImageIndex}
            setCurrentImageIndex={handleSelectImage}
          />
        </div>

        <SimilarProducts currentPaintingId={painting.id} />
      </div>
    </main>
  );
}