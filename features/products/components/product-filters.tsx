'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { COLLECTIONS, PRICE_RANGES, SORT_OPTIONS } from '../queries';
import { cn } from '@/lib/utils';
import { X, Filter, SlidersHorizontal } from 'lucide-react';

interface ProductFiltersProps {
  showCategoryFilter?: boolean;
  showMobileToggle?: boolean;
}

export function ProductFilters({ showCategoryFilter = true, showMobileToggle = false }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get('category') || 'all';
  const currentMinPrice = searchParams.get('minPrice');
  const currentMaxPrice = searchParams.get('maxPrice');
  const currentSort = searchParams.get('sort') || 'newest';

  const createQueryString = useCallback(
    (params: Record<string, string | undefined>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });

      return newParams.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (params: Record<string, string | undefined>) => {
    startTransition(() => {
      const queryString = createQueryString(params);
      router.push(`${pathname}${queryString ? `?${queryString}` : ''}`);
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasActiveFilters = currentCategory !== 'all' || currentMinPrice || currentMaxPrice;

  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="w-full justify-start text-gray-500 hover:text-brand-pink"
        >
          <X className="w-4 h-4 mr-2" />
          Clear all filters
        </Button>
      )}

      {/* Categories */}
      {showCategoryFilter && (
        <div>
          <h3 className="font-semibold text-brand-brown mb-3">Categories</h3>
          <div className="space-y-2">
            <button
              onClick={() => handleFilterChange({ category: undefined })}
              className={cn(
                'block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                currentCategory === 'all'
                  ? 'bg-brand-soft-pink text-brand-pink font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              All Products
            </button>
            {COLLECTIONS.map((collection) => (
              <button
                key={collection.slug}
                onClick={() => handleFilterChange({ category: collection.slug })}
                className={cn(
                  'block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                  currentCategory === collection.slug
                    ? 'bg-brand-soft-pink text-brand-pink font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {collection.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-brand-brown mb-3">Price</h3>
        <div className="space-y-2">
          <button
            onClick={() => handleFilterChange({ minPrice: undefined, maxPrice: undefined })}
            className={cn(
              'block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
              !currentMinPrice && !currentMaxPrice
                ? 'bg-brand-soft-pink text-brand-pink font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            All Prices
          </button>
          {PRICE_RANGES.map((range) => {
            const isActive =
              currentMinPrice === String(range.min) &&
              (range.max === undefined
                ? !currentMaxPrice
                : currentMaxPrice === String(range.max));

            return (
              <button
                key={range.label}
                onClick={() =>
                  handleFilterChange({
                    minPrice: String(range.min),
                    maxPrice: range.max !== undefined ? String(range.max) : undefined,
                  })
                }
                className={cn(
                  'block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-brand-soft-pink text-brand-pink font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="font-semibold text-brand-brown mb-3">Sort By</h3>
        <div className="space-y-2">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterChange({ sort: option.value })}
              className={cn(
                'block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                currentSort === option.value
                  ? 'bg-brand-soft-pink text-brand-pink font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Sort dropdown for mobile/header
export function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSort = searchParams.get('sort') || 'newest';

  const handleSortChange = (value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('sort', value);
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <select
      value={currentSort}
      onChange={(e) => handleSortChange(e.target.value)}
      className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-pink"
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
