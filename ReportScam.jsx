import React, { useState, useEffect } from 'react';
import { 
  Flag, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  History, 
  Calendar,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { submitReport, getReports } from '../services/api';

export default function ReportScam() {
  const [targetType, setTargetType] = useState('phone');
  const [targetValue, setTargetValue] = useState('');
  const [category, setCategory] = useState('Digital Arrest');
  const [fraudType, setFraudType] = useState('Police / CBI Impersonation');
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState('');
  const [reporterContact, setReporterContact] = useState('Anonymous');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [recentReports, setRecentReports] = useState([]);

  useEffect(() => {
    loadRecentReports();
  }, []);

  async function loadRecentReports() {
    try {
      const data = await getReports(8);
      setRecentReports(data);
    } catch (e) {
      // ignore
    }
  }

  function handleReset() {
    setTargetType('phone');
    setTargetValue('');
    setCategory('Digital Arrest');
    setFraudType('Police / CBI Impersonation');
    setDescription('');
    setEvidence('');
    setReporterContact('Anonymous');
    setError(null);
    setSuccess(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!targetValue.trim() || !description.trim()) {
      setError('Target value and incident description are required.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await submitReport({
        target_type: targetType,
        target_value: targetValue.trim(),
        category,
        fraud_type: fraudType,
        description: description.trim(),
        evidence: evidence.trim(),
        reporter_contact: reporterContact.trim() || 'Anonymous'
      });

      setSuccess(true);
      setTargetValue('');
      setDescription('');
      setEvidence('');
      loadRecentReports();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || 'Failed to submit report.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="title-section" style={{ fontSize: '1.85rem', marginBottom: '0.35rem' }}>
          Report a Cyber Fraud or Scam Contact
        </h1>
        <p className="subtitle">
          Help protect thousands of citizens. Your reported scam numbers and messages instantly update the SpamShield AI intelligence engine.
        </p>
      </div>

      <div className="grid-2">
        {/* Left Column: Form */}
        <div className="cyber-card cyber-card-glow">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Flag size={20} color="#06b6d4" />
            <h2 className="title-section" style={{ fontSize: '1.2rem' }}>File New Incident Report</h2>
          </div>

          {success && (
            <div style={{ padding: '0.85rem 1rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#34d399', fontSize: '0.875rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} />
              <span>Report filed successfully! Threat intelligence updated.</span>
            </div>
          )}

          {error && (
            <div style={{ padding: '0.85rem 1rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#f87171', fontSize: '0.875rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid-2" style={{ marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Target Type:
                </label>
                <select
                  className="input-field"
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value)}
                >
                  <option value="phone">Phone Number</option>
                  <option value="email">Email Address</option>
                  <option value="sms">SMS Sender ID</option>
                  <option value="url">Phishing URL / Website</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Target Contact / Number:
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. +919876543210 or scam@bank.xyz"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid-2" style={{ marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Scam Category:
                </label>
                <select
                  className="input-field"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Digital Arrest">Digital Arrest / Police Impersonation</option>
                  <option value="Banking Fraud">Banking & KYC Phishing</option>
                  <option value="Utility Fraud">Electricity Bill Disconnection</option>
                  <option value="Job Fraud">Telegram / YouTube Task Scam</option>
                  <option value="Courier Scam">FedEx / Customs Narcotics Seizure</option>
                  <option value="Loan App Extortion">Illegal Instant Loan Blackmail</option>
                  <option value="UPI Fraud">QR Code Reverse Payment Scam</option>
                  <option value="Blackmail / Extortion">Video Call Sextortion</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Fraud Subtype:
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Fake CBI Summons / Power Cut"
                  value={fraudType}
                  onChange={(e) => setFraudType(e.target.value)}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Incident Description & Caller Script:
              </label>
              <textarea
                className="textarea-field"
                placeholder="What did the scammer say or demand? Mention amounts, threats, or claims made..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Evidence Text / Message Copy (Optional):
              </label>
              <textarea
                className="textarea-field"
                placeholder="Paste verbatim SMS text, WhatsApp messages, or links provided by scammer..."
                rows={2}
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Reporter Alias / Contact (Optional):
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Anonymous or your email"
                value={reporterContact}
                onChange={(e) => setReporterContact(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-outline"
                onClick={handleReset}
                disabled={loading}
                style={{ padding: '0.85rem 1.25rem' }}
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>

              <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading}>
                <Send size={18} />
                <span>{loading ? 'Submitting Report...' : 'Submit Scam Report to Registry'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Recent Community Reports Feed */}
        <div>
          <div className="cyber-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <History size={18} color="#f59e0b" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Community Scam Submissions</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recentReports.length > 0 ? (
                recentReports.map((r) => (
                  <div key={r.id} style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid #1e293b'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#f8fafc', fontSize: '0.9rem' }}>
                        {r.target_value}
                      </span>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: '#f87171',
                        background: 'rgba(239, 68, 68, 0.1)',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        border: '1px solid rgba(239, 68, 68, 0.25)'
                      }}>
                        {r.category}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.25rem' }}>
                      <strong>{r.fraud_type}:</strong> {r.description}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
                      <span>Reported by: {r.reporter_contact}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={11} /> {r.created_at}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No recent user reports yet. Be the first to report!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
