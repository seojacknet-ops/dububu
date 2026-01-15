'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { searchProducts } from '@/lib/data/products';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export function SearchBar({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    startTransition(() => {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
      onClose?.();
    });
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for plushies, hoodies, mugs..."
        className="w-full pl-10 pr-4 py-3 text-lg"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      {isPending && (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
      )}
    </form>
  );
}

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ReturnType<typeof searchProducts>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (query.length >= 2) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        const searchResults = searchProducts(query);
        setResults(searchResults.slice(0, 6));
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  const handleProductClick = () => {
    onClose();
    setQuery('');
    setResults([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white shadow-2xl"
          >
            <div className="container mx-auto px-4 py-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg font-bold text-brand-brown">Search</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="relative mb-4">
                <Input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for plushies, hoodies, mugs..."
                  className="w-full pl-10 pr-12 py-3 text-lg border-2 border-brand-pink focus:ring-brand-pink"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-pink text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-brand-blush transition"
                >
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                </button>
              </form>

              {/* Results */}
              {results.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-3">
                    {results.length} result{results.length !== 1 ? 's' : ''} found
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        href={`/shop/products/${product.slug}`}
                        onClick={handleProductClick}
                        className="group"
                      >
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-brand-cream mb-2">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                            unoptimized
                          />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-brand-pink transition">
                          {product.name}
                        </h3>
                        <p className="text-sm text-brand-pink font-semibold">
                          {formatPrice(product.price)}
                        </p>
                      </Link>
                    ))}
                  </div>

                  {query.length >= 2 && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={handleSearch}
                        className="text-brand-pink hover:underline text-sm font-medium"
                      >
                        View all results for &quot;{query}&quot; →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* No Results */}
              {query.length >= 2 && results.length === 0 && !isSearching && (
                <div className="text-center py-8 text-gray-500">
                  <p>No products found for &quot;{query}&quot;</p>
                  <p className="text-sm mt-1">Try a different search term</p>
                </div>
              )}

              {/* Popular Searches */}
              {query.length < 2 && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-3">Popular searches</p>
                  <div className="flex flex-wrap gap-2">
                    {['plushies', 'hoodies', 'mugs', 'keychains', 'matching', 'gift set'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-3 py-1.5 bg-brand-soft-pink text-brand-pink rounded-full text-sm hover:bg-brand-pink hover:text-white transition"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
