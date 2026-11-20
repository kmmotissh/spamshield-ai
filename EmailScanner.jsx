import React, { useState } from 'react';
import { 
  MailWarning, 
  Send, 
  ShieldAlert, 
  AlertTriangle, 
  ExternalLink, 
  Phone, 
  Sparkles,
  AlertCircle,
  Clock,
  CreditCard,
  Building,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { scanEmail } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import RiskMeter from '../components/RiskMeter';

export default function EmailScanner({ onNavigateToPhone }) {
  const [content, setContent] = useState('');
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  function handleReset() {
    setContent('');
    setSender('');
    setSubject('');
    setResult(null);
    setError(null);
  }

  const sampleMessages = [
    {
      label: 'Electricity Bill Cut SMS',
      sender: 'VM-BIJBIL',
      subject: 'URGENT: Power Cut Notice',
      text: 'Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM from the power station because your previous month bill was not updated. Please immediately contact our electricity officer at +919945012384 or update APK bill.'
    },
    {
      label: 'Digital Arrest WhatsApp Notice',
      sender: 'CBI Cyber Crime HQ <cbi-investigation@gmail.com>',
      subject: 'Supreme Court & Mumbai Crime Branch Arrest Warrant',
      text: 'Notice of Digital Arrest: A contraband parcel containing narcotics, 5 fake passports and bank debit cards sent to Taiwan has been seized under your Aadhaar. You are under immediate Digital Arrest. Do not disconnect Skype video call with CBI Officer or legal warrant will be executed.'
    },
    {
      label: 'SBI Yono KYC Phishing',
      sender: 'AX-SBINB',
      subject: 'Account Blocked Notice',
      text: 'Dear Customer, Your SBI YONO Account has been blocked today. Please click http://sbi-kyc-update.xyz to verify your PAN card and update KYC within 24 hours to prevent permanent deactivation. Enter your NetBanking username and OTP.'
    },
    {
      label: 'Part-Time Telegram Job Scam',
      sender: '+917021345678',
      subject: 'Earn Rs 5000 Daily From Home',
      text: 'Dear candidate, We have a part time work from home opportunity. Earn Rs 3000 to 8000 daily by simply liking YouTube videos and rating Google hotels. Join our official Telegram task group at https://bit.ly/tele-task-earn to claim Rs 500 joining bonus.'
    },
    {
      label: 'Safe Business Email',
      sender: 'support@github.com',
      subject: 'Security alert: New sign-in detected',
      text: 'Hi there, We noticed a new sign-in to your GitHub account from Chrome on Windows. If this was you, you can safely ignore this email. If not, please review your account activity.'
    }
  ];

  async function handleAnalyze(e) {
    if (e) e.preventDefault();
    if (!content.trim()) {
      setError('Please paste an email body or SMS message to analyze');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await scanEmail({
        content,
        sender: sender.trim() || undefined,
        subject: subject.trim() || undefined
      });
      setResult(res);
    } catch (err) {
      setError(err.message || 'Error occurred while analyzing text content');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectSample(s) {
    setContent(s.text);
    setSender(s.sender);
    setSubject(s.subject);
    setError(null);
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="title-section" style={{ fontSize: '1.85rem', marginBottom: '0.35rem' }}>
          Email, SMS & WhatsApp Scam Threat Analyzer
        </h1>
        <p className="subtitle">
          Detect phishing domains, psychological urgency triggers, fake police impersonation, and malicious APK links.
        </p>
      </div>

      <div className="cyber-card cyber-card-glow" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleAnalyze}>
          <div className="grid-2" style={{ marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Sender ID / Email Address (Optional):
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. AX-SBINB, cbi-investigation@gmail.com, or +919876543210"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Subject / Title (Optional):
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Urgent KYC Blocked Notice"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Message Content / SMS Body:
            </label>
            <textarea
              className="textarea-field"
              placeholder="Paste suspicious text message, email body, WhatsApp notification or Telegram job pitch here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Sparkles size={12} color="#06b6d4" /> Try Scenario:
              </span>
              {sampleMessages.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(s)}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid #1e293b',
                    color: '#cbd5e1',
                    cursor: 'pointer'
                  }}
                >
                  {s.label}
                </button>
              ))}
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

              <button type="submit" className="btn-primary" disabled={loading}>
                <Send size={18} />
                <span>{loading ? 'Analyzing Content...' : 'Inspect Threat Vectors'}</span>
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {result && (
        <div className="grid-2">
          {/* Left Column: Risk Meter & Threat Breakdown */}
          <div className="cyber-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Classification
                </span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                  {result.fraud_category}
                </div>
              </div>
              <RiskBadge level={result.risk_level} />
            </div>

            <RiskMeter score={result.risk_score} level={result.risk_level} verdict={result.verdict} />

            {/* Sub-scores */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '1.5rem', paddingTop: '1.25rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.85rem' }}>
                Psychological Manipulation Indicators:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1' }}>
                      <Clock size={14} color="#f59e0b" /> Artificial Urgency & Panic
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#f59e0b' }}>
                      {result.urgent_urgency_score}%
                    </span>
                  </div>
                  <div style={{ height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${result.urgent_urgency_score}%`, background: '#f59e0b', borderRadius: '3px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1' }}>
                      <CreditCard size={14} color="#ef4444" /> Financial Credential Demand
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ef4444' }}>
                      {result.financial_request_score}%
                    </span>
                  </div>
                  <div style={{ height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${result.financial_request_score}%`, background: '#ef4444', borderRadius: '3px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1' }}>
                      <Building size={14} color="#06b6d4" /> Authority Impersonation (Govt/Bank)
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#06b6d4' }}>
                      {result.authority_impersonation_score}%
                    </span>
                  </div>
                  <div style={{ height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${result.authority_impersonation_score}%`, background: '#06b6d4', borderRadius: '3px' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Extracted Entities */}
            {(result.extracted_urls.length > 0 || result.extracted_phone_numbers.length > 0) && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '1.5rem', paddingTop: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.6rem' }}>
                  Extracted Links & Contacts:
                </div>

                {result.extracted_urls.map((u, idx) => (
                  <div key={idx} style={{
                    fontSize: '0.8rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    background: u.is_suspicious ? 'rgba(239, 68, 68, 0.1)' : 'rgba(15, 23, 42, 0.6)',
                    border: u.is_suspicious ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #1e293b',
                    color: u.is_suspicious ? '#fca5a5' : '#94a3b8',
                    marginBottom: '0.4rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ wordBreak: 'break-all', fontFamily: 'var(--font-mono)' }}>{u.url}</span>
                    {u.is_suspicious && (
                      <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700, marginLeft: '0.5rem', whiteSpace: 'nowrap' }}>
                        DECEPTIVE DESTINATION
                      </span>
                    )}
                  </div>
                ))}

                {result.extracted_phone_numbers.map((ph, idx) => (
                  <div key={idx} style={{
                    fontSize: '0.8rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    background: 'rgba(2, 132, 199, 0.1)',
                    border: '1px solid rgba(2, 132, 199, 0.3)',
                    color: '#93c5fd',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.4rem'
                  }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{ph}</span>
                    <button
                      type="button"
                      onClick={() => onNavigateToPhone && onNavigateToPhone(ph)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#38bdf8',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem'
                      }}
                    >
                      <Phone size={12} /> Scan Number &rarr;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Threat Indicators & Actions */}
          <div>
            <div className="cyber-card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} color="#f97316" /> Detected Threat Triggers ({result.detected_indicators.length})
              </h3>

              {result.detected_indicators.length > 0 ? (
                <div>
                  {result.detected_indicators.map((ind, idx) => (
                    <div key={idx} className={`factor-card ${ind.impact.toLowerCase()}`}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>
                            {ind.rule}
                          </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: ind.impact === 'Critical' ? '#f87171' : '#fb923c' }}>
                            +{ind.score_change} pts
                          </span>
                        </div>
                        <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                          {ind.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', color: '#34d399', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} />
                  <span>No malicious scam indicators detected in this message.</span>
                </div>
              )}
            </div>

            {/* Emergency Actions */}
            {result.emergency_actions?.length > 0 && (
              <div className="cyber-card" style={{ borderLeft: '4px solid #ef4444', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f87171', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldAlert size={18} /> Emergency Response Actions
                </div>
                <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem' }}>
                  {result.emergency_actions.map((act, idx) => (
                    <li key={idx} style={{ color: '#fca5a5' }}>{act}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* General Advice */}
            <div className="cyber-card">
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem' }}>
                Safe Handling Practices
              </div>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} style={{ color: '#e2e8f0' }}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
