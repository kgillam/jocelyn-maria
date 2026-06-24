import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

// Lazily create the Stripe client INSIDE the handler. Constructing it at module
// load with a missing STRIPE_SECRET_KEY throws and crashes the whole function
// (FUNCTION_INVOCATION_FAILED) before it can return a useful error.
let stripe: Stripe | null = null;
function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('MISSING_STRIPE_KEY');
  }
  if (!stripe) {
    stripe = new Stripe(key);
  }
  return stripe;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: { message: 'Method Not Allowed' } });
  }

  try {
    const { total } = req.body ?? {};
    const amount = Math.round(Number(total) * 100); // Stripe expects cents

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: { message: 'Invalid order total.' } });
    }
    // Stripe's minimum charge is 50 cents (USD).
    if (amount < 50) {
      return res.status(400).json({ error: { message: 'Order total is below the $0.50 minimum.' } });
    }

    const paymentIntent = await getStripe().paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    const raw = error?.message || String(error);
    console.error('Stripe error:', raw);
    const message =
      raw === 'MISSING_STRIPE_KEY'
        ? 'Payment is not configured yet. Please try again later.'
        : raw || 'Unable to start payment.';
    return res.status(500).json({ error: { message } });
  }
}
