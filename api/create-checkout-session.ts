import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { list } from '@vercel/blob';

// Lazy init so a missing key returns a clean error instead of crashing the
// whole function at module load.
let stripe: Stripe | null = null;
function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('MISSING_STRIPE_KEY');
  if (!stripe) stripe = new Stripe(key);
  return stripe;
}

const CATALOG_PREFIX = 'catalog/';

// Load the authoritative product catalog from Vercel Blob (same store the shop
// and admin use). Prices/details come from here — never trusted from the client.
async function loadCatalog(): Promise<any[]> {
  const { blobs } = await list({ prefix: CATALOG_PREFIX, limit: 100 });
  if (blobs.length === 0) return [];
  const newest = blobs.reduce((a, b) =>
    new Date(b.uploadedAt).getTime() > new Date(a.uploadedAt).getTime() ? b : a
  );
  const resp = await fetch(newest.url, { cache: 'no-store' });
  if (!resp.ok) return [];
  const data = await resp.json();
  return Array.isArray(data) ? data : [];
}

// "$65.00" -> 65 (first valid numeric token only).
function parsePrice(price: unknown): number {
  if (typeof price !== 'string') return typeof price === 'number' ? price : 0;
  const m = price.replace(/[^0-9.]/g, '').match(/^\d*(?:\.\d+)?/);
  return m ? Number(m[0]) || 0 : 0;
}

// Stripe needs absolute, publicly reachable image URLs.
function toAbsolute(src: string, origin: string): string {
  if (!src) return '';
  if (/^https?:\/\//i.test(src)) return src; // Blob URLs are already absolute
  return `${origin}${src.startsWith('/') ? '' : '/'}${src}`;
}

const FLAT_SHIPPING_CENTS = 800; // $8 flat, matches the cart

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: { message: 'Method Not Allowed' } });
  }

  try {
    const { lines, artistNote } = req.body ?? {};
    if (!Array.isArray(lines) || lines.length === 0) {
      return res.status(400).json({ error: { message: 'Your cart is empty.' } });
    }

    const origin =
      (req.headers.origin as string) ||
      (req.headers.host ? `https://${req.headers.host}` : 'https://www.jocelynmaria.com');

    const catalog = await loadCatalog();
    if (catalog.length === 0) {
      return res.status(500).json({ error: { message: 'Could not load products. Please try again.' } });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let referenceCount = 0;

    for (const line of lines) {
      const product = catalog.find((p: any) => p.id === Number(line.productId));
      if (!product) continue;

      const sizeObj = product.sizes?.find((s: any) => s.label === line.size);
      const originalPrice = sizeObj ? Number(sizeObj.price) : parsePrice(product.price);
      const images = (product.images || [])
        .map((src: string) => toAbsolute(src, origin))
        .filter(Boolean)
        .slice(0, 8); // Stripe allows up to 8 images per product

      // The original piece (one per line — each is its own configured item).
      line_items.push({
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(originalPrice * 100),
          product_data: {
            name: line.size ? `${product.title} (${line.size})` : product.title,
            description: product.description,
            images,
          },
        },
      });

      // Optional additional prints, as their own line item with its own price.
      if (line.option === 'original-prints' && Number(line.printQuantity) > 0) {
        const printUnit = sizeObj?.printPrice ?? product.printPrice;
        if (printUnit != null && Number(printUnit) > 0) {
          line_items.push({
            quantity: Number(line.printQuantity),
            price_data: {
              currency: 'usd',
              unit_amount: Math.round(Number(printUnit) * 100),
              product_data: {
                name: `${product.title} — Additional Print${line.size ? ` (${line.size})` : ''}`,
                description: 'Fine art print reproduction.',
                images,
              },
            },
          });
        }
      }

      if (line.hasReferencePhoto) referenceCount += 1;
    }

    if (line_items.length === 0) {
      return res.status(400).json({ error: { message: 'No valid items in your cart.' } });
    }

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items,
      phone_number_collection: { enabled: true },
      shipping_address_collection: { allowed_countries: ['US'] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: FLAT_SHIPPING_CENTS, currency: 'usd' },
            display_name: 'Standard shipping',
          },
        },
      ],
      metadata: {
        artistNote: String(artistNote || '').slice(0, 500),
        referencePhotosAttached: String(referenceCount),
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    const raw = error?.message || String(error);
    console.error('Checkout session error:', raw);
    const message =
      raw === 'MISSING_STRIPE_KEY'
        ? 'Payment is not configured yet. Please try again later.'
        : raw || 'Unable to start checkout.';
    return res.status(500).json({ error: { message } });
  }
}
