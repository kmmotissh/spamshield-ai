import React from 'react';
import { 
  ShieldCheck, 
  PhoneCall, 
  MailWarning, 
  FileSearch, 
  Database, 
  Flag, 
  PhoneForwarded,
  LayoutDashboard
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'phone', label: 'Phone Scanner', icon: PhoneCall },
    { id: 'email', label: 'Email & SMS', icon: MailWarning },
    { id: 'screenshot', label: 'Screenshot OCR', icon: FileSearch },
    { id: 'database', label: 'Scam Registry', icon: Database },
    { id: 'report', label: 'Report Fraud', icon: Flag }
  ];

  return (
    <header className="nav-header">
      <div className="nav-wrapper">
        <div className="logo-group" onClick={() => setActiveTab('dashboard')}>
          <div className="logo-icon-box">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="logo-text-title">SpamShield AI</div>
            <div className="logo-text-subtitle">Cyber Fraud Intelligence System</div>
          </div>
        </div>

        <nav className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div>
          <button 
            className="helpline-pill"
            onClick={() => setActiveTab('helpline')}
            title="Immediate Cyber Crime Assistance"
          >
            <PhoneForwarded size={14} />
            <span>Emergency 1930</span>
          </button>
        </div>
      </div>
    </header>
  );
}
