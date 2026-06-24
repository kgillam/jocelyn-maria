import { VercelRequest, VercelResponse } from '@vercel/node';
import { put, list, del } from '@vercel/blob';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Check authorization (simple check for our basic token)
  const authHeader = req.headers.authorization;
  if (authHeader !== 'Bearer admin_authenticated') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const blob = await put(`products/${Date.now()}-${req.query.filename}`, req, {
        access: 'public',
      });
      return res.status(200).json(blob);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: error.message || 'Upload failed' });
    }
  }

  res.setHeader('Allow', 'POST');
  return res.status(405).end('Method Not Allowed');
}

export const config = {
  api: {
    bodyParser: false,
  },
};
