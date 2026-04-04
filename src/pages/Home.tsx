import React from 'react';
import Hero from '../components/Hero';
import ArtistSpotlight from '../components/ArtistSpotlight';
import ProductGrid from '../components/ProductGrid';
import CustomCommissions from '../components/CustomCommissions';
import BehindTheScenes from '../components/BehindTheScenes';

export default function Home() {
  return (
    <main>
      <Hero />
      <ArtistSpotlight />
      <ProductGrid />
      <CustomCommissions />
      <BehindTheScenes />
    </main>
  );
}
