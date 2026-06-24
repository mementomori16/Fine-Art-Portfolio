import { notFound } from "next/navigation";
import { PAINTINGS } from "../../../data/paintings";
import ArtworkPageClient from "./ArtworkPageClient"; 
import englishData from "../../../../public/locales/english.json";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const painting = PAINTINGS.find((p) => p.id === slug);
  if (!painting) return { title: "Artwork | Ilya Medvedev" };

  const title = (englishData as any)?.artwork?.items?.[painting.id]?.title || "Artwork";
  return {
    title: `${title} | Ilya Medvedev`,
    description: `View "${title}" by Ilya Medvedev. Original fine art painting.`,
  };
}

export default async function ArtworkPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  
  const painting = PAINTINGS.find((p) => p.id === slug && p.category === category);
  if (!painting) notFound();

  const getTranslation = (key: string) => {
    const keys = key.split('.');
    return keys.reduce((o, i) => (o ? o[i] : null), englishData as any) || key;
  };

  const optimizedPaintingData = {
    ...painting,
    title: getTranslation(`artwork.items.${painting.id}.title`),
    size: getTranslation(`artwork.items.${painting.id}.size`),
    allImages: [painting.images?.large, painting.thumbnail].filter(Boolean)
  };

  return <ArtworkPageClient painting={optimizedPaintingData} />;
}
