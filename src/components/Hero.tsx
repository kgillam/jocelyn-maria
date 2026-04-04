import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';

const heroStates = [
  {
    id: 1,
    image: '/jocelynmariaheropic1.jpeg',
  },
  {
    id: 2,
    image: '/jocelynmariaheropic2.jpeg',
  },
  {
    id: 3,
    image: '/jocelynmariaheropic3.jpeg',
  }
];

export default function Hero() {
  const [currentState, setCurrentState] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });


  
  // Transform for text content to slip under the next section as we scroll past
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0px", "250px"]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentState((prev) => (prev + 1) % heroStates.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen flex flex-col lg:flex-row lg:h-screen w-full overflow-hidden bg-cream">
      {/* Left Content Area (Static) */}
      <div className="w-full lg:w-1/2 min-h-[60vh] lg:min-h-0 lg:h-full flex flex-col justify-center px-4 sm:px-16 lg:px-24 pt-32 lg:pt-0 pb-16 lg:pb-0 relative z-10 text-ink bg-cream border-b lg:border-b-0 border-sage/10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 3.3, ease: "easeOut" }}
          className="w-full flex justify-center"
        >
          <motion.div 
            style={{ opacity: textOpacity, y: textY }}
            className="max-w-md md:max-w-lg lg:max-w-xl flex flex-col items-center text-center space-y-4 md:space-y-6 mx-auto"
          >
          <img 
            src="/jocelynmarialogo.png" 
            alt="Jocelyn Maria Logo" 
            className="w-20 md:w-24 h-auto opacity-50 mb-2"
          />
          
          <img 
            src="/jocelynmariasignature.png" 
            alt="Jocelyn Maria" 
            className="w-[75%] sm:w-[85%] md:w-[80%] h-auto object-contain opacity-90 my-2 origin-center"
          />
          
          <div className="w-16 h-px bg-sage/60"></div>
          
          <p className="font-sans text-ink/70 text-sm md:text-base leading-relaxed px-4">
            Exquisite watercolor paintings, custom family portrait commissions, and beautifully crafted greeting cards.
          </p>
          
          <button className="mt-4 px-8 py-4 bg-ink text-ivory hover:bg-olive font-serif tracking-widest text-sm uppercase transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105">
            EXPLORE ORIGINAL WORKS
          </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Carousel Area (Sliding) */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-full min-h-[400px] lg:min-h-0 relative overflow-hidden z-20 bg-cream">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentState}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroStates[currentState].image})` }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Indicators on the Right Side */}
        <div className="absolute bottom-6 lg:bottom-12 left-0 right-0 flex justify-center space-x-3 z-20">
          {heroStates.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentState(index)}
              className={`h-2 transition-all duration-500 rounded-full ${
                index === currentState ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80 w-2'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
