import { notFound } from "next/navigation";
import { PAINTINGS, CATEGORY_COVERS } from "../../data/paintings";
import ArtworkCard from "../../../src/components/ArtworkCard/ArtworkCard";
import englishData from "../../../public/locales/english.json";
import "./page.scss";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = CATEGORY_COVERS.find((c) => c.slug === slug);
  if (!category) return { title: "Gallery | Ilya Medvedev" };
  
  const title = (englishData as any)?.artwork?.[category.titleKey] || "Category";
  return { title: `${title} | Ilya Medvedev` };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const currentCategory = CATEGORY_COVERS.find((c) => c.slug === slug);
  if (!currentCategory) notFound();

  const categoryPaintings = PAINTINGS.filter((p) => p.category === slug && p.images);

  const getTranslation = (key: string) => {
    const keys = key.split('.');
    return keys.reduce((o, i) => (o ? o[i] : null), englishData as any) || key;
  };

  return (
    <main className="category-gallery-page">
      <div className="category-container">
        <header className="section-header">
          <h1 className="category-main-title">{getTranslation(currentCategory.titleKey)}</h1>
        </header>

        <div className="artwork-grid">
          {categoryPaintings.map((painting, index) => (
            <div key={painting.id} className="artwork-card-wrapper">
              <div className="individual-artwork-glow" />
              <ArtworkCard
                id={painting.id}
                category={painting.category}
                image={painting.images.large}
                title={getTranslation(`artwork.${painting.id}.title`)}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}