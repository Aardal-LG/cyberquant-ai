import { masterMockData } from './mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function fetchTopologyData() {
  try {
    const request = async (path) => {
      const res = await fetch(`${API_BASE_URL}${path}`, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
      return res.json();
    };
    const [assets, threats, topology] = await Promise.all([
      request('/assets'),
      request('/threats/anomalies'),
      request('/topology')
    ]);
    return {
      assets: assets.assets,
      // The current backend has no vulnerability-inventory endpoint; retain the
      // shared contract data for the detail table until that owned API exists.
      vulnerabilities: masterMockData.vulnerabilities,
      network_connections: topology.network_connections,
      anomalies: threats.anomalies,
      critical_attack_paths: topology.critical_attack_paths,
      source: 'live_backend'
    };
  } catch (err) {
    console.warn('Backend server offline. Falling back to master mock_data.json contract.', err.message);
    return {
      ...masterMockData,
      source: 'mock_data'
    };
  }
}

export async function fetchFinancialRisk() {
  try {
    const res = await fetch(`${API_BASE_URL}/risk/financial`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    return masterMockData.risk_metrics;
  }
}

export async function fetchOptimization(budget = 350000) {
  try {
    const res = await fetch(`${API_BASE_URL}/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ budget_usd: budget }),
      signal: AbortSignal.timeout(3000)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.summary;
  } catch (err) {
    console.warn('Optimization API unavailable; displaying the last bundled result.', err.message);
    return masterMockData.optimization_results;
  }
}

export async function fetchCompliance() {
  const res = await fetch(`${API_BASE_URL}/compliance`, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
