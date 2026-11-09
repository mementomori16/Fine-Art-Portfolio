import { notFound } from "next/navigation";
import { PAINTINGS, STYLE_CATEGORIES, getPaintingsByStyle } from "../../data/paintings";
import ArtworkCard from "../../../src/components/ArtworkCard/ArtworkCard";
import englishData from "../../../public/locales/english.json";
import "./page.scss";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const styleCat = STYLE_CATEGORIES?.find((s) => s.slug === slug);
  if (!styleCat) return { title: "Gallery | Fine Art" };

  const rawKey = styleCat.titleKey.replace("styleCategories.", "").replace("categories.", "");
  const title =
    (englishData as any)?.styleCategories?.[rawKey] ||
    (englishData as any)?.categories?.[rawKey] ||
    styleCat.id;
  return { title: `${title} | Fine Art` };
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

  // Use the helper from paintings.ts which maps composite slugs (e.g., 'mortality-memento-mori')
  let matchingPaintings = getPaintingsByStyle(targetSlug);

  // Fallback match using tags if getPaintingsByStyle returns an empty array for singular/plural terms
  if (matchingPaintings.length === 0) {
    matchingPaintings = PAINTINGS.filter((p) => {
      const itemStyle = (p.style as string | undefined)?.toLowerCase() || "";
      const itemSubcat = ((p as any).subcategory as string | undefined)?.toLowerCase() || "";
      const itemTags = Array.isArray(p.tags) ? p.tags.map((t) => t.toLowerCase()) : [];

      if (targetSlug === "portrait" || targetSlug === "portraits") {
        return itemStyle.includes("portrait") || itemSubcat.includes("portrait") || itemTags.includes("portrait");
      }
      if (targetSlug === "nude" || targetSlug === "nudes") {
        return itemStyle.includes("nude") || itemSubcat.includes("nude") || itemTags.includes("nude");
      }

      return itemStyle.includes(targetSlug) || itemSubcat.includes(targetSlug) || itemTags.includes(targetSlug);
    });
  }

  return (
    <main className="category-gallery-page">
      <div className="category-container">
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
          <div className="empty-category-placeholder" style={{ textAlign: "center", padding: "6rem 2rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 300, opacity: 0.85, marginBottom: "1rem" }}>
              Collection in Preparation
            </h2>
            <p style={{ fontSize: "0.95rem", opacity: 0.6, maxWidth: "450px", margin: "0 auto" }}>
              New works are currently being added to this gallery section.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}