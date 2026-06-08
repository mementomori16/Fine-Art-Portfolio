"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
      <div className="image-wrapper">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="gallery-img"
          />
        ) : (
          <div style={{ color: "red" }}>MISSING IMAGE</div>
        )}
      </div>

      <h3>{title}</h3>
    </div>
  );
}