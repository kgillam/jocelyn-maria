import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { visibleProducts, parsePrice, formatPrice } from '../data/products';

export default function CustomCommissions() {
  const [images, setImages] = useState([
    '/watercolorredbrickhome.png',
    '/watercolorbrickhome.png',
    '/watercolorwhitehome.png'
  ]);

  // Quick-order configuration for the house portrait.
  const housePortrait = visibleProducts.find(p => p.category === 'Watercolor Houses');
  const [quickSize, setQuickSize] = useState<string | undefined>(housePortrait?.sizes?.[0]?.label);
  const selectedQuickSize = housePortrait?.sizes?.find(s => s.label === quickSize);
  const quickPrice = selectedQuickSize
    ? selectedQuickSize.price
    : housePortrait
      ? parsePrice(housePortrait.price)
      : 0;
  const quickOrderHref = housePortrait
    ? `/shop/${housePortrait.id}${quickSize ? `?size=${encodeURIComponent(quickSize)}` : ''}`
    : '/shop';

  const handleImageSwap = (clickedIndex: number) => {
    if (clickedIndex === 0) return;
    setImages(prev => {
      const newArr = [...prev];
      const temp = newArr[0];
      newArr[0] = newArr[clickedIndex];
      newArr[clickedIndex] = temp;
      return newArr;
    });
  };

  return (
    <section className="relative py-24 bg-ivory bg-[url('/papertexture.png')] bg-cover bg-center overflow-hidden">
      <div className="absolute inset-0 bg-white/50 pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 relative z-10">
          <p className="font-sans text-xs md:text-sm uppercase tracking-[0.25em] text-olive mb-4">Capturing the Places You Love</p>
          <h2 className="font-serif text-2xl md:text-4xl text-ink mb-4 uppercase tracking-[0.1em] md:tracking-[0.15em] font-light">House Portraits: Custom Commissions</h2>
          <div className="w-16 h-px bg-olive mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Floating Gallery */}
          <div className="relative h-[400px] md:h-[500px] w-full flex items-center justify-center group perspective-1000 order-2">
             {images.map((src, index) => {
               const isMain = index === 0;
               const isSec1 = index === 1;
               
               let className = "";
               let animY = [];
               let trans: any = {};

               if (isMain) {
                 className = "w-[80%] h-auto object-contain drop-shadow-2xl absolute z-20 hover:scale-105 transition-transform duration-500 cursor-pointer transform-gpu";
                 animY = [-15, 15, -15];
                 trans = { duration: 8, repeat: Infinity, ease: "easeInOut", layout: { duration: 0.6, ease: "circOut" } };
               } else if (isSec1) {
                 className = "w-[75%] h-auto object-contain drop-shadow-xl absolute top-4 md:top-8 left-0 md:-left-4 z-10 opacity-70 hover:!opacity-100 hover:!z-30 transition-all duration-700 cursor-pointer transform-gpu";
                 animY = [10, -10, 10];
                 trans = { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1, layout: { duration: 0.6, ease: "circOut" } };
               } else {
                 className = "w-[75%] h-auto object-contain drop-shadow-xl absolute bottom-4 md:bottom-8 right-0 md:-right-4 z-10 opacity-70 hover:!opacity-100 hover:!z-30 transition-all duration-700 cursor-pointer transform-gpu";
                 animY = [-8, 8, -8];
                 trans = { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2, layout: { duration: 0.6, ease: "circOut" } };
               }

               return (
                 <motion.img 
                   key={src}
                   layout
                   onClick={() => handleImageSwap(index)}
                   src={src} 
                   alt={`House Portrait ${index}`} 
                   className={className}
                   animate={{ y: animY }}
                   transition={trans}
                 />
               );
             })}
          </div>

          {/* Right: Quick Order Card */}
          <div className="bg-transparent p-8 md:p-12 rounded-2xl border border-sage/30 ml-0 lg:ml-8 order-1 flex flex-col justify-center items-center text-center">

            <p className="font-sans text-xs uppercase tracking-[0.25em] text-olive mb-3">Quick Order</p>
            <h3 className="font-serif text-3xl md:text-4xl text-ink mb-2">Watercolor House Portrait</h3>
            <p className="font-sans text-2xl text-ink/90 mb-8">{formatPrice(quickPrice)}</p>

            {housePortrait?.sizes && housePortrait.sizes.length > 0 && (
              <div className="w-full max-w-xs mb-8">
                <p className="font-serif text-sm tracking-widest uppercase text-ink/80 mb-3">Size</p>
                <div className="flex justify-center gap-3">
                  {housePortrait.sizes.map(s => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => setQuickSize(s.label)}
                      className={`px-5 py-2.5 border font-sans text-sm transition-colors ${
                        quickSize === s.label
                          ? 'border-olive bg-olive/5 text-ink'
                          : 'border-sage/40 text-ink/70 hover:border-sage/70'
                      }`}
                    >
                      {s.label} — {formatPrice(s.price)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Link
              to={quickOrderHref}
              className="group w-full max-w-xs px-8 py-4 bg-ink text-cream font-serif tracking-widest text-xs uppercase hover:bg-olive transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              Start Your Order
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>

            <p className="font-sans text-xs text-ink/50 mt-4 max-w-xs">
              Choose your options and add your reference photo on the next step.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
