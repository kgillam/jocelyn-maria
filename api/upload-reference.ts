import { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

// Allow a few MB so a downscaled reference photo's data URL fits.
export const config = { api: { bodyParser: { sizeLimit: '6mb' } } };

const MAX_BYTES = 5 * 1024 * 1024; // 5MB decoded

// Public endpoint: customers upload a reference photo (already downscaled
// client-side) so we can store it in Blob and put a small URL in the order
// metadata — a base64 data URL is far too big for Stripe metadata.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { dataUrl, filename } = req.body ?? {};
    if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
      return res.status(400).json({ error: 'A valid image data URL is required.' });
    }

    const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) return res.status(400).json({ error: 'Unsupported image format.' });

    const contentType = match[1];
    const buffer = Buffer.from(match[2], 'base64');
    if (buffer.length === 0) return res.status(400).json({ error: 'Empty image.' });
    if (buffer.length > MAX_BYTES) return res.status(413).json({ error: 'Image is too large.' });

    const ext = (contentType.split('/')[1] || 'jpg').replace('jpeg', 'jpg').replace('+xml', '');
    const safe =
      String(filename || 'reference')
        .replace(/\.[^.]+$/, '') // drop any existing extension
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .slice(0, 60) || 'reference';

    const blob = await put(`references/${safe}.${ext}`, buffer, {
      access: 'public',
      contentType,
      addRandomSuffix: true,
    });

    return res.status(200).json({ url: blob.url });
  } catch (error: any) {
    console.error('Reference upload failed:', error?.message || error);
    return res.status(500).json({ error: 'Upload failed.' });
  }
}
