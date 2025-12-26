import { notFound } from 'next/navigation';
import { COLLECTIONS, CollectionSlug, getCollectionMeta, getProductsByCategory } from '@/features/products/queries';
import { ProductGrid } from '@/features/products/components/product-grid';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return COLLECTIONS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params.slug as CollectionSlug;
  const collection = getCollectionMeta(slug);

  if (!collection) {
    return { title: 'Collection not found | DuBuBu' };
  }

  return {
    title: `${collection.title} | DuBuBu`,
    description: collection.description,
    openGraph: {
      title: `${collection.title} | DuBuBu`,
      description: collection.description,
    },
  };
}

export default async function CollectionPage({ params }: { params: { slug: string } }) {
  const slug = params.slug as CollectionSlug;
  const collection = getCollectionMeta(slug);

  if (!collection) {
    notFound();
  }

  const products = await getProductsByCategory(slug);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 space-y-2 text-center">
        <p className="text-sm uppercase tracking-wide text-brand-pink">Collections</p>
        <h1 className="font-heading text-4xl font-bold text-brand-brown">{collection.title}</h1>
        {collection.description && (
          <p className="text-gray-600">{collection.description}</p>
        )}
      </div>

      <ProductGrid products={products} emptyMessage="We are curating goodies for this collection. Check back soon!" />
    </div>
  );
}
