const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('safetyai_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export const api = {
  // Auth
  login: async (orgId, email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          org_id: orgId?.trim() || '', 
          email: email?.trim() || '', 
          password: password?.trim() || '' 
        })
      });
      if (res.ok) {
        return await res.json();
      }
      const err = await res.json().catch(() => ({ detail: 'Authentication failed' }));
      throw new Error(err.detail || 'Invalid Organization ID, Email, or Password.');
    } catch (err) {
      // If server returned an application/HTTP error, propagate it
      if (err.message && !err.message.includes('Failed to fetch') && !err.message.includes('NetworkError') && !err.message.includes('network')) {
        throw err;
      }

      // Offline fallback for demo accounts if backend is unreachable
      const DEMO_ACCOUNTS = [
        { orgId: 'id001', email: 'admin1@gmail.com', pass: 'Admin1@123', name: 'Oil India Limited – Operational Safety Unit', officer: 'HSE Lead Officer 01' },
        { orgId: 'id002', email: 'admin2@gmail.com', pass: 'Admin2@123', name: 'Offshore Rig Operations & Drilling Division', officer: 'HSE Lead Officer 02' },
        { orgId: 'id003', email: 'admin3@gmail.com', pass: 'Admin3@123', name: 'Refinery & Petrochemical Processing Center', officer: 'HSE Lead Officer 03' },
        { orgId: 'id004', email: 'admin4@gmail.com', pass: 'Admin4@123', name: 'Exploration & Production Field Command', officer: 'HSE Lead Officer 04' },
        { orgId: 'id005', email: 'admin5@gmail.com', pass: 'Admin5@123', name: 'Cross-Country Gas Transmission & Integrity', officer: 'HSE Lead Officer 05' },
      ];

      const cleanOrg = orgId?.trim().toLowerCase() || '';
      const cleanEmail = email?.trim().toLowerCase() || '';
      const cleanPass = password?.trim() || '';

      const match = DEMO_ACCOUNTS.find(acc => 
        (acc.orgId === cleanOrg || acc.email === cleanEmail) && acc.pass === cleanPass
      );

      if (match) {
        return {
          access_token: 'demo-token-' + Date.now(),
          token_type: 'bearer',
          user: {
            id: 1,
            organization_id: match.orgId,
            email: match.email,
            full_name: match.officer,
            role: 'CHIEF_HSE_AUDITOR',
            organization_name: match.name
          }
        };
      }

      throw new Error('Invalid Organization ID, Email, or Password.');
    }
  },

  getProfile: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  // Reports
  submitReport: async (reportData) => {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reportData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to submit report' }));
      throw new Error(err.detail || 'Failed to submit report');
    }
    return res.json();
  },

  getReports: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.report_type && filters.report_type !== 'ALL') params.append('report_type', filters.report_type);
    if (filters.analysis_status && filters.analysis_status !== 'ALL') params.append('analysis_status', filters.analysis_status);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/reports${queryStr}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
  },

  getReportById: async (reportId) => {
    const res = await fetch(`${API_BASE}/reports/${reportId}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch report details');
    return res.json();
  },

  triggerAnalysis: async (reportId) => {
    const res = await fetch(`${API_BASE}/reports/${reportId}/analyze`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to execute AI analysis');
    return res.json();
  },

  getAnalyses: async () => {
    const res = await fetch(`${API_BASE}/analysis`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch analyses');
    return res.json();
  },

  getSIFIntelligence: async () => {
    const res = await fetch(`${API_BASE}/sif-intelligence`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch SIF intelligence');
    return res.json();
  },

  getSIFPatterns: async () => {
    const res = await fetch(`${API_BASE}/sif-intelligence/patterns`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch SIF patterns and hotspot matrix');
    return res.json();
  },

  // Feedback
  submitFeedback: async (reportId, feedbackStatus, feedbackText) => {
    const res = await fetch(`${API_BASE}/feedback/reports/${reportId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        feedback_status: feedbackStatus,
        feedback_text: feedbackText
      })
    });
    if (!res.ok) throw new Error('Failed to submit feedback');
    return res.json();
  },

  getPendingReviewReports: async () => {
    const res = await fetch(`${API_BASE}/feedback/pending`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch pending reviews');
    return res.json();
  },

  getAllFeedback: async () => {
    const res = await fetch(`${API_BASE}/feedback/all`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch feedback history');
    return res.json();
  },

  // Dynamic Dashboard
  getDashboardData: async () => {
    const res = await fetch(`${API_BASE}/dashboard`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard data');
    return res.json();
  }
};
