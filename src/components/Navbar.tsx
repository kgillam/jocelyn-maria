import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { InstagramIcon, TikTokIcon, INSTAGRAM_URL, TIKTOK_URL } from './SocialIcons';
import { useIntroOnce } from '../utils/useIntroOnce';

const searchablePages = [
  { name: 'Home', description: 'Return to the homepage', href: '/' },
  { name: 'Shop', description: 'Browse the full collection', href: '/shop' },
  { name: 'Meet The Artist', description: 'About JocelynMaria', href: '/meet-the-artist' },
  { name: 'Gallery', description: 'View past work', href: '/gallery' },
  { name: 'Contact', description: 'Get in touch', href: '/contact' },
  { name: 'Cart', description: 'Review your order', href: '/cart' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { visibleProducts } = useProducts();
  // Play the header entrance on load/refresh only, not on in-app navigation.
  const playIntro = useIntroOnce('header');
  
  // The centered signature/logo shows once scrolled on the homepage, but stays
  // visible at the top on every other page.
  const showLogo = isScrolled || !isHomePage;
  const iconColorClass = isHomePage ? (isScrolled ? 'text-ink' : 'text-ink md:text-white') : 'text-ink';
  const shadowClass = isHomePage ? 'drop-shadow-sm' : '';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // When the search overlay is open: focus the field, lock scroll, allow Escape.
  useEffect(() => {
    if (!searchOpen) return;
    searchInputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', onKey);
    };
  }, [searchOpen]);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery('');
  };

  const trimmedQuery = query.trim().toLowerCase();
  const productResults = trimmedQuery
    ? visibleProducts.filter(p =>
        `${p.title} ${p.type} ${p.category}`.toLowerCase().includes(trimmedQuery)
      )
    : [];
  const pageResults = trimmedQuery
    ? searchablePages.filter(p =>
        `${p.name} ${p.description}`.toLowerCase().includes(trimmedQuery)
      )
    : [];
  const hasResults = productResults.length > 0 || pageResults.length > 0;

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Meet The Artist', href: '/meet-the-artist' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <motion.header
        initial={playIntro ? { opacity: 0, y: -100 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.0, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed w-full top-0 z-50 transition-colors duration-500 ${isScrolled ? 'bg-cream/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}
      >
        {/* Top Banner */}
        <div className="bg-sage text-ivory text-center py-2 text-xs tracking-widest font-serif uppercase">
          HAND-PAINTED CUSTOM WATERCOLOR HOMES & PORTRAITS · MADE TO ORDER WITH CARE
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex justify-between items-center h-20 relative">

            {/* Left: Hamburger Menu + Icons */}
            <div className="flex items-center gap-4 lg:gap-5 relative z-[60]">
              <button onClick={() => setMobileMenuOpen(true)} aria-label="Open menu" className="hover:text-olive transition-colors text-ink cursor-pointer">
                <Menu className="w-6 h-6" />
              </button>

              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="group cursor-pointer"
              >
                <Search className="w-5 h-5 text-ink group-hover:text-olive transition-colors" strokeWidth={1.5} />
              </button>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hidden md:block group cursor-pointer"
              >
                <InstagramIcon className="w-[18px] h-[18px] text-ink group-hover:text-olive transition-colors" />
              </a>

              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="hidden md:block group cursor-pointer"
              >
                <TikTokIcon className="w-[18px] h-[18px] text-ink group-hover:text-olive transition-colors" />
              </a>
            </div>

            {/* Center: Logo (Visible only when scrolled) */}
            <div className="flex-shrink-0 flex items-center justify-center pointer-events-none">
              <Link
                to="/"
                className={`absolute top-1/2 left-1/2 z-50 transition-all duration-500 ease-out transform ${showLogo
                    ? 'opacity-100 -translate-x-1/2 -translate-y-1/2 pointer-events-auto'
                    : 'opacity-0 -translate-x-1/2 -translate-y-[80%] pointer-events-none'
                  }`}
              >
                <div className="relative w-28 h-12 flex items-center justify-center">
                  <img
                    src="/logo/byJocelynMaria-logo.png"
                    alt="JocelynMaria logo"
                    className="absolute inset-0 w-full h-full object-contain opacity-30"
                  />
                  <img
                    src="/jocelynmariasignature.png"
                    alt="JocelynMaria"
                    className="relative h-10 md:h-12 w-auto object-contain drop-shadow-sm opacity-90 hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </Link>
            </div>

            {/* Right: Social icons (mobile) / Primary nav links (desktop) */}
            <div className="flex items-center justify-end relative z-[60]">
              {/* Mobile: social icons */}
              <div className="flex md:hidden items-center gap-4">
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="group cursor-pointer">
                  <InstagramIcon className="w-5 h-5 text-ink group-hover:text-olive transition-colors" />
                </a>
                <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="group cursor-pointer">
                  <TikTokIcon className="w-5 h-5 text-ink group-hover:text-olive transition-colors" />
                </a>
              </div>

              {/* Desktop: primary nav links */}
              <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                <Link to="/shop" className={`font-serif text-xs lg:text-sm uppercase tracking-widest hover:text-olive transition-colors ${iconColorClass} ${shadowClass}`}>Shop</Link>
                <Link to="/meet-the-artist" className={`font-serif text-xs lg:text-sm uppercase tracking-widest hover:text-olive transition-colors ${iconColorClass} ${shadowClass}`}>Meet The Artist</Link>
                <Link to="/gallery" className={`font-serif text-xs lg:text-sm uppercase tracking-widest hover:text-olive transition-colors ${iconColorClass} ${shadowClass}`}>Gallery</Link>
              </nav>
            </div>
          </div>
        </div>

      </motion.header>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSearch}
              className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[75]"
            />

            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 left-0 right-0 z-[80] bg-cream shadow-2xl max-h-[85vh] flex flex-col"
            >
              <div className="w-full max-w-3xl mx-auto px-6 py-8 flex flex-col overflow-hidden">
                {/* Search input row */}
                <div className="flex items-center gap-4 border-b border-sage/40 pb-4">
                  <Search className="w-5 h-5 text-olive flex-shrink-0" strokeWidth={1.5} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products and pages…"
                    className="flex-1 bg-transparent font-serif text-xl md:text-2xl text-ink placeholder:text-ink/30 focus:outline-none"
                  />
                  <button onClick={closeSearch} aria-label="Close search" className="text-ink hover:text-olive transition-colors flex-shrink-0">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Results */}
                <div className="overflow-y-auto mt-6">
                  {!trimmedQuery && (
                    <p className="font-sans text-sm text-ink/50 text-center py-8">
                      Start typing to search products and pages.
                    </p>
                  )}

                  {trimmedQuery && !hasResults && (
                    <p className="font-sans text-sm text-ink/50 text-center py-8">
                      No results for “{query.trim()}”.
                    </p>
                  )}

                  {productResults.length > 0 && (
                    <div className="mb-8">
                      <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-ink/40 mb-3">Products</p>
                      <div className="space-y-1">
                        {productResults.map((product) => (
                          <Link
                            key={product.id}
                            to={`/shop/${product.id}`}
                            onClick={closeSearch}
                            className="flex items-center gap-4 p-2 rounded-sm hover:bg-sage/10 transition-colors group"
                          >
                            <div className="w-12 h-12 flex-shrink-0 bg-ivory rounded-sm overflow-hidden">
                              <img src={product.images[0]} alt={product.title} className="w-full h-full object-contain p-1" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-serif text-base text-ink group-hover:text-olive transition-colors truncate">{product.title}</p>
                              <p className="font-sans text-xs text-ink/50">{product.type} · {product.price}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {pageResults.length > 0 && (
                    <div className="mb-2">
                      <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-ink/40 mb-3">Pages</p>
                      <div className="space-y-1">
                        {pageResults.map((page) => (
                          <Link
                            key={page.href}
                            to={page.href}
                            onClick={closeSearch}
                            className="block p-2 rounded-sm hover:bg-sage/10 transition-colors group"
                          >
                            <p className="font-serif text-base text-ink group-hover:text-olive transition-colors">{page.name}</p>
                            <p className="font-sans text-xs text-ink/50">{page.description}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
                      <Link to={link.href} onClick={() => setMobileMenuOpen(false)} className="block font-serif text-lg tracking-wider uppercase text-ink hover:text-olive transition-colors">
                        {link.name}
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Legal Links */}
                <div className="mt-8 mb-6 space-y-3">
                  <Link to="/privacy-policy" onClick={() => setMobileMenuOpen(false)} className="block font-sans text-sm tracking-wide text-ink/60 hover:text-olive transition-colors">
                    Privacy Policy
                  </Link>
                  <Link to="/terms-and-conditions" onClick={() => setMobileMenuOpen(false)} className="block font-sans text-sm tracking-wide text-ink/60 hover:text-olive transition-colors">
                    Terms &amp; Conditions
                  </Link>
                </div>

                {/* Footer inside drawer */}
                <div className="w-full mt-4 flex flex-col items-center">
                  {/* Social */}
                  <p className="font-serif text-xs tracking-widest uppercase text-ink/50 mb-4">Follow Along</p>
                  <div className="flex items-center gap-8 mb-6">
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-ink hover:text-olive transition-colors"
                    >
                      <InstagramIcon className="w-6 h-6" />
                    </a>
                    <a
                      href={TIKTOK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="TikTok"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-ink hover:text-olive transition-colors"
                    >
                      <TikTokIcon className="w-6 h-6" />
                    </a>
                  </div>
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
