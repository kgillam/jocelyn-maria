import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ArtistSpotlight from './components/ArtistSpotlight';
import CustomCommissions from './components/CustomCommissions';
import ProductGrid from './components/ProductGrid';
import BehindTheScenes from './components/BehindTheScenes';
import Footer from './components/Footer';
import FloatingOrderButton from './components/FloatingOrderButton';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Keep intro visible for 2 seconds, then transition
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-cream selection:bg-blush selection:text-ink">
      <LayoutGroup>
        <AnimatePresence>
          {showIntro && (
            <motion.div
              key="intro"
              className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center pointer-events-none"
              exit={{ opacity: 0, backgroundColor: 'rgba(255, 255, 255, 0)' }}
              transition={{ duration: 1.0, ease: 'easeInOut' }}
            >
              <motion.img 
                layoutId="signature"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.0 }}
                src="/jocelynmariasignature.png" 
                alt="Jocelyn Maria" 
                className="w-56 sm:w-64 md:w-[22rem] lg:w-[26rem] opacity-90 object-contain" 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* When the intro finishes, we mount the rest of the application. 
            Because they share LayoutGroup, the signature will seamlessly transition 
            to its new layout position in Hero.tsx */}
        {!showIntro && (
          <div className="relative">
            <Navbar />
            <main>
              <Hero />
              <ArtistSpotlight />
              <ProductGrid />
              <CustomCommissions />
              <BehindTheScenes />
            </main>
            <Footer />
            <FloatingOrderButton />
          </div>
        )}
      </LayoutGroup>
    </div>
  );
}
