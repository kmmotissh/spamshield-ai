import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  PhoneCall, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert, 
  MapPin, 
  Building2,
  RefreshCw
} from 'lucide-react';
import { getDatabase } from '../services/api';
import RiskBadge from '../components/RiskBadge';

export default function DatabaseExplorer({ onSelectPhone }) {
  const [data, setData] = useState({ total: 0, page: 1, page_size: 10, items: [] });
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [riskLevel, setRiskLevel] = useState('All');
  const [state, setState] = useState('All');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    'All',
    'Digital Arrest',
    'Banking Fraud',
    'Utility Fraud',
    'Job Fraud',
    'Courier Scam',
    'Loan App Extortion',
    'Lottery Scam',
    'UPI Fraud',
    'Challan Phishing',
    'Blackmail / Extortion',
    'Investment Scam'
  ];

  const riskLevels = ['All', 'CRITICAL', 'HIGH', 'MEDIUM'];

  const states = [
    'All',
    'Delhi',
    'Maharashtra',
    'Karnataka',
    'West Bengal',
    'Tamil Nadu',
    'Uttar Pradesh',
    'Gujarat',
    'Telangana',
    'Bihar',
    'Rajasthan'
  ];

  useEffect(() => {
    fetchData();
  }, [page, category, riskLevel, state]);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      const res = await getDatabase({
        query: query.trim() || undefined,
        category,
        risk_level: riskLevel,
        state,
        page,
        page_size: 10
      });
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to query database');
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    setPage(1);
    fetchData();
  }

  function handleReset() {
    setQuery('');
    setCategory('All');
    setRiskLevel('All');
    setState('All');
    setPage(1);
  }

  const totalPages = Math.ceil(data.total / data.page_size) || 1;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="title-section" style={{ fontSize: '1.85rem', marginBottom: '0.35rem' }}>
          Indian Scam Number Registry Explorer
        </h1>
        <p className="subtitle">
          Explore and cross-reference verified cybercrime numbers, digital arrest impersonators, and phishing phone numbers.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="cyber-card" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearchSubmit}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <div style={{ position: 'relative', flex: 2, minWidth: '240px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Search phone number, caller ID, description, or fraud type..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            <button type="submit" className="btn-primary">
              <Search size={16} />
              <span>Search Registry</span>
            </button>

            <button type="button" className="btn-outline" onClick={handleReset}>
              <RefreshCw size={16} />
              <span>Reset</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={15} color="#06b6d4" />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Category:</span>
              <select
                className="input-field"
                style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Risk:</span>
              <select
                className="input-field"
                style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                value={riskLevel}
                onChange={(e) => { setRiskLevel(e.target.value); setPage(1); }}
              >
                {riskLevels.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Circle / State:</span>
              <select
                className="input-field"
                style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                value={state}
                onChange={(e) => { setState(e.target.value); setPage(1); }}
              >
                {states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              Showing {data.items.length} of {data.total} records
            </div>
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="cyber-card" style={{ padding: 0, overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <th style={{ padding: '0.9rem 1.25rem' }}>Phone Number</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>Caller / Tag</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>Category & Fraud Type</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>Threat Level</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>Victim Reports</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>Location / Operator</th>
                <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Loading database records...
                  </td>
                </tr>
              ) : data.items.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No matching scam numbers found for your criteria.
                  </td>
                </tr>
              ) : (
                data.items.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid #1e293b',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '1rem 1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#f8fafc' }}>
                      {item.phone_number}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{item.caller_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.description}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 600, color: '#38bdf8' }}>{item.category}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{item.fraud_type}</div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <RiskBadge level={item.risk_level} />
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: item.reports_count > 300 ? '#ef4444' : '#fbbf24' }}>
                      {item.reports_count}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                        <MapPin size={12} color="#06b6d4" /> {item.location_state}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        <Building2 size={12} /> {item.carrier}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <button
                        onClick={() => onSelectPhone && onSelectPhone(item.phone_number)}
                        style={{
                          background: 'rgba(2, 132, 199, 0.15)',
                          border: '1px solid rgba(2, 132, 199, 0.35)',
                          borderRadius: '6px',
                          color: '#38bdf8',
                          padding: '0.4rem 0.75rem',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        <PhoneCall size={12} /> Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div style={{
          padding: '0.85rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.8)',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.85rem'
        }}>
          <span style={{ color: 'var(--text-muted)' }}>
            Page {data.page} of {totalPages}
          </span>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn-outline"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              className="btn-outline"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
