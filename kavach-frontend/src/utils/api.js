const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

let token = null;

export function setToken(newToken) {
  token = newToken;
}

export function getToken() {
  return token;
}

export function clearToken() {
  token = null;
}

export async function fetchJSON(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearToken();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (response.status === 403) {
    if (window.location.pathname !== '/complete-profile') {
      window.location.href = '/complete-profile';
    }
    throw new Error('Profile not completed');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || 'Request failed');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getGoogleLoginUrl() {
  return `${API_BASE}/auth/google/login`;
}
