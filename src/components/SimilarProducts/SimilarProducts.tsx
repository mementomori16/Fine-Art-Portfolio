import React from "react";
import ArtworkCard from "../ArtworkCard/ArtworkCard";
import { PAINTINGS } from "../../../app/data/paintings";
import "./similarProducts.scss";

export default function SimilarProducts({ currentPaintingId }: { currentPaintingId: string }) {
  const current = PAINTINGS.find((p) => p.id === currentPaintingId);

  if (!current) return null;

  const similar = [...PAINTINGS]
    .filter((p) => p.id !== currentPaintingId)
    .sort(() => Math.random() - 0.5)
    .sort((a, b) => {
      const aSlug = a.slug === current.slug ? 1 : 0;
      const bSlug = b.slug === current.slug ? 1 : 0;
      return bSlug - aSlug; 
    })
    .slice(0, 4);

  if (similar.length === 0) return null;

  return (
    <section id="similar-works-section" className="similar-products-section">
      <h2 className="similar-section-title">Similar Works</h2>
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