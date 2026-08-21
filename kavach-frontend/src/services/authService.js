import { fetchJSON, getGoogleLoginUrl, setToken, clearToken } from '../utils/api';

export function getGoogleAuthUrl() {
  return getGoogleLoginUrl();
}

export async function handleAuthCallback(token, profileComplete) {
  setToken(token);
  sessionStorage.setItem('kavach_token', token);
  if (!profileComplete) {
    return { profileComplete: false };
  }
  const user = await fetchJSON('/auth/me');
  return { user, profileComplete: true };
}

export async function signup(name, email, password, role, district, language) {
  const data = await fetchJSON('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role, district, language }),
  });
  setToken(data.access_token);
  sessionStorage.setItem('kavach_token', data.access_token);
  return data.user;
}

export async function loginEmail(email, password) {
  const data = await fetchJSON('/auth/login-email', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.access_token);
  sessionStorage.setItem('kavach_token', data.access_token);
  return data.user;
}

export async function completeProfile(role, district, language) {
  const data = await fetchJSON('/auth/complete-profile', {
    method: 'POST',
    body: JSON.stringify({ role, district, language }),
  });
  setToken(data.access_token);
  sessionStorage.setItem('kavach_token', data.access_token);
  return data.user;
}

export async function getMe() {
  return fetchJSON('/auth/me');
}

export async function logoutUser() {
  try {
    await fetchJSON('/auth/logout', { method: 'POST' });
  } catch {
    // ignore
  }
  clearToken();
  sessionStorage.removeItem('kavach_token');
}
