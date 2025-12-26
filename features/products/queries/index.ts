import { products } from '@/lib/data/products';
import { Product } from '@/lib/types';

export const COLLECTIONS = [
  { slug: 'plushies', title: 'Plushies', description: 'Soft, huggable Bubu & Dudu plushies for every mood.' },
  { slug: 'apparel', title: 'Apparel', description: 'Cozy fits for couples who match in style.' },
  { slug: 'accessories', title: 'Accessories', description: 'Everyday essentials that keep Bubu & Dudu close.' },
  { slug: 'gift-sets', title: 'Gift Sets', description: 'Curated bundles for anniversaries, birthdays, and just because.' },
  { slug: 'matching-sets', title: 'Matching Sets', description: 'Couple-perfect outfits and bundles that pair together.' },
] as const;

export type CollectionSlug = (typeof COLLECTIONS)[number]['slug'];

export function getCollectionMeta(slug: CollectionSlug) {
  return COLLECTIONS.find((collection) => collection.slug === slug);
}

export async function getProductsByCategory(slug: CollectionSlug): Promise<Product[]> {
  return products.filter((product) => product.category === slug);
}

export async function getAllProducts(): Promise<Product[]> {
  return products;
}
