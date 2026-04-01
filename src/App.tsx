/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SplashScreen from './components/SplashScreen';
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
      <SplashScreen />
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
  );
}
