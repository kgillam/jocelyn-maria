import { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from 'pg';

import { allProducts } from '../../src/data/products';

async function withDb<T>(fn: (client: Client) => Promise<T>): Promise<T> {
  const connectionString =
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL;

  if (!connectionString) throw new Error('No database connection string found in environment');

  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.end();
  }
}

async function ensureTable(client: Client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS products (
      id   SERIAL PRIMARY KEY,
      data JSONB NOT NULL
    )
  `);
}

async function getProducts(): Promise<any[]> {
  try {
    return await withDb(async (client) => {
      await ensureTable(client);
      const result = await client.query(
        `SELECT data FROM products ORDER BY (data->>'id')::int ASC`
      );
      return result.rows.length > 0 ? result.rows.map((r) => r.data) : allProducts;
    });
  } catch (e) {
    console.error('Error fetching products from DB:', e);
    return allProducts;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const products = await getProducts();
    return res.status(200).json(products);
  }

  const authHeader = req.headers.authorization;
  if (authHeader !== 'Bearer admin_authenticated') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await withDb(async (client) => {
      await ensureTable(client);

      const { rows } = await client.query(
        `SELECT data FROM products ORDER BY (data->>'id')::int ASC`
      );
      let productsData: any[] = rows.length > 0 ? rows.map((r) => r.data) : [...allProducts];

      if (req.method === 'POST') {
        const newProduct = req.body;
        newProduct.id = Math.max(0, ...productsData.map((p: any) => p.id)) + 1;
        productsData.push(newProduct);
      } else if (req.method === 'PUT') {
        const updatedProduct = req.body;
        const index = productsData.findIndex((p: any) => p.id === updatedProduct.id);
        if (index !== -1) productsData[index] = updatedProduct;
      } else if (req.method === 'DELETE') {
        const { id } = req.query;
        productsData = productsData.filter((p: any) => p.id !== Number(id));
      }

      await client.query(`DELETE FROM products`);
      for (const product of productsData) {
        await client.query(`INSERT INTO products (data) VALUES ($1)`, [
          JSON.stringify(product),
        ]);
      }

      return productsData;
    });

    return res.status(200).json({ success: true, products: result });
  } catch (error: any) {
    const message = error?.message || String(error) || 'Database operation failed';
    console.error('Product operation failed:', error);
    return res.status(500).json({ error: message });
  }
}
