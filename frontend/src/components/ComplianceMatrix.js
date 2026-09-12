'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Search, FileText, CheckCircle2, AlertCircle, Layers } from 'lucide-react';
import { fetchCompliance } from '../lib/api';

export default function ComplianceMatrix() {
  const [searchTerm, setSearchTerm] = useState('');
  const [frameworkFilter, setFrameworkFilter] = useState('ALL');
  const [compliance, setCompliance] = useState({ frameworks: [], control_mappings: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompliance().then(setCompliance).catch((err) => setError(err.message));
  }, []);

  const controls = Object.values(compliance.control_mappings.reduce((byControl, mapping) => {
    const control = byControl[mapping.control_id] || {
      id: mapping.control_id,
      name: mapping.control_name,
      category: 'Security control',
      compliance_mappings: {}
    };
    control.compliance_mappings[mapping.framework] = mapping.mapped_requirements;
    byControl[mapping.control_id] = control;
    return byControl;
  }, {}));

  const filteredControls = controls.filter(ctrl => {
    const matchesSearch = 
      ctrl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ctrl.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ctrl.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="glass-panel p-6 rounded-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Regulatory Compliance Readiness Matrix
              <span className="px-2.5 py-0.5 text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-mono">
                Member 5 View
              </span>
            </h2>
            <p className="text-xs text-gray-400">Mapping security controls across NIST 800-53, ISO 27001, CIS Controls, RBI CSF, and SEBI CCRF</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-3">
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search control, framework..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-gray-900/90 text-xs text-white placeholder-gray-500 rounded-lg border border-gray-700/60 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {compliance.frameworks.map((framework) => (
          <div key={framework.code} className="p-3 bg-gray-900/80 rounded-xl border border-gray-800 text-xs">
            <span className="text-gray-400 font-semibold">{framework.framework_name}</span>
            <div className="text-lg font-bold text-emerald-400 mt-1">{framework.overall_compliance_score}% Covered</div>
            <span className="text-[10px] text-gray-500">Gaps: {framework.gap_areas.join(', ') || 'None'}</span>
          </div>
        ))}
      </div>
      {error && <p className="text-xs text-red-400">Compliance API unavailable: {error}</p>}

      {/* Compliance Mapping Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="bg-gray-900/90 text-gray-400 font-semibold uppercase tracking-wider text-[11px] border-b border-gray-800">
            <tr>
              <th className="py-3 px-4">Control ID</th>
              <th className="py-3 px-4">Security Control Name</th>
              <th className="py-3 px-4">NIST 800-53</th>
              <th className="py-3 px-4">ISO 27001</th>
              <th className="py-3 px-4">CIS Controls</th>
              <th className="py-3 px-4">RBI CSF</th>
              <th className="py-3 px-4">SEBI CCRF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {filteredControls.map((ctrl) => (
              <tr key={ctrl.id} className="hover:bg-gray-900/50 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-emerald-400">{ctrl.id}</td>
                <td className="py-3 px-4 font-medium text-white max-w-[260px]">
                  <div>{ctrl.name}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{ctrl.category}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {ctrl.compliance_mappings?.NIST_800_53?.map(req => (
                      <span key={req} className="px-1.5 py-0.5 bg-sky-950 text-sky-300 rounded font-mono text-[10px] border border-sky-800">
                        {req}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {ctrl.compliance_mappings?.ISO_27001?.map(req => (
                      <span key={req} className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 rounded font-mono text-[10px] border border-emerald-800">
                        {req}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {ctrl.compliance_mappings?.CIS_Controls?.map(req => (
                      <span key={req} className="px-1.5 py-0.5 bg-purple-950 text-purple-300 rounded font-mono text-[10px] border border-purple-800">
                        {req}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {ctrl.compliance_mappings?.RBI_CSF?.map(req => (
                      <span key={req} className="px-1.5 py-0.5 bg-amber-950 text-amber-300 rounded font-mono text-[10px] border border-amber-800">
                        {req}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {ctrl.compliance_mappings?.SEBI_CCRF?.map(req => (
                      <span key={req} className="px-1.5 py-0.5 bg-teal-950 text-teal-300 rounded font-mono text-[10px] border border-teal-800">
                        {req}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
