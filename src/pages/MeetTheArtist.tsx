import React from 'react';
import { motion } from 'motion/react';

export default function MeetTheArtist() {
  const galleryImages = [
    { src: '/Jocelyn Maria Headshot1.jpg', alt: 'Jocelyn Portrait 1' },
    { src: '/jocelynpic2.JPG', alt: 'Jocelyn Portrait 2' },
    { src: '/jocelynpic3.JPG', alt: 'Jocelyn Portrait 3' },
    { src: '/jocelynpic4.JPG', alt: 'Jocelyn Portrait 4' },
  ];

  return (
    <main className="min-h-screen bg-ivory pt-32 pb-0 texture-overlay overflow-hidden">
      
      {/* Editorial Header Sequence */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center mb-8 lg:mb-12">
        <motion.p 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="font-serif tracking-[0.2em] uppercase text-xs text-olive/80 mb-6 text-center"
        >
          Behind The Canvas
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-4xl md:text-5xl text-ink mb-6 uppercase tracking-[0.1em] text-center font-light"
        >
          Meet Jocelyn
        </motion.h1>
        <motion.div initial={{ width: 0 }} animate={{ width: '4rem' }} transition={{ duration: 1, delay: 0.2 }} className="h-px bg-olive mx-auto mb-6 lg:mb-16"></motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          
          {/* Main Portrait Flow */}
          <div className="w-full lg:w-5/12 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative rounded-t-full overflow-hidden shadow-2xl border-x-4 border-t-4 border-white aspect-[3/4]"
            >
              <img src="/jocelynpic1.JPG" alt="Jocelyn Maria Portrait" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-sage/5 mix-blend-multiply pointer-events-none" />
            </motion.div>
            
            {/* Decorative Elements */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-olive/10 rounded-full blur-2xl z-0" />
          </div>

          {/* Expanded Biography & Typeography Flow */}
          <div className="w-full lg:w-7/12 flex flex-col justify-center relative z-10 pt-8 lg:pt-12">
            
            <h2 className="font-serif text-2xl md:text-3xl text-ink mb-8 leading-snug">
              Art created to preserve memories and evoke feeling.
            </h2>

            <div className="space-y-6 font-sans text-ink/75 leading-relaxed text-sm md:text-base">
              <p>
                Art created to preserve memories and evoke feeling.
              </p>

              <p>
                Based in the quiet warmth of Central Louisiana and shaped by my roots in Central California, I am a watercolor and mixed-media artist dedicated to capturing the beauty found in everyday life. Through my work, I seek to preserve not only moments, but the feelings attached to them. I hope to capture the comfort, nostalgia, and meaning often discovered in life’s quietest experiences.
              </p>

              <p>
                Drawing upon a formal academic foundation with a degree in Studio Art and a concentration in Ceramics from Louisiana Christian University, I blend classical techniques with my love for feminine elegance, thoughtful detail, and organic imperfection.
              </p>

              <p>
                When I’m not in the studio layering washes of color, you can often find me seeking inspiration in local architecture, creating cozy and collected spaces at home, or spending time with family. Each piece is created with intention and care, with the hope that it becomes something meaningful. Whether displayed in a home, gifted to someone special, or treasured for years to come.
              </p>
            </div>

            {/* Blockquote Emphasis */}
            <blockquote className="my-10 pl-6 border-l-2 border-olive/40 py-2 relative">
              <span className="absolute -top-4 -left-2 text-6xl text-olive/20 font-serif">"</span>
              <p className="font-serif text-xl md:text-2xl italic text-ink/90 leading-relaxed max-w-lg relative z-10">
                Every brushstroke is carefully nuanced to create pieces that feel intimate, personal, and effortlessly sophisticated.
              </p>
            </blockquote>

            <p className="font-sans text-ink/75 leading-relaxed text-sm md:text-base">
              When I'm not in the studio layering washes of color, you can often find me seeking inspiration in local architecture, curating cozy interior spaces, or enjoying time with my family. My ultimate goal with every commission or original painting is to invite you to pause, breathe, and appreciate the delicate beauty of the world around you.
            </p>

            <div 
              className="relative mt-10 inline-block"
              style={{ backgroundImage: 'url(/logo/byJocelynMaria-logo.png)', backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundBlendMode: 'multiply' }}
            >
              <div className="absolute inset-0 bg-ivory/95 pointer-events-none" />
              <img src="/jocelynmariasignature.png" alt="Signature" className="relative h-16 object-contain opacity-80 mix-blend-multiply" />
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Strip / Grid Gallery */}
      <div className="w-full mt-32 relative z-10 pb-0 overflow-hidden border-t border-sage/20">
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-0">
          {galleryImages.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: idx * 0.1 }}
              className="relative w-full aspect-[3/4] lg:aspect-[4/5] overflow-hidden group"
            >
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover object-center grayscale-[20%] group-hover:grayscale-0 transition-all duration-[1s]" />
              <div className="absolute inset-0 bg-ink/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>

    </main>
  );
}
