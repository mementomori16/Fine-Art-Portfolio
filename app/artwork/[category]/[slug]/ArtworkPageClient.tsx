"use client";

import React, { useState } from "react";
import ArtworkViewer from "../../../../src/components/ArtworkViewer/ArtworkViewer";
import ArtworkInfo from "../../../../src/components/ArtworkInfo/ArtworkInfo";
import SimilarProducts from "../../../../src/components/SimilarProducts/SimilarProducts";
import "./page.scss";

export default function ArtworkPageClient({ painting }: { painting: any }) {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  return (
    <main className="artwork-page">
      <div className="artwork-container">
        <div className="artwork-layout">
          <ArtworkViewer 
            painting={painting} 
            currentImageIndex={currentImageIndex} 
          />
          <ArtworkInfo 
            painting={painting} 
            currentImageIndex={currentImageIndex} 
            setCurrentImageIndex={setCurrentImageIndex} 
          />
        </div>
        
        <SimilarProducts currentPaintingId={painting.id} />
      </div>
    </main>
  );
}