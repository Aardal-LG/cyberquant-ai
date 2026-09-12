'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingDown, Percent, ShieldCheck, Sliders, Award, Layers, AlertOctagon, CheckCircle2, ArrowRight } from 'lucide-react';
import { fetchFinancialRisk, fetchOptimization } from '../lib/api';
import { masterMockData } from '../lib/mockData';

export default function ExecutiveDashboard() {
  const [budget, setBudget] = useState(350000);
  const [optimization, setOptimization] = useState(masterMockData.optimization_results);
  const [financialRisk, setFinancialRisk] = useState(masterMockData.risk_metrics);
  const [isCalculating, setIsCalculating] = useState(false);

  // Re-run OR-Tools optimization whenever budget slider changes
  useEffect(() => {
    let isMounted = true;
    setIsCalculating(true);
    fetchOptimization(budget).then(res => {
      if (isMounted) {
        setOptimization(res);
        setIsCalculating(false);
      }
    });
    return () => { isMounted = false; };
  }, [budget]);

  useEffect(() => {
    fetchFinancialRisk().then((result) => setFinancialRisk(result.metrics || result));
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const selectedControls = (optimization.selected_controls || masterMockData.controls.filter(c => 
    optimization.selected_control_ids?.includes(c.id)
  ));

  return (
    <div className="space-y-6">
      {/* Top Executive KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Baseline EAL */}
        <div className="glass-panel glass-panel-hover p-4 rounded-xl border-l-4 border-l-red-500">
          <p className="text-xs uppercase font-semibold text-gray-400 tracking-wider">Baseline Expected Annual Loss (EAL)</p>
          <h3 className="text-2xl font-extrabold text-white mt-1">
            {formatCurrency(optimization.pre_control_eal_usd || 1250000)}
          </h3>
          <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
            <AlertOctagon className="w-3.5 h-3.5" /> Monte Carlo Mean Loss
          </p>
        </div>

        {/* Post-Control EAL */}
        <div className="glass-panel glass-panel-hover p-4 rounded-xl border-l-4 border-l-emerald-500">
          <p className="text-xs uppercase font-semibold text-gray-400 tracking-wider">Optimized Post-Control EAL</p>
          <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">
            {formatCurrency(optimization.post_control_eal_usd || 397250)}
          </h3>
          <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" /> {formatCurrency(optimization.net_risk_reduction_usd || 852750)} Risk Reduced
          </p>
        </div>

        {/* 95% Value at Risk (VaR) */}
        <div className="glass-panel glass-panel-hover p-4 rounded-xl border-l-4 border-l-amber-500">
          <p className="text-xs uppercase font-semibold text-gray-400 tracking-wider">95% Value at Risk (VaR)</p>
          <h3 className="text-2xl font-extrabold text-amber-300 mt-1">
            {formatCurrency(optimization.post_control_var_95_usd || 714000)}
          </h3>
          <p className="text-xs text-gray-400 mt-1">Baseline 95% VaR: {formatCurrency(financialRisk.value_at_risk_95_usd)}</p>
        </div>

        {/* ROSI % */}
        <div className="glass-panel glass-panel-hover p-4 rounded-xl border-l-4 border-l-sky-500">
          <p className="text-xs uppercase font-semibold text-gray-400 tracking-wider">Return on Security Investment (ROSI)</p>
          <h3 className="text-2xl font-extrabold text-sky-400 mt-1">
            {optimization.return_on_security_investment_percent}%
          </h3>
          <p className="text-xs text-sky-400/80 mt-1 flex items-center gap-1">
            <Percent className="w-3.5 h-3.5" /> Gordon-Loeb Net ROI
          </p>
        </div>
      </div>

      {/* Interactive Budget Slider & Investment Optimizer Panel */}
      <div className="glass-panel p-6 rounded-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/20 text-sky-400 rounded-xl border border-sky-500/30">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Cyber Security Budget Optimizer
                <span className="px-2.5 py-0.5 text-xs bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full font-mono">
                  Google OR-Tools MILP
                </span>
              </h2>
              <p className="text-xs text-gray-400">Adjust total cybersecurity budget cap to calculate optimal control portfolios and ROSI</p>
            </div>
          </div>

          <div className="bg-gray-900/90 px-4 py-2 rounded-xl border border-gray-800 flex items-center gap-3">
            <span className="text-xs text-gray-400">Allocated Budget Cap:</span>
            <span className="text-lg font-extrabold text-sky-400 font-mono">{formatCurrency(budget)}</span>
          </div>
        </div>

        {/* Interactive Slider Input */}
        <div className="space-y-3 bg-gray-900/60 p-4 rounded-xl border border-gray-800">
          <div className="flex justify-between items-center text-xs font-semibold text-gray-300">
            <span>Minimum ($50,000)</span>
            <span className="text-sky-400 font-bold text-sm">{formatCurrency(budget)}</span>
            <span>Maximum ($600,000)</span>
          </div>
          <input
            type="range"
            min={50000}
            max={600000}
            step={10000}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full h-2.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
          <div className="flex justify-between items-center text-[11px] text-gray-500">
            <span>Low Protection Tier</span>
            <span>Balanced Optimization Range</span>
            <span>Max Security Coverage</span>
          </div>
        </div>

        {/* Selected Optimal Security Controls Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs uppercase font-semibold text-gray-400 tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Optimal Selected Controls ({selectedControls.length} Selected)
            </h3>
            <span className="text-xs text-gray-400 font-mono">
              Total Spend: <strong className="text-emerald-400">{formatCurrency(optimization.total_investment_cost_usd)}</strong> / {formatCurrency(budget)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {selectedControls.map((ctrl) => (
              <div key={ctrl.id} className="p-3 bg-gray-900/80 rounded-xl border border-emerald-500/30 text-xs hover:border-emerald-500 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-emerald-400">{ctrl.id}</span>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded font-mono font-bold">
                    -{ (ctrl.risk_reduction_factor * 100).toFixed(0) }% Risk
                  </span>
                </div>
                <h4 className="font-bold text-white line-clamp-1 mt-1">{ctrl.name}</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">{ctrl.category}</p>
                <div className="mt-2 pt-2 border-t border-gray-800 flex justify-between items-center text-[11px]">
                  <span className="text-gray-400">Implementation Cost:</span>
                  <span className="font-mono text-white font-bold">{formatCurrency(ctrl.cost_usd)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
