import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CustomCommissions() {
  const [images, setImages] = useState([
    '/watercolorredbrickhome.png',
    '/watercolorbrickhome.png',
    '/watercolorwhitehome.png'
  ]);

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
    <section className="py-24 bg-ivory overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative z-10">
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

          {/* Right: Promotional Link to Dedicated Page */}
          <div className="bg-ivory p-8 md:p-16 rounded-2xl shadow-xl border border-sage/10 ml-0 lg:ml-8 order-1 flex flex-col justify-center items-center text-center">
            
            <h3 className="font-serif text-3xl md:text-4xl text-ink mb-6">Custom Commissions</h3>
            
            <p className="font-sans text-ink/70 leading-relaxed max-w-sm mb-10">
              Transform your most cherished memories—from the family home to precious portraits—into timeless watercolor heirlooms.
            </p>

            <Link to="/custom-commissions" className="group px-8 py-4 border-2 border-olive text-ink font-serif tracking-widest text-xs uppercase hover:bg-olive hover:text-white transition-all duration-300 flex items-center shadow-sm">
              Explore Commission Services
              <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
