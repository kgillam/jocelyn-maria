import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter } from 'lucide-react';
import { allProducts, categories } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All Shop']);

  const toggleCategory = (item: string) => {
    if (item === 'All Shop') {
      setSelectedCategories(['All Shop']);
    } else {
      setSelectedCategories(prev => {
        const withoutAll = prev.filter(c => c !== 'All Shop');
        if (withoutAll.includes(item)) {
          const curr = withoutAll.filter(c => c !== item);
          return curr.length === 0 ? ['All Shop'] : curr;
        } else {
          return [...withoutAll, item];
        }
      });
    }
  };

  const filteredProducts = selectedCategories.includes('All Shop') 
    ? allProducts 
    : allProducts.filter(p => selectedCategories.includes(p.category));

  return (
    <main className="min-h-screen bg-cream pt-32 pb-24">
      {/* Minimalist Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h1 className="font-serif text-4xl md:text-5xl text-ink mb-6 uppercase tracking-[0.1em] md:tracking-[0.15em] font-light">Shop Collection</h1>
        <div className="w-16 h-px bg-olive mx-auto mb-10"></div>
        <p className="font-sans text-ink/70 text-sm md:text-base max-w-2xl mx-auto">
          Delicate, hand-painted original watercolors and curated prints. Find the perfect piece to bring a touch of timeless warmth into your home.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Horizontal Top Filter */}
        <div className="mb-12 border-b border-t border-sage/20 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-2 text-ink">
              <Filter className="w-5 h-5 text-olive" />
              <span className="font-serif text-lg">Filter:</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {categories.map((item) => (
                <label key={item} className="flex items-center space-x-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      name="category"
                      checked={selectedCategories.includes(item)}
                      onChange={() => toggleCategory(item)}
                      className="peer sr-only" 
                    />
                    <div className="w-4 h-4 border border-sage/60 rounded-sm bg-transparent peer-checked:border-olive peer-checked:bg-olive transition-colors flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-sm opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <span className={`text-sm font-sans transition-colors ${selectedCategories.includes(item) ? 'text-olive font-medium' : 'text-ink/70 group-hover:text-ink'}`}>
                    {item}
                  </span>
                </label>
              ))}
            </div>
            
            <div className="text-sm text-ink/60 font-sans hidden md:block">
              {filteredProducts.length} Products
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredProducts.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-serif text-xl text-ink/50">No products found for this category.</p>
          </div>
        )}
      </div>
    </main>
  );
}
