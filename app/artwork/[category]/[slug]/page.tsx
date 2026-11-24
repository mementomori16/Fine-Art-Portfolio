import { notFound } from "next/navigation";
import { PAINTINGS } from "../../../data/paintings";
import ArtworkPageClient from "./ArtworkPageClient";
import englishData from "../../../../public/locales/english.json";
import germanData from "../../../../public/locales/german.json";
import frenchData from "../../../../public/locales/french.json";

type LocaleDict = Record<string, unknown>;

const LOCALE_DICTS: Record<"en" | "de" | "fr", LocaleDict> = {
  en: englishData as LocaleDict,
  de: germanData as LocaleDict,
  fr: frenchData as LocaleDict,
};

// Helper to get translation based on your exact JSON structure across EN / DE / FR
const getTranslationFromDict = (dict: LocaleDict, key: string): string | undefined => {
  // We use your exact keys: artwork.oil_02.title
  const keys = key.split(".");
  let current: unknown = dict;

  for (const part of keys) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return typeof current === "string" && current.trim().length > 0 ? current : undefined;
};

const getTranslation = (key: string, lang: "en" | "de" | "fr" = "en"): string | undefined => {
  return (
    getTranslationFromDict(LOCALE_DICTS[lang], key) ||
    getTranslationFromDict(LOCALE_DICTS.en, key) ||
    getTranslationFromDict(LOCALE_DICTS.de, key) ||
    getTranslationFromDict(LOCALE_DICTS.fr, key)
  );
};

const formatFallbackTitle = (slug: string, id: string): string => {
  const source = slug || id;
  return source
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string; category: string }> }) {
  const { slug, category } = await params;
  const painting = PAINTINGS.find((p) => p.id === slug && p.category === category);

  if (!painting) return { title: "Ilya Medvedev" };

  // Use the ID directly (e.g., 'oil_02') to match your JSON
  const titleEn = getTranslation(`artwork.${painting.id}.title`, "en") || formatFallbackTitle(painting.slug, painting.id);
  const titleDe = getTranslation(`artwork.${painting.id}.title`, "de");
  const titleFr = getTranslation(`artwork.${painting.id}.title`, "fr");

  const medium = getTranslation(`artwork.${painting.id}.medium`, "en");
  const size = getTranslation(`artwork.${painting.id}.size`, "en");
  const customDescription = getTranslation(`artwork.${painting.id}.description`, "en");

  const localizedTitles = Array.from(new Set([titleEn, titleDe, titleFr].filter(Boolean)));
  const siteName = "Ilya Medvedev";

  const metaParts = [
    localizedTitles.length > 1 ? localizedTitles.join(" / ") : null,
    customDescription,
    medium,
    size,
    siteName,
  ].filter(Boolean);

  const description = metaParts.join(" — ");

  return {
    title: `${titleEn} | ${siteName}`,
    description,
    openGraph: {
      title: `${titleEn} | ${siteName}`,
      description,
      images: [
        {
          url: painting.images?.large || painting.thumbnail || "",
          width: 1200,
          height: 630,
          alt: titleEn,
        },
      ],
      type: "article",
    },
  };
}

export default async function ArtworkPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;

  const painting = PAINTINGS.find((p) => p.id === slug && p.category === category);
  if (!painting) notFound();

  const title = getTranslation(`artwork.${painting.id}.title`, "en") || formatFallbackTitle(painting.slug, painting.id);
  const medium = getTranslation(`artwork.${painting.id}.medium`, "en") || "";
  const size = getTranslation(`artwork.${painting.id}.size`, "en") || "";
  const description = getTranslation(`artwork.${painting.id}.description`, "en") || "";

  const allImages = [
    painting.images?.large,
    painting.thumbnail,
    painting.thumbnail2,
    painting.thumbnail3,
  ].filter((url): url is string => Boolean(url));

  const optimizedPaintingData = {
    ...painting,
    // Corrected to match your JSON structure: artwork.oil_02.title
    title,
    medium,
    size,
    description,
    allImages,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: title,
    creator: {
      "@type": "Person",
      name: "Ilya Medvedev",
    },
    ...(medium ? { artMedium: medium } : {}),
    ...(size ? { size } : {}),
    ...(description ? { description } : {}),
    ...(allImages[0] ? { image: allImages } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArtworkPageClient painting={optimizedPaintingData} />
    </>
  );
}