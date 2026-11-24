import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PAINTINGS,
  CATEGORY_COVERS,
  getPaintingsByStyle,
  groupPaintingsByYear,
  getAvailableYears,
} from "../../data/paintings";
import ArtworkCard from "../../../src/components/ArtworkCard/ArtworkCard";
import CategoryTitle from "../../../src/components/CategoryTitle/CategoryTitle";
import englishData from "../../../public/locales/english.json";
import germanData from "../../../public/locales/german.json";
import frenchData from "../../../public/locales/french.json";
import "./page.scss";

type LocaleDict = Record<string, any>;

const LOCALE_DICTS: Record<"en" | "de" | "fr", LocaleDict> = {
  en: englishData as LocaleDict,
  de: germanData as LocaleDict,
  fr: frenchData as LocaleDict,
};

function resolveCategoryKey(slug: string, titleKey?: string): string {
  const cleaned = (titleKey || slug)
    .replace(/^categories\./, "")
    .replace(/^styleCategories\./, "")
    .replace(/-/g, "_");

  if (cleaned === "landscape_still_life") {
    return "categories.landscape_still_life";
  }

  return `categories.${cleaned}`;
}

function getCategoryTitleFromDict(dict: LocaleDict, slug: string, titleKey?: string): string | undefined {
  const rawKey = (titleKey || slug)
    .replace(/^categories\./, "")
    .replace(/^styleCategories\./, "")
    .replace(/-/g, "_");

  const camelKey = rawKey.replace(/_([a-z])/g, (_, ch: string) => ch.toUpperCase());

  const candidate =
    dict?.categories?.[rawKey] ||
    dict?.categories?.[camelKey] ||
    dict?.categories?.[slug] ||
    dict?.styleCategories?.[rawKey] ||
    dict?.styleCategories?.[camelKey];

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
  const category = CATEGORY_COVERS.find((c) => c.slug === slug);
  if (!category) return { title: "Gallery | Ilya Medvedev" };

  const titleEn =
    getCategoryTitleFromDict(LOCALE_DICTS.en, slug, category.titleKey) || formatSlugFallback(slug);
  const titleDe = getCategoryTitleFromDict(LOCALE_DICTS.de, slug, category.titleKey);
  const titleFr = getCategoryTitleFromDict(LOCALE_DICTS.fr, slug, category.titleKey);

  const siteName = "Ilya Medvedev";
  const allNames = Array.from(new Set([titleEn, titleDe, titleFr].filter(Boolean)));
  const description = `${allNames.join(" / ")} — ${siteName}`;

  return {
    title: `${titleEn} | ${siteName}`,
    description,
    openGraph: {
      title: `${titleEn} | ${siteName}`,
      description,
      images: category.cloudinaryId
        ? [
            {
              url: category.cloudinaryId,
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

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ year?: string }>;
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const currentCategory = CATEGORY_COVERS.find((c) => c.slug === slug);
  if (!currentCategory) notFound();

  const headingKey = resolveCategoryKey(slug, currentCategory.titleKey);
  const fallbackTitle =
    getCategoryTitleFromDict(LOCALE_DICTS.en, slug, currentCategory.titleKey) ||
    formatSlugFallback(slug);

  const isByYears = slug === "works-by-years";

  const basePaintings =
    slug === "all-paintings" || isByYears
      ? getPaintingsByStyle(slug)
      : PAINTINGS.filter((p) => {
          if (slug === "tempera") {
            return (p.category === "tempera" || p.category === "other-works") && p.images;
          }
          return p.category === slug && p.images;
        });

  const availableYears = isByYears ? getAvailableYears(basePaintings) : [];
  const selectedYearNum = resolvedSearchParams?.year ? Number(resolvedSearchParams.year) : null;
  const activeYear =
    selectedYearNum && availableYears.includes(selectedYearNum) ? selectedYearNum : null;

  const yearGroups = isByYears ? groupPaintingsByYear(basePaintings) : [];
  const visibleGroups = activeYear
    ? yearGroups.filter((g) => g.year === activeYear)
    : yearGroups;

  return (
    <main className="category-gallery-page">
      <div className="category-container">
        <CategoryTitle i18nKey={headingKey} fallbackTitle={fallbackTitle} />

        {isByYears && availableYears.length > 0 ? (
          <>
            <nav className="year-links-nav" aria-label="Years navigation">
              <Link
                href={`/categories/${slug}`}
                className={`year-link-pill ${activeYear === null ? "is-active" : ""}`}
              >
                All
              </Link>
              {availableYears.map((yr) => (
                <Link
                  key={yr}
                  href={`/categories/${slug}?year=${yr}`}
                  className={`year-link-pill ${activeYear === yr ? "is-active" : ""}`}
                >
                  {yr}
                </Link>
              ))}
            </nav>

            <div className="years-sections">
              {visibleGroups.map((group) => (
                <section
                  key={group.year}
                  id={`year-${group.year}`}
                  className="year-section-block"
                >
                  <h2 className="year-section-heading">{group.year}</h2>

                  <div className="artwork-grid">
                    {group.paintings.map((painting, index) => (
                      <div key={painting.id} className="artwork-card-wrapper">
                        <div className="individual-artwork-glow" />
                        <ArtworkCard
                          id={painting.id}
                          category={painting.category}
                          image={painting.images.medium || painting.images.large}
                          title={`artwork.${painting.id}.title`}
                          index={index}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        ) : (
          <div className="artwork-grid">
            {basePaintings.map((painting, index) => (
              <div key={painting.id} className="artwork-card-wrapper">
                <div className="individual-artwork-glow" />
                <ArtworkCard
                  id={painting.id}
                  category={painting.category}
                  image={painting.images.medium || painting.images.large}
                  title={`artwork.${painting.id}.title`}
                  index={index}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}