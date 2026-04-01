import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export default function ArtistSpotlight() {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax transform for the image
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  
  // Text content fades out and slips under as you scroll past the section
  const textOpacity = useTransform(scrollYProgress, [0.5, 0.9], [1, 0]);
  const textY = useTransform(scrollYProgress, [0.5, 1], ["0px", "200px"]);

  return (
    <section ref={containerRef} className="relative w-full flex flex-col-reverse lg:flex-row overflow-hidden bg-ivory texture-overlay min-h-[600px] lg:h-[800px]">
      
      {/* Image Side (Left) */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 h-[400px] sm:h-[500px] lg:h-full relative overflow-hidden"
      >
        <motion.img 
          src="/Jocelyn%20Maria%20Headshot1.jpg" 
          alt="Jocelyn Maria" 
          style={{ y: imageY, scale: 1.25 }}
          className="absolute inset-0 w-full h-full object-cover object-[center_30%]" 
        />
      </motion.div>

      {/* Bio Side (Right) */}
      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-16 lg:py-0 text-center z-10"
      >
        <motion.div style={{ opacity: textOpacity, y: textY }} className="max-w-xl mx-auto flex flex-col items-center text-center">
          <span className="font-serif tracking-[0.2em] uppercase text-xs text-olive/80 mb-4 block">
            Artist Spotlight
          </span>
          
          <div className="mb-8 flex justify-center mt-2">
            <img src="/jocelynmarianame2.png" alt="Jocelyn Maria" className="h-16 md:h-20 lg:h-24 w-auto object-contain drop-shadow-sm opacity-90" />
          </div>

          <div className="space-y-6 font-sans text-ink/70 leading-relaxed mb-10 text-sm md:text-base px-2">
            <p>
              Based in the quiet warmth of Central Louisiana, Jocelyn transforms everyday moments into timeless watercolor and portrait art. Drawing upon an academic foundation with a degree in Ceramics and Fine Art from Louisiana Christian University, she blends classical technique with a distinctive love for feminine elegance.
            </p>
            <p>
              Her minimalist approach emphasizes the raw emotion and subtle grace hidden within each subject. Every brushstroke is carefully nuanced to create pieces that feel intimate, personal, and effortlessly sophisticated—inviting you to pause and appreciate the delicate beauty of the world.
            </p>
          </div>

          <div className="flex justify-center">
             <button className="py-3 px-8 border-b-2 border-olive text-ink font-serif uppercase tracking-widest text-xs hover:text-olive hover:bg-olive/5 transition-all duration-300 pointer-events-auto">
               Read The Full Story
             </button>
          </div>
        </motion.div>
      </motion.div>

    </section>
  );
}
