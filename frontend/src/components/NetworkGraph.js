'use client';

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Search, Filter, ZoomIn, ZoomOut, Maximize2, Play, Pause, AlertCircle, ShieldCheck, Zap } from 'lucide-react';

const NetworkGraph = forwardRef(function NetworkGraph({
  assets = [],
  networkConnections = [],
  anomalies = [],
  selectedNodeId = null,
  activePath = null,
  onSelectNode
}, ref) {
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const nodesDataSetRef = useRef(null);
  const edgesDataSetRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [criticalityFilter, setCriticalityFilter] = useState('ALL');
  const [internetFilter, setInternetFilter] = useState('ALL');
  const [isPhysicsActive, setIsPhysicsActive] = useState(true);

  // Expose reset/zoom methods to parent via ref
  useImperativeHandle(ref, () => ({
    fit: () => networkRef.current?.fit({ animation: { duration: 500 } }),
    zoomIn: () => {
      const scale = networkRef.current?.getScale() || 1;
      networkRef.current?.moveTo({ scale: scale * 1.2 });
    },
    zoomOut: () => {
      const scale = networkRef.current?.getScale() || 1;
      networkRef.current?.moveTo({ scale: scale * 0.8 });
    }
  }));

  // Build Vis Network Nodes & Edges
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Dynamically import vis-network & vis-data on client side
    Promise.all([import('vis-network'), import('vis-data')]).then(([{ Network }, { DataSet }]) => {
      // Map anomaly asset IDs
      const anomalyAssetIds = new Set(anomalies.map(a => a.asset_id));

      // Extract attack path asset & edge sets if an attack path is active
      const activePathAssetIds = new Set();
      const activePathEdgeKeys = new Set();

      if (activePath && activePath.hops) {
        activePath.hops.forEach((hop, idx) => {
          activePathAssetIds.add(hop.asset_id);
          if (idx < activePath.hops.length - 1) {
            const nextHop = activePath.hops[idx + 1];
            activePathEdgeKeys.add(`${hop.asset_id}->${nextHop.asset_id}`);
            activePathEdgeKeys.add(`${nextHop.asset_id}->${hop.asset_id}`);
          }
        });
      }

      // Filter assets based on user controls
      const filteredAssets = assets.filter(asset => {
        const matchesSearch =
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.ip_address.includes(searchTerm);

        const matchesCriticality =
          criticalityFilter === 'ALL' || asset.criticality === criticalityFilter;

        const matchesInternet =
          internetFilter === 'ALL' ||
          (internetFilter === 'EXPOSED' && asset.internet_exposed) ||
          (internetFilter === 'INTERNAL' && !asset.internet_exposed);

        return matchesSearch && matchesCriticality && matchesInternet;
      });

      const filteredAssetIds = new Set(filteredAssets.map(a => a.id));

      // 1. Create Nodes
      const visNodes = filteredAssets.map(asset => {
        const hasVulnerability = asset.associated_vulnerabilities?.length > 0;
        const isAnomaly = anomalyAssetIds.has(asset.id);
        const isSelected = asset.id === selectedNodeId;
        const isInActivePath = activePathAssetIds.has(asset.id);

        // Determine node color category
        let colorObj = {
          background: '#10b981', // Green = Secure
          border: '#059669',
          highlight: { background: '#34d399', border: '#10b981' }
        };

        if (hasVulnerability || asset.criticality === 'CRITICAL') {
          colorObj = {
            background: '#ef4444', // Red = High Risk / Vulnerable
            border: '#dc2626',
            highlight: { background: '#f87171', border: '#ef4444' }
          };
        } else if (isAnomaly || asset.security_posture?.patch_level === 'outdated') {
          colorObj = {
            background: '#f97316', // Orange = Anomaly / Moderate Risk
            border: '#ea580c',
            highlight: { background: '#fb923c', border: '#f97316' }
          };
        }

        // Highlight override if in active attack path
        if (isInActivePath) {
          colorObj = {
            background: '#a855f7', // Glowing Purple for Attack Path
            border: '#ec4899',
            highlight: { background: '#c084fc', border: '#f43f5e' }
          };
        }

        // Selected node border
        if (isSelected) {
          colorObj.border = '#38bdf8';
        }

        // Icon shape mapping
        let shape = 'dot';
        if (asset.type === 'database') shape = 'database';
        else if (asset.internet_exposed) shape = 'diamond';

        return {
          id: asset.id,
          label: `${asset.name}\n[${asset.ip_address}]`,
          shape: shape,
          size: isSelected ? 32 : (isInActivePath ? 28 : (asset.criticality === 'CRITICAL' ? 24 : 18)),
          color: colorObj,
          font: {
            color: isSelected ? '#38bdf8' : (isInActivePath ? '#f43f5e' : '#f3f4f6'),
            size: isSelected ? 14 : 11,
            face: 'Inter',
            strokeWidth: 3,
            strokeColor: '#090d16'
          },
          borderWidth: isSelected ? 4 : (isInActivePath ? 3 : 2),
          shadow: isSelected || isInActivePath ? { enabled: true, color: colorObj.background, size: 20 } : false
        };
      });

      // 2. Create Edges
      const visEdges = [];
      networkConnections.forEach((conn, index) => {
        if (!filteredAssetIds.has(conn.source_asset_id) || !filteredAssetIds.has(conn.target_asset_id)) return;

        const isPathEdge =
          activePathEdgeKeys.has(`${conn.source_asset_id}->${conn.target_asset_id}`);

        visEdges.push({
          id: `edge-${index}`,
          from: conn.source_asset_id,
          to: conn.target_asset_id,
          label: `${conn.protocol}:${conn.port}`,
          arrows: 'to',
          color: isPathEdge ? { color: '#f43f5e', highlight: '#f43f5e', opacity: 1 } : { color: '#374151', highlight: '#38bdf8', opacity: 0.6 },
          width: isPathEdge ? 4 : 1, borderDash: conn.relationship_type === 'routes_traffic_to' ? [4, 4] : false,
          font: {
            color: isPathEdge ? '#f43f5e' : '#9ca3af',
            size: 9,
            align: 'middle',
            strokeWidth: 2,
            strokeColor: '#090d16'
          },
          smooth: { type: 'continuous', roundness: 0.2 }
        });
      });

      const nodesDataSet = new DataSet(visNodes);
      const edgesDataSet = new DataSet(visEdges);

      nodesDataSetRef.current = nodesDataSet;
      edgesDataSetRef.current = edgesDataSet;

      const data = { nodes: nodesDataSet, edges: edgesDataSet };

      const options = {
        nodes: {
          borderWidthSelected: 4,
        },
        edges: {
          selectionWidth: 3,
        },
        interaction: {
          hover: true,
          tooltipDelay: 150,
          zoomView: true,
          dragView: true
        },
        physics: {
          enabled: isPhysicsActive,
          barnesHut: {
            gravitationalConstant: -3000,
            centralGravity: 0.3,
            springLength: 120,
            springConstant: 0.04
          },
          stabilization: { iterations: 150 }
        }
      };

      // Create Vis Network
      if (networkRef.current) networkRef.current.destroy();

      const network = new Network(containerRef.current, data, options);
      networkRef.current = network;

      // Event listener for Node Click
      network.on('click', (params) => {
        if (params.nodes.length > 0) {
          onSelectNode(params.nodes[0]);
        }
      });
    });

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [assets, networkConnections, anomalies, selectedNodeId, activePath, searchTerm, criticalityFilter, internetFilter, isPhysicsActive]);

  return (
    <div className="glass-panel rounded-xl p-4 mb-6 relative">
      {/* Control Bar Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-800">
        {/* Left: Title & Legend */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/20 text-sky-400 rounded-lg border border-sky-500/30">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Asset Security Topology Graph</h3>
            <div className="flex items-center gap-3 mt-1 text-xs">
              <span className="flex items-center gap-1.5 text-red-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shadow-glow-red"></span> High Risk / CVE
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-glow-orange"></span> DBSCAN Anomaly
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-glow-green"></span> Secure Asset
              </span>
            </div>
          </div>
        </div>

        {/* Right: Search & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative min-w-[180px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search asset, IP, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-gray-900/90 text-xs text-white placeholder-gray-500 rounded-lg border border-gray-700/60 focus:border-sky-500 focus:outline-none"
            />
          </div>

          {/* Criticality Filter */}
          <select
            value={criticalityFilter}
            onChange={(e) => setCriticalityFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-gray-900/90 text-xs text-gray-200 rounded-lg border border-gray-700/60 focus:border-sky-500 focus:outline-none"
          >
            <option value="ALL">Criticality: All</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Only</option>
            <option value="MEDIUM">Medium Only</option>
            <option value="LOW">Low Only</option>
          </select>

          {/* Exposure Filter */}
          <select
            value={internetFilter}
            onChange={(e) => setInternetFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-gray-900/90 text-xs text-gray-200 rounded-lg border border-gray-700/60 focus:border-sky-500 focus:outline-none"
          >
            <option value="ALL">Exposure: All</option>
            <option value="EXPOSED">Internet Exposed</option>
            <option value="INTERNAL">Internal Only</option>
          </select>

          {/* Physics Toggle */}
          <button
            onClick={() => setIsPhysicsActive(!isPhysicsActive)}
            className={`p-1.5 text-xs rounded-lg border transition-colors flex items-center gap-1 ${isPhysicsActive
              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
              : 'bg-gray-800 text-gray-400 border-gray-700'
              }`}
            title={isPhysicsActive ? 'Pause Graph Physics' : 'Enable Physics Layout'}
          >
            {isPhysicsActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-[520px] bg-gray-950/60 rounded-xl border border-gray-800/80 relative"
      />

      {/* Floating Canvas Controls */}
      <div className="absolute bottom-6 right-6 flex items-center gap-1 bg-gray-900/90 p-1 rounded-lg border border-gray-700/80 shadow-lg">
        <button
          onClick={() => {
            const scale = networkRef.current?.getScale() || 1;
            networkRef.current?.moveTo({ scale: scale * 1.2 });
          }}
          className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            const scale = networkRef.current?.getScale() || 1;
            networkRef.current?.moveTo({ scale: scale * 0.8 });
          }}
          className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => networkRef.current?.fit({ animation: { duration: 500 } })}
          className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors"
          title="Fit Canvas View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

export default NetworkGraph;
