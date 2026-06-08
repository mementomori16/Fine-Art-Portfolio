"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Painting } from "../../../app/data/paintings";
import ArtworkCard from "../../../src/components/ArtworkCard/ArtworkCard";

const DRAWING_COVERS_CONFIG = {
  portraitArtworkId: "p1", 
  nudeArtworkId: "n1",     
  allArtworkId: "g1",      
};

interface DrawingsSubgalleryProps {
  paintings: Painting[];
}

export default function DrawingsSubgallery({ paintings }: DrawingsSubgalleryProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const activeSub = searchParams.get("sub");

  const filteredPaintings = paintings.filter((p) => {
    if (!activeSub || activeSub === "all") return true;
    return p.subcategory === activeSub;
  });

  const portraitCover = paintings.find((p) => p.id === DRAWING_COVERS_CONFIG.portraitArtworkId)?.images.large 
    || paintings.find((p) => p.subcategory === "portrait")?.images.large 
    || "";

  const nudeCover = paintings.find((p) => p.id === DRAWING_COVERS_CONFIG.nudeArtworkId)?.images.large 
    || paintings.find((p) => p.subcategory === "nude")?.images.large 
    || "";

  const generalCover = paintings.find((p) => p.id === DRAWING_COVERS_CONFIG.allArtworkId)?.images.large 
    || paintings.find((p) => p.subcategory === "general")?.images.large 
    || "";

  const handleSubcategoryChange = (subKey: string | null) => {
    if (!subKey) {
      router.push("?sub=all");
    } else {
      router.push(`?sub=${subKey}`);
    }
  };

  return (
    <>
      <div className="subcategory-filter-menu">
        <button 
          className={`filter-btn ${activeSub === "portrait" ? "active" : ""}`}
          onClick={() => handleSubcategoryChange("portrait")}
        >
          {t("subcategories.portraits")}
        </button>
        <button 
          className={`filter-btn ${activeSub === "nude" ? "active" : ""}`}
          onClick={() => handleSubcategoryChange("nude")}
        >
          {t("subcategories.nude")}
        </button>
        <button 
          className={`filter-btn ${activeSub === "all" ? "active" : ""}`}
          onClick={() => handleSubcategoryChange(null)}
        >
          {t("subcategories.general")}
        </button>
      </div>

      {(!activeSub || activeSub === "all") && (
        <div className="subcategory-visual-grid">
          <div className="sub-cover-card" onClick={() => handleSubcategoryChange("portrait")}>
            <h3 className="sub-cover-title">{t("subcategories.portraits")}</h3>
            <div className="image-wrapper">
              {portraitCover && <img src={portraitCover} alt="" role="presentation" />}
            </div>
          </div>

          <div className="sub-cover-card" onClick={() => handleSubcategoryChange("nude")}>
            <h3 className="sub-cover-title">{t("subcategories.nude")}</h3>
            <div className="image-wrapper">
              {nudeCover && <img src={nudeCover} alt="" role="presentation" />}
            </div>
          </div>

          <div className="sub-cover-card" onClick={() => handleSubcategoryChange(null)}>
            <h3 className="sub-cover-title">{t("subcategories.general")}</h3>
            <div className="image-wrapper">
              {generalCover && <img src={generalCover} alt="" role="presentation" />}
            </div>
          </div>
        </div>
      )}

      {activeSub && activeSub !== "all" && (
        <div className="artwork-grid">
          {filteredPaintings.map((painting, index) => (
            <ArtworkCard
              key={painting.id}
              id={painting.id}
              category={painting.category}
              image={painting.images.large}
              title={t(painting.titleKey)}
              index={index} // Resolves structural binding matching rules cleanly
            />
          ))}
        </div>
      )}
    </>
  );
}