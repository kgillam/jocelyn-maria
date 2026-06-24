import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InstagramIcon, TikTokIcon, INSTAGRAM_URL, TIKTOK_URL } from './SocialIcons';

const quickLinks = [
  { name: 'Shop', href: '/shop' },
  { name: 'Meet The Artist', href: '/meet-the-artist' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Contact', href: '/contact' },
  { name: 'Cart', href: '/cart' },
];

const inputClass =
  'w-full bg-transparent border-b border-ivory/30 py-2 font-sans text-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-blush transition-colors';

export default function Footer() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <footer className="bg-ink text-ivory pt-0">

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="relative mb-4 inline-block">
              {/* Logo watermark behind the signature (inverted to light for the dark footer) */}
              <div
                className="absolute inset-0 bg-center bg-no-repeat opacity-30 [filter:brightness(0)_invert(1)] pointer-events-none"
                style={{ backgroundImage: 'url(/logo/byJocelynMaria-logo.png)', backgroundSize: 'contain' }}
              />
              <img
                src="/jocelynmariasignature.png"
                alt="Jocelyn Maria Logo"
                className="relative h-14 md:h-16 w-auto object-contain opacity-90 [filter:brightness(0)_invert(1)]"
              />
            </div>
            <p className="font-sans text-sm text-ivory/70 mb-6 leading-relaxed">
              Hand-painted custom watercolor home and family portraits — one-of-a-kind keepsakes created from your most cherished places and people.
            </p>
            <div className="flex space-x-4">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-ivory/70 hover:text-blush transition-colors">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-ivory/70 hover:text-blush transition-colors">
                <TikTokIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg text-ivory mb-6 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3 font-serif text-ivory/70">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="hover:text-blush transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Contact Form */}
          <div>
            <h4 className="font-serif text-lg text-ivory mb-6 uppercase tracking-wider">Get In Touch</h4>
            {submitted ? (
              <p className="font-sans text-sm text-ivory/80 leading-relaxed">
                Thank you for reaching out! Jocelyn will get back to you shortly.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <input type="text" name="name" required placeholder="Your Name" className={inputClass} />
                <input type="email" name="email" required placeholder="Email Address" className={inputClass} />
                <textarea name="message" rows={3} required placeholder="How can we help?" className={`${inputClass} resize-none`} />
                <button
                  type="submit"
                  className="bg-ivory text-ink px-6 py-3 font-serif uppercase tracking-widest text-xs hover:bg-blush transition-colors"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-ivory/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex space-x-4 font-sans text-xs text-ivory/60">
            <Link to="/admin" className="hover:text-ivory transition-colors">
              &copy; {new Date().getFullYear()} Jocelyn Maria. All rights reserved.
            </Link>
          </div>
          <div className="flex space-x-6 font-sans text-xs text-ivory/60">
            <Link to="/privacy-policy" className="hover:text-blush transition-colors">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-blush transition-colors">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>


    </footer>
  );
}
