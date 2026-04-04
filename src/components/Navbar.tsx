import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingCart, ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Originals', href: '#' },
    { 
      name: 'Prints', 
      href: '#',
      dropdown: ['Giclee', 'Open Edition', 'Framed']
    },
    { 
      name: 'Cards & Gifts', 
      href: '#',
      dropdown: ['Notecards', 'Holiday Cards', 'Custom Stationery']
    },
    { 
      name: 'Commissions', 
      href: '#',
      dropdown: ['House Portraits', 'Custom Requests']
    },
    { name: 'About & Contact', href: '#' },
  ];

  return (
    <>
    <motion.header 
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2.0, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed w-full top-0 z-50 transition-colors duration-500 ${isScrolled ? 'bg-cream/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}
    >
      {/* Top Banner */}
      <div className="bg-sage text-ivory text-center py-2 text-xs tracking-widest font-serif uppercase">
        FREE SHIPPING ON ORDERS OVER $100+ & HOLIDAY COLLECTION PRE-SALE IS LIVE
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex justify-between items-center h-20 relative">
          
          {/* Left: Global Hamburger Menu */}
          <div className="flex items-center w-1/4">
            <button onClick={() => setMobileMenuOpen(true)} className="relative z-[60] hover:text-olive transition-colors text-ink cursor-pointer drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Center: Logo (Visible only when scrolled) */}
          <div className="flex-shrink-0 flex items-center justify-center pointer-events-none">
            <a 
              href="#" 
              className={`absolute top-1/2 left-1/2 z-50 transition-all duration-500 ease-out transform ${
                isScrolled 
                  ? 'opacity-100 -translate-x-1/2 -translate-y-1/2 pointer-events-auto' 
                  : 'opacity-0 -translate-x-1/2 -translate-y-[80%] pointer-events-none'
              }`}
            >
              <img 
                src="/jocelynmariasignature.png" 
                alt="Jocelyn Maria" 
                className="h-10 md:h-12 mt-1 w-auto object-contain drop-shadow-sm opacity-90 hover:opacity-100 transition-opacity duration-300" 
              />
            </a>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center justify-end w-1/4 space-x-4 lg:space-x-6 relative z-[60]">

            <button className="flex flex-col items-center group cursor-pointer drop-shadow-sm">
              <User className={`w-5 h-5 group-hover:text-olive transition-colors ${isScrolled ? 'text-ink' : 'text-ink md:text-white'}`} strokeWidth={1.5} />
              <span className={`text-[10px] font-serif uppercase mt-1 hidden md:block transition-colors ${isScrolled ? 'text-ink' : 'text-ink md:text-white'}`}>Account</span>
            </button>
            <button className="flex flex-col items-center group relative cursor-pointer drop-shadow-sm">
              <div className="relative">
                <ShoppingCart className={`w-5 h-5 group-hover:text-olive transition-colors ${isScrolled ? 'text-ink' : 'text-ink md:text-white'}`} strokeWidth={1.5} />
                <span className="absolute -top-1 -right-2 bg-blush text-ink text-[9px] font-bold px-1.5 py-0.5 rounded-full z-10">
                  3
                </span>
              </div>
              <span className={`text-[10px] font-serif uppercase mt-1 hidden md:block transition-colors ${isScrolled ? 'text-ink' : 'text-ink md:text-white'}`}>Cart</span>
            </button>
          </div>
        </div>
      </div>

    </motion.header>

      {/* Global Slide-Out Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[60]"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 w-80 max-w-[80vw] bg-ivory shadow-2xl z-[70] flex flex-col overflow-y-auto"
            >
              <div className="px-8 py-10 flex flex-col h-full">
                {/* Header inside drawer */}
                <div className="mb-12 flex justify-between items-center">
                  <span className="font-serif text-xl tracking-widest uppercase text-ink">
                    Menu
                  </span>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-ink hover:text-olive p-2 -mr-2 transition-colors cursor-pointer">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="space-y-8 flex-grow">
                  {navLinks.map((link) => (
                    <div key={link.name}>
                      <a href={link.href} className="block font-serif text-lg tracking-wider uppercase text-ink hover:text-olive transition-colors">
                        {link.name}
                      </a>
                      {link.dropdown && (
                        <div className="pl-4 mt-3 space-y-3 border-l-2 border-sage/30">
                          {link.dropdown.map((item) => (
                            <a key={item} href="#" className="block font-sans text-sm tracking-wide text-ink/70 hover:text-olive transition-colors">
                              {item}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer inside drawer */}
                <div className="w-full mt-4 flex flex-col items-center">
                  <div className="w-12 h-px bg-sage/40 mb-3"></div>
                  <p className="font-serif text-xs tracking-widest uppercase text-ink/50 text-center">
                    Est. 2024 • Made with care
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
