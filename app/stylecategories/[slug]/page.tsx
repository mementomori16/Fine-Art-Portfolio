import { notFound } from "next/navigation";
import { PAINTINGS, STYLE_CATEGORIES, getPaintingsByStyle } from "../../data/paintings";
import ArtworkCard from "../../../src/components/ArtworkCard/ArtworkCard";
import CategoryTitle from "../../../src/components/CategoryTitle/CategoryTitle";
import englishData from "../../../public/locales/english.json";
import germanData from "../../../public/locales/german.json";
import frenchData from "../../../public/locales/french.json";
import "../../../src/components/CategoryGallery/categoryGallery.scss";

type LocaleDict = Record<string, any>;

const LOCALE_DICTS: Record<"en" | "de" | "fr", LocaleDict> = {
  en: englishData as LocaleDict,
  de: germanData as LocaleDict,
  fr: frenchData as LocaleDict,
};

function resolveStyleKey(slug: string, titleKey?: string): string {
  if (titleKey && titleKey.trim().length > 0) {
    return titleKey.trim();
  }

  const rawKey = slug.replace(/-/g, "_");
  const camelKey = rawKey.replace(/_([a-z])/g, (_, ch: string) => ch.toUpperCase());

  if (englishData?.styleCategories && camelKey in englishData.styleCategories) {
    return `styleCategories.${camelKey}`;
  }
  if (englishData?.styleCategories && rawKey in englishData.styleCategories) {
    return `styleCategories.${rawKey}`;
  }

  return `styleCategories.${camelKey}`;
}

function getStyleTitleFromDict(dict: LocaleDict, slug: string, titleKey?: string): string | undefined {
  const fromTitleKey = titleKey
    ? titleKey.split(".").reduce((acc: any, part: string) => (acc ? acc[part] : undefined), dict)
    : undefined;

  if (typeof fromTitleKey === "string" && fromTitleKey.trim().length > 0) {
    return fromTitleKey.trim();
  }

  const rawKey = slug.replace(/-/g, "_");
  const camelKey = rawKey.replace(/_([a-z])/g, (_, ch: string) => ch.toUpperCase());

  const candidate =
    dict?.styleCategories?.[camelKey] ||
    dict?.styleCategories?.[rawKey] ||
    dict?.styleCategories?.[slug] ||
    dict?.categories?.[camelKey] ||
    dict?.categories?.[rawKey];

  return typeof candidate === "string" && candidate.trim().length > 0
    ? candidate.trim()
    : undefined;
}

function formatSlugFallback(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const styleCat = STYLE_CATEGORIES?.find((s) => s.slug === slug);
  if (!styleCat) return { title: "Gallery | Fine Art" };

  const titleEn =
    getStyleTitleFromDict(LOCALE_DICTS.en, slug, styleCat.titleKey) || formatSlugFallback(slug);
  const titleDe = getStyleTitleFromDict(LOCALE_DICTS.de, slug, styleCat.titleKey);
  const titleFr = getStyleTitleFromDict(LOCALE_DICTS.fr, slug, styleCat.titleKey);

  const siteName = "Ilya Medvedev";
  const allNames = Array.from(new Set([titleEn, titleDe, titleFr].filter(Boolean)));
  const description = `${allNames.join(" / ")} — ${siteName}`;

  return {
    title: `${titleEn} | ${siteName}`,
    description,
    openGraph: {
      title: `${titleEn} | ${siteName}`,
      description,
      images: styleCat.coverImage
        ? [
            {
              url: styleCat.coverImage,
              width: 1200,
              height: 630,
              alt: titleEn,
            },
          ]
        : [],
      type: "website",
    },
  };
}

export default async function StylePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) notFound();

  const targetSlug = slug.toLowerCase();

  // Validate that the slug exists in STYLE_CATEGORIES
  const styleCat = STYLE_CATEGORIES?.find((s) => s.slug.toLowerCase() === targetSlug);
  if (!styleCat) {
    notFound();
  }

  const headingKey = resolveStyleKey(targetSlug, styleCat.titleKey);
  const fallbackTitle =
    getStyleTitleFromDict(LOCALE_DICTS.en, targetSlug, styleCat.titleKey) ||
    formatSlugFallback(targetSlug);

  // Use the helper from paintings.ts which maps composite slugs (e.g., 'mortality-memento-mori')
  let matchingPaintings = getPaintingsByStyle(targetSlug);

  // Fallback match using tags if getPaintingsByStyle returns an empty array for singular/plural terms
  if (matchingPaintings.length === 0) {
    matchingPaintings = PAINTINGS.filter((p) => {
      const itemStyle = (p.style as string | undefined)?.toLowerCase() || "";
      const itemSubcat = ((p as any).subcategory as string | undefined)?.toLowerCase() || "";
      const itemTags = Array.isArray(p.tags) ? p.tags.map((t) => t.toLowerCase()) : [];

      if (targetSlug === "portrait" || targetSlug === "portraits") {
        return (
          itemStyle.includes("portrait") ||
          itemSubcat.includes("portrait") ||
          itemTags.includes("portrait")
        );
      }
      if (targetSlug === "nude" || targetSlug === "nudes") {
        return itemStyle.includes("nude") || itemSubcat.includes("nude") || itemTags.includes("nude");
      }

      return (
        itemStyle.includes(targetSlug) ||
        itemSubcat.includes(targetSlug) ||
        itemTags.includes(targetSlug)
      );
    });
  }

  return (
    <main className="category-gallery-page">
      <div className="category-container">
        <CategoryTitle i18nKey={headingKey} fallbackTitle={fallbackTitle} />

        {matchingPaintings.length > 0 ? (
          <div className="artwork-grid">
            {matchingPaintings.map((painting, index) => {
              const imageUrl =
                painting.images?.large ||
                painting.images?.medium ||
                painting.thumbnail ||
                "";

              return (
                <div key={painting.id} className="artwork-card-wrapper">
                  <div className="individual-artwork-glow" />
                  <ArtworkCard
                    id={painting.id}
                    category={painting.category}
                    image={imageUrl}
                    title={`artwork.${painting.id}.title`}
                    index={index}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-category-placeholder">
            <h2 className="empty-category-title">
              <CategoryTitle i18nKey="styleCategories.inPreparation" fallbackTitle="" />
            </h2>
          </div>
        )}
      </div>
    </main>
  );
}