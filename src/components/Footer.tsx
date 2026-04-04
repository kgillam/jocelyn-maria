import React from 'react';
import { Instagram, Facebook, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-cream pt-0 border-t border-sage/20">

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <img 
              src="/jocelynmariasignature.png" 
              alt="Jocelyn Maria Logo" 
              className="h-14 md:h-16 w-auto object-contain mb-4 opacity-90 drop-shadow-sm"
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
