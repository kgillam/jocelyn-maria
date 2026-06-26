export interface ProductOption {
  name: string;      // e.g. "Background"
  choices: string[];  // e.g. ["White", "Cream", "Sage Green"]
}

export interface Product {
  id: number;
  title: string;
  price: string;
  // Per-print price for Custom pieces that are NOT sold by size. When a product
  // has sizes, each size carries its own printPrice instead. When unset, the
  // piece simply isn't offered as prints.
  printPrice?: number;
  images: string[];
  // Doubles as the descriptor shown on cards/detail: 'Custom' | 'Greeting Card'
  // | 'Original Painting'. Older entries may use legacy values.
  category: string;
  // Legacy descriptor. Kept for backward-compatibility; the admin now mirrors
  // it from `category` on save so existing reads keep working.
  type?: string;
  description: string;
  details: string[];
  sizes?: SizeOption[];
  // Whether this product is visible on the storefront. Defaults to true when
  // omitted, so all existing products remain visible without a migration.
  active?: boolean;
  // Custom selectable options (e.g. background type). Each option has a name
  // and a list of choices the customer picks from on the product detail page.
  options?: ProductOption[];
}

export interface SizeOption {
  label: string;
  price: number;        // price of the original piece at this size
  printPrice?: number;  // price per print at this size (Custom pieces)
}

export const allProducts: Product[] = [
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

// Categories temporarily hidden from the storefront. The client is currently
// only marketing Custom Watercolor House Portraits & Custom Portraits.
// Remove entries here to re-enable them in the Featured section and Shop page.
export const hiddenCategories = ['Cards', 'Original Paintings'];

const allCategories = ['All Shop', 'Cards', 'Watercolor Houses', 'Portraits', 'Original Paintings'];

// Products and category filters shown across the storefront (Featured + Shop).
export const visibleProducts = allProducts.filter(p => !hiddenCategories.includes(p.category));
export const categories = allCategories.filter(c => !hiddenCategories.includes(c));

// Look up a single product by its id (used by the product detail page).
export function getProductById(id: number | string): Product | undefined {
  const numericId = typeof id === 'string' ? Number(id) : id;
  return allProducts.find(p => p.id === numericId);
}

// Convert a display price like "$65.00" into a number for cart math. Reads only
// the first valid numeric token so a malformed string can't silently zero out.
export function parsePrice(price: string): number {
  if (typeof price !== 'string') return 0;
  const match = price.replace(/[^0-9.]/g, '').match(/^\d*(?:\.\d+)?/);
  return match ? Number(match[0]) || 0 : 0;
}

// Format a number back into the storefront's "$0.00" display style.
export function formatPrice(amount: number): string {
  return `$${(Math.round(amount * 100) / 100).toFixed(2)}`;
}
