import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

// Lazy init so a missing key returns a clean error instead of crashing the
// whole function at module load.
let stripe: Stripe | null = null;
function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('MISSING_STRIPE_KEY');
  if (!stripe) stripe = new Stripe(key);
  return stripe;
}

// Stripe metadata values are capped at 500 chars; descriptions at ~1000.
const truncate = (s: unknown, n = 500) => String(s ?? '').slice(0, n);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: { message: 'Method Not Allowed' } });
  }

  try {
    const { items, total, customer, artistNote } = req.body ?? {};
    const amount = Math.round(Number(total) * 100); // dollars -> cents

    if (!Number.isFinite(amount) || amount < 50) {
      return res.status(400).json({ error: { message: 'Invalid order total.' } });
    }

    const cust = customer || {};
    const fullName = `${cust.firstName || ''} ${cust.lastName || ''}`.trim() || 'Customer';
    const itemList: any[] = Array.isArray(items) ? items : [];

    // Human-readable line summary, reused in both the description and metadata.
    const itemSummary = itemList
      .map((i) => {
        const size = i.size ? ` [${i.size}]` : '';
        const prints =
          i.option === 'original-prints' && Number(i.printQuantity) > 0
            ? ` + ${i.printQuantity} print${Number(i.printQuantity) > 1 ? 's' : ''}`
            : '';
        return `${i.title}${size}${prints}`;
      })
      .join('; ');

    const shippingLine = [
      cust.address,
      cust.address2,
      `${cust.city || ''}, ${cust.state || ''} ${cust.zip || ''}`.trim(),
    ]
      .filter((p) => p && p !== ',')
      .join(', ');

    // 1) Dynamic description — shows on the payment row in the Stripe Dashboard.
    const description = truncate(`Order for ${fullName} — ${itemSummary || 'items'}`, 1000);

    // 2) Metadata — serialized order details, readable directly in the Dashboard.
    const metadata: Record<string, string> = {
      customer_name: truncate(fullName),
      customer_email: truncate(cust.email),
      customer_phone: truncate(cust.phone),
      shipping_address: truncate(shippingLine),
      items: truncate(itemSummary),
      item_count: String(itemList.length),
      artist_note: truncate(artistNote),
    };

    const paymentIntent = await getStripe().paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      description,
      metadata,
      // Stripe emails the customer a receipt for this address.
      receipt_email: cust.email || undefined,
      // Native shipping block so the Dashboard shows a proper shipping section.
      shipping: cust.address
        ? {
            name: fullName,
            phone: cust.phone || undefined,
            address: {
              line1: cust.address,
              line2: cust.address2 || undefined,
              city: cust.city || undefined,
              state: cust.state || undefined,
              postal_code: cust.zip || undefined,
              country: 'US',
            },
          }
        : undefined,
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
