import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingOrderButton from './components/FloatingOrderButton';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="min-h-screen bg-cream selection:bg-blush selection:text-ink">
      <ScrollToTop />
      <div className="relative">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
        <FloatingOrderButton />
      </div>
    </div>
  );
}
