const API_BASE = '/api';

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Backend health check failed');
  return res.json();
}

export async function scanPhone(phoneNumber) {
  const res = await fetch(`${API_BASE}/scan/phone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone_number: phoneNumber })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to scan phone number');
  }
  return res.json();
}

export async function scanEmail({ content, sender, subject }) {
  const res = await fetch(`${API_BASE}/scan/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, sender, subject })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to analyze text content');
  }
  return res.json();
}

export async function scanScreenshot(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/scan/screenshot`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to process screenshot OCR');
  }
  return res.json();
}

export async function getDatabase(params = {}) {
  const query = new URLSearchParams();
  if (params.query) query.set('query', params.query);
  if (params.category && params.category !== 'All') query.set('category', params.category);
  if (params.risk_level && params.risk_level !== 'All') query.set('risk_level', params.risk_level);
  if (params.state && params.state !== 'All') query.set('state', params.state);
  if (params.page) query.set('page', params.page);
  if (params.page_size) query.set('page_size', params.page_size);

  const res = await fetch(`${API_BASE}/database?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch scam database');
  return res.json();
}

export async function submitReport(reportData) {
  const res = await fetch(`${API_BASE}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reportData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to submit scam report');
  }
  return res.json();
}

export async function getReports(limit = 15) {
  const res = await fetch(`${API_BASE}/reports?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch recent reports');
  return res.json();
}

export async function getStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch dashboard statistics');
  return res.json();
}
