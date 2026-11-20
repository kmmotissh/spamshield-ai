import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  PhoneCall, 
  MailWarning, 
  FileSearch, 
  AlertTriangle, 
  Activity, 
  Database,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { getStats } from '../services/api';
import RiskBadge from '../components/RiskBadge';

export default function Dashboard({ setActiveTab }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setLoading(true);
      const data = await getStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Hero Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(2, 132, 199, 0.05) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.25)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="live-dot" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#38bdf8' }}>
              Active Threat Monitoring Engine
            </span>
          </div>
          <h1 className="title-hero" style={{ marginBottom: '0.5rem' }}>
            Protect Yourself from Modern Indian Cyber Frauds
          </h1>
          <p className="subtitle">
            Instant AI-driven detection for "Digital Arrest" impersonation, Electricity bill cutoff SMS, 
            fake SBI/HDFC KYC phishing, and Telegram task scams.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => setActiveTab('phone')}>
            <PhoneCall size={18} />
            <span>Scan Phone Number</span>
          </button>
          <button className="btn-outline" onClick={() => setActiveTab('screenshot')}>
            <FileSearch size={18} />
            <span>Scan Screenshot</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="cyber-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Tracked Scam Numbers</span>
            <Database size={18} color="#06b6d4" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
            {loading ? '...' : (stats?.total_scam_numbers || 40)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <TrendingUp size={12} /> Indian telecom verified registry
          </div>
        </div>

        <div className="cyber-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Critical Threats</span>
            <ShieldAlert size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: '#ef4444', fontFamily: 'var(--font-mono)' }}>
            {loading ? '...' : (stats?.critical_threats || 16)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
            Severe risk / digital arrest scams
          </div>
        </div>

        <div className="cyber-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Scans Performed</span>
            <Activity size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
            {loading ? '...' : (stats?.total_scans_performed || 0)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Live inspections recorded
          </div>
        </div>

        <div className="cyber-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>User Reports Filed</span>
            <CheckCircle2 size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
            {loading ? '...' : (stats?.total_user_reports || 0)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '0.25rem' }}>
            Community crowd-sourced defense
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Recent High Alert Feed */}
        <div className="cyber-card cyber-card-glow">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <AlertTriangle size={20} color="#f97316" />
              <h2 className="title-section">High-Priority Scam Alerts</h2>
            </div>
            <button 
              onClick={() => setActiveTab('database')} 
              style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}
            >
              View Registry <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {stats?.recent_alerts?.length ? (
              stats.recent_alerts.map((alert) => (
                <div key={alert.id} style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid #1e293b',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>
                        {alert.phone_number}
                      </span>
                      <RiskBadge level={alert.risk_level} />
                    </div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      <strong>{alert.caller_name}</strong> &bull; {alert.category}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                      {alert.description}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '90px' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f87171', fontFamily: 'var(--font-mono)' }}>
                      {alert.reports_count}
                    </span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Reports</div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                Loading threat feed...
              </div>
            )}
          </div>
        </div>

        {/* Threat Distribution Breakdown */}
        <div className="cyber-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Activity size={20} color="#06b6d4" />
            <h2 className="title-section">Top Cyber Scam Vectors</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats?.top_fraud_types?.length ? (
              stats.top_fraud_types.map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{item.fraud_type}</span>
                    <span style={{ color: '#06b6d4', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      {item.total_reports} victim reports
                    </span>
                  </div>
                  <div style={{ height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, (item.total_reports / 1000) * 100)}%`,
                      background: idx === 0 ? 'linear-gradient(90deg, #ef4444, #f97316)' : 'linear-gradient(90deg, #0284c7, #06b6d4)',
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                Loading vector data...
              </div>
            )}

            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={15} color="#38bdf8" /> Telecom Circle Activity
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {stats?.state_breakdown?.map((s, idx) => (
                  <span key={idx} style={{
                    fontSize: '0.75rem',
                    background: 'rgba(2, 132, 199, 0.1)',
                    border: '1px solid rgba(2, 132, 199, 0.25)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    color: '#93c5fd'
                  }}>
                    {s.state}: <strong>{s.count}</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid-3">
        <div className="cyber-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('phone')}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(2, 132, 199, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#38bdf8' }}>
            <PhoneCall size={22} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Phone Number Scanner</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Check unknown 10-digit Indian numbers or suspicious international VOIP prefixes against known scam profiles.
          </p>
          <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Inspect Number <ArrowRight size={14} />
          </span>
        </div>

        <div className="cyber-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('email')}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#fbbf24' }}>
            <MailWarning size={22} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Email & SMS Threat Analyzer</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Paste electricity disconnect threats, SBI YONO KYC warnings, or job offers to identify malicious URLs and panic cues.
          </p>
          <span style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Analyze Message <ArrowRight size={14} />
          </span>
        </div>

        <div className="cyber-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('screenshot')}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#34d399' }}>
            <FileSearch size={22} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Screenshot OCR Scanner</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Upload screenshots of WhatsApp chats, SMS inboxes, or payment QR codes for automated text extraction and threat profiling.
          </p>
          <span style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Upload Screenshot <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
}
