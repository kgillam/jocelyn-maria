import { VercelRequest, VercelResponse } from '@vercel/node';
import { put, list, del } from '@vercel/blob';

// All product-catalog blobs live under this prefix. Each save writes a brand
// new immutable file (catalog/products-<random>.json) so reads always target a
// URL the CDN has never cached — this is what prevents deleted products from
// reappearing due to stale edge-cached content.
const CATALOG_PREFIX = 'catalog/';
const CATALOG_BASENAME = 'catalog/products.json';

const defaultProducts = [
  {
    id: 1,
    title: "Blueberry Botanical Card",
    price: '$8.00',
    images: ['/cardblueberryproduct.png?v=4'],
    category: 'Cards',
    type: 'Greeting Card',
    description: "A delicate hand-painted blueberry botanical, reproduced as a fine art greeting card. Blank inside for your own heartfelt message.",
    details: [
      'Printed on premium heavyweight matte cardstock',
      'A2 size (4.25" x 5.5") with coordinating envelope',
      'Blank interior for a personal note'
    ]
  },
  {
    id: 101,
    title: "Lavender Botanical Card",
    price: '$8.00',
    images: ['/cardlavenderproduct.png?v=4'],
    category: 'Cards',
    type: 'Greeting Card',
    description: "Soft sprigs of watercolor lavender on a fine art greeting card. A quiet, timeless way to send a little love.",
    details: [
      'Printed on premium heavyweight matte cardstock',
      'A2 size (4.25" x 5.5") with coordinating envelope',
      'Blank interior for a personal note'
    ]
  },
  {
    id: 102,
    title: "Margaritas Card",
    price: '$8.00',
    images: ['/cardmargaritasproduct.png?v=4'],
    category: 'Cards',
    type: 'Greeting Card',
    description: "A cheerful watercolor margaritas card — perfect for celebrations, birthdays, and just-because greetings.",
    details: [
      'Printed on premium heavyweight matte cardstock',
      'A2 size (4.25" x 5.5") with coordinating envelope',
      'Blank interior for a personal note'
    ]
  },
  {
    id: 103,
    title: "Mother's Day Card",
    price: '$8.00',
    images: ['/cardmothersdayproduct.png?v=4'],
    category: 'Cards',
    type: 'Greeting Card',
    description: "A tender hand-painted card to honor the mothers in your life, finished with a signature watercolor touch.",
    details: [
      'Printed on premium heavyweight matte cardstock',
      'A2 size (4.25" x 5.5") with coordinating envelope',
      'Blank interior for a personal note'
    ]
  },
  {
    id: 2,
    title: "Watercolor House Portraits",
    price: '$65.00',
    images: [
      '/watercolorbrickhome.png',
      '/watercolorredbrickhome.png',
      '/watercolorwhitehome.png'
    ],
    category: 'Watercolor Houses',
    type: 'Custom',
    description: "Commemorate your family home, childhood estate, wedding venue, or first apartment with a bespoke watercolor portrait. Each piece is hand-painted from your reference photos to capture the architectural charm and personal warmth of the places you love most.",
    sizes: [
      { label: '8x10"', price: 65 },
      { label: '11x14"', price: 80 }
    ],
    details: [
      'Hand-painted using premium archival-grade watercolors',
      'Minor landscaping or structural alterations can be requested',
      'Please allow a 2–3 week turnaround before shipping'
    ]
  },
  {
    id: 3,
    title: "Custom Portraits",
    price: '$30.00',
    images: [
      '/girlsontripportrait.png',
      '/momanddaughterportrait.png',
      '/girlsatcampportrait.png',
      '/girlsatpromportrait.png',
      '/momandgirlsportrait.png',
      '/momandkidsreadingportrait.png'
    ],
    category: 'Portraits',
    type: 'Custom',
    description: "Beautiful, stylized watercolor figures capturing precious family moments, wedding memories, and candid snapshots — designed with a signature, timeless artistic touch and painted from your favorite photographs.",
    sizes: [
      { label: '5x7"', price: 30 },
      { label: '8x10"', price: 45 }
    ],
    details: [
      'Focuses on impressionistic emotion and posture',
      'Can seamlessly composite multiple reference photos',
      'Please allow a 2–3 week turnaround before shipping'
    ]
  },
  {
    id: 4,
    title: "Misty Mountains",
    price: '$150.00',
    images: [
      '/MistyMountains.png'
    ],
    category: 'Art Prints',
    type: 'Art Print',
    description: "An original one-of-a-kind watercolor landscape of layered, misty peaks. Signed by the artist and ready to frame.",
    details: [
      'Original hand-painted watercolor (not a print)',
      'Painted on archival watercolor paper',
      'Signed by the artist',
      'One available — once it sells, it is gone'
    ]
  }
];

