import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'jocelyn2026';

  if (password === adminPassword) {
    // In a real app we'd use JWT or HTTP-only cookies.
    // For this simple implementation, we'll return a basic token to store in localStorage.
    return res.status(200).json({ success: true, token: 'admin_authenticated' });
  }

  return res.status(401).json({ success: false, error: 'Invalid password' });
}
