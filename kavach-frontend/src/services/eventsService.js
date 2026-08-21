import { fetchJSON } from '../utils/api';

export async function getEvents(filters = {}) {
  const params = new URLSearchParams();
  if (filters.type && filters.type !== 'All') params.set('type', filters.type);
  if (filters.district) params.set('district', filters.district);
  if (filters.status) params.set('status', filters.status);
  const qs = params.toString();
  return fetchJSON(`/events${qs ? `?${qs}` : ''}`);
}

export async function getEventById(id) {
  try {
    return await fetchJSON(`/events/${id}`);
  } catch {
    return null;
  }
}

export async function registerForEvent(id) {
  return fetchJSON(`/events/${id}/register`, { method: 'POST' });
}

export async function publishEvent(data) {
  return fetchJSON('/events', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getUpcomingDrills() {
  return fetchJSON('/events/drills/upcoming');
}

export async function getEventStats() {
  return fetchJSON('/events/stats');
}
