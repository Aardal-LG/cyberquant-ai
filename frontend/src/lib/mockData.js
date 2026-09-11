export const masterMockData = {
  schema_version: "1.0",
  assets: [
    {
      id: "AST-001",
      name: "Core Banking DB Cluster",
      type: "database",
      ip_address: "10.0.1.15",
      criticality: "CRITICAL",
      internet_exposed: false,
      owner: "Finance Tech Ops",
      associated_vulnerabilities: ["CVE-2021-44228"],
      security_posture: {
        patch_level: "outdated",
        edr_installed: true,
        mfa_enabled: true,
        encryption_at_rest: true
      }
    },
    {
      id: "AST-002",
      name: "Customer Portal Web App",
      type: "web_server",
      ip_address: "198.51.100.42",
      criticality: "HIGH",
      internet_exposed: true,
      owner: "Digital Products",
      associated_vulnerabilities: ["CVE-2023-34362", "CVE-2021-44228"],
      security_posture: {
        patch_level: "critical_missing",
        edr_installed: true,
        mfa_enabled: false,
        encryption_at_rest: true
      }
    },
    {
      id: "AST-003",
      name: "Payment Gateway Proxy",
      type: "api_gateway",
      ip_address: "198.51.100.88",
      criticality: "CRITICAL",
      internet_exposed: true,
      owner: "Payments Team",
      associated_vulnerabilities: ["CVE-2024-30078"],
      security_posture: {
        patch_level: "up_to_date",
        edr_installed: true,
        mfa_enabled: true,
        encryption_at_rest: true
      }
    },
    {
      id: "AST-004",
      name: "Active Directory Primary DC",
      type: "domain_controller",
      ip_address: "10.0.0.5",
      criticality: "CRITICAL",
      internet_exposed: false,
      owner: "Identity SecOps",
      associated_vulnerabilities: ["CVE-2023-23397"],
      security_posture: {
        patch_level: "partially_patched",
        edr_installed: true,
        mfa_enabled: true,
        encryption_at_rest: false
      }
    },
    {
      id: "AST-005",
      name: "Kubernetes Ingress Gateway",
      type: "load_balancer",
      ip_address: "198.51.100.10",
      criticality: "HIGH",
      internet_exposed: true,
      owner: "Cloud Platform",
      associated_vulnerabilities: ["CVE-2024-21626"],
      security_posture: {
        patch_level: "outdated",
        edr_installed: false,
        mfa_enabled: true,
        encryption_at_rest: true
      }
    },
    {
      id: "AST-006",
      name: "HR & Payroll Application",
      type: "application_server",
      ip_address: "10.0.2.20",
      criticality: "MEDIUM",
      internet_exposed: false,
      owner: "HR Systems",
      associated_vulnerabilities: ["CVE-2021-44228"],
      security_posture: {
        patch_level: "outdated",
        edr_installed: true,
        mfa_enabled: false,
        encryption_at_rest: true
      }
    },
    {
      id: "AST-007",
      name: "Jenkins CI/CD Worker Node",
      type: "build_server",
      ip_address: "10.0.5.12",
      criticality: "HIGH",
      internet_exposed: true,
      owner: "DevOps Team",
      associated_vulnerabilities: ["CVE-2024-21626"],
      security_posture: {
        patch_level: "critical_missing",
        edr_installed: false,
        mfa_enabled: false,
        encryption_at_rest: false
      }
    },
    {
      id: "AST-008",
      name: "Customer Analytics Data Warehouse",
      type: "analytics_db",
      ip_address: "10.0.1.99",
      criticality: "CRITICAL",
      internet_exposed: false,
      owner: "Data Science",
      associated_vulnerabilities: [],
      security_posture: {
        patch_level: "up_to_date",
        edr_installed: true,
        mfa_enabled: true,
        encryption_at_rest: true
      }
    },
    {
      id: "AST-009",
      name: "Legacy ERP Middleware",
      type: "legacy_server",
      ip_address: "10.0.3.4",
      criticality: "HIGH",
      internet_exposed: false,
      owner: "Enterprise Apps",
      associated_vulnerabilities: ["CVE-2021-44228"],
      security_posture: {
        patch_level: "outdated",
        edr_installed: false,
        mfa_enabled: false,
        encryption_at_rest: false
      }
    },
    {
      id: "AST-010",
      name: "Corporate Exchange Email Server",
      type: "email_server",
      ip_address: "198.51.100.55",
      criticality: "HIGH",
      internet_exposed: true,
      owner: "IT Communications",
      associated_vulnerabilities: ["CVE-2023-23397"],
      security_posture: {
        patch_level: "partially_patched",
        edr_installed: true,
        mfa_enabled: true,
        encryption_at_rest: true
      }
    },
    {
      id: "AST-011",
      name: "VPN Concentrator Appliance",
      type: "network_device",
      ip_address: "198.51.100.1",
      criticality: "CRITICAL",
      internet_exposed: true,
      owner: "Network Infrastructure",
      associated_vulnerabilities: ["CVE-2023-34362"],
      security_posture: {
        patch_level: "up_to_date",
        edr_installed: false,
        mfa_enabled: true,
        encryption_at_rest: true
      }
    },
    {
      id: "AST-012",
      name: "Finance Workstation #14",
      type: "endpoint",
      ip_address: "10.0.10.45",
      criticality: "LOW",
      internet_exposed: false,
      owner: "Finance Users",
      associated_vulnerabilities: ["CVE-2024-30078"],
      security_posture: {
        patch_level: "up_to_date",
        edr_installed: true,
        mfa_enabled: true,
        encryption_at_rest: true
      }
    },
    {
      id: "AST-013",
      name: "Staging App Deployment Pod",
      type: "container",
      ip_address: "10.0.5.88",
      criticality: "MEDIUM",
      internet_exposed: false,
      owner: "QA Team",
      associated_vulnerabilities: ["CVE-2024-21626"],
      security_posture: {
        patch_level: "outdated",
        edr_installed: false,
        mfa_enabled: false,
        encryption_at_rest: false
      }
    },
    {
      id: "AST-014",
      name: "SFTP Data Exchange Host",
      type: "file_server",
      ip_address: "198.51.100.77",
      criticality: "HIGH",
      internet_exposed: true,
      owner: "B2B Operations",
      associated_vulnerabilities: ["CVE-2023-34362"],
      security_posture: {
        patch_level: "critical_missing",
        edr_installed: true,
        mfa_enabled: false,
        encryption_at_rest: true
      }
    },
    {
      id: "AST-015",
      name: "IAM Identity Store DB",
      type: "database",
      ip_address: "10.0.0.12",
      criticality: "CRITICAL",
      internet_exposed: false,
      owner: "Identity SecOps",
      associated_vulnerabilities: [],
      security_posture: {
        patch_level: "up_to_date",
        edr_installed: true,
        mfa_enabled: true,
        encryption_at_rest: true
      }
    },
    {
      id: "AST-016",
      name: "Core Payment Clearing Processor",
      type: "mainframe",
      ip_address: "10.0.1.200",
      criticality: "CRITICAL",
      internet_exposed: false,
      owner: "Payments Core",
      associated_vulnerabilities: [],
      security_posture: {
        patch_level: "up_to_date",
        edr_installed: true,
        mfa_enabled: true,
        encryption_at_rest: true
      }
    },
    {
      id: "AST-017",
      name: "SIEM Collector Node",
      type: "monitoring",
      ip_address: "10.0.4.10",
      criticality: "MEDIUM",
      internet_exposed: false,
      owner: "SOC Team",
      associated_vulnerabilities: [],
      security_posture: {
        patch_level: "up_to_date",
        edr_installed: true,
        mfa_enabled: true,
        encryption_at_rest: true
      }
    },
    {
      id: "AST-018",
      name: "Public Marketing Web Server",
      type: "web_server",
      ip_address: "198.51.100.99",
      criticality: "LOW",
      internet_exposed: true,
      owner: "Marketing Tech",
      associated_vulnerabilities: ["CVE-2021-44228"],
      security_posture: {
        patch_level: "outdated",
        edr_installed: false,
        mfa_enabled: false,
        encryption_at_rest: false
      }
    },
    {
      id: "AST-019",
      name: "Redis Session Cache Cluster",
      type: "cache",
      ip_address: "10.0.1.50",
      criticality: "MEDIUM",
      internet_exposed: false,
      owner: "Digital Products",
      associated_vulnerabilities: [],
      security_posture: {
        patch_level: "up_to_date",
        edr_installed: true,
        mfa_enabled: false,
        encryption_at_rest: false
      }
    },
    {
      id: "AST-020",
      name: "Disaster Recovery Backup Vault",
      type: "backup_appliance",
      ip_address: "10.0.9.100",
      criticality: "HIGH",
      internet_exposed: false,
      owner: "IT Disaster Recovery",
      associated_vulnerabilities: ["CVE-2023-34362"],
      security_posture: {
        patch_level: "outdated",
        edr_installed: true,
        mfa_enabled: true,
        encryption_at_rest: true
      }
    }
  ],
  vulnerabilities: [
    {
      cve_id: "CVE-2021-44228",
      name: "Log4Shell Remote Code Execution",
      cvss_score: 10.0,
      severity: "CRITICAL",
      cisa_kev: true,
      exploit_age_days: 1005,
      exploit_probability: 0.95,
      description: "Apache Log4j2 JNDI features used in configuration, log messages, and parameters do not protect against attacker controlled LDAP and other JNDI related endpoints."
    },
    {
      cve_id: "CVE-2023-34362",
      name: "MOVEit Transfer SQL Injection RCE",
      cvss_score: 9.8,
      severity: "CRITICAL",
      cisa_kev: true,
      exploit_age_days: 468,
      exploit_probability: 0.88,
      description: "Unauthenticated SQL injection vulnerability in MOVEit Transfer web application could allow an unauthenticated attacker to gain access to MOVEit Transfer's database."
    },
    {
      cve_id: "CVE-2023-23397",
      name: "Microsoft Outlook NTLM Privilege Escalation",
      cvss_score: 9.8,
      severity: "CRITICAL",
      cisa_kev: true,
      exploit_age_days: 540,
      exploit_probability: 0.82,
      description: "Microsoft Outlook elevation of privilege vulnerability triggering NTLM hash leaks via crafted sound file properties."
    },
    {
      cve_id: "CVE-2024-30078",
      name: "Windows Wi-Fi Driver Remote Code Execution",
      cvss_score: 8.8,
      severity: "HIGH",
      cisa_kev: false,
      exploit_age_days: 90,
      exploit_probability: 0.64,
      description: "An unauthenticated attacker could execute remote code execution on a target system using a malicious Wi-Fi packet."
    },
    {
      cve_id: "CVE-2024-21626",
      name: "runc Container Breakout Leaky File Descriptors",
      cvss_score: 8.6,
      severity: "HIGH",
      cisa_kev: true,
      exploit_age_days: 220,
      exploit_probability: 0.76,
      description: "Container escape vulnerability in runc allowing attacker to acquire file descriptor access to host directory tree."
    }
  ],
  network_connections: [
    { source_asset_id: "AST-005", target_asset_id: "AST-002", port: 443, protocol: "HTTPS", relationship_type: "routes_traffic_to" },
    { source_asset_id: "AST-002", target_asset_id: "AST-001", port: 5432, protocol: "PostgreSQL", relationship_type: "queries_database" },
    { source_asset_id: "AST-003", target_asset_id: "AST-016", port: 8443, protocol: "mTLS", relationship_type: "initiates_payment" },
    { source_asset_id: "AST-012", target_asset_id: "AST-004", port: 88, protocol: "Kerberos", relationship_type: "authenticates_via" },
    { source_asset_id: "AST-006", target_asset_id: "AST-004", port: 389, protocol: "LDAP", relationship_type: "authenticates_via" },
    { source_asset_id: "AST-007", target_asset_id: "AST-013", port: 22, protocol: "SSH", relationship_type: "triggers_build" },
    { source_asset_id: "AST-002", target_asset_id: "AST-019", port: 6379, protocol: "Redis", relationship_type: "caches_session" },
    { source_asset_id: "AST-017", target_asset_id: "AST-001", port: 514, protocol: "Syslog", relationship_type: "monitors_logs" },
    { source_asset_id: "AST-011", target_asset_id: "AST-004", port: 443, protocol: "IPSec", relationship_type: "vpn_tunnel" },
    { source_asset_id: "AST-014", target_asset_id: "AST-008", port: 22, protocol: "SFTP", relationship_type: "transfers_batch" },
    { source_asset_id: "AST-010", target_asset_id: "AST-004", port: 135, protocol: "RPC", relationship_type: "ad_sync" },
    { source_asset_id: "AST-018", target_asset_id: "AST-002", port: 80, protocol: "HTTP", relationship_type: "redirects_traffic" },
    { source_asset_id: "AST-009", target_asset_id: "AST-001", port: 1433, protocol: "TDS", relationship_type: "db_sync" },
    { source_asset_id: "AST-020", target_asset_id: "AST-001", port: 445, protocol: "SMB", relationship_type: "backup_snapshots" }
  ],
  anomalies: [
    {
      anomaly_id: "ANM-901",
      asset_id: "AST-007",
      asset_name: "Jenkins CI/CD Worker Node",
      type: "Behavioral Traffic Spike",
      cluster_id: -1,
      dbscan_score: -0.92,
      detected_at: "2026-09-11T19:42:00Z",
      description: "Unmapped egress traffic spike (4.2 GB in 5 mins) to unauthorized external IP (185.220.101.5)."
    },
    {
      anomaly_id: "ANM-902",
      asset_id: "AST-002",
      asset_name: "Customer Portal Web App",
      type: "Privilege Escalation / Off-hours Login",
      cluster_id: -1,
      dbscan_score: -0.85,
      detected_at: "2026-09-11T20:15:30Z",
      description: "Multiple failed root authentication attempts followed by successful sudo shell spawn."
    },
    {
      anomaly_id: "ANM-903",
      asset_id: "AST-014",
      asset_name: "SFTP Data Exchange Host",
      type: "Log Tampering / Audit Clearing",
      cluster_id: -1,
      dbscan_score: -0.78,
      detected_at: "2026-09-11T21:02:10Z",
      description: "Syslog daemon termination event followed by immediate deletion of /var/log/secure."
    }
  ],
  critical_attack_paths: [
    {
      path_id: "PATH-001",
      name: "Internet Gateway to Core Banking Database",
      entry_point_asset_id: "AST-005",
      target_asset_id: "AST-001",
      cumulative_exploit_probability: 0.72,
      path_length: 3,
      hops: [
        {
          step_number: 1,
          asset_id: "AST-005",
          asset_name: "Kubernetes Ingress Gateway",
          cve_id: "CVE-2024-21626",
          vulnerability_name: "runc Container Breakout",
          exploit_probability: 0.76
        },
        {
          step_number: 2,
          asset_id: "AST-002",
          asset_name: "Customer Portal Web App",
          cve_id: "CVE-2023-34362",
          vulnerability_name: "MOVEit Transfer RCE",
          exploit_probability: 0.88
        },
        {
          step_number: 3,
          asset_id: "AST-001",
          asset_name: "Core Banking DB Cluster",
          cve_id: "CVE-2021-44228",
          vulnerability_name: "Log4Shell RCE",
          exploit_probability: 0.95
        }
      ]
    },
    {
      path_id: "PATH-002",
      name: "Corporate Email to Active Directory DC",
      entry_point_asset_id: "AST-010",
      target_asset_id: "AST-004",
      cumulative_exploit_probability: 0.67,
      path_length: 2,
      hops: [
        {
          step_number: 1,
          asset_id: "AST-010",
          asset_name: "Corporate Exchange Email Server",
          cve_id: "CVE-2023-23397",
          vulnerability_name: "Outlook NTLM Hash Leak",
          exploit_probability: 0.82
        },
        {
          step_number: 2,
          asset_id: "AST-004",
          asset_name: "Active Directory Primary DC",
          cve_id: "CVE-2023-23397",
          vulnerability_name: "NTLM Relay Privilege Escalation",
          exploit_probability: 0.81
        }
      ]
    },
    {
      path_id: "PATH-003",
      name: "CI/CD Build Server to Staging Container",
      entry_point_asset_id: "AST-007",
      target_asset_id: "AST-013",
      cumulative_exploit_probability: 0.58,
      path_length: 2,
      hops: [
        {
          step_number: 1,
          asset_id: "AST-007",
          asset_name: "Jenkins CI/CD Worker Node",
          cve_id: "CVE-2024-21626",
          vulnerability_name: "runc Leaky File Descriptor",
          exploit_probability: 0.76
        },
        {
          step_number: 2,
          asset_id: "AST-013",
          asset_name: "Staging App Deployment Pod",
          cve_id: "CVE-2024-21626",
          vulnerability_name: "Container Breakout to Host",
          exploit_probability: 0.76
        }
      ]
    }
  ],
  risk_metrics: {
    composite_technical_risk_score: 78.4,
    expected_annual_loss_usd: 1250000.0,
    value_at_risk_95_usd: 2100000.0,
    conditional_var_95_usd: 2850000.0,
    annual_loss_frequency: 4.2,
    average_loss_magnitude_usd: 297619.0,
    high_risk_asset_count: 7,
    critical_vulnerability_count: 3
  },
  controls: [
    {
      id: "CTRL-001",
      name: "Next-Gen EDR Deployment across Endpoints & Servers",
      category: "Endpoint Security",
      cost_usd: 120000.0,
      risk_reduction_factor: 0.35,
      compliance_mappings: {
        NIST_800_53: ["DE.CM-4", "PR.PT-1"],
        ISO_27001: ["A.12.2.1"],
        CIS_Controls: ["V8-10.1"],
        RBI_CSF: ["Clause 4.1"],
        SEBI_CCRF: ["Req 2.3"]
      }
    },
    {
      id: "CTRL-002",
      name: "Privileged Access Management (PAM) & Just-In-Time Access",
      category: "Identity & Access Management",
      cost_usd: 95000.0,
      risk_reduction_factor: 0.28,
      compliance_mappings: {
        NIST_800_53: ["PR.AC-1", "PR.AC-6"],
        ISO_27001: ["A.9.2.3"],
        CIS_Controls: ["V8-5.4"],
        RBI_CSF: ["Clause 3.2"],
        SEBI_CCRF: ["Req 1.4"]
      }
    },
    {
      id: "CTRL-003",
      name: "Automated Patch & Vulnerability Management Engine",
      category: "Vulnerability Management",
      cost_usd: 70000.0,
      risk_reduction_factor: 0.30,
      compliance_mappings: {
        NIST_800_53: ["ID.RA-5", "PR.IP-12"],
        ISO_27001: ["A.12.6.1"],
        CIS_Controls: ["V8-7.1"],
        RBI_CSF: ["Clause 5.3"],
        SEBI_CCRF: ["Req 3.1"]
      }
    },
    {
      id: "CTRL-004",
      name: "Web Application Firewall (WAF) & API Shielding",
      category: "Network & Application Security",
      cost_usd: 85000.0,
      risk_reduction_factor: 0.22,
      compliance_mappings: {
        NIST_800_53: ["PR.PT-4"],
        ISO_27001: ["A.13.1.1"],
        CIS_Controls: ["V8-9.2"],
        RBI_CSF: ["Clause 6.2"],
        SEBI_CCRF: ["Req 4.2"]
      }
    },
    {
      id: "CTRL-005",
      name: "Zero-Trust Network Microsegmentation",
      category: "Network Architecture",
      cost_usd: 150000.0,
      risk_reduction_factor: 0.40,
      compliance_mappings: {
        NIST_800_53: ["PR.AC-5", "PR.PT-4"],
        ISO_27001: ["A.13.1.3"],
        CIS_Controls: ["V8-12.2"],
        RBI_CSF: ["Clause 7.1"],
        SEBI_CCRF: ["Req 5.5"]
      }
    },
    {
      id: "CTRL-006",
      name: "Hardware Token Enforced Multi-Factor Authentication (MFA)",
      category: "Identity & Access Management",
      cost_usd: 40000.0,
      risk_reduction_factor: 0.18,
      compliance_mappings: {
        NIST_800_53: ["PR.AC-7"],
        ISO_27001: ["A.9.4.2"],
        CIS_Controls: ["V8-6.3"],
        RBI_CSF: ["Clause 3.5"],
        SEBI_CCRF: ["Req 1.8"]
      }
    }
  ],
  optimization_results: {
    budget_usd: 350000.0,
    selected_control_ids: ["CTRL-001", "CTRL-003", "CTRL-005"],
    total_investment_cost_usd: 340000.0,
    pre_control_eal_usd: 1250000.0,
    post_control_eal_usd: 397250.0,
    net_risk_reduction_usd: 852750.0,
    net_financial_benefit_usd: 512750.0,
    return_on_security_investment_percent: 150.81,
    post_control_var_95_usd: 714000.0,
    post_control_cvar_95_usd: 969000.0,
    algorithm_version: "OR-Tools MILP v1.0 (Mock Contract)"
  }
};
