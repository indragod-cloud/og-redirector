// pages/api/create.js
import redis from '../../lib/redis';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { imageUrl, title, description, targetUrl, siteName, ratio } = req.body;

    if (!imageUrl || !title || !targetUrl) {
      return res.status(400).json({ error: 'imageUrl, title, dan targetUrl wajib diisi' });
    }

    const id = uuidv4().slice(0, 8);
    const data = {
      imageUrl,
      title,
      description: description || '',
      targetUrl,
      siteName: siteName || '',
      ratio: ratio || '16:9',
      createdAt: new Date().toISOString(),
    };

    await redis.set(`link:${id}`, JSON.stringify(data), { ex: 60 * 60 * 24 * 90 });

    const previewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/p/${id}`;
    res.status(200).json({ id, previewUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal membuat link: ' + err.message });
  }
}