// --- In-memory write-through bridge -----------------------------------------
// Vercel Blob's content CDN is eventually consistent: after a write it can take
// up to ~60s for a read of the same URL to reflect the change. Back-to-back
// admin mutations on the same warm serverless instance would otherwise re-read
// a stale list and resurrect just-deleted products. To prevent that, after a
// write we keep the exact array we just persisted in memory and let the next
// mutation on this instance read it directly instead of re-reading storage.
let writeBridge: { products: any[]; expires: number } | null = null;
const BRIDGE_TTL_MS = 90_000; // safely exceeds the ~60s CDN propagation window

// Read the latest catalog from Blob. We always read the NEWEST blob (by upload
// time). Because every save writes to a brand-new unique pathname, that URL has
// no cached predecessor, so its first read is served fresh from origin — this
// is what sidesteps the CDN staleness entirely.
async function loadFromStore(): Promise<any[]> {
  try {
    const { blobs } = await list({ prefix: CATALOG_PREFIX, limit: 100 });
    if (blobs.length === 0) return defaultProducts;
    const newest = blobs.reduce((a, b) =>
      new Date(b.uploadedAt).getTime() > new Date(a.uploadedAt).getTime() ? b : a
    );
    const resp = await fetch(newest.url, { cache: 'no-store' });
    if (!resp.ok) return defaultProducts;
    const data = await resp.json();
    return Array.isArray(data) ? data : defaultProducts;
  } catch (e) {
    console.error('loadFromStore failed:', e);
    return defaultProducts;
  }
}

// Used by mutations: prefer the freshly-written in-memory array if this warm
// instance wrote recently, so rapid sequential edits never see stale storage.
async function loadForWrite(): Promise<any[]> {
  if (writeBridge && Date.now() < writeBridge.expires) {
    return writeBridge.products.map((p) => ({ ...p }));
  }
  return loadFromStore();
}

async function saveProducts(products: any[]): Promise<void> {
  // Write an immutable, uniquely-named blob (catalog/products-<random>.json).
  const { url } = await put(CATALOG_BASENAME, JSON.stringify(products), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: true,
  });

  // Update the in-memory bridge immediately so this instance's next mutation
  // reads the just-written state, regardless of CDN/list propagation lag.
  writeBridge = { products: products.map((p) => ({ ...p })), expires: Date.now() + BRIDGE_TTL_MS };

  // Best-effort cleanup of superseded versions so the store doesn't accumulate
  // and reads stay unambiguous. Never let cleanup failure fail the request.
  try {
    const { blobs } = await list({ prefix: CATALOG_PREFIX, limit: 100 });
    const stale = blobs.filter((b) => b.url !== url).map((b) => b.url);
    if (stale.length) await del(stale);
  } catch (e) {
    console.error('catalog cleanup failed (non-fatal):', e);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      // Shop + dashboard load: always read from storage (never the write
      // bridge) so a warm read-instance can't pin stale in-memory data.
      const products = await loadFromStore();
      return res.status(200).json(products);
    } catch (e: any) {
      return res.status(500).json({ error: e.message || 'Failed to load products' });
    }
  }

  if (req.headers.authorization !== 'Bearer admin_authenticated') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    let products = await loadForWrite();

    if (req.method === 'POST') {
      const product = { ...req.body };
      const maxId = products.reduce((max: number, p: any) => Math.max(max, Number(p.id) || 0), 0);
      product.id = maxId + 1;
      products.push(product);
    } else if (req.method === 'PUT') {
      const updated = req.body;
      const i = products.findIndex((p: any) => p.id === updated.id);
      if (i !== -1) products[i] = updated;
    } else if (req.method === 'DELETE') {
      const id = Number(req.query.id);
      products = products.filter((p: any) => p.id !== id);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    await saveProducts(products);
    return res.status(200).json({ success: true, products });
  } catch (e: any) {
    console.error('Product operation error:', e);
    return res.status(500).json({ error: e.message || 'Operation failed' });
  }
}
