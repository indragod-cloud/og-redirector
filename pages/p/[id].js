// pages/p/[id].js
import Head from 'next/head';
import redis from '../../lib/redis';

// Untuk Facebook: portrait tidak support → konversi ke landscape/square
const RATIO_SIZES = {
  '16:9': { width: 1200, height: 630 },
  '1:1':  { width: 1200, height: 1200 },
  '4:5':  { width: 1200, height: 1200 }, // paksa 1:1
  '9:16': { width: 1200, height: 630 },  // paksa 16:9
};

export default function PreviewPage({ data, error }) {
  if (error || !data) {
    return (
      <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '60px' }}>
        <h2>Link tidak ditemukan atau sudah kadaluarsa.</h2>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.description} />

        {/* Open Graph */}
        <meta property="og:title" content={data.title} />
        <meta property="og:description" content={data.description} />
        <meta property="og:image" content={data.imageUrl} />
        <meta property="og:image:width" content={String(data.ogWidth)} />
        <meta property="og:image:height" content={String(data.ogHeight)} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content={data.siteName} />
        <meta property="og:url" content={data.pageUrl} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.title} />
        <meta name="twitter:description" content={data.description} />
        <meta name="twitter:image" content={data.imageUrl} />
      </Head>

      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'sans-serif', background: '#f0f2f5',
      }}>
        <p style={{ color: '#1877f2' }}>⏳ Mengalihkan...</p>
      </div>
    </>
  );
}

export async function getServerSideProps({ params, req }) {
  const { id } = params;
  const userAgent = req.headers['user-agent'] || '';

  // Deteksi crawler Facebook, WhatsApp, Telegram, dll
  const isCrawler = /facebookexternalhit|Facebot|Twitterbot|WhatsApp|TelegramBot|LinkedInBot|Slackbot|bot|crawler|spider/i.test(userAgent);

  try {
    const raw = await redis.get(`link:${id}`);
    if (!raw) return { props: { error: true } };

    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const size = RATIO_SIZES[data.ratio] || RATIO_SIZES['16:9'];
    const pageUrl = `${process.env.NEXT_PUBLIC_APP_URL}/p/${id}`;
    const siteName = data.siteName || 'OG-REDIRECTOR.VERCEL.APP';

    // Crawler → tampilkan OG tag, JANGAN redirect
    if (isCrawler) {
      return {
        props: {
          data: {
            ...data,
            pageUrl,
            siteName,
            ogWidth: size.width,
            ogHeight: size.height,
          }
        }
      };
    }

    // User biasa → langsung redirect
    return {
      redirect: {
        destination: data.targetUrl,
        permanent: false,
      }
    };

  } catch (err) {
    console.error(err);
    return { props: { error: true } };
  }
}
