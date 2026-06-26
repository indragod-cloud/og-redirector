// pages/p/[id].js
import Head from 'next/head';
import redis from '../../lib/redis';
import { useEffect } from 'react';

const RATIO_SIZES = {
  '16:9': { width: 1200, height: 630 },
  '1:1':  { width: 1080, height: 1080 },
  '4:5':  { width: 1080, height: 1350 },
  '9:16': { width: 1080, height: 1920 },
};

export default function PreviewPage({ data, error, id }) {
  useEffect(() => {
    if (data?.targetUrl) {
      window.location.replace(data.targetUrl);
    }
  }, [data]);

  if (error || !data) {
    return (
      <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '60px' }}>
        <h2>Link tidak ditemukan atau sudah kadaluarsa.</h2>
      </div>
    );
  }

  const pageUrl = `${process.env.NEXT_PUBLIC_APP_URL}/p/${id}`;
  const size = RATIO_SIZES[data.ratio] || RATIO_SIZES['16:9'];
  const siteName = data.siteName || 'OG-REDIRECTOR.VERCEL.APP';

  return (
    <>
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.description} />

        {/* Open Graph */}
        <meta property="og:title" content={data.title} />
        <meta property="og:description" content={data.description} />
        <meta property="og:image" content={data.imageUrl} />
        <meta property="og:image:width" content={String(size.width)} />
        <meta property="og:image:height" content={String(size.height)} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:url" content={pageUrl} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.title} />
        <meta name="twitter:description" content={data.description} />
        <meta name="twitter:image" content={data.imageUrl} />
        <meta name="twitter:site" content={siteName} />
      </Head>

      <div style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: '#f0f2f5', padding: '20px'
      }}>
        <img
          src={data.imageUrl}
          alt={data.title}
          style={{ maxWidth: '600px', width: '100%', borderRadius: '12px', marginBottom: '24px' }}
        />
        <h1 style={{ fontSize: '1.4rem', textAlign: 'center', color: '#1c1e21', margin: '0 0 8px' }}>
          {data.title}
        </h1>
        {data.description && (
          <p style={{ color: '#65676b', textAlign: 'center', margin: '0 0 20px' }}>
            {data.description}
          </p>
        )}
        <p style={{ color: '#1877f2', fontSize: '0.9rem' }}>⏳ Mengalihkan ke halaman tujuan...</p>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { id } = params;
  try {
    const raw = await redis.get(`link:${id}`);
    if (!raw) return { props: { error: true, id } };
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return { props: { data, id } };
  } catch (err) {
    console.error(err);
    return { props: { error: true, id } };
  }
}
