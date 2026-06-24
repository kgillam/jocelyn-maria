import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';

export default function Checkout() {
  const { items, subtotal, shipping, total, lineTotal } = useCart();
  const [artistNote, setArtistNote] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Guard: nothing to check out.
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-cream pt-32 pb-24 flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-serif text-3xl text-ink mb-4 uppercase tracking-[0.15em] font-light">Your Cart Is Empty</h1>
          <div className="w-16 h-px bg-olive mx-auto mb-8"></div>
          <p className="font-sans text-ink/70 mb-8">Add a piece to your cart before checking out.</p>
          <Link to="/shop" className="inline-flex items-center text-sm font-serif uppercase tracking-widest text-olive hover:text-ink transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const handlePay = async () => {
    setIsRedirecting(true);
    setError(null);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines: items.map(item => ({
            productId: item.productId,
            size: item.size,
            option: item.option,
            printQuantity: item.printQuantity,
            hasReferencePhoto: !!item.referenceImageName,
          })),
          artistNote,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        // Hand off to Stripe's secure hosted checkout.
        window.location.href = data.url;
      } else {
        setError(data?.error?.message || 'Unable to start checkout. Please try again.');
        setIsRedirecting(false);
      }
    } catch (e) {
      console.error(e);
      setError('Unable to start checkout. Please try again.');
      setIsRedirecting(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-ink mb-6 uppercase tracking-[0.1em] md:tracking-[0.15em] font-light">Checkout</h1>
          <div className="w-16 h-px bg-olive mx-auto"></div>
        </div>

        <div className="bg-ivory border border-sage/20 p-8">
          <h2 className="font-serif text-xl text-ink uppercase tracking-widest mb-6">Order Summary</h2>

          {/* Line items */}
          <div className="space-y-4 mb-6">
            {items.map(item => (
              <div key={item.lineId} className="flex gap-4 items-center">
                <div className="relative flex-shrink-0 w-16 h-16 bg-cream rounded-sm overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-sm text-ink truncate">{item.title}</p>
                  <p className="font-sans text-xs text-ink/50">
                    {item.size ? `${item.size} · ` : ''}
                    {item.option === 'original-prints'
                      ? `Original + ${item.printQuantity} print${(item.printQuantity ?? 0) > 1 ? 's' : ''}`
                      : 'Original only'}
                    {item.referenceImageName ? ' · Photo attached' : ''}
                  </p>
                </div>
                <p className="font-sans text-sm text-ink/90">{formatPrice(lineTotal(item))}</p>
              </div>
            ))}
          </div>

          {/* Note for the artist */}
          <div className="border-t border-sage/20 pt-6 mb-6">
            <label className="font-serif text-sm tracking-widest uppercase text-ink/80 block mb-2">
              Note for the Artist <span className="text-ink/40 normal-case tracking-normal">(optional)</span>
            </label>
            <textarea
              value={artistNote}
              onChange={e => setArtistNote(e.target.value)}
              rows={3}
              maxLength={500}
              className="w-full bg-cream/50 border border-sage/40 p-4 font-sans text-sm text-ink focus:outline-none focus:border-olive transition-colors resize-y"
              placeholder="e.g. Please emphasize the autumn colors, include our dog on the porch, this is a wedding gift for June 14th…"
            />
          </div>

          {/* Totals */}
          <div className="border-t border-sage/20 pt-6 space-y-3 font-sans text-sm text-ink/80">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatPrice(shipping)}</span>
            </div>
            <div className="border-t border-sage/20 pt-3 flex justify-between font-serif text-lg text-ink">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {error && <div className="text-red-600 text-sm mt-6 font-sans text-center">{error}</div>}

          {/* Pay with Stripe */}
          <button
            onClick={handlePay}
            disabled={isRedirecting}
            className="mt-8 w-full bg-ink text-cream py-4 font-serif uppercase tracking-[0.15em] text-sm hover:bg-olive transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRedirecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Redirecting to secure checkout…
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" /> Pay with Stripe
              </>
            )}
          </button>

          <p className="font-sans text-xs text-ink/50 mt-4 flex items-center justify-center gap-2 text-center">
            <Lock className="w-3.5 h-3.5" /> You'll be taken to Stripe's secure checkout to enter your email,
            shipping, and payment details.
          </p>

          <Link to="/cart" className="mt-4 inline-flex items-center justify-center w-full text-xs font-serif uppercase tracking-widest text-olive hover:text-ink transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Return to Cart
          </Link>
        </div>
      </div>
    </main>
  );
}
