import { notFound } from "next/navigation";
import { PAINTINGS } from "../../../data/paintings";
import ArtworkPageClient from "./ArtworkPageClient"; 
import englishData from "../../../../public/locales/english.json";

// Helper to get translation based on your exact JSON structure
const getTranslation = (key: string) => {
  // We use your exact keys: artwork.oil_02.title
  const keys = key.split('.');
  return keys.reduce((o, i) => (o ? o[i] : null), englishData as any) || key;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string; category: string }> }) {
  const { slug, category } = await params;
  const painting = PAINTINGS.find((p) => p.id === slug && p.category === category);
  
  if (!painting) return { title: "Ilya Medvedev" };

  // Use the ID directly (e.g., 'oil_02') to match your JSON
  const title = getTranslation(`artwork.${painting.id}.title`);
  const siteName = "Ilya Medvedev"; 

  return {
    title: `${title} | ${siteName}`,
    description: `${title} - ${siteName}`,
    openGraph: {
      title: `${title} | ${siteName}`,
      description: `${title} - ${siteName}`,
      images: [
        {
          url: painting.images?.large || "",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'article',
    },
  };
}

export default async function ArtworkPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  
  const painting = PAINTINGS.find((p) => p.id === slug && p.category === category);
  if (!painting) notFound();

  const optimizedPaintingData = {
    ...painting,
    // Corrected to match your JSON structure: artwork.oil_02.title
    title: getTranslation(`artwork.${painting.id}.title`),
    size: getTranslation(`artwork.${painting.id}.size`),
    allImages: [painting.images?.large, painting.thumbnail].filter(Boolean)
  };

  return <ArtworkPageClient painting={optimizedPaintingData} />;
}
