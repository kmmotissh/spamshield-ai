import React, { useState } from 'react';
import { 
  PhoneCall, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Radio, 
  MapPin, 
  Building2, 
  Calendar,
  AlertCircle,
  HelpCircle,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { scanPhone } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import RiskMeter from '../components/RiskMeter';

export default function PhoneScanner({ initialPhone = '' }) {
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  React.useEffect(() => {
    if (initialPhone) {
      setPhoneNumber(initialPhone);
      setError(null);
    }
  }, [initialPhone]);

  const sampleNumbers = [
    { label: 'Digital Arrest Scam', num: '+919876543210' },
    { label: 'SBI KYC Phishing', num: '+919123456789' },
    { label: 'Electricity Disconnect', num: '+919945012384' },
    { label: 'Telegram Job Scam', num: '+917021345678' },
    { label: 'FedEx Customs Fraud', num: '+919443210987' },
    { label: 'Safe Mobile Number', num: '+919820129820' }
  ];

  async function handleScan(e) {
    if (e) e.preventDefault();
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number to scan');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await scanPhone(phoneNumber);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Error occurred while scanning phone number');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectSample(num) {
    setPhoneNumber(num);
    setError(null);
  }

  function handleReset() {
    setPhoneNumber('');
    setResult(null);
    setError(null);
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="title-section" style={{ fontSize: '1.85rem', marginBottom: '0.35rem' }}>
          Indian Phone Number & Caller Threat Scanner
        </h1>
        <p className="subtitle">
          Inspect any 10-digit mobile number, landline, or international VOIP caller against the National ScamShield Registry.
        </p>
      </div>

      {/* Input Box */}
      <div className="cyber-card cyber-card-glow" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleScan}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Enter Phone Number (with or without +91 / 0):
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. +919876543210 or 9876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{ paddingLeft: '2.5rem', fontFamily: 'var(--font-mono)', fontSize: '1.05rem' }}
              />
              <PhoneCall size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn-outline"
                onClick={handleReset}
                disabled={loading}
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>

              <button type="submit" className="btn-primary" disabled={loading}>
                <Search size={18} />
                <span>{loading ? 'Inspecting...' : 'Scan Number'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Sample Quick Clicks */}
        <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Sparkles size={12} color="#06b6d4" /> Quick Test Samples:
          </span>
          {sampleNumbers.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(s.num)}
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.6rem',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid #1e293b',
                color: '#cbd5e1',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.target.style.borderColor = '#0284c7'}
              onMouseLeave={(e) => e.target.style.borderColor = '#1e293b'}
            >
              {s.label} ({s.num})
            </button>
          ))}
        </div>

        {error && (
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results Section */}
      {result && (
        <div className="grid-2">
          {/* Left Column: Risk Gauge & Number Attributes */}
          <div className="cyber-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Target Contact
                </span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#f8fafc' }}>
                  {result.phone_number}
                </div>
              </div>
              <RiskBadge level={result.risk_level} />
            </div>

            <RiskMeter score={result.risk_score} level={result.risk_level} verdict={result.verdict} />

            <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '1.25rem', paddingTop: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={12} color="#38bdf8" /> Telecom Circle
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '0.2rem' }}>
                    {result.circle_state_guess}
                  </div>
                </div>

                <div style={{ padding: '0.75rem', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Building2 size={12} color="#06b6d4" /> Carrier Operator
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '0.2rem' }}>
                    {result.carrier_guess}
                  </div>
                </div>

                <div style={{ padding: '0.75rem', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Radio size={12} color="#10b981" /> Number Line Type
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '0.2rem' }}>
                    {result.telecom_type}
                  </div>
                </div>

                <div style={{ padding: '0.75rem', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '8px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={12} color="#f59e0b" /> Registry Reports
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '0.2rem', color: result.reports_count > 0 ? '#ef4444' : '#10b981' }}>
                    {result.reports_count} {result.reports_count === 1 ? 'report' : 'reports'}
                  </div>
                </div>
              </div>
            </div>

            {result.is_known_scam && (
              <div style={{ marginTop: '1.25rem', padding: '1rem', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f87171', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldAlert size={16} /> Known Scam Profile
                </div>
                <div style={{ fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '0.25rem' }}>
                  <strong>Caller ID Tag:</strong> {result.caller_name}
                </div>
                <div style={{ fontSize: '0.825rem', color: '#cbd5e1', marginBottom: '0.25rem' }}>
                  <strong>Scam Category:</strong> {result.category} &bull; {result.fraud_type}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <strong>Report Details:</strong> {result.description}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Risk Factors & Recommendations */}
          <div>
            <div className="cyber-card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} color="#f97316" /> Identified Risk Factors ({result.risk_factors.length})
              </h3>

              {result.risk_factors.length > 0 ? (
                <div>
                  {result.risk_factors.map((factor, idx) => (
                    <div 
                      key={idx} 
                      className={`factor-card ${factor.impact.toLowerCase()}`}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>
                            {factor.rule}
                          </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: factor.impact === 'Critical' ? '#f87171' : '#fb923c' }}>
                            +{factor.score_change} pts
                          </span>
                        </div>
                        <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                          {factor.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', color: '#34d399', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} />
                  <span>No high-risk red flags identified for this phone number.</span>
                </div>
              )}
            </div>

            {/* Safety Tips & Action */}
            <div className="cyber-card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HelpCircle size={18} color="#06b6d4" /> Defensive Action Guidelines
              </h3>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {result.safety_recommendations.map((tip, idx) => (
                  <li key={idx} style={{ color: '#e2e8f0' }}>{tip}</li>
                ))}
              </ul>

              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  National Cyber Crime Helpline: <strong style={{ color: '#f87171' }}>1930</strong>
                </div>
                <a 
                  href="https://cybercrime.gov.in" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ fontSize: '0.8rem', color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}
                >
                  cybercrime.gov.in &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
