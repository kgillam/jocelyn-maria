import React from 'react';
import { motion } from 'motion/react';
import { InstagramIcon, TikTokIcon, INSTAGRAM_URL, TIKTOK_URL } from './SocialIcons';

export default function BehindTheScenes() {
  return (
    <section className="py-24 bg-sage/10 text-ink overflow-hidden relative">
      {/* Decorative subtle texture */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cGF0aCBkPSJNMCAwaDh2OEgweiIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNMCAwaDR2NEgweiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">

        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-sans text-xs uppercase tracking-[0.2em] text-ink/60 mb-4 block text-center"
        >
          Join The Community
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink leading-tight mb-6 text-center max-w-2xl"
        >
          Follow <span className="italic opacity-90 font-light">the</span> Journey
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="font-sans text-ink/80 text-center max-w-xl mx-auto mb-16 leading-relaxed"
        >
          See the process behind the paintings, discover new techniques, and get early access to exclusive drops. Join our community of art lovers on Instagram and TikTok.
        </motion.p>

        <div className="flex items-center justify-center gap-12 w-full mt-4">

          {/* Instagram CTA */}
          <motion.a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.1, y: -5 }}
            transition={{ delay: 0.3 }}
            className="group"
          >
            <InstagramIcon className="w-14 h-14 text-ink/80 group-hover:text-ink transition-all duration-300 drop-shadow-sm" />
          </motion.a>

          {/* TikTok CTA */}
          <motion.a
            href={TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.1, y: -5 }}
            transition={{ delay: 0.4 }}
            className="group"
          >
            <TikTokIcon className="w-14 h-14 text-ink/80 group-hover:text-ink transition-all duration-300 drop-shadow-sm" />
          </motion.a>

        </div>

      </div>
    </section>
  );
}
