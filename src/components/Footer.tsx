import React from 'react';
import { Instagram, Facebook, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-cream pt-0 border-t border-sage/20">
      {/* Newsletter Banner */}
      <div className="bg-sage/10 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="font-serif text-2xl md:text-3xl text-ink mb-4 uppercase tracking-widest">Letters From The Studio</h3>
          <p className="font-sans text-ink/70 mb-8 text-sm">
            Subscribe for 15% off your first purchase, early access to collections, and our freebie library.
          </p>
          <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 bg-transparent border border-sage/40 px-4 py-3 font-sans text-sm focus:outline-none focus:border-olive placeholder-ink/40"
            />
            <button type="submit" className="bg-ink text-ivory px-6 py-3 font-serif uppercase tracking-widest text-xs hover:bg-olive transition-colors flex items-center justify-center">
              Subscribe <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <img 
              src="/jocelynmarianame2.png" 
              alt="Jocelyn Maria Logo" 
              className="h-10 md:h-12 w-auto object-contain mb-8 opacity-90 drop-shadow-sm"
            />
            <p className="font-sans text-sm text-ink/70 mb-6 leading-relaxed">
              Fine art originals, prints, and paper goods inspired by nature, created with care in our sunlit studio.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-ink/60 hover:text-olive transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-ink/60 hover:text-olive transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-serif text-lg text-ink mb-6 uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-3 font-serif text-ink/80">
              <li><a href="#" className="hover:text-olive transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-olive transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-olive transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-olive transition-colors">Freebie Library</a></li>
              <li><a href="#" className="hover:text-olive transition-colors">Gift Cards</a></li>
              <li><a href="#" className="hover:text-olive transition-colors">Custom Request Form</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg text-ink mb-6 uppercase tracking-wider">Find Out More</h4>
            <ul className="space-y-3 font-serif text-ink/80">
              <li><a href="#" className="hover:text-olive transition-colors">About Jocelyn</a></li>
              <li><a href="#" className="hover:text-olive transition-colors">Our Process</a></li>
              <li><a href="#" className="hover:text-olive transition-colors">Custom Work</a></li>
              <li><a href="#" className="hover:text-olive transition-colors">Studio Journal</a></li>
              <li><a href="#" className="hover:text-olive transition-colors">Accessibility Statement</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg text-ink mb-6 uppercase tracking-wider">Wholesale</h4>
            <ul className="space-y-3 font-serif text-ink/80">
              <li><a href="#" className="hover:text-olive transition-colors">Apply</a></li>
              <li><a href="#" className="hover:text-olive transition-colors">Login</a></li>
              <li><a href="#" className="hover:text-olive transition-colors uppercase tracking-widest text-xs">Stockists</a></li>
              <li><a href="#" className="hover:text-olive transition-colors">Holiday Bulk Ordering</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-sage/20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex space-x-4 font-sans text-xs text-ink/60">
            <span>&copy; {new Date().getFullYear()} Jocelyn Maria. All rights reserved.</span>
          </div>
          <div className="flex space-x-6 font-sans text-xs text-ink/60">
            <a href="#" className="hover:text-olive transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-olive transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>


    </footer>
  );
}
