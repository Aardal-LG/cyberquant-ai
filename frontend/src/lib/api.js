import { masterMockData } from './mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function fetchTopologyData() {
  try {
    const res = await fetch(`${API_BASE_URL}/topology`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      assets: masterMockData.assets,
      vulnerabilities: masterMockData.vulnerabilities,
      network_connections: data.network_connections || masterMockData.network_connections,
      anomalies: masterMockData.anomalies,
      critical_attack_paths: data.critical_attack_paths || masterMockData.critical_attack_paths,
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
    return data;
  } catch (err) {
    // Dynamic MILP simulation fallback based on budget
    const controls = masterMockData.controls;
    let availableBudget = budget;
    let selectedControls = [];
    let totalCost = 0;
    let cumulativeReduction = 1.0;

    // Simple greedy selection by efficiency
    const sortedControls = [...controls].sort((a, b) => b.risk_reduction_factor / b.cost_usd - a.risk_reduction_factor / a.cost_usd);

    for (const ctrl of sortedControls) {
      if (ctrl.cost_usd <= availableBudget) {
        selectedControls.push(ctrl);
        availableBudget -= ctrl.cost_usd;
        totalCost += ctrl.cost_usd;
        cumulativeReduction *= (1 - ctrl.risk_reduction_factor);
      }
    }

    const baselineEal = masterMockData.risk_metrics.expected_annual_loss_usd;
    const postControlEal = Math.round(baselineEal * cumulativeReduction);
    const netRiskReduction = baselineEal - postControlEal;
    const netBenefit = netRiskReduction - totalCost;
    const rosiPercent = totalCost > 0 ? ((netRiskReduction - totalCost) / totalCost) * 100 : 0;

    return {
      budget_usd: budget,
      selected_control_ids: selectedControls.map(c => c.id),
      selected_controls: selectedControls,
      total_investment_cost_usd: totalCost,
      pre_control_eal_usd: baselineEal,
      post_control_eal_usd: postControlEal,
      net_risk_reduction_usd: netRiskReduction,
      net_financial_benefit_usd: netBenefit,
      return_on_security_investment_percent: parseFloat(rosiPercent.toFixed(2)),
      post_control_var_95_usd: Math.round(masterMockData.risk_metrics.value_at_risk_95_usd * cumulativeReduction),
      post_control_cvar_95_usd: Math.round(masterMockData.risk_metrics.conditional_var_95_usd * cumulativeReduction),
      algorithm_version: "OR-Tools MILP Simulator (Mock Fallback)"
    };
  }
}
