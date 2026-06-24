import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CheckoutSuccess() {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  // Stripe redirects here with a session_id after a successful payment — clear
  // the cart so the completed order doesn't linger. (Guarded so visiting the
  // page directly, without a session, doesn't wipe an in-progress cart.)
  useEffect(() => {
    if (sessionId) clearCart();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-cream pt-32 pb-24 flex items-center justify-center">
      <div className="text-center px-6 max-w-xl">
        <div className="w-16 h-16 rounded-full bg-olive/10 flex items-center justify-center mx-auto mb-8">
          <Check className="w-8 h-8 text-olive" strokeWidth={2} />
        </div>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-4 uppercase tracking-[0.12em] font-light">
          Thank You So Much!
        </h1>
        <div className="w-16 h-px bg-olive mx-auto mb-8"></div>
        <p className="font-sans text-ink/80 leading-relaxed mb-4 text-lg">
          Your order is confirmed — we are absolutely thrilled and so grateful you chose a piece of
          hand-painted art to treasure!
        </p>
        <p className="font-sans text-ink/70 leading-relaxed mb-4">
          A confirmation and receipt are on their way to your email. For any made-to-order pieces,
          Jocelyn will personally reach out to gather your reference photos and details.
        </p>
        <p className="font-sans text-ink/70 leading-relaxed mb-10">
          Have any questions about your order? We'd love to hear from you — reach out anytime at{' '}
          <a href="mailto:hello@jocelynmaria.com" className="text-olive underline hover:text-ink transition-colors">
            hello@jocelynmaria.com
          </a>.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center w-full sm:w-auto bg-ink text-cream px-8 py-4 font-serif uppercase tracking-[0.15em] text-sm hover:bg-olive transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full sm:w-auto border border-ink text-ink px-8 py-4 font-serif uppercase tracking-[0.15em] text-sm hover:bg-ink hover:text-cream transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
