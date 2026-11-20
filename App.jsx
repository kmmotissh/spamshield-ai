import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import PhoneScanner from './pages/PhoneScanner';
import EmailScanner from './pages/EmailScanner';
import ScreenshotScanner from './pages/ScreenshotScanner';
import DatabaseExplorer from './pages/DatabaseExplorer';
import ReportScam from './pages/ReportScam';
import HelplineGuide from './pages/HelplineGuide';
import { ShieldCheck, PhoneCall, ExternalLink, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPhone, setSelectedPhone] = useState('');

  function handleNavigateToPhone(phone) {
    setSelectedPhone(phone);
    setActiveTab('phone');
  }

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'phone' && <PhoneScanner initialPhone={selectedPhone} />}
        {activeTab === 'email' && <EmailScanner onNavigateToPhone={handleNavigateToPhone} />}
        {activeTab === 'screenshot' && <ScreenshotScanner onNavigateToPhone={handleNavigateToPhone} />}
        {activeTab === 'database' && <DatabaseExplorer onSelectPhone={handleNavigateToPhone} />}
        {activeTab === 'report' && <ReportScam />}
        {activeTab === 'helpline' && <HelplineGuide />}
      </main>

      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(7, 11, 20, 0.9)',
        padding: '2rem 1.5rem',
        marginTop: 'auto',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #06b6d4, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <ShieldCheck size={16} />
            </div>
            <div>
              <span style={{ fontWeight: 700, color: '#f8fafc' }}>SpamShield AI</span> &bull; Indian Cyber Scam & Phishing Defense Engine
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f87171', fontWeight: 600 }}>
              <PhoneCall size={14} /> Emergency Helpline: 1930
            </span>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              cybercrime.gov.in <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
