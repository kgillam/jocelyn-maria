import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function FloatingOrderButton() {
  const { itemCount } = useCart();

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 3.8, duration: 0.8 }} // Appear after splash screen & hero
      className="fixed bottom-6 right-6 z-[90] pointer-events-auto"
    >
      <Link
        to="/cart"
        aria-label={itemCount > 0 ? `View cart, ${itemCount} item${itemCount > 1 ? 's' : ''}` : 'View cart'}
        className="relative bg-ink text-ivory p-4 rounded-full shadow-2xl hover:bg-olive hover:scale-110 transition-all duration-300 group flex items-center justify-center"
      >
        <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
        <AnimatePresence>
          {itemCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-blush text-ink text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow"
            >
              {itemCount}
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  );
}
