const API_BASE = 'http://localhost:5000/api';

export async function fetchZones() {
  const res = await fetch(`${API_BASE}/zones`);
  return res.json();
}

export async function runSimulation(zoneId, params) {
  const res = await fetch(`${API_BASE}/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ zoneId, ...params }),
  });
  return res.json();
}

export async function predictFlood(zoneId, params) {
  const res = await fetch(`${API_BASE}/predict-flood`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ zoneId, ...params }),
  });
  return res.json();
}

export async function optimizeEnergy(zoneId, params) {
  const res = await fetch(`${API_BASE}/optimize-energy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ zoneId, ...params }),
  });
  return res.json();
}

export async function getIrrigationPlan(zoneId, params) {
  const res = await fetch(`${API_BASE}/irrigation-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ zoneId, ...params }),
  });
  return res.json();
}

export async function fetchAnalytics(params) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/analytics?${query}`);
  return res.json();
}
