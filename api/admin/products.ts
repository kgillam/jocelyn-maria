import { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

import { allProducts } from '../../src/data/products';

function getDb() {
  // neon() HTTP transport requires the direct (unpooled) Neon endpoint URL
  const url = process.env.DATABASE_URL_UNPOOLED
    || process.env.POSTGRES_URL_NON_POOLING
    || process.env.DATABASE_URL
    || process.env.POSTGRES_URL;
  if (!url) throw new Error('No database URL configured');
  return neon(url);
}

async function ensureTable(sql: ReturnType<typeof neon>) {
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id        SERIAL PRIMARY KEY,
      data      JSONB NOT NULL
    )
  `;
}

async function getProducts() {
  try {
    const sql = getDb();
    await ensureTable(sql);
    const rows = await sql`SELECT data FROM products ORDER BY (data->>'id')::int ASC`;
    if (rows.length > 0) {
      return rows.map((r: any) => r.data);
    }
  } catch (e) {
    console.error('Error fetching products from DB:', e);
  }
  return allProducts;
}

async function saveProducts(sql: ReturnType<typeof neon>, productsData: any[]) {
  await sql`DELETE FROM products`;
  for (const product of productsData) {
    await sql`INSERT INTO products (data) VALUES (${JSON.stringify(product)})`;
  }
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
    const sql = getDb();
    await ensureTable(sql);

    let productsData: any[] = await getProducts();

    if (req.method === 'POST') {
      const newProduct = req.body;
      newProduct.id = Math.max(0, ...productsData.map((p: any) => p.id)) + 1;
      productsData.push(newProduct);
    } else if (req.method === 'PUT') {
      const updatedProduct = req.body;
      const index = productsData.findIndex((p: any) => p.id === updatedProduct.id);
      if (index !== -1) {
        productsData[index] = updatedProduct;
      }
    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      productsData = productsData.filter((p: any) => p.id !== Number(id));
    } else {
      res.setHeader('Allow', 'GET, POST, PUT, DELETE');
      return res.status(405).end('Method Not Allowed');
    }

    await saveProducts(sql, productsData);
    return res.status(200).json({ success: true, products: productsData });
  } catch (error: any) {
    const message = error?.message || error?.name || String(error) || 'Database operation failed';
    console.error('Product operation failed:', error);
    return res.status(500).json({ error: message });
  }
}
