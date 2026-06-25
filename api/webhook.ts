import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { Resend } from 'resend';

// Stripe signature verification requires the RAW request body. Disabling
// Vercel's automatic body parser lets us read the unmodified bytes below.
export const config = { api: { bodyParser: false } };

let stripe: Stripe | null = null;
function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('MISSING_STRIPE_KEY');
  if (!stripe) stripe = new Stripe(key);
  return stripe;
}

// Buffer the raw request stream (bodyParser is disabled, so req is unconsumed).
function readRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(typeof c === 'string' ? Buffer.from(c) : c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

const esc = (s: unknown) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers['stripe-signature'] as string | undefined;

  let event: Stripe.Event;
  try {
    if (!webhookSecret) throw new Error('Missing STRIPE_WEBHOOK_SECRET');
    if (!signature) throw new Error('Missing stripe-signature header');
    const rawBody = await readRawBody(req);
    // Throws if the signature/secret don't match — this is what makes it secure.
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent;
    try {
      await sendOrderEmail(pi);
    } catch (e: any) {
      // Log but still return 200 so Stripe doesn't retry forever over an email hiccup.
      console.error('Order email failed:', e?.message || e);
    }
  }

  // Acknowledge receipt so Stripe stops retrying.
  return res.status(200).json({ received: true });
}

async function sendOrderEmail(pi: Stripe.PaymentIntent) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const m = pi.metadata || {};
  const amount = (pi.amount_received ?? pi.amount ?? 0) / 100;

  // Prefer the structured shipping block; fall back to the metadata string.
  const ship = pi.shipping;
  const shippingHtml = ship?.address
    ? [
        esc(ship.name),
        esc(ship.address.line1),
        esc(ship.address.line2),
        esc(`${ship.address.city || ''}, ${ship.address.state || ''} ${ship.address.postal_code || ''}`.trim()),
      ]
        .filter((l) => l && l !== ',')
        .join('<br />')
    : esc(m.shipping_address || '—');

  const html = `
    <h2>New Order Received</h2>
    <p style="font-size:18px"><strong>Total Paid: $${amount.toFixed(2)}</strong></p>

    <h3>Customer</h3>
    <p>
      <strong>Name:</strong> ${esc(m.customer_name) || '—'}<br />
      <strong>Email:</strong> ${esc(m.customer_email) || '—'}<br />
      <strong>Phone:</strong> ${esc(m.customer_phone) || '—'}
    </p>

    <h3>Shipping Address</h3>
    <p>${shippingHtml}</p>

    <h3>Items (${esc(m.item_count) || '0'})</h3>
    <p>${esc(m.items) || '—'}</p>

    <h3>Note for the Artist</h3>
    <p>${m.artist_note ? esc(m.artist_note).replace(/\n/g, '<br />') : '—'}</p>

    <hr />
    <p style="color:#888;font-size:12px">Stripe Payment ID: ${esc(pi.id)}</p>
  `;

  await resend.emails.send({
    from: 'hello@jocelynmaria.com',
    to: 'byjocelynmaria@gmail.com',
    replyTo: m.customer_email || undefined,
    subject: `New Order — ${m.customer_name || 'Customer'} ($${amount.toFixed(2)})`,
    html,
  });
}
