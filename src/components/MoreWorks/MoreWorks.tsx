"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ArtworkCard from "../ArtworkCard/ArtworkCard";
import { PAINTINGS, Painting } from "../../../app/data/paintings";
import "./moreWorks.scss";

const MAX_MORE_WORKS = 18;

const getPaintingTags = (painting: Painting): string[] => {
  const slugTags = painting.slug
    ? painting.slug.split(",").map((s) => s.trim().toLowerCase())
    : [];
  const subcategoryTag = painting.subcategory ? [painting.subcategory.toLowerCase()] : [];
  return Array.from(new Set([...slugTags, ...subcategoryTag]));
};

// Детерминированный хеш строки — порядок стабилен при гидратации, но зависит от текущей работы
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
};

// Ключ группы для чередования: сначала категория/медиа, либо первый тег/подкатегория
const getBucketKey = (painting: Painting): string => {
  const category = (painting.category || "other").trim().toLowerCase();
  const tags = getPaintingTags(painting);
  const primaryTopic = tags[0] || "general";
  return `${category}:${primaryTopic}`;
};

export default function MoreWorks({ currentPaintingId }: { currentPaintingId: string }) {
  const { t, i18n } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const current = PAINTINGS.find((p) => p.id === currentPaintingId);

  const moreWorks = useMemo(() => {
    if (!current) return [];

    const currentTags = getPaintingTags(current);

    const similarIds = new Set(
      PAINTINGS.filter((p) => p.id !== currentPaintingId)
        .map((painting) => {
          const itemTags = getPaintingTags(painting);
          const sharedTagCount = itemTags.filter((tag) => currentTags.includes(tag)).length;
          const isSameCategory = painting.category === current.category;
          const score = sharedTagCount * 10 + (isSameCategory ? 2 : 0);
          return { id: painting.id, score };
        })
        .filter((item) => item.score > 0)
        .map((item) => item.id)
    );

    const pool = PAINTINGS.filter(
      (p) => p.id !== currentPaintingId && !similarIds.has(p.id)
    );

    // Группируем по bucket (категория + тема/тег)
    const bucketsMap = new Map<string, Painting[]>();
    for (const item of pool) {
      const key = getBucketKey(item);
      const list = bucketsMap.get(key) ?? [];
      list.push(item);
      bucketsMap.set(key, list);
    }

    const seed = hashString(currentPaintingId);

    // Перемешиваем работы внутри каждой группы детерминированно
    const bucketKeys = Array.from(bucketsMap.keys()).sort(
      (a, b) => ((hashString(`${seed}:${a}`) % 1000) - (hashString(`${seed}:${b}`) % 1000))
    );

    const queues: Painting[][] = bucketKeys.map((key) => {
      const items = [...(bucketsMap.get(key) ?? [])];
      items.sort(
        (a, b) =>
          ((hashString(`${seed}:${key}:${a.id}`) % 1000) -
            (hashString(`${seed}:${key}:${b.id}`) % 1000))
      );
      return items;
    });

    // Берём по одной работе из каждой группы по кругу, пока не наберём лимит
    const interleaved: Painting[] = [];
    let addedInRound = true;

    while (interleaved.length < MAX_MORE_WORKS && addedInRound) {
      addedInRound = false;
      for (const queue of queues) {
        if (interleaved.length >= MAX_MORE_WORKS) break;
        const nextItem = queue.shift();
        if (nextItem) {
          interleaved.push(nextItem);
          addedInRound = true;
        }
      }
    }

    return interleaved;
  }, [currentPaintingId, current]);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);

    const maxScroll = scrollWidth - clientWidth;
    setScrollProgress(maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [moreWorks]);

  if (!current || moreWorks.length === 0) return null;

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="more-works-section"
      className="more-works-section"
      key={i18n.language}
    >
      <div className="more-works-header">
        <h2 className="more-works-section-title">
          {t("artwork.more_works", "More Works")}
        </h2>

        <div className="more-works-controls">
          <button
            type="button"
            className={`more-works-arrow-btn ${!canScrollLeft ? "disabled" : ""}`}
            onClick={() => handleScroll("left")}
            aria-label="Previous artworks"
            disabled={!canScrollLeft}
          >
            ‹
          </button>
          <button
            type="button"
            className={`more-works-arrow-btn ${!canScrollRight ? "disabled" : ""}`}
            onClick={() => handleScroll("right")}
            aria-label="Next artworks"
            disabled={!canScrollRight}
          >
            ›
          </button>
        </div>
      </div>

      <div
        className="more-works-scroll-wrapper"
        ref={scrollRef}
        onScroll={checkScroll}
      >
        <div className="more-works-row">
          {moreWorks.map((painting) => (
            <div key={painting.id} className="more-works-item-wrapper">
              <ArtworkCard
                id={painting.id}
                category={painting.category}
                image={painting.images?.medium || ""}
                title={`artwork.${painting.id}.title`}
              />
            </div>
          ))}
        </div>
      </div>

      {moreWorks.length > 2 && (
        <div className="more-works-progress-track">
          <div
            className="more-works-progress-bar"
            style={{ width: `${Math.max(scrollProgress, 15)}%` }}
          />
        </div>
      )}
    </section>
  );
}