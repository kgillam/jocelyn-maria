import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { allProducts } from '../data/products';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ProductGrid() {
  // Select one product from each category to create a 4-item showcase
  const featuredProducts = [
    allProducts.find(p => p.category === 'Cards'),
    allProducts.find(p => p.category === 'Watercolor Houses'),
    allProducts.find(p => p.category === 'Portraits'),
    allProducts.find(p => p.category === 'Original Paintings')
  ].filter(Boolean);

  return (
    <section className="py-24 bg-cream" id="collection">
      <div className="w-full px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16 relative z-10 flex flex-col items-center">
          <h2 className="font-serif text-2xl md:text-4xl text-ink mb-4 uppercase tracking-[0.1em] md:tracking-[0.15em] font-light">Featured Collections</h2>
          <div className="w-16 h-px bg-olive mb-6"></div>
          <p className="font-sans text-ink/70 max-w-2xl text-center mb-4">
            A curated showcase of original art, premium prints, and custom commissions.
          </p>
        </div>

        {/* 4-Item Side-by-Side Product Grid */}
        <div className="w-full">
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence>
              {featuredProducts.map((product) => (
                product ? <ProductCard key={product.id} product={product} /> : null
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Call to action below grid */}
        <div className="mt-16 flex justify-center">
          <Link to="/shop" className="inline-flex items-center text-sm font-serif uppercase tracking-widest text-olive hover:text-ink transition-colors group">
            Shop Full Collection
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
