'use client';

import React from 'react';
import { X, ShieldAlert, Server, Globe, Lock, Cpu, Database, Activity, FileText, CheckCircle, AlertCircle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function NodeDetailsDrawer({ asset, vulnerabilities = [], networkConnections = [], anomalies = [], onClose }) {
  if (!asset) return null;

  // Filter vulnerabilities associated with this asset
  const assetCves = vulnerabilities.filter(v => 
    asset.associated_vulnerabilities?.includes(v.cve_id)
  );

  // Filter anomalies for this asset
  const assetAnomalies = anomalies.filter(a => a.asset_id === asset.id);

  // Filter inbound/outbound connections
  const inboundConns = networkConnections.filter(c => c.target_asset_id === asset.id);
  const outboundConns = networkConnections.filter(c => c.source_asset_id === asset.id);

  const getCriticalityBadge = (crit) => {
    switch (crit) {
      case 'CRITICAL':
        return <span className="px-2.5 py-1 text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40 rounded-full shadow-glow-red">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2.5 py-1 text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40 rounded-full">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-1 text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full">MEDIUM</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full">LOW</span>;
    }
  };

  const getPatchBadge = (patch) => {
    switch (patch) {
      case 'up_to_date':
        return <span className="text-emerald-400 font-semibold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Up To Date</span>;
      case 'partially_patched':
        return <span className="text-amber-400 font-semibold flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Partially Patched</span>;
      case 'outdated':
        return <span className="text-orange-400 font-semibold flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Outdated</span>;
      default:
        return <span className="text-red-400 font-bold flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Critical Missing</span>;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-gray-950/95 backdrop-blur-xl border-l border-gray-800 shadow-2xl z-50 overflow-y-auto flex flex-col transition-transform duration-300">
      {/* Drawer Header */}
      <div className="p-5 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-950/90 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-sky-400 font-bold">{asset.id}</span>
              {getCriticalityBadge(asset.criticality)}
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">{asset.name}</h2>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-5 space-y-6 flex-1">
        {/* Core Attributes Card */}
        <div className="glass-panel p-4 rounded-xl space-y-3">
          <h3 className="text-xs uppercase font-semibold text-gray-400 tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sky-400" /> Infrastructure Attributes
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-400">IP Address:</span>
              <p className="font-mono text-white font-semibold mt-0.5">{asset.ip_address}</p>
            </div>
            <div>
              <span className="text-gray-400">Asset Type:</span>
              <p className="text-white font-semibold mt-0.5 capitalize">{asset.type?.replace('_', ' ')}</p>
            </div>
            <div>
              <span className="text-gray-400">Owner / Dept:</span>
              <p className="text-white font-semibold mt-0.5">{asset.owner}</p>
            </div>
            <div>
              <span className="text-gray-400">Internet Exposure:</span>
              <p className="mt-0.5">
                {asset.internet_exposed ? (
                  <span className="text-red-400 font-semibold flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Publicly Exposed</span>
                ) : (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Internal Enclave</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Security Posture Matrix */}
        <div className="glass-panel p-4 rounded-xl space-y-3">
          <h3 className="text-xs uppercase font-semibold text-gray-400 tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" /> Security Posture
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="col-span-2 pb-2 border-b border-gray-800 flex justify-between items-center">
              <span className="text-gray-400">Patch Status:</span>
              {getPatchBadge(asset.security_posture?.patch_level)}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">EDR Installed:</span>
              <span className={asset.security_posture?.edr_installed ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                {asset.security_posture?.edr_installed ? "ENABLED" : "MISSING"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">MFA Enforced:</span>
              <span className={asset.security_posture?.mfa_enabled ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                {asset.security_posture?.mfa_enabled ? "ENABLED" : "DISABLED"}
              </span>
            </div>
            <div className="flex justify-between items-center col-span-2">
              <span className="text-gray-400">Encryption at Rest:</span>
              <span className={asset.security_posture?.encryption_at_rest ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                {asset.security_posture?.encryption_at_rest ? "ACTIVE (AES-256)" : "UNENCRYPTED"}
              </span>
            </div>
          </div>
        </div>

        {/* Associated Vulnerabilities */}
        <div className="glass-panel p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase font-semibold text-gray-400 tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" /> Associated Vulnerabilities ({assetCves.length})
            </h3>
          </div>
          {assetCves.length === 0 ? (
            <p className="text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded border border-emerald-500/20 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> No known CVE vulnerabilities linked to this asset.
            </p>
          ) : (
            <div className="space-y-2">
              {assetCves.map((cve) => (
                <div key={cve.cve_id} className="p-3 bg-gray-900/80 rounded-lg border border-red-500/30 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-red-400">{cve.cve_id}</span>
                    <span className="px-2 py-0.5 bg-red-950 text-red-300 rounded font-mono font-bold">
                      CVSS {cve.cvss_score}
                    </span>
                  </div>
                  <p className="font-semibold text-white mt-1">{cve.name}</p>
                  <p className="text-gray-400 text-[11px] mt-1 line-clamp-2">{cve.description}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-800 text-[11px]">
                    <span className="text-red-400 font-mono">
                      P(Exploit): <strong>{(cve.exploit_probability * 100).toFixed(0)}%</strong>
                    </span>
                    {cve.cisa_kev && (
                      <span className="px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-800 rounded text-[10px] font-bold">
                        CISA KEV EXPLOITED
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Behavioral Anomalies */}
        {assetAnomalies.length > 0 && (
          <div className="glass-panel p-4 rounded-xl space-y-3 border-amber-500/40">
            <h3 className="text-xs uppercase font-semibold text-amber-400 tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4" /> DBSCAN Behavioral Anomalies ({assetAnomalies.length})
            </h3>
            <div className="space-y-2">
              {assetAnomalies.map((anm) => (
                <div key={anm.anomaly_id} className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-amber-300">{anm.anomaly_id}</span>
                    <span className="text-[10px] bg-amber-950 text-amber-400 px-1.5 py-0.5 rounded font-mono">
                      Cluster Score {anm.dbscan_score}
                    </span>
                  </div>
                  <p className="font-bold text-white">{anm.type}</p>
                  <p className="text-gray-300 mt-1 text-[11px]">{anm.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Network Routes */}
        <div className="glass-panel p-4 rounded-xl space-y-3">
          <h3 className="text-xs uppercase font-semibold text-gray-400 tracking-wider">Connected Network Routes</h3>
          <div className="space-y-2 text-xs">
            {outboundConns.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-gray-900/60 rounded border border-gray-800">
                <span className="text-gray-400 flex items-center gap-1"><ArrowUpRight className="w-3.5 h-3.5 text-sky-400" /> Outbound to {c.target_asset_id}</span>
                <span className="font-mono text-sky-300">{c.protocol}:{c.port}</span>
              </div>
            ))}
            {inboundConns.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-gray-900/60 rounded border border-gray-800">
                <span className="text-gray-400 flex items-center gap-1"><ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" /> Inbound from {c.source_asset_id}</span>
                <span className="font-mono text-emerald-300">{c.protocol}:{c.port}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Telemetry Raw Snippet */}
        <div className="glass-panel p-4 rounded-xl space-y-2">
          <h3 className="text-xs uppercase font-semibold text-gray-400 tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-400" /> SIEM Raw Telemetry Stream
          </h3>
          <pre className="p-3 bg-gray-950 rounded-lg text-[10px] font-mono text-sky-300 overflow-x-auto border border-gray-800">
{`{
  "event_timestamp": "${new Date().toISOString()}",
  "asset_id": "${asset.id}",
  "ip": "${asset.ip_address}",
  "status": "TELEMETRY_STREAMING",
  "packets_sec": ${Math.floor(Math.random() * 500) + 120},
  "cve_flags": ${JSON.stringify(asset.associated_vulnerabilities || [])}
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
