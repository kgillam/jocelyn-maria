import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Unified gallery images — we will render them with a consistent aspect ratio
const galleryItems = [
  { src: '/jocelynmariaheropic1.jpeg', alt: 'Artist Painting' },
  { src: '/MistyMountains.png', alt: 'Misty Mountains' },
  { src: '/watercolorbrickhome.png', alt: 'Watercolor Brick Home' },
  { src: '/momandgirlsportrait.png', alt: 'Mom and Girls Portrait' },
  { src: '/jocelynmariaheropic2.jpeg', alt: 'Painting Process' },
  { src: '/cardblueberryproduct.png?v=4', alt: 'Blueberry Greeting Card' },
  { src: '/girlsatpromportrait.png', alt: 'Girls at Prom' },
  { src: '/watercolorredbrickhome.png', alt: 'Red Brick Home' },
  { src: '/girlsontripportrait.png', alt: 'Girls on Trip' },
  { src: '/cardlavenderproduct.png?v=4', alt: 'Lavender Greeting Card' },
  { src: '/momanddaughterportrait.png', alt: 'Mom and Daughter' },
  { src: '/jocelynmariaheropic3.jpeg', alt: 'Studio Detail' },
];

export default function Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = useCallback((index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const showPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + galleryItems.length) % galleryItems.length);
  }, []);

  const showNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % galleryItems.length);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, closeLightbox, showPrev, showNext]);
  return (
    <main className="min-h-screen bg-cream pt-32 pb-0">
      
      {/* Header section matching Shop/Contact minimalism */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h1 className="font-serif text-4xl md:text-5xl text-ink mb-6 uppercase tracking-[0.1em] md:tracking-[0.15em] font-light">
          The Gallery
        </h1>
        <div className="w-16 h-px bg-olive mx-auto mb-10"></div>
        <p className="font-sans text-ink/70 text-sm md:text-base max-w-2xl mx-auto">
          An immersive curation of past works, custom portraits, and the sunlit studio process. A glimpse into the beauty of everyday moments translated to canvas.
        </p>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={closeLightbox} />

          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.18 }} className="relative z-50 max-w-5xl w-full mx-4">
            <button onClick={closeLightbox} className="absolute top-4 right-4 z-60 p-2 rounded-full bg-black/40 text-white hover:bg-black/60">
              <X className="w-5 h-5" />
            </button>

            <div className="relative bg-black rounded-md overflow-hidden">
              <img src={galleryItems[currentIndex].src} alt={galleryItems[currentIndex].alt} className="w-full max-h-[80vh] object-contain mx-auto block" />

              <button onClick={(e) => { e.stopPropagation(); showPrev(); }} aria-label="Previous" className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60">
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button onClick={(e) => { e.stopPropagation(); showNext(); }} aria-label="Next" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60">
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="absolute left-1/2 -translate-x-1/2 bottom-3 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {galleryItems.length}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Full width, 0-gap Grid */}
      <div className="w-full">
        {/* We use grid-cols-2 on mobile and grid-cols-6 on desktop. 
            auto-rows creates dynamic height chunks combined with row-span */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 overflow-hidden">
          {galleryItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.06 }}
              className={`relative group overflow-hidden bg-sage/5`}
            >
              <button
                onClick={() => openLightbox(index)}
                className="w-full h-full block"
                aria-label={`Open image ${index + 1}`}
              >
                <div className="aspect-square w-full">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover object-center transform transition-transform duration-[1.5s] ease-out group-hover:scale-110 will-change-transform"
                  />
                </div>
              </button>
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-500 mix-blend-multiply pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>

    </main>
  );
}
