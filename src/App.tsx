import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingOrderButton from './components/FloatingOrderButton';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import CustomCommissionsPage from './pages/CustomCommissionsPage';
import MeetTheArtist from './pages/MeetTheArtist';

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
          <Route path="/shop/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/meet-the-artist" element={<MeetTheArtist />} />
          <Route path="/custom-commissions" element={<CustomCommissionsPage />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
        <FloatingOrderButton />
      </div>
    </div>
  );
}
