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
            src="/jocelynmarianame2.png" 
            alt="Jocelyn Maria" 
            className="w-72 sm:w-80 md:w-[30rem] lg:w-[36rem] opacity-90 object-contain drop-shadow-md" 
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
