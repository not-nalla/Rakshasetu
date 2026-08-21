import { fetchJSON } from '../utils/api';

export async function adminTriggerAlert(data) {
  return fetchJSON('/admin/alerts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function adminPublishEvent(data) {
  return fetchJSON('/admin/events', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function adminGetAllAlerts() {
  return fetchJSON('/admin/alerts');
}

export async function adminGetAllEvents() {
  return fetchJSON('/admin/events');
}

export async function adminGetPendingApprovals() {
  return fetchJSON('/admin/pending-approvals');
}
