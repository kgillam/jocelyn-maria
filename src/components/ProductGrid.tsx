import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { visibleProducts } from '../data/products';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ProductGrid() {
  // Show one product from each currently-marketed category.
  const featuredProducts = [
    visibleProducts.find(p => p.category === 'Watercolor Houses'),
    visibleProducts.find(p => p.category === 'Portraits')
  ].filter(Boolean);

  return (
    <section className="py-24 bg-cream" id="collection">
      <div className="w-full px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16 relative z-10 flex flex-col items-center">
          <h2 className="font-serif text-3xl md:text-5xl text-ink mb-4 uppercase tracking-[0.1em] md:tracking-[0.15em] font-light">What I Create</h2>
          <div className="w-16 h-px bg-olive mb-6"></div>
          <p className="font-sans text-ink/70 text-sm md:text-base max-w-2xl mx-auto">
            Hand-painted, made-to-order watercolor pieces — created from your most cherished photos and places.
          </p>
        </div>

        {/* Featured Products — larger, with image carousel + view details */}
        <div className="w-full max-w-5xl mx-auto">
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-10 lg:gap-16">
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
