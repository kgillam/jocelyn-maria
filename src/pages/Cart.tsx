import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Minus, Plus, X, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart, FREE_SHIPPING_THRESHOLD } from '../context/CartContext';
import { formatPrice } from '../data/products';

export default function Cart() {
  const { items, setPrintQuantity, removeItem, lineTotal, subtotal, shipping, total } = useCart();

  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-cream pt-32 pb-24 flex items-center justify-center">
        <div className="text-center px-6">
          <ShoppingBag className="w-10 h-10 text-olive/60 mx-auto mb-6" strokeWidth={1.2} />
          <h1 className="font-serif text-3xl text-ink mb-4 uppercase tracking-[0.15em] font-light">Your Cart Is Empty</h1>
          <div className="w-16 h-px bg-olive mx-auto mb-8"></div>
          <p className="font-sans text-ink/70 mb-8 max-w-md mx-auto">
            Looks like you haven't added anything yet. Explore the collection to find your perfect piece.
          </p>
          <Link to="/shop" className="inline-flex items-center bg-ink text-cream px-8 py-4 font-serif uppercase tracking-[0.15em] text-sm hover:bg-olive transition-colors">
            Shop the Collection
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-ink mb-6 uppercase tracking-[0.1em] md:tracking-[0.15em] font-light">Your Cart</h1>
          <div className="w-16 h-px bg-olive mx-auto"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* Line items */}
          <div className="w-full lg:w-7/12">
            <div className="border-t border-sage/20">
              <AnimatePresence initial={false}>
                {items.map(item => (
                  <motion.div
                    key={item.lineId}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-5 py-6 border-b border-sage/20"
                  >
                    <Link to={`/shop/${item.productId}`} className="flex-shrink-0 w-24 h-24 bg-ivory/60 rounded-sm overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-contain p-1" />
                    </Link>

                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="text-[10px] font-sans text-ink/50 uppercase tracking-widest mb-1">{item.type}</p>
                          <Link to={`/shop/${item.productId}`} className="font-serif text-lg text-ink hover:text-olive transition-colors">
                            {item.title}
                          </Link>
                          <p className="font-sans text-xs text-ink/60 mt-1">
                            {item.size ? `${item.size} · ` : ''}
                            {item.option === 'original-prints'
                              ? `Original + ${item.printQuantity} print${item.printQuantity > 1 ? 's' : ''}`
                              : 'Original piece only'}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.lineId)}
                          aria-label={`Remove ${item.title}`}
                          className="text-ink/40 hover:text-ink transition-colors p-1 -mr-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Reference photo */}
                      {item.referenceImagePreview && (
                        <div className="flex items-center gap-2 mt-2">
                          <img
                            src={item.referenceImagePreview}
                            alt="Reference"
                            className="w-8 h-8 object-cover rounded-sm border border-sage/30"
                          />
                          <span className="font-sans text-xs text-ink/50 truncate max-w-[12rem]">
                            {item.referenceImageName ?? 'Reference photo attached'}
                          </span>
                        </div>
                      )}

                      <div className="mt-auto flex justify-between items-end pt-3">
                        {/* Print quantity control (only when prints are part of the order) */}
                        {item.option === 'original-prints' ? (
                          <div className="flex items-center gap-2">
                            <span className="font-sans text-xs text-ink/50 uppercase tracking-wider">Prints</span>
                            <div className="flex items-center border border-sage/40">
                              <button
                                onClick={() => setPrintQuantity(item.lineId, item.printQuantity - 1)}
                                aria-label="Fewer prints"
                                className="px-2.5 py-2 text-ink hover:text-olive transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-10 text-center text-sm font-sans text-ink select-none">{item.printQuantity}</span>
                              <button
                                onClick={() => setPrintQuantity(item.lineId, item.printQuantity + 1)}
                                aria-label="More prints"
                                className="px-2.5 py-2 text-ink hover:text-olive transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span />
                        )}
                        <p className="font-sans text-ink/90">{formatPrice(lineTotal(item))}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <Link to="/shop" className="inline-flex items-center mt-8 text-sm font-serif uppercase tracking-widest text-olive hover:text-ink transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
            </Link>
          </div>

          {/* Order summary */}
          <div className="w-full lg:w-5/12">
            <div className="bg-ivory border border-sage/20 p-8 sticky top-32">
              <h2 className="font-serif text-xl text-ink uppercase tracking-widest mb-6">Order Summary</h2>

              <div className="space-y-4 font-sans text-sm text-ink/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>

                {amountToFreeShipping > 0 && (
                  <p className="text-xs text-olive bg-olive/5 border border-olive/20 p-3">
                    Add {formatPrice(amountToFreeShipping)} more to unlock free shipping.
                  </p>
                )}

                <div className="border-t border-sage/20 pt-4 flex justify-between font-serif text-lg text-ink">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-8 w-full bg-ink text-cream py-4 font-serif uppercase tracking-[0.15em] text-sm hover:bg-olive transition-colors flex items-center justify-center"
              >
                Proceed to Checkout
              </Link>

              <p className="mt-4 text-center text-xs font-sans text-ink/50">
                Taxes calculated at checkout. Secure ordering.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
