'use client';

import React from 'react';
import { GitPullRequest, ArrowRight, ShieldAlert, CheckCircle2, Zap } from 'lucide-react';

export default function AttackPathSelector({ attackPaths = [], activePathId, onSelectPath }) {
  const activePath = attackPaths.find(p => p.path_id === activePathId) || null;

  return (
    <div className="glass-panel p-4 rounded-xl mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30">
            <GitPullRequest className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Critical Attack Path Analyzer
              <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                Neo4j Graph Mining
              </span>
            </h3>
            <p className="text-xs text-gray-400">Select an attack vector to highlight shortest paths from entry points to critical targets</p>
          </div>
        </div>

        {/* Path Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSelectPath(null)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activePathId === null
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-glow-blue'
                : 'bg-gray-800/60 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-700/50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Show Full Graph
          </button>

          {attackPaths.map((path) => {
            const isSelected = path.path_id === activePathId;
            return (
              <button
                key={path.path_id}
                onClick={() => onSelectPath(path.path_id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-red-500/20 text-red-300 border border-red-500/50 shadow-glow-red'
                    : 'bg-gray-800/60 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-700/50'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                <span>{path.path_id}</span>
                <span className="px-1.5 py-0.5 text-[10px] bg-red-900/60 text-red-300 rounded font-mono">
                  {(path.cumulative_exploit_probability * 100).toFixed(0)}% P(E)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Attack Path Details Timeline */}
      {activePath && (
        <div className="mt-4 pt-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
              <span className="text-sm font-semibold text-white">{activePath.name}</span>
              <span className="text-xs text-gray-400">({activePath.hops.length} Hops)</span>
            </div>
            <div className="text-xs text-red-400 bg-red-500/10 px-2.5 py-1 rounded border border-red-500/20 font-mono">
              Cumulative Exploit Likelihood: <strong>{(activePath.cumulative_exploit_probability * 100).toFixed(1)}%</strong>
            </div>
          </div>

          {/* Hop Steps Horizontal Chain */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 overflow-x-auto pb-2">
            {activePath.hops.map((hop, idx) => (
              <React.Fragment key={hop.step_number || idx}>
                <div className="flex-1 min-w-[220px] bg-gray-900/80 p-3 rounded-lg border border-red-500/30 relative group hover:border-red-500 transition-colors">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span className="font-mono text-purple-400">Hop #{hop.step_number}</span>
                    <span className="text-[10px] bg-red-950 text-red-400 px-1.5 py-0.5 rounded border border-red-800">
                      P(E): {((hop.exploit_probability || 0.8) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white truncate">{hop.asset_name}</div>
                  <div className="text-xs text-gray-400 font-mono mt-0.5">{hop.asset_id}</div>
                  
                  {hop.cve_id && (
                    <div className="mt-2 text-[11px] bg-red-500/10 text-red-300 p-1.5 rounded border border-red-500/20">
                      <span className="font-bold">{hop.cve_id}</span>: {hop.vulnerability_name}
                    </div>
                  )}
                </div>

                {idx < activePath.hops.length - 1 && (
                  <div className="flex justify-center items-center text-red-500">
                    <ArrowRight className="w-5 h-5 hidden md:block animate-pulse" />
                    <div className="h-4 w-0.5 bg-red-500 md:hidden my-1"></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
