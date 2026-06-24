import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, parsePrice, PRINT_PRICE } from '../data/products';

export type PurchaseOption = 'original' | 'original-prints';

export interface CartItem {
  lineId: string;
  productId: number;
  title: string;
  basePrice: string; // display price of the original piece, e.g. "$65.00"
  printPrice?: number; // price per print for this line (falls back to PRINT_PRICE)
  image: string;
  type: string;
  option: PurchaseOption;
  printQuantity: number; // number of prints (0 when option === 'original')
  size?: string;
  referenceImageName?: string;
  referenceImagePreview?: string; // downscaled data URL
}

export interface AddItemInput {
  product: Product;
  option: PurchaseOption;
  printQuantity: number;
  size?: string;
  basePrice?: string; // overrides product.price (e.g. a size-specific price)
  printPrice?: number; // per-print price for this configuration
  referenceImageName?: string;
  referenceImagePreview?: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (input: AddItemInput) => void;
  removeItem: (lineId: string) => void;
  setPrintQuantity: (lineId: string, printQuantity: number) => void;
  clearCart: () => void;
  lineTotal: (item: CartItem) => number;
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
}

// Free shipping threshold advertised in the site banner.
const FREE_SHIPPING_THRESHOLD = 100;
const FLAT_SHIPPING_RATE = 8;
const STORAGE_KEY = 'jocelyn-maria-cart';

const CartContext = createContext<CartContextValue | undefined>(undefined);

// Only keep stored entries that match the current cart shape. This discards
// carts saved under an older schema (which would otherwise crash on render).
function isValidCartItem(item: unknown): item is CartItem {
  if (typeof item !== 'object' || item === null) return false;
  const candidate = item as Record<string, unknown>;
  return (
    typeof candidate.lineId === 'string' &&
    typeof candidate.basePrice === 'string' &&
    typeof candidate.title === 'string' &&
    (candidate.option === 'original' || candidate.option === 'original-prints')
  );
}

function loadInitialCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(isValidCartItem) : [];
  } catch {
    return [];
  }
}

function makeLineId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
}

// Price of a single line: one original piece plus any prints.
function computeLineTotal(item: CartItem): number {
  const unit = item.printPrice ?? PRINT_PRICE;
  return parsePrice(item.basePrice) + unit * item.printQuantity;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadInitialCart);

  // Persist the cart so it survives reloads.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore write failures (e.g. quota or private mode) */
    }
  }, [items]);

  const addItem = (input: AddItemInput) => {
    const { product, option, printQuantity, size, basePrice, printPrice, referenceImageName, referenceImagePreview } = input;
    // Each add is its own line item — custom pieces carry a unique reference photo.
    setItems(prev => [
      ...prev,
      {
        lineId: makeLineId(),
        productId: product.id,
        title: product.title,
        basePrice: basePrice ?? product.price,
        printPrice,
        image: product.images[0],
        type: product.type ?? product.category,
        option,
        printQuantity: option === 'original-prints' ? Math.max(1, printQuantity) : 0,
        size,
        referenceImageName,
        referenceImagePreview
      }
    ]);
  };

  const removeItem = (lineId: string) => {
    setItems(prev => prev.filter(item => item.lineId !== lineId));
  };

  const setPrintQuantity = (lineId: string, printQuantity: number) => {
    setItems(prev =>
      prev.map(item =>
        item.lineId === lineId && item.option === 'original-prints'
          ? { ...item, printQuantity: Math.max(1, printQuantity) }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const itemCount = items.length;
  const subtotal = items.reduce((sum, item) => sum + computeLineTotal(item), 0);
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        setPrintQuantity,
        clearCart,
        lineTotal: computeLineTotal,
        itemCount,
        subtotal,
        shipping,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export { FREE_SHIPPING_THRESHOLD };
