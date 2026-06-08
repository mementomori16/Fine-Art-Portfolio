"use client";

import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { PAINTINGS } from "../../../data/paintings";
import ArtworkViewer from "../../../../src/components/ArtworkViewer/ArtworkViewer";
import ArtworkInfo from "../../../../src/components/ArtworkInfo/ArtworkInfo";
import "./page.scss";

interface ImageData {
  url: string;
  title: string;
  date: string;
}

export default function ArtworkPage() {
  const { t } = useTranslation();
  const params = useParams();

  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const category = Array.isArray(params.category) ? params.category[0] : params.category;

  const painting = PAINTINGS.find(
    (p) => p.id === slug && p.category === category
  );

  if (!painting) return <div>Artwork not found</div>;

  const baseKey = painting.titleKey.replace(".title", "");

  const images: ImageData[] = [
    {
      url: painting.images?.large || painting.images?.medium || "",
      title: t(painting.titleKey),
      date: t(`${baseKey}.size`),
    },
  ];

  return (
    <main className="artwork-page">
      <div className="artwork-layout">
        <ArtworkViewer images={images} />
        <ArtworkInfo painting={painting} />
      </div>
    </main>
  );
}