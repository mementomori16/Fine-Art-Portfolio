"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // ✅ Import Next.js optimized Image component
import "./artworkCard.scss";

export default function ArtworkCard({
  id,
  category,
  image,
  title,
}: any) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/artwork/${category}/${id}`);
  };

  return (
    <div className="artwork-card" onClick={handleClick}>
      {/* Ensure the parent .image-wrapper in artworkCard.scss has:
        position: relative; 
        along with a defined height or aspect-ratio so Next.js 'fill' works correctly.
      */}
      <div className="image-wrapper" style={{ position: "relative", width: "100%", height: "300px" }}>
        {image ? (
          <Image 
            src={image} 
            alt={title} 
            fill // ✅ Fills the parent container dynamically
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" // ✅ Tells browser exactly what size to download
            style={{ objectFit: "cover" }} // ✅ Mimics background-size: cover behavior
            className="gallery-img" 
            loading="lazy" // ✅ Ensures browser defers loading until the card scrolls near view
          />
        ) : (
          <div style={{ color: "red" }}>MISSING IMAGE</div>
        )}
      </div>

      <h3>{title}</h3>
    </div>
  );
}