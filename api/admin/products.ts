import { VercelRequest, VercelResponse } from '@vercel/node';
import { put, list } from '@vercel/blob';

const PRODUCTS_PATH = 'catalog/products.json';

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
    category: 'Original Paintings',
    type: 'Original Painting',
    description: "An original one-of-a-kind watercolor landscape of layered, misty peaks. Signed by the artist and ready to frame.",
    details: [
      'Original hand-painted watercolor (not a print)',
      'Painted on archival watercolor paper',
      'Signed by the artist',
      'One available — once it sells, it is gone'
    ]
  }
];

async function loadProducts(): Promise<any[]> {
  try {
    const { blobs } = await list({ prefix: 'catalog/', limit: 10 });
    const blob = blobs.find(b => b.pathname === PRODUCTS_PATH);
    if (!blob) return defaultProducts;
    const resp = await fetch(blob.url);
    if (!resp.ok) return defaultProducts;
    return await resp.json();
  } catch {
    return defaultProducts;
  }
}

async function saveProducts(products: any[]): Promise<void> {
  await put(PRODUCTS_PATH, JSON.stringify(products), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const products = await loadProducts();
      return res.status(200).json(products);
    } catch (e: any) {
      return res.status(500).json({ error: e.message || 'Failed to load products' });
    }
  }

  if (req.headers.authorization !== 'Bearer admin_authenticated') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    let products = await loadProducts();

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
