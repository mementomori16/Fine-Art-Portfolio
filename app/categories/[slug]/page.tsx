import { notFound } from "next/navigation";
import { PAINTINGS, CATEGORY_COVERS } from "../../data/paintings";
import ArtworkCard from "../../../src/components/ArtworkCard/ArtworkCard";
import englishData from "../../../public/locales/english.json";
import "./page.scss";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = CATEGORY_COVERS.find((c) => c.slug === slug);
  if (!category) return { title: "Gallery | Ilya Medvedev" };
  
  const rawKey = category.titleKey 
    ? category.titleKey.replace(/^categories\./, "").replace(/^styleCategories\./, "")
    : slug.replace(/-/g, "_");

  const title = 
    (englishData as any)?.categories?.[rawKey] || 
    (englishData as any)?.categories?.[slug.replace(/-/g, "_")] ||
    (englishData as any)?.categories?.[category.slug] ||
    "Category";

  return { title: `${title} | Ilya Medvedev` };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const currentCategory = CATEGORY_COVERS.find((c) => c.slug === slug);
  if (!currentCategory) notFound();

  // Strict category filter
  const categoryPaintings = PAINTINGS.filter((p) => {
    if (slug === "tempera") {
      return (p.category === "tempera" || p.category === "other-works") && p.images;
    }
    return p.category === slug && p.images;
  });

  return (
    <main className="category-gallery-page">
      <div className="category-container">
        <div className="artwork-grid">
          {categoryPaintings.map((painting, index) => (
            <div key={painting.id} className="artwork-card-wrapper">
              <div className="individual-artwork-glow" />
              <ArtworkCard
                id={painting.id}
                category={painting.category}
                image={painting.images.large}
                title={`artwork.${painting.id}.title`}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}