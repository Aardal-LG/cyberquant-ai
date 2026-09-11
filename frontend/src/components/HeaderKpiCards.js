'use client';

import React from 'react';
import { Server, AlertTriangle, Activity, GitCommit, Database, CheckCircle2, RefreshCw } from 'lucide-react';

export default function HeaderKpiCards({ assets = [], anomalies = [], attackPaths = [], dataSource = 'mock_data', onRefresh, isRefreshing }) {
  const totalAssets = assets.length;
  
  // Calculate vulnerable assets (assets having associated CVEs or patch level critical/outdated)
  const highRiskAssets = assets.filter(a => 
    a.associated_vulnerabilities?.length > 0 || 
    a.criticality === 'CRITICAL' ||
    a.security_posture?.patch_level === 'critical_missing'
  ).length;

  const totalAnomalies = anomalies.length;
  const totalPaths = attackPaths.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {/* Total Assets Card */}
      <div className="glass-panel glass-panel-hover p-4 rounded-xl flex items-center justify-between border-l-4 border-l-sky-500">
        <div>
          <p className="text-xs uppercase font-semibold text-gray-400 tracking-wider">Total Topology Assets</p>
          <h3 className="text-2xl font-bold text-white mt-1">{totalAssets}</h3>
          <p className="text-xs text-sky-400 mt-1 flex items-center gap-1">
            <Server className="w-3 h-3" /> Graph Nodes Active
          </p>
        </div>
        <div className="p-3 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
          <Server className="w-6 h-6" />
        </div>
      </div>

      {/* High Risk / Vulnerable Card */}
      <div className="glass-panel glass-panel-hover p-4 rounded-xl flex items-center justify-between border-l-4 border-l-red-500">
        <div>
          <p className="text-xs uppercase font-semibold text-gray-400 tracking-wider">Vulnerable / High Risk</p>
          <h3 className="text-2xl font-bold text-red-400 mt-1">{highRiskAssets}</h3>
          <p className="text-xs text-red-400/80 mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> P(Exploit) &gt; 0.70
          </p>
        </div>
        <div className="p-3 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
          <AlertTriangle className="w-6 h-6" />
        </div>
      </div>

      {/* DBSCAN Anomalies Card */}
      <div className="glass-panel glass-panel-hover p-4 rounded-xl flex items-center justify-between border-l-4 border-l-amber-500">
        <div>
          <p className="text-xs uppercase font-semibold text-gray-400 tracking-wider">DBSCAN Anomalies</p>
          <h3 className="text-2xl font-bold text-amber-400 mt-1">{totalAnomalies}</h3>
          <p className="text-xs text-amber-400/80 mt-1 flex items-center gap-1">
            <Activity className="w-3 h-3" /> Unmapped Behavior
          </p>
        </div>
        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
          <Activity className="w-6 h-6" />
        </div>
      </div>

      {/* Critical Attack Paths Card */}
      <div className="glass-panel glass-panel-hover p-4 rounded-xl flex items-center justify-between border-l-4 border-l-purple-500">
        <div>
          <p className="text-xs uppercase font-semibold text-gray-400 tracking-wider">Critical Attack Paths</p>
          <h3 className="text-2xl font-bold text-purple-400 mt-1">{totalPaths}</h3>
          <p className="text-xs text-purple-400/80 mt-1 flex items-center gap-1">
            <GitCommit className="w-3 h-3" /> Multi-hop Vectors
          </p>
        </div>
        <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20">
          <GitCommit className="w-6 h-6" />
        </div>
      </div>

      {/* System Gateway Status Card */}
      <div className="glass-panel glass-panel-hover p-4 rounded-xl flex items-center justify-between border-l-4 border-l-emerald-500">
        <div className="overflow-hidden">
          <p className="text-xs uppercase font-semibold text-gray-400 tracking-wider">Backend Gateway</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-semibold text-emerald-400 truncate">
              {dataSource === 'live_backend' ? 'FastAPI Live' : 'Mock Contract 1.0'}
            </span>
          </div>
          <button 
            onClick={onRefresh} 
            disabled={isRefreshing}
            className="mt-1 text-xs text-gray-400 hover:text-sky-400 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Telemetry</span>
          </button>
        </div>
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
