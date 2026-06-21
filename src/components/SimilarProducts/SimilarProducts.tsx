import React from "react";
import ArtworkCard from "../ArtworkCard/ArtworkCard";
import { PAINTINGS } from "../../../app/data/paintings";
import "./similarProducts.scss";

export default function SimilarProducts({ currentPaintingId }: { currentPaintingId: string }) {
  const current = PAINTINGS.find((p) => p.id === currentPaintingId);

  if (!current) return null;

  // 1. Get all other paintings
  // 2. Shuffle them to ensure randomness
  // 3. Sort: Move items with matching slugs to the front
  const similar = [...PAINTINGS]
    .filter((p) => p.id !== currentPaintingId)
    .sort(() => Math.random() - 0.5) // Randomize order
    .sort((a, b) => {
      // Slug match gets priority
      const aSlug = a.slug === current.slug ? 1 : 0;
      const bSlug = b.slug === current.slug ? 1 : 0;
      return bSlug - aSlug; 
    })
    .slice(0, 4);

  if (similar.length === 0) return null;

  return (
    <section className="similar-products-section">
      <h2 className="similar-section-title">Similar Works</h2>
      {/* Scroll wrapper handles the movement, the row stays transparent */}
      <div className="similar-scroll-wrapper">
        <div className="similar-row">
          {similar.map((painting) => (
            <div key={painting.id} className="similar-item-wrapper">
              <ArtworkCard
                id={painting.id}
                category={painting.category}
                image={painting.images?.medium || ""}
                title={""} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}