// lib/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Untuk Facebook: semua dikonversi ke landscape atau square
const RATIOS = {
  '16:9': { width: 1200, height: 630 },
  '1:1':  { width: 1200, height: 1200 },
  '4:5':  { width: 1200, height: 1200 }, // paksa 1:1
  '9:16': { width: 1200, height: 630 },  // paksa 16:9
};

export async function uploadImage(base64Data, ratio = '16:9') {
  const size = RATIOS[ratio] || RATIOS['16:9'];

  const result = await cloudinary.uploader.upload(base64Data, {
    folder: 'og-redirector',
    eager: [
      {
        width: size.width,
        height: size.height,
        crop: 'fill',
        gravity: 'center',
        quality: 90,
        format: 'jpg',
      }
    ],
    eager_async: false,
  });

  return result.eager?.[0]?.secure_url || result.secure_url;
}
