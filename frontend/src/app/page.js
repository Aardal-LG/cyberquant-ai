'use client';

import React, { useEffect, useState, useRef } from 'react';
import HeaderKpiCards from '../components/HeaderKpiCards';
import AttackPathSelector from '../components/AttackPathSelector';
import NetworkGraph from '../components/NetworkGraph';
import NodeDetailsDrawer from '../components/NodeDetailsDrawer';
import CveAnomalyTable from '../components/CveAnomalyTable';
import ExecutiveDashboard from '../components/ExecutiveDashboard';
import ComplianceMatrix from '../components/ComplianceMatrix';
import { fetchTopologyData } from '../lib/api';
import { Network, RefreshCw, Terminal, Layers, BarChart3, ShieldCheck, Cpu } from 'lucide-react';

export default function CombinedUnifiedDashboard() {
  const [activeTab, setActiveTab] = useState('technical'); // 'executive' | 'compliance' | 'technical'

  const [data, setData] = useState({
    assets: [],
    vulnerabilities: [],
    network_connections: [],
    anomalies: [],
    critical_attack_paths: [],
    source: 'mock_data'
  });
  
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [activePathId, setActivePathId] = useState(null);

  const graphRef = useRef(null);

  const loadData = async (isManualSync = false) => {
    if (isManualSync) setIsRefreshing(true);
    try {
      const result = await fetchTopologyData();
      setData(result);
    } catch (err) {
      console.error('Error fetching topology data:', err);
    } finally {
      setLoading(false);
      if (isManualSync) setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedAsset = data.assets.find(a => a.id === selectedNodeId) || null;
  const activeAttackPath = data.critical_attack_paths.find(p => p.path_id === activePathId) || null;

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100 p-4 md:p-8">
      {/* Main Top Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-sky-500 via-indigo-600 to-purple-600 rounded-2xl shadow-glow-blue text-white">
            <Network className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-extrabold tracking-tight text-white">CyberQuant AI</h1>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-full">
                Unified Frontend Platform
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
              <span>Member 5 (Exec & Compliance) & Member 6 (Technical Topology)</span>
              <span>•</span>
              <span className="text-gray-500">FastAPI REST & Master Data Contract v1.0</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Tab Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Main Module Tabs */}
          <div className="flex items-center p-1 bg-gray-900/90 rounded-xl border border-gray-800">
            <button
              onClick={() => setActiveTab('executive')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'executive'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-glow-blue'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Exec & ROSI (Member 5)
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'compliance'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-green'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Compliance Matrix (Member 5)
            </button>
            <button
              onClick={() => setActiveTab('technical')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'technical'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-glow-red'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4" />
              Technical Topology (Member 6)
            </button>
          </div>

          <button
            onClick={() => loadData(true)}
            disabled={isRefreshing}
            className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-gray-300 text-xs font-semibold rounded-xl border border-gray-800 flex items-center gap-2 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Sync
          </button>
        </div>
      </header>

      {loading ? (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
          <p className="text-sm text-sky-400 font-mono">Loading CyberQuant Platform Interface...</p>
        </div>
      ) : (
        <main className="max-w-7xl mx-auto">
          {/* Member 5: Executive View */}
          {activeTab === 'executive' && (
            <ExecutiveDashboard />
          )}

          {/* Member 5: Compliance Matrix View */}
          {activeTab === 'compliance' && (
            <ComplianceMatrix />
          )}

          {/* Member 6: Technical Topology View */}
          {activeTab === 'technical' && (
            <>
              <HeaderKpiCards 
                assets={data.assets}
                anomalies={data.anomalies}
                attackPaths={data.critical_attack_paths}
                dataSource={data.source}
                onRefresh={() => loadData(true)}
                isRefreshing={isRefreshing}
              />

              <AttackPathSelector 
                attackPaths={data.critical_attack_paths}
                activePathId={activePathId}
                onSelectPath={(pathId) => {
                  setActivePathId(pathId);
                  if (pathId) {
                    const path = data.critical_attack_paths.find(p => p.path_id === pathId);
                    if (path && path.entry_point_asset_id) {
                      setSelectedNodeId(path.entry_point_asset_id);
                    }
                  }
                }}
              />

              <NetworkGraph 
                ref={graphRef}
                assets={data.assets}
                networkConnections={data.network_connections}
                anomalies={data.anomalies}
                selectedNodeId={selectedNodeId}
                activePath={activeAttackPath}
                onSelectNode={(nodeId) => setSelectedNodeId(nodeId)}
              />

              <CveAnomalyTable 
                vulnerabilities={data.vulnerabilities}
                anomalies={data.anomalies}
                onSelectAssetNode={(nodeId) => {
                  setSelectedNodeId(nodeId);
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
              />
            </>
          )}
        </main>
      )}

      {/* Node Details Drawer (Member 6) */}
      <NodeDetailsDrawer 
        asset={selectedAsset}
        vulnerabilities={data.vulnerabilities}
        networkConnections={data.network_connections}
        anomalies={data.anomalies}
        onClose={() => setSelectedNodeId(null)}
      />

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-900 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-3">
        <p>© CyberQuant AI — Continuous Cyber Risk Quantification & Investment Optimization</p>
        <p className="flex items-center gap-1.5 font-mono text-gray-400">
          <Terminal className="w-3.5 h-3.5 text-sky-400" /> Member 5 & Member 6 Unified Frontend Interface
        </p>
      </footer>
    </div>
  );
}
