const API_BASE = '/api';

export const api = {
  // Temples
  async getTemples(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const res = await fetch(`${API_BASE}/temples?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch temples');
    return res.json();
  },

  async getTempleById(id) {
    const res = await fetch(`${API_BASE}/temples/${id}`);
    if (!res.ok) throw new Error('Failed to fetch temple details');
    return res.json();
  },

  async createTemple(templeData, token) {
    const res = await fetch(`${API_BASE}/temples`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(templeData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create temple');
    return data;
  },

  async updateTemple(id, templeData, token) {
    const res = await fetch(`${API_BASE}/temples/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(templeData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update temple');
    return data;
  },

  async deleteTemple(id, token) {
    const res = await fetch(`${API_BASE}/temples/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete temple');
    return data;
  },

  // Circuits
  async getCircuits() {
    const res = await fetch(`${API_BASE}/circuits`);
    if (!res.ok) throw new Error('Failed to fetch circuits');
    return res.json();
  },

  async getCircuitById(id) {
    const res = await fetch(`${API_BASE}/circuits/${id}`);
    if (!res.ok) throw new Error('Failed to fetch circuit details');
    return res.json();
  },

  // Region / Filter Metadata
  async getRegionsMetadata() {
    const res = await fetch(`${API_BASE}/regions/metadata`);
    if (!res.ok) throw new Error('Failed to fetch metadata');
    return res.json();
  },

  // Stats & Real Telemetry
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  async sendTelemetryPing(pingData) {
    try {
      await fetch(`${API_BASE}/stats/ping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pingData)
      });
    } catch (e) {
      // Ignore background telemetry errors
    }
  },

  // Auth
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async getMe(token) {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Session expired');
    return data;
  },

  // Reviews & Pilgrim Tips
  async submitTip(tipData) {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tipData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit tip');
    return data;
  },

  async getAllReviews(token) {
    const res = await fetch(`${API_BASE}/reviews/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch reviews');
    return data;
  },

  async moderateReview(id, status, token) {
    const res = await fetch(`${API_BASE}/reviews/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update review status');
    return data;
  }
};

