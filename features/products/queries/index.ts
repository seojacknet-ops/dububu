import { products } from '@/lib/data/products';
import { Product } from '@/lib/types';

export const COLLECTIONS = [
  { slug: 'plushies', title: 'Plushies', description: 'Soft, huggable Bubu & Dudu plushies for every mood.' },
  { slug: 'apparel', title: 'Apparel', description: 'Cozy fits for couples who match in style.' },
  { slug: 'accessories', title: 'Accessories', description: 'Everyday essentials that keep Bubu & Dudu close.' },
  { slug: 'home', title: 'Home & Living', description: 'Cozy home essentials featuring Bubu & Dudu.' },
  { slug: 'gift-sets', title: 'Gift Sets', description: 'Curated bundles for anniversaries, birthdays, and just because.' },
  { slug: 'matching-sets', title: 'Matching Sets', description: 'Couple-perfect outfits and bundles that pair together.' },
] as const;

export type CollectionSlug = (typeof COLLECTIONS)[number]['slug'];

export function getCollectionMeta(slug: string) {
  return COLLECTIONS.find((collection) => collection.slug === slug);
}

export async function getProductsByCategory(slug: CollectionSlug): Promise<Product[]> {
  return products.filter((product) => product.category === slug);
}

export async function getAllProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((product) => product.slug === slug);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return products.filter((product) => product.featured);
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
  search?: string;
  tags?: string[];
  inStock?: boolean;
}

export async function getFilteredProducts(filters: ProductFilters): Promise<Product[]> {
  let filtered = [...products];

  // Filter by category
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter((p) => p.category === filters.category);
  }

  // Filter by price range
  if (filters.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
  }

  // Filter by search query
  if (filters.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  // Filter by tags
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((p) =>
      filters.tags!.some((tag) => p.tags?.includes(tag))
    );
  }

  // Filter by stock
  if (filters.inStock) {
    filtered = filtered.filter((p) => p.inStock);
  }

  // Sort products
  if (filters.sort) {
    switch (filters.sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
      default:
        // Keep default order (newest first is assumed)
        break;
    }
  }

  return filtered;
}

// Price ranges for filtering
export const PRICE_RANGES = [
  { label: 'Under $25', min: 0, max: 25 },
  { label: '$25 - $50', min: 25, max: 50 },
  { label: '$50 - $75', min: 50, max: 75 },
  { label: 'Over $75', min: 75, max: undefined },
] as const;

// Sort options
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
] as const;
