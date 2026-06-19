import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';

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
    <section ref={containerRef} className="relative w-full flex flex-col-reverse lg:flex-row overflow-hidden bg-cream min-h-[600px] lg:h-[800px]">

      {/* Paper texture + overlay (matches the hero) */}
      <div className="absolute inset-0 z-0 bg-[url('/papertexture.png')] bg-cover bg-center pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-white/50 pointer-events-none" />

      {/* Image Side (Left) */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 h-[400px] sm:h-[500px] lg:h-full relative overflow-hidden z-20 bg-ivory"
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
          <span className="font-serif tracking-[0.2em] uppercase text-xs text-olive/80 mb-8 block">
            Artist Spotlight
          </span>

          <div className="space-y-6 font-sans text-ink/70 leading-relaxed mb-10 text-sm md:text-base px-2">
            <p>
              Based in the quiet warmth of Central Louisiana and shaped by my roots in Central California, I am a watercolor and mixed-media artist dedicated to capturing the beauty found in everyday life. Through my work, I seek to preserve not only moments, but the feelings attached to them. I hope to capture the comfort, nostalgia, and meaning often discovered in life’s quietest experiences.
            </p>
            <p>
              Drawing upon a formal academic foundation with a degree in Studio Art and a concentration in Ceramics from Louisiana Christian University, I blend classical techniques with my love for feminine elegance, thoughtful detail, and organic imperfection.
            </p>
          </div>

          <div className="flex justify-center mt-4">
             <Link to="/meet-the-artist" className="py-3 px-8 border-b-2 border-olive text-ink font-serif uppercase tracking-widest text-xs hover:text-olive hover:bg-olive/5 transition-all duration-300 pointer-events-auto">
               Read The Full Story
             </Link>
          </div>
        </motion.div>
      </motion.div>

    </section>
  );
}
