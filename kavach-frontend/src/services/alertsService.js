import { fetchJSON } from '../utils/api';

export async function getActiveAlert() {
  return fetchJSON('/alerts/active');
}

export async function getAllAlerts() {
  return fetchJSON('/alerts');
}

export async function triggerAlert(data) {
  return fetchJSON('/alerts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function dismissAlert(id) {
  return fetchJSON(`/alerts/${id}/dismiss`, { method: 'PUT' });
}

export async function getShelters() {
  return fetchJSON('/shelters');
}

export async function getNearestShelter() {
  return fetchJSON('/shelters/nearest');
}
