import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, allProducts as fallbackProducts } from '../data/products';

interface ProductContextType {
  products: Product[];
  visibleProducts: Product[];
  categories: string[];
  loading: boolean;
  getProductById: (id: number | string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/admin/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Failed to fetch products, using fallback', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const visibleProducts = products;

  const categorySet = new Set(products.map(p => p.category));
  const categories = ['All Shop', ...Array.from(categorySet)];

  const getProductById = (id: number | string) => {
    const numericId = typeof id === 'string' ? Number(id) : id;
    return products.find(p => p.id === numericId);
  };

  return (
    <ProductContext.Provider value={{ products, visibleProducts, categories, loading, getProductById }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
