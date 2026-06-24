import { VercelRequest, VercelResponse } from '@vercel/node';
import { put, list } from '@vercel/blob';

// We fallback to the hardcoded products if the blob doesn't exist yet
import { allProducts } from '../../src/data/products';

const BLOB_PATH = 'database/products.json';

async function getProducts() {
  try {
    const { blobs } = await list({ prefix: BLOB_PATH });
    if (blobs.length > 0) {
      const response = await fetch(blobs[0].url);
      if (response.ok) {
        return await response.json();
      }
    }
  } catch (e) {
    console.error('Error fetching products from blob:', e);
  }
  return allProducts;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const products = await getProducts();
    return res.status(200).json(products);
  }

  // All mutating methods require auth
  const authHeader = req.headers.authorization;
  if (authHeader !== 'Bearer admin_authenticated') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const products = await getProducts();

    if (req.method === 'POST') {
      const newProduct = req.body;
      // Generate a simple ID
      newProduct.id = Math.max(0, ...products.map((p: any) => p.id)) + 1;
      products.push(newProduct);
    } else if (req.method === 'PUT') {
      const updatedProduct = req.body;
      const index = products.findIndex((p: any) => p.id === updatedProduct.id);
      if (index !== -1) {
        products[index] = updatedProduct;
      }
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      const index = products.findIndex((p: any) => p.id === Number(id));
      if (index !== -1) {
        products.splice(index, 1);
      }
    } else {
      res.setHeader('Allow', 'GET, POST, PUT, DELETE');
      return res.status(405).end('Method Not Allowed');
    }

    // Save back to Blob
    await put(BLOB_PATH, JSON.stringify(products), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false, // Override the file
    });

    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database operation failed' });
  }
}
