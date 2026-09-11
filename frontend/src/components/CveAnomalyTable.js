'use client';

import React, { useState } from 'react';
import { AlertCircle, Activity, Search, ShieldAlert, CheckCircle2, ChevronRight, Download } from 'lucide-react';

export default function CveAnomalyTable({ vulnerabilities = [], anomalies = [], onSelectAssetNode }) {
  const [activeTab, setActiveTab] = useState('cves'); // 'cves' | 'anomalies'
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filteredCves = vulnerabilities.filter(cve => {
    const matchesSearch = 
      cve.cve_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cve.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cve.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || cve.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const filteredAnomalies = anomalies.filter(anm => {
    return (
      anm.anomaly_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anm.asset_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anm.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anm.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="glass-panel rounded-xl p-5 mb-8">
      {/* Table Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Vulnerability & Behavioral Telemetry Engine</h3>
            <p className="text-xs text-gray-400">ML Threat Predictions (GBDT Exploit Probabilities & DBSCAN Behavioral Anomalies)</p>
          </div>
        </div>

        {/* Tabs & Search */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search CVE, anomaly, asset..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-gray-900/90 text-xs text-white placeholder-gray-500 rounded-lg border border-gray-700/60 focus:border-sky-500 focus:outline-none"
            />
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center p-1 bg-gray-900/80 rounded-lg border border-gray-800">
            <button
              onClick={() => setActiveTab('cves')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'cves'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-glow-red'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              CVE Vulnerabilities ({vulnerabilities.length})
            </button>
            <button
              onClick={() => setActiveTab('anomalies')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'anomalies'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-orange'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              DBSCAN Anomalies ({anomalies.length})
            </button>
          </div>
        </div>
      </div>

      {/* CVE Table View */}
      {activeTab === 'cves' && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-gray-900/80 text-gray-400 font-semibold uppercase tracking-wider text-[11px] border-b border-gray-800">
              <tr>
                <th className="py-3 px-4">CVE ID</th>
                <th className="py-3 px-4">Vulnerability Name</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">CVSS Score</th>
                <th className="py-3 px-4">P(Exploit)</th>
                <th className="py-3 px-4">CISA KEV</th>
                <th className="py-3 px-4">Exploit Age</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {filteredCves.map((cve) => (
                <tr 
                  key={cve.cve_id}
                  className="hover:bg-gray-900/50 transition-colors group cursor-pointer"
                >
                  <td className="py-3 px-4 font-mono font-bold text-red-400">{cve.cve_id}</td>
                  <td className="py-3 px-4 font-medium text-white max-w-[280px]">
                    <div>{cve.name}</div>
                    <div className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{cve.description}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 font-bold rounded-md border border-red-500/30 text-[10px]">
                      {cve.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-white">{cve.cvss_score} / 10.0</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-red-500 h-full rounded-full" 
                          style={{ width: `${(cve.exploit_probability * 100)}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-red-400">
                        {(cve.exploit_probability * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {cve.cisa_kev ? (
                      <span className="px-2 py-0.5 bg-purple-950 text-purple-300 font-bold rounded border border-purple-800 text-[10px]">
                        FLAGGED
                      </span>
                    ) : (
                      <span className="text-gray-500 text-[11px]">No</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-400">{cve.exploit_age_days} Days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DBSCAN Anomalies Table View */}
      {activeTab === 'anomalies' && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-gray-900/80 text-gray-400 font-semibold uppercase tracking-wider text-[11px] border-b border-gray-800">
              <tr>
                <th className="py-3 px-4">Anomaly ID</th>
                <th className="py-3 px-4">Target Asset</th>
                <th className="py-3 px-4">Anomaly Type</th>
                <th className="py-3 px-4">DBSCAN Score</th>
                <th className="py-3 px-4">Telemetry Description</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {filteredAnomalies.map((anm) => (
                <tr 
                  key={anm.anomaly_id}
                  className="hover:bg-gray-900/50 transition-colors group"
                >
                  <td className="py-3 px-4 font-mono font-bold text-amber-300">{anm.anomaly_id}</td>
                  <td className="py-3 px-4 font-semibold text-white">
                    <div>{anm.asset_name}</div>
                    <div className="text-[11px] font-mono text-gray-400">{anm.asset_id}</div>
                  </td>
                  <td className="py-3 px-4 text-amber-400 font-medium">{anm.type}</td>
                  <td className="py-3 px-4 font-mono text-amber-300 font-bold">{anm.dbscan_score}</td>
                  <td className="py-3 px-4 text-gray-300 max-w-[340px]">{anm.description}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onSelectAssetNode(anm.asset_id)}
                      className="px-2.5 py-1 text-xs bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 rounded border border-amber-500/40 flex items-center gap-1 transition-colors"
                    >
                      Locate Node <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
