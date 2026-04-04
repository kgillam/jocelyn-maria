import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, Star, ChevronDown, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';

const allProducts = [
  {
    id: 1,
    title: "Cards Collection",
    price: '$8.00+',
    images: [
      '/cardblueberry.png',
      '/cardlavender.png',
      '/cardmargaritas.png',
      '/cardmothersday.png'
    ],
    category: 'Cards',
    type: 'Cards (Multiple Variations)'
  },
  {
    id: 2,
    title: "Watercolor House Portraits",
    price: '$65.00',
    images: [
      '/watercolorbrickhome.png',
      '/watercolorredbrickhome.png',
      '/watercolorwhitehome.png'
    ],
    category: 'Watercolor Houses',
    type: 'Custom'
  },
  {
    id: 3,
    title: "Custom Portraits",
    price: '$30.00',
    images: [
      '/portraitgirlsontrip.png',
      '/portrait mom&daughter.png',
      '/portraitgirlscamp.png',
      '/portraitgirlsatprom.png',
      '/portraitmom&daughters.png',
      '/portraitmom&kidsreading.png'
    ],
    category: 'Portraits',
    type: 'Custom'
  },
  {
    id: 4,
    title: "Misty Mountains",
    price: '$150.00',
    images: [
      '/MistyMountains.png'
    ],
    category: 'Original Paintings',
    type: 'Original Painting'
  }
];

const categories = ['All Shop', 'Cards', 'Watercolor Houses', 'Portraits', 'Original Paintings'];

type Product = typeof allProducts[0];

function ProductCard({ product }: { product: Product; key?: React.Key }) {
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
      key={product.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="group cursor-pointer flex flex-col"
    >
      <div className="relative aspect-[4/3] mb-4 overflow-hidden rounded-sm">
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

export default function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState('All Shop');

  const filteredProducts = selectedCategory === 'All Shop' 
    ? allProducts 
    : allProducts.filter(p => p.category === selectedCategory);

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
                          type="radio" 
                          name="category"
                          checked={selectedCategory === item}
                          onChange={() => setSelectedCategory(item)}
                          className="peer sr-only" 
                        />
                        <div className="w-4 h-4 border border-sage/60 rounded-full bg-transparent peer-checked:border-olive peer-checked:bg-olive transition-colors flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <span className={`text-sm font-sans transition-colors ${selectedCategory === item ? 'text-olive font-medium' : 'text-ink/70 group-hover:text-ink'}`}>
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
