// pages/api/upload.js
import { uploadImage } from '../../lib/cloudinary';

export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { imageBase64, ratio } = req.body;
    if (!imageBase64) return res.status(400).json({ error: 'No image provided' });

    const imageUrl = await uploadImage(imageBase64, ratio);
    res.status(200).json({ imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
}
