import { fetchJSON } from '../utils/api';

export async function getDisasters(filters = {}) {
  const params = new URLSearchParams();
  if (filters.type && filters.type !== 'All') params.set('type', filters.type);
  if (filters.year && filters.year !== 'All') params.set('year', filters.year);
  const qs = params.toString();
  return fetchJSON(`/disasters${qs ? `?${qs}` : ''}`);
}

export async function getDisasterById(id) {
  try {
    return await fetchJSON(`/disasters/${id}`);
  } catch {
    return null;
  }
}

export async function getDisasterTypes() {
  return fetchJSON('/disasters/types');
}

export async function getDisasterYears() {
  return fetchJSON('/disasters/years');
}
