import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Keep the splash screen visible for 2.8 seconds before triggering the exit animation
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-ivory flex flex-col items-center justify-center pointer-events-none"
        >
          <motion.img 
            initial={{ opacity: 0, y: 10, rotate: -30 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
            src="/jocelynmarialogo.png" 
            alt="Poppy Logo" 
            className="w-10 md:w-14 mb-8 opacity-80" 
          />
          <img 
            src="/jocelynmariasignature.png" 
            alt="Jocelyn Maria" 
            className="w-56 sm:w-64 md:w-[22rem] lg:w-[26rem] opacity-90 object-contain" 
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
