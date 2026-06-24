import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Check, ArrowLeft, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe outside the component. Guard against a missing publishable
// key so checkout shows a clear message instead of hanging.
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

const inputClass =
  'w-full bg-transparent border-b border-sage/40 py-2 font-sans text-ink focus:outline-none focus:border-olive transition-colors';
const labelClass = 'font-serif text-sm tracking-widest uppercase text-ink/80 block mb-1';

// Friendly, first-person confirmation shown after a successful order. Kept in
// the OUTER component (below) so clearing the cart doesn't bounce the customer
// to the empty-cart screen.
function OrderConfirmation({ email }: { email: string }) {
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
          I'm absolutely thrilled — and so grateful — that you've chosen a piece of my hand-painted
          art to treasure. Thank you for supporting my little studio; it truly means the world to me!
        </p>
        <p className="font-sans text-ink/70 leading-relaxed mb-4">
          A confirmation and receipt {email
            ? <>are on their way to <span className="text-ink">{email}</span></>
            : 'are on their way to your email'}.
          If your piece is made-to-order, I'll personally reach out to gather your reference photos
          and any details so I can get started.
        </p>
        <p className="font-sans text-ink/70 leading-relaxed mb-10">
          Have any questions about your order? I'd love to hear from you — just reach out anytime at{' '}
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

function CheckoutFormContent({ onSuccess }: { onSuccess: (email: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const { items, subtotal, shipping, total, lineTotal } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const fd = new FormData(e.currentTarget);
    const customer = {
      firstName: (fd.get('firstName') as string) || '',
      lastName: (fd.get('lastName') as string) || '',
      email: (fd.get('email') as string) || '',
      phone: (fd.get('phone') as string) || '',
      address: (fd.get('address') as string) || '',
      address2: (fd.get('address2') as string) || '',
      city: (fd.get('city') as string) || '',
      state: (fd.get('state') as string) || '',
      zip: (fd.get('zip') as string) || '',
    };
    const artistNote = (fd.get('artistNote') as string) || '';

    // 1) Validate the PaymentElement.
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message ?? 'Validation failed.');
      setIsProcessing(false);
      return;
    }

    // 2) Create the PaymentIntent server-side WITH full order details, then
    //    confirm it — deferred-intent flow, so we capture the customer's info
    //    before the intent exists.
    let clientSecret: string;
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            title: i.title,
            size: i.size,
            option: i.option,
            printQuantity: i.printQuantity,
          })),
          total,
          customer,
          artistNote,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.clientSecret) {
        setErrorMessage(data?.error?.message || 'Unable to start payment. Please try again.');
        setIsProcessing(false);
        return;
      }
      clientSecret = data.clientSecret;
    } catch {
      setErrorMessage('Unable to start payment. Please try again.');
      setIsProcessing(false);
      return;
    }

    // 3) Confirm on-page (no redirect for cards).
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: { return_url: `${window.location.origin}/checkout` },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message ?? 'An unexpected error occurred.');
      setIsProcessing(false);
    } else {
      onSuccess(customer.email);
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
                maxLength={500}
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
                  <span>{formatPrice(shipping)}</span>
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
  const { items, total, clearCart } = useCart();
  const [placed, setPlaced] = useState(false);
  const [orderEmail, setOrderEmail] = useState('');

  // Success view is checked FIRST — so clearing the cart after a successful
  // order doesn't bounce the customer to the empty-cart screen.
  if (placed) {
    return <OrderConfirmation email={orderEmail} />;
  }

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

  // Deferred PaymentIntent: render the PaymentElement up front using the order
  // amount; the intent itself is created on submit (with full order details).
  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: 'payment',
        amount: Math.max(50, Math.round(total * 100)),
        currency: 'usd',
        appearance: { theme: 'stripe' },
      }}
    >
      <CheckoutFormContent
        onSuccess={(email) => {
          setOrderEmail(email);
          clearCart();
          setPlaced(true);
          window.scrollTo(0, 0);
        }}
      />
    </Elements>
  );
}
