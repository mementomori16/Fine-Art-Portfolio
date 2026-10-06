"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ArtworkCard from "../ArtworkCard/ArtworkCard";
import { PAINTINGS, Painting } from "../../../app/data/paintings";
import "./similarProducts.scss";

// Helper to extract clean array of tag keywords from painting's slug and subcategory
const getPaintingTags = (painting: Painting): string[] => {
  const slugTags = painting.slug
    ? painting.slug.split(",").map((s) => s.trim().toLowerCase())
    : [];
  const subcategoryTag = painting.subcategory ? [painting.subcategory.toLowerCase()] : [];
  return Array.from(new Set([...slugTags, ...subcategoryTag]));
};

export default function SimilarProducts({ currentPaintingId }: { currentPaintingId: string }) {
  const { t, i18n } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const current = PAINTINGS.find((p) => p.id === currentPaintingId);

  // Compute strictly similar paintings based on tag overlap and category match
  const similar = useMemo(() => {
    if (!current) return [];

    const currentTags = getPaintingTags(current);

    return PAINTINGS
      .filter((p) => p.id !== currentPaintingId) // Exclude current painting
      .map((painting) => {
        const itemTags = getPaintingTags(painting);
        
        // Count how many tags match (e.g., 'nude', 'portrait', 'landscape', 'memento-mori')
        const sharedTagCount = itemTags.filter((tag) => currentTags.includes(tag)).length;
        
        // Medium match bonus (same medium category gets bonus points)
        const isSameCategory = painting.category === current.category;

        return {
          painting,
          score: sharedTagCount * 10 + (isSameCategory ? 2 : 0),
          sharedTagCount,
        };
      })
      .filter((item) => item.score > 0) // Only include works with matching tags or category
      .sort((a, b) => b.score - a.score) // Rank highest similarity first
      .map((item) => item.painting);
  }, [currentPaintingId, current]);

  if (!current || similar.length === 0) return null;

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
  }, [similar]);

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
      id="similar-works-section" 
      className="similar-products-section"
      key={i18n.language}
    >
      <div className="similar-header">
        <h2 className="similar-section-title">
          {t("artwork.similar_works", "Similar Works")}
        </h2>

        {/* Desktop Carousel Controls */}
        <div className="similar-controls">
          <button
            type="button"
            className={`similar-arrow-btn ${!canScrollLeft ? "disabled" : ""}`}
            onClick={() => handleScroll("left")}
            aria-label="Previous artworks"
            disabled={!canScrollLeft}
          >
            ‹
          </button>
          <button
            type="button"
            className={`similar-arrow-btn ${!canScrollRight ? "disabled" : ""}`}
            onClick={() => handleScroll("right")}
            aria-label="Next artworks"
            disabled={!canScrollRight}
          >
            ›
          </button>
        </div>
      </div>

      <div 
        className="similar-scroll-wrapper" 
        ref={scrollRef} 
        onScroll={checkScroll}
      >
        <div className="similar-row">
          {similar.map((painting) => (
            <div key={painting.id} className="similar-item-wrapper">
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

      {/* Luxury Progress Indicator Bar */}
      {similar.length > 3 && (
        <div className="similar-progress-track">
          <div 
            className="similar-progress-bar" 
            style={{ width: `${Math.max(scrollProgress, 15)}%` }} 
          />
        </div>
      )}
    </section>
  );
}