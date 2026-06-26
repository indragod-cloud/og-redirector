// pages/index.js
import { useState, useRef } from 'react';
import Head from 'next/head';

const RATIOS = [
  { value: '16:9', label: '16:9', desc: 'Facebook / Blog', aspect: '16/9' },
  { value: '1:1',  label: '1:1',  desc: 'Instagram Feed',  aspect: '1/1'  },
  { value: '4:5',  label: '4:5',  desc: 'Portrait',        aspect: '4/5'  },
  { value: '9:16', label: '9:16', desc: 'Stories / Reels', aspect: '9/16' },
];

export default function Home() {
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [ratio, setRatio] = useState('16:9');
  const [form, setForm] = useState({ title: '', description: '', targetUrl: '', siteName: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef();

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
      setImageBase64(ev.target.result);
      setStep(2);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    if (!imageBase64 || !form.title || !form.targetUrl) {
      alert('Gambar, judul, dan URL tujuan wajib diisi!');
      return;
    }
    setLoading(true);
    try {
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, ratio }),
      });
      const { imageUrl, error: uploadErr } = await uploadRes.json();
      if (uploadErr) throw new Error(uploadErr);

      const createRes = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, ...form, ratio }),
      });
      const { previewUrl, error: createErr } = await createRes.json();
      if (createErr) throw new Error(createErr);

      setResult(previewUrl);
      setStep(3);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function handleReset() {
    setStep(1);
    setImagePreview(null);
    setImageBase64(null);
    setRatio('16:9');
    setForm({ title: '', description: '', targetUrl: '', siteName: '' });
    setResult(null);
  }

  const selectedRatio = RATIOS.find(r => r.value === ratio);

  return (
    <>
      <Head>
        <title>OG Link Generator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={s.page}>
        <div style={s.card}>

          <div style={s.header}>
            <div style={s.logo}>🔗</div>
            <h1 style={s.title}>OG Link Generator</h1>
            <p style={s.subtitle}>Buat link dengan preview besar di Facebook</p>
          </div>

          <div style={s.stepBar}>
            {['Upload Gambar', 'Isi Detail', 'Selesai'].map((label, i) => {
              const num = i + 1;
              const active = step === num;
              const done = step > num;
              return (
                <div key={i} style={s.stepItem}>
                  <div style={{
                    ...s.stepCircle,
                    background: done ? '#22c55e' : active ? '#1877f2' : '#e4e6ea',
                    color: done || active ? '#fff' : '#9ca3af',
                  }}>
                    {done ? '✓' : num}
                  </div>
                  <span style={{ ...s.stepLabel, color: active ? '#1877f2' : done ? '#22c55e' : '#9ca3af' }}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* STEP 1: Upload + Pilih Rasio */}
          {step === 1 && (
            <div>
              {/* Ratio Selector */}
              <p style={s.ratioTitle}>Pilih ukuran gambar:</p>
              <div style={s.ratioGrid}>
                {RATIOS.map(r => (
                  <button
                    key={r.value}
                    style={{
                      ...s.ratioBtn,
                      border: ratio === r.value ? '2px solid #1877f2' : '2px solid #e4e6ea',
                      background: ratio === r.value ? '#eff6ff' : '#fff',
                    }}
                    onClick={() => setRatio(r.value)}
                  >
                    <div style={{
                      ...s.ratioPreview,
                      aspectRatio: r.aspect,
                      background: ratio === r.value ? '#bfdbfe' : '#e4e6ea',
                    }} />
                    <span style={{
                      ...s.ratioLabel,
                      color: ratio === r.value ? '#1877f2' : '#1c1e21',
                      fontWeight: ratio === r.value ? 700 : 500,
                    }}>{r.label}</span>
                    <span style={s.ratioDesc}>{r.desc}</span>
                  </button>
                ))}
              </div>

              {/* Dropzone */}
              <div
                style={s.dropzone}
                onClick={() => fileRef.current.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    const dt = new DataTransfer();
                    dt.items.add(file);
                    fileRef.current.files = dt.files;
                    fileRef.current.dispatchEvent(new Event('change', { bubbles: true }));
                  }
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🖼️</div>
                <p style={s.dropTitle}>Klik atau drag & drop gambar</p>
                <p style={s.dropHint}>
                  Akan di-crop ke rasio <strong>{selectedRatio.label}</strong> · JPG, PNG, WEBP
                </p>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
              </div>
            </div>
          )}

          {/* STEP 2: Form */}
          {step === 2 && (
            <div>
              {/* Preview gambar dengan rasio yang dipilih */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  width: '100%',
                  aspectRatio: selectedRatio.aspect,
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1px solid #e4e6ea',
                  background: '#f0f2f5',
                }}>
                  <img
                    src={imagePreview}
                    alt="preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <p style={{ margin: '6px 0 0', fontSize: '0.8rem', color: '#65676b', textAlign: 'center' }}>
                  Rasio: <strong>{selectedRatio.label}</strong> — {selectedRatio.desc}
                  <button
                    onClick={() => setStep(1)}
                    style={{ marginLeft: '8px', color: '#1877f2', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
                  >
                    Ganti rasio
                  </button>
                </p>
              </div>

              {[
                { key: 'title', label: 'Judul', hint: 'tampil di preview Facebook', placeholder: 'Contoh: Viral!! Sepatu Murah Kualitas Premium...', required: true },
                { key: 'description', label: 'Deskripsi', hint: 'opsional', placeholder: 'Deskripsi singkat...', required: false },
                { key: 'targetUrl', label: 'URL Tujuan', hint: 'link saat preview diklik', placeholder: 'https://s.shopee.co.id/...', required: true },
                { key: 'siteName', label: 'Nama Situs', hint: 'muncul di bawah preview', placeholder: 'Contoh: SHOPEE.CO.ID', required: false },
              ].map(f => (
                <div key={f.key} style={s.formGroup}>
                  <label style={s.label}>
                    {f.label} {f.required && <span style={{ color: '#ef4444' }}>*</span>}
                    <span style={s.hint}> — {f.hint}</span>
                  </label>
                  {f.key === 'description' ? (
                    <textarea
                      style={{ ...s.input, height: '76px', resize: 'vertical' }}
                      placeholder={f.placeholder}
                      value={form[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    />
                  ) : (
                    <input
                      style={s.input}
                      placeholder={f.placeholder}
                      value={form[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    />
                  )}
                </div>
              ))}

              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button style={s.btnSecondary} onClick={() => setStep(1)}>← Ganti Gambar</button>
                <button
                  style={{ ...s.btnPrimary, flex: 1, opacity: loading ? 0.75 : 1 }}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? '⏳ Memproses...' : '🚀 Generate Link'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Result */}
          {step === 3 && result && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '12px' }}>🎉</div>
              <h2 style={{ margin: '0 0 6px', color: '#1c1e21' }}>Link berhasil dibuat!</h2>
              <p style={{ color: '#65676b', marginBottom: '24px', fontSize: '0.95rem' }}>
                Share link ini ke Facebook — preview akan tampil besar otomatis
              </p>

              <div style={s.resultBox}>
                <span style={s.resultUrl}>{result}</span>
                <button style={s.copyBtn} onClick={handleCopy}>
                  {copied ? '✅ Tersalin!' : '📋 Salin'}
                </button>
              </div>

              <div style={s.infoBox}>
                <p style={{ fontWeight: 700, margin: '0 0 10px', color: '#1c1e21' }}>📋 Cara share ke Facebook:</p>
                <ol style={{ margin: 0, paddingLeft: '18px', color: '#374151', lineHeight: '1.9', fontSize: '0.9rem' }}>
                  <li>Salin link di atas</li>
                  <li>Buka <strong>developers.facebook.com/tools/debug</strong></li>
                  <li>Paste link → klik <strong>Debug</strong> (refresh cache FB)</li>
                  <li>Buka Facebook → buat postingan baru</li>
                  <li>Paste link → preview besar muncul otomatis ✅</li>
                </ol>
              </div>

              <button style={s.btnPrimary} onClick={handleReset}>+ Buat Link Baru</button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #eff6ff 0%, #f0f2f5 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    background: '#fff', borderRadius: '20px', padding: '36px 32px',
    width: '100%', maxWidth: '520px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
  },
  header: { textAlign: 'center', marginBottom: '28px' },
  logo: { fontSize: '2.5rem', marginBottom: '8px' },
  title: { margin: '0 0 6px', fontSize: '1.6rem', fontWeight: 800, color: '#1c1e21' },
  subtitle: { margin: 0, color: '#65676b', fontSize: '0.92rem' },
  stepBar: { display: 'flex', justifyContent: 'center', gap: '28px', marginBottom: '28px' },
  stepItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' },
  stepCircle: {
    width: '34px', height: '34px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: '0.85rem',
  },
  stepLabel: { fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' },
  ratioTitle: { margin: '0 0 10px', fontWeight: 700, color: '#1c1e21', fontSize: '0.9rem' },
  ratioGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' },
  ratioBtn: {
    padding: '10px 6px', borderRadius: '10px', cursor: 'pointer',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
    transition: 'all 0.15s',
  },
  ratioPreview: {
    width: '36px', borderRadius: '4px', transition: 'background 0.15s',
  },
  ratioLabel: { fontSize: '0.85rem' },
  ratioDesc: { fontSize: '0.68rem', color: '#6b7280', textAlign: 'center' },
  dropzone: {
    border: '2.5px dashed #93c5fd', borderRadius: '14px',
    padding: '40px 24px', textAlign: 'center', cursor: 'pointer',
    background: '#eff6ff',
  },
  dropTitle: { margin: '0 0 6px', fontWeight: 700, color: '#1c1e21', fontSize: '1rem' },
  dropHint: { margin: 0, color: '#6b7280', fontSize: '0.83rem' },
  formGroup: { marginBottom: '14px' },
  label: { display: 'block', fontWeight: 700, marginBottom: '5px', color: '#1c1e21', fontSize: '0.88rem' },
  hint: { fontWeight: 400, color: '#9ca3af', fontSize: '0.8rem' },
  input: {
    width: '100%', padding: '10px 13px', border: '1.5px solid #e4e6ea',
    borderRadius: '8px', fontSize: '0.93rem', boxSizing: 'border-box',
    outline: 'none', fontFamily: 'inherit', color: '#1c1e21',
  },
  btnPrimary: {
    padding: '13px 24px', background: '#1877f2', color: '#fff',
    border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.97rem',
    cursor: 'pointer', width: '100%',
  },
  btnSecondary: {
    padding: '13px 18px', background: '#f0f2f5', color: '#374151',
    border: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '0.93rem',
    cursor: 'pointer',
  },
  resultBox: {
    background: '#eff6ff', borderRadius: '10px', padding: '14px 16px',
    display: 'flex', alignItems: 'center', gap: '10px',
    marginBottom: '20px', wordBreak: 'break-all', textAlign: 'left',
  },
  resultUrl: { flex: 1, color: '#1877f2', fontSize: '0.88rem' },
  copyBtn: {
    padding: '8px 14px', background: '#1877f2', color: '#fff',
    border: 'none', borderRadius: '7px', cursor: 'pointer',
    fontWeight: 700, fontSize: '0.82rem', whiteSpace: 'nowrap',
  },
  infoBox: {
    background: '#f0fdf4', borderRadius: '12px', padding: '16px 18px',
    marginBottom: '22px', textAlign: 'left', border: '1px solid #bbf7d0',
  },
};
