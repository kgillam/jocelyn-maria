import React from 'react';
import { motion } from 'motion/react';

// Pre-defining an array of gallery images with varied tailwind spans to create a true masonry/bento effect
const galleryItems = [
  { src: '/jocelynmariaheropic1.jpeg', alt: 'Artist Painting', span: 'col-span-2 row-span-2 md:col-span-2 md:row-span-3' },
  { src: '/MistyMountains.png', alt: 'Misty Mountains', span: 'col-span-2 row-span-1 md:col-span-3 md:row-span-2' },
  { src: '/watercolorbrickhome.png', alt: 'Watercolor Brick Home', span: 'col-span-1 row-span-1 md:col-span-1 md:row-span-2' },
  { src: '/momandgirlsportrait.png', alt: 'Mom and Girls Portrait', span: 'col-span-1 row-span-2 md:col-span-2 md:row-span-2' },
  { src: '/jocelynmariaheropic2.jpeg', alt: 'Painting Process', span: 'col-span-2 row-span-2 md:col-span-2 md:row-span-2' },
  { src: '/cardblueberryproduct.png?v=4', alt: 'Blueberry Greeting Card', span: 'col-span-1 row-span-1 md:col-span-1 md:row-span-1' },
  { src: '/girlsatpromportrait.png', alt: 'Girls at Prom', span: 'col-span-1 row-span-1 md:col-span-1 md:row-span-1' },
  { src: '/watercolorredbrickhome.png', alt: 'Red Brick Home', span: 'col-span-2 row-span-2 md:col-span-3 md:row-span-2' },
  { src: '/girlsontripportrait.png', alt: 'Girls on Trip', span: 'col-span-1 row-span-1 md:col-span-1 md:row-span-2' },
  { src: '/cardlavenderproduct.png?v=4', alt: 'Lavender Greeting Card', span: 'col-span-1 row-span-1 md:col-span-2 md:row-span-2' },
  { src: '/momanddaughterportrait.png', alt: 'Mom and Daughter', span: 'col-span-1 row-span-1 md:col-span-1 md:row-span-2' },
  { src: '/jocelynmariaheropic3.jpeg', alt: 'Studio Detail', span: 'col-span-2 row-span-1 md:col-span-3 md:row-span-1' },
];

export default function Gallery() {
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

      {/* Full width, 0-gap Grid */}
      <div className="w-full">
        {/* We use grid-cols-2 on mobile and grid-cols-6 on desktop. 
            auto-rows creates dynamic height chunks combined with row-span */}
        <div className="grid grid-cols-2 md:grid-cols-6 auto-rows-[150px] md:auto-rows-[250px] gap-0 overflow-hidden">
          {galleryItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative group overflow-hidden bg-sage/5 ${item.span}`}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover object-center transform transition-transform duration-[1.5s] ease-out group-hover:scale-110 will-change-transform"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-500 Mix-blend-multiply pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>

    </main>
  );
}
