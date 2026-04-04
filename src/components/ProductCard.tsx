import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../data/products';

export default function ProductCard({ product }: { product: Product; key?: React.Key }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDirection(-1);
    setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDirection(1);
    setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="group cursor-pointer flex flex-col"
    >
      <div className="relative aspect-[4/3] mb-4 overflow-hidden rounded-sm bg-transparent">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img 
            key={currentImageIndex}
            src={product.images[currentImageIndex]} 
            alt={`${product.title} ${currentImageIndex + 1}`} 
            custom={direction}
            variants={{
              enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (dir: number) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 })
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 drop-shadow-lg"
          />
        </AnimatePresence>
        
        {/* Navigation Arrows */}
        {product.images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10">
            <button 
              onClick={handlePrev} 
              className="bg-white/80 hover:bg-white text-ink rounded-full p-1.5 shadow-sm transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={handleNext} 
              className="bg-white/80 hover:bg-white text-ink rounded-full p-1.5 shadow-sm transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dots */}
        {product.images.length > 1 && (
          <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10">
            {product.images.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        )}

        {/* Enhanced Quick View Button */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
          <button className="w-full bg-white/95 text-ink py-3 font-serif uppercase tracking-widest text-xs hover:bg-ink hover:text-white transition-colors flex items-center justify-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Quick View
          </button>
        </div>
      </div>
      
      <div className="text-center mt-auto">
        <p className="text-[10px] font-sans text-ink/50 uppercase tracking-widest mb-1.5">{product.type}</p>
        <h3 className="font-serif text-lg text-ink mb-1.5 group-hover:text-olive transition-colors">{product.title}</h3>
        <p className="font-sans text-sm text-ink/80">{product.price}</p>
      </div>
    </motion.div>
  );
}
