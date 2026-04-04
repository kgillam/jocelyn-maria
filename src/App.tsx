import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingOrderButton from './components/FloatingOrderButton';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';

export default function App() {
  return (
    <div className="min-h-screen bg-cream selection:bg-blush selection:text-ink">
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
