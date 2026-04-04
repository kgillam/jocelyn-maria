import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ArtistSpotlight from './components/ArtistSpotlight';
import CustomCommissions from './components/CustomCommissions';
import ProductGrid from './components/ProductGrid';
import BehindTheScenes from './components/BehindTheScenes';
import Footer from './components/Footer';
import FloatingOrderButton from './components/FloatingOrderButton';

export default function App() {
  return (
    <div className="min-h-screen bg-cream selection:bg-blush selection:text-ink">
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
    </div>
  );
}
