import React, { useState, useRef } from 'react';
import { 
  FileSearch, 
  UploadCloud, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  FileText,
  AlertCircle,
  ExternalLink,
  Phone,
  RotateCcw
} from 'lucide-react';
import { scanScreenshot } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import RiskMeter from '../components/RiskMeter';

export default function ScreenshotScanner({ onNavigateToPhone }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  function handleReset() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function handleFileChange(selectedFile) {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file (.png, .jpg, .jpeg, .webp)');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  }

  async function handleUploadAndScan() {
    if (!file) {
      setError('Please select or drop an image file first');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await scanScreenshot(file);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Error occurred during screenshot OCR analysis');
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="title-section" style={{ fontSize: '1.85rem', marginBottom: '0.35rem' }}>
          Screenshot OCR & Visual Threat Scanner
        </h1>
        <p className="subtitle">
          Upload WhatsApp screenshots, suspicious SMS alerts, or payment QR receipts to extract text and identify cyber scam vectors.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="cyber-card cyber-card-glow" style={{ marginBottom: '2rem' }}>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          style={{
            border: '2px dashed #334155',
            borderRadius: '12px',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: 'rgba(15, 23, 42, 0.4)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0284c7'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#334155'}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e.target.files[0])}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(6, 182, 212, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4' }}>
              <UploadCloud size={28} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#f8fafc', marginBottom: '0.25rem' }}>
                {file ? file.name : 'Click to upload or drag & drop screenshot'}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Supports PNG, JPG, JPEG, WEBP up to 10MB
              </div>
            </div>
          </div>
        </div>

        {preview && (
          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', padding: '1rem', background: '#090e1a', borderRadius: '10px', border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src={preview}
                alt="Upload preview"
                style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #334155' }}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc' }}>{file.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  {(file.size / 1024).toFixed(1)} KB &bull; Image Ready for OCR Analysis
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-outline"
                onClick={handleReset}
                disabled={loading}
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>

              <button
                type="button"
                className="btn-primary"
                onClick={handleUploadAndScan}
                disabled={loading}
              >
                <Cpu size={18} />
                <span>{loading ? 'Performing OCR & Scanning...' : 'Start OCR Threat Analysis'}</span>
              </button>
            </div>
          </div>
        )}

        {error && (
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results Display */}
      {result && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              OCR Inspection Analysis
            </span>
            <button
              type="button"
              className="btn-outline"
              onClick={handleReset}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', gap: '0.4rem' }}
            >
              <RotateCcw size={14} />
              <span>Clear & Scan Another Screenshot</span>
            </button>
          </div>

          <div className="grid-2">
          {/* Left Column: OCR Output & Extracted Text */}
          <div className="cyber-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} color="#06b6d4" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>OCR Text Extraction</h3>
              </div>
              <span style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                color: '#93c5fd',
                background: 'rgba(2, 132, 199, 0.15)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                border: '1px solid rgba(2, 132, 199, 0.3)'
              }}>
                Engine: {result.ocr_engine}
              </span>
            </div>

            <div style={{
              background: '#070b14',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              padding: '1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              color: '#cbd5e1',
              whiteSpace: 'pre-wrap',
              maxHeight: '260px',
              overflowY: 'auto',
              marginBottom: '1rem',
              lineHeight: 1.6
            }}>
              {result.extracted_text || '(No legible text identified)'}
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '1.25rem' }}>
              {result.ocr_status}
            </div>

            {/* Extracted Phone Numbers */}
            {result.detected_phones?.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem' }}>
                  Numbers Discovered in Image:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {result.detected_phones.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => onNavigateToPhone && onNavigateToPhone(p)}
                      style={{
                        padding: '0.3rem 0.6rem',
                        borderRadius: '6px',
                        background: 'rgba(2, 132, 199, 0.15)',
                        border: '1px solid rgba(2, 132, 199, 0.35)',
                        color: '#38bdf8',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <Phone size={12} /> {p} &rarr;
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted URLs */}
            {result.detected_urls?.length > 0 && (
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem' }}>
                  URLs Extracted from Image:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {result.detected_urls.map((u, idx) => (
                    <span key={idx} style={{
                      padding: '0.35rem 0.6rem',
                      borderRadius: '6px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      color: '#fca5a5',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      wordBreak: 'break-all'
                    }}>
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Threat Evaluation */}
          <div className="cyber-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Category Verdict
                </span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                  {result.detected_category}
                </div>
              </div>
              <RiskBadge level={result.risk_level} />
            </div>

            <RiskMeter score={result.risk_score} level={result.risk_level} verdict={result.verdict} />

            <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '1.5rem', paddingTop: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertTriangle size={16} color="#f97316" /> Image Threat Indicators ({result.risk_indicators.length})
              </h4>

              {result.risk_indicators.length > 0 ? (
                <div>
                  {result.risk_indicators.map((ind, idx) => (
                    <div key={idx} className={`factor-card ${ind.impact.toLowerCase()}`}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#f8fafc' }}>
                            {ind.rule}
                          </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: ind.impact === 'Critical' ? '#f87171' : '#fb923c' }}>
                            +{ind.score_change} pts
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {ind.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', color: '#34d399', fontSize: '0.825rem' }}>
                  No threatening triggers detected in screenshot text.
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
                Protective Next Steps:
              </div>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {result.recommendations.map((r, idx) => (
                  <li key={idx} style={{ color: '#e2e8f0' }}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
}
