import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Check, ArrowLeft, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe outside the component. Guard against a missing publishable
// key so checkout shows a clear message instead of hanging on "loading".
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

const inputClass =
  'w-full bg-transparent border-b border-sage/40 py-2 font-sans text-ink focus:outline-none focus:border-olive transition-colors';
const labelClass = 'font-serif text-sm tracking-widest uppercase text-ink/80 block mb-1';

function CheckoutFormContent({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const { items, subtotal, shipping, total, lineTotal, clearCart } = useCart();
  
  const [placed, setPlaced] = useState(false);
  const [orderEmail, setOrderEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Order confirmation view
  if (placed) {
    return (
      <main className="min-h-screen bg-cream pt-32 pb-24 flex items-center justify-center">
        <div className="text-center px-6 max-w-lg">
          <div className="w-16 h-16 rounded-full bg-olive/10 flex items-center justify-center mx-auto mb-8">
            <Check className="w-8 h-8 text-olive" strokeWidth={2} />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-ink mb-4 uppercase tracking-[0.12em] font-light">Thank You</h1>
          <div className="w-16 h-px bg-olive mx-auto mb-8"></div>
          <p className="font-sans text-ink/70 leading-relaxed mb-2">
            Your order has been received. A confirmation has been sent
            {orderEmail ? <> to <span className="text-ink">{orderEmail}</span></> : ''}.
          </p>
          <p className="font-sans text-ink/70 leading-relaxed mb-10">
            For any made-to-order pieces, Jocelyn will be in touch to gather your reference photos and details.
          </p>
          <Link to="/shop" className="inline-flex items-center bg-ink text-cream px-8 py-4 font-serif uppercase tracking-[0.15em] text-sm hover:bg-olive transition-colors">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const data = new FormData(e.currentTarget);
    const email = (data.get('email') as string) || '';

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message ?? 'Validation failed.');
      setIsProcessing(false);
      return;
    }

    // Confirm the payment
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        receipt_email: email,
        // We handle redirect manually
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message ?? 'An unexpected error occurred.');
      setIsProcessing(false);
    } else {
      setOrderEmail(email);
      clearCart();
      setPlaced(true);
      window.scrollTo(0, 0);
    }
  };

  return (
    <main className="min-h-screen bg-cream pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-ink mb-6 uppercase tracking-[0.1em] md:tracking-[0.15em] font-light">Checkout</h1>
          <div className="w-16 h-px bg-olive mx-auto"></div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-12">
          {/* Form fields */}
          <div className="w-full lg:w-7/12 space-y-12">
            
            {/* Payment via Stripe */}
            <section>
              <h2 className="font-serif text-xl text-ink uppercase tracking-widest mb-2">Payment</h2>
              <p className="font-sans text-xs text-ink/50 mb-6 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" /> All transactions are secure and encrypted via Stripe.
              </p>
              <div className="space-y-6">
                <PaymentElement />
                {errorMessage && (
                  <div className="text-red-600 text-sm mt-4 font-sans">{errorMessage}</div>
                )}
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="font-serif text-xl text-ink uppercase tracking-widest mb-6">Contact</h2>
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input name="email" type="email" required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input name="phone" type="tel" className={inputClass} />
                </div>
              </div>
            </section>

            {/* Shipping */}
            <section>
              <h2 className="font-serif text-xl text-ink uppercase tracking-widest mb-6">Shipping Address</h2>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-1/2">
                    <label className={labelClass}>First Name</label>
                    <input name="firstName" type="text" required className={inputClass} />
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label className={labelClass}>Last Name</label>
                    <input name="lastName" type="text" required className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Street Address</label>
                  <input name="address" type="text" required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Apartment, suite, etc. (optional)</label>
                  <input name="address2" type="text" className={inputClass} />
                </div>
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-1/2">
                    <label className={labelClass}>City</label>
                    <input name="city" type="text" required className={inputClass} />
                  </div>
                  <div className="w-full sm:w-1/4">
                    <label className={labelClass}>State</label>
                    <input name="state" type="text" required className={inputClass} />
                  </div>
                  <div className="w-full sm:w-1/4">
                    <label className={labelClass}>ZIP</label>
                    <input name="zip" type="text" required className={inputClass} />
                  </div>
                </div>
              </div>
            </section>

            {/* Note for the artist */}
            <section>
              <h2 className="font-serif text-xl text-ink uppercase tracking-widest mb-2">Note for the Artist</h2>
              <p className="font-sans text-xs text-ink/50 mb-6">
                Share any requests or details for your piece — color preferences, who's in the photo, framing, occasion, deadlines, etc. (optional)
              </p>
              <textarea
                name="artistNote"
                rows={4}
                className="w-full bg-cream/50 border border-sage/40 p-4 font-sans text-sm text-ink focus:outline-none focus:border-olive transition-colors resize-y min-h-[120px]"
                placeholder="e.g. Please emphasize the autumn colors, include our dog on the porch, this is a wedding gift for June 14th…"
              />
            </section>
          </div>

          {/* Order summary */}
          <div className="w-full lg:w-5/12">
            <div className="bg-ivory border border-sage/20 p-8 sticky top-32">
              <h2 className="font-serif text-xl text-ink uppercase tracking-widest mb-6">Order Summary</h2>

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

              <div className="border-t border-sage/20 pt-6 space-y-3 font-sans text-sm text-ink/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="border-t border-sage/20 pt-3 flex justify-between font-serif text-lg text-ink">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="mt-8 w-full bg-ink text-cream py-4 font-serif uppercase tracking-[0.15em] text-sm hover:bg-olive transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Place Order
                  </>
                )}
              </button>

              <Link to="/cart" className="mt-4 inline-flex items-center justify-center w-full text-xs font-serif uppercase tracking-widest text-olive hover:text-ink transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Return to Cart
              </Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function Checkout() {
  const { items, total } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0 || !stripePromise) return;

    // Fetch client secret from serverless function
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items, total }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to initialize payment');
        }
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load payment options. Please try again later.');
      });
  }, [items, total]);

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

  if (!stripePromise) {
    return (
      <main className="min-h-screen bg-cream pt-32 pb-24 flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-red-500 font-sans">Payment is not configured yet. Please try again later.</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-cream pt-32 pb-24 flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-red-500 font-sans">{error}</p>
        </div>
      </main>
    );
  }

  if (!clientSecret) {
    return (
      <main className="min-h-screen bg-cream pt-32 pb-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-olive animate-spin" />
          <p className="font-sans text-ink/70">Securely loading payment options...</p>
        </div>
      </main>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
      <CheckoutFormContent clientSecret={clientSecret} />
    </Elements>
  );
}
