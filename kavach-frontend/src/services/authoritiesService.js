import { fetchJSON } from '../utils/api';

export async function getAuthorities(filters = {}) {
  const params = new URLSearchParams();
  if (filters.district) params.set('district', filters.district);
  if (filters.search) params.set('search', filters.search);
  const qs = params.toString();
  return fetchJSON(`/authorities${qs ? `?${qs}` : ''}`);
}

export async function getAuthorityById(id) {
  try {
    return await fetchJSON(`/authorities/${id}`);
  } catch {
    return null;
  }
}
