// pages/api/link/[id].js
import redis from '../../../lib/redis';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const raw = await redis.get(`link:${id}`);
    if (!raw) return res.status(404).json({ error: 'Link tidak ditemukan' });

    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
