import React from 'react';
import { 
  PhoneCall, 
  ShieldAlert, 
  AlertOctagon, 
  Clock, 
  ExternalLink, 
  FileCheck, 
  Lock, 
  Building2,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function HelplineGuide() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="title-section" style={{ fontSize: '1.85rem', marginBottom: '0.35rem' }}>
          National Cyber Helpline 1930 & Emergency Response Protocol
        </h1>
        <p className="subtitle">
          Critical instructions, official helpline contacts, and step-by-step procedures to recover funds and freeze fraudulent bank accounts.
        </p>
      </div>

      {/* Emergency Helpline Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(185, 28, 28, 0.05) 100%)',
        border: '1px solid rgba(239, 68, 68, 0.4)',
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.65rem', borderRadius: '9999px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#fca5a5', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            <AlertOctagon size={13} /> Golden Hour Incident Protocol
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
            Victim of a Financial Cyber Scam? Dial <span style={{ color: '#ef4444' }}>1930</span> Immediately
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 }}>
            The <strong>National Cyber Crime Helpline (1930)</strong> operates 24/7 across all Indian States and Union Territories. 
            Reporting within the <strong>Golden Hour (first 1 to 2 hours)</strong> triggers immediate NPCI and banking inter-bank freeze mechanisms to stop the scammer from withdrawing your funds.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <a
            href="tel:1930"
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)', fontSize: '1.1rem', padding: '1rem 2rem' }}
          >
            <PhoneCall size={20} />
            <span>Call 1930 Helpline</span>
          </a>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noreferrer"
            className="btn-outline"
            style={{ textAlign: 'center', justifyContent: 'center' }}
          >
            <span>Visit cybercrime.gov.in</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Step by step action plan */}
      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', color: '#f8fafc' }}>
        Immediate 4-Step Incident Action Plan
      </h3>

      <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
        <div className="cyber-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ef4444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>1</div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Call 1930 within the Golden Hour</h4>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Provide transaction details (UTR / Transaction ID, sender bank, recipient UPI ID / Account Number, exact amount, and time of transfer). 
            The Citizen Financial Cyber Fraud Reporting System alerts nodal officers at both sender and receiver banks to block debit cards and freeze target accounts.
          </p>
        </div>

        <div className="cyber-card" style={{ borderLeft: '4px solid #f97316' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f97316', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>2</div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Block Cards, UPI & Change NetBanking Passwords</h4>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Immediately contact your bank’s 24x7 phone banking desk. Request emergency blocking of ATM cards, disable UPI access, and change your NetBanking login & transaction passwords from a clean, secure device.
          </p>
        </div>

        <div className="cyber-card" style={{ borderLeft: '4px solid #06b6d4' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#06b6d4', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>3</div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>File Formal Complaint on cybercrime.gov.in</h4>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Log in to the official National Cyber Crime Reporting Portal. Upload screenshots of WhatsApp conversations, call logs, SMS transcripts, and bank account statement highlighting the fraudulent debits. Note your Acknowledgement Number.
          </p>
        </div>

        <div className="cyber-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>4</div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Report to Local Cyber Police Station</h4>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Take printouts of your cybercrime acknowledgment slip, bank statements, and relevant evidence to the designated Cyber Police Station in your city or jurisdiction to register an FIR under Section 66D of the IT Act.
          </p>
        </div>
      </div>

      {/* Digital Arrest Reality Check */}
      <div className="cyber-card cyber-card-glow" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={20} color="#ef4444" /> "Digital Arrest" Fact Check — Supreme Court & Police Facts
        </h3>

        <div className="grid-2">
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
            <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <XCircle size={16} /> Fake Claims Made by Scammers:
            </div>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <li>Claiming you are under "Digital Arrest" and cannot turn off video call.</li>
              <li>Fake CBI / ED officers wearing fake uniforms sitting in artificial rooms.</li>
              <li>Demanding you transfer funds to "Supreme Court verification" accounts.</li>
              <li>Fake courier notices (FedEx / DHL) claiming drugs sent to Taiwan under your name.</li>
            </ul>
          </div>

          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <div style={{ color: '#34d399', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} /> Official Legal Reality in India:
            </div>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <li><strong>There is NO provision of "Digital Arrest"</strong> in the Indian Penal Code (IPC / BNS) or Code of Criminal Procedure (CrPC).</li>
              <li>Indian Law Enforcement NEVER interrogates citizens via WhatsApp or Skype video calls.</li>
              <li>No police or judicial body ever asks citizens to transfer money for "clearance".</li>
              <li>Disconnect video call immediately and report to 1930.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
