import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter } from 'lucide-react';
import { allProducts, categories } from '../data/products';
import ProductCard from './ProductCard';

export default function ProductGrid() {
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
    <section className="py-24 bg-cream" id="collection">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 relative z-10">
          <h2 className="font-serif text-2xl md:text-4xl text-ink mb-4 uppercase tracking-[0.1em] md:tracking-[0.15em] font-light">Featured Collections</h2>
          <div className="w-16 h-px bg-olive mx-auto"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Filtering */}
          <div className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-40 self-start">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-sage/20">
              <h3 className="font-serif text-xl text-ink">Filter Collection</h3>
              <Filter className="w-5 h-5 text-olive" />
            </div>
            
            <div className="space-y-8">
              {/* Filter Group 1 */}
              <div>
                <h4 className="font-serif text-lg text-ink mb-4 flex justify-between items-center">
                  Category
                </h4>
                <div className="space-y-3">
                  {categories.map((item) => (
                    <label key={item} className="flex items-center space-x-3 cursor-pointer group">
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
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <p className="text-sm text-ink/60 font-sans">Showing {filteredProducts.length} products</p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-ink/60 font-sans">Sort by:</span>
                <select className="bg-transparent border-none text-sm font-serif text-ink focus:ring-0 cursor-pointer outline-none">
                  <option>Featured</option>
                  <option>Newest Arrivals</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
        </div>
      </div>
    </section>
  );
}
