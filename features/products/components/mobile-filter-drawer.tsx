'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProductFilters } from './product-filters';
import { Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function MobileFilterDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <Filter className="w-4 h-4" />
        Filters
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white shadow-xl overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-4">
                <h2 className="font-heading text-lg font-bold text-brand-brown">Filters</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Filters */}
              <div className="p-4">
                <ProductFilters showCategoryFilter={true} />
              </div>

              {/* Apply Button */}
              <div className="sticky bottom-0 border-t bg-white p-4">
                <Button
                  onClick={() => setIsOpen(false)}
                  className="w-full"
                >
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
