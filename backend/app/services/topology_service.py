"""
Topology Service — Integration interface for Member 2 (Neo4j Graph Database, Attack Path Traversals, Compliance Mapping).

Member 2 Integration Note:
Replace mock loader queries with direct Neo4j Cypher queries using neo4j-python-driver once live graph database is connected.
"""

from app.schemas.compliance import ComplianceResponse, ControlComplianceMapping, FrameworkComplianceSummary
from app.schemas.topology import AttackPath, AttackPathHop, NetworkConnection, TopologyResponse, UserAccessInfo
from app.services.mock_loader import mock_loader


class TopologyService:
    def get_topology_graph(self) -> TopologyResponse:
        raw_conns = mock_loader.get_network_connections()
        raw_users = mock_loader.get_users()
        assets = mock_loader.get_assets()
        
        connections = [NetworkConnection(**c) for c in raw_conns]
        users = [UserAccessInfo(**u) for u in raw_users]
        
        # Sample Attack Path derived from assets & CVEs
        attack_paths = [
            AttackPath(
                path_id="PATH-001",
                entry_point_asset_id="AST-005",
                target_asset_id="AST-001",
                cumulative_exploit_probability=0.72,
                path_length=3,
                hops=[
                    AttackPathHop(
                        step_number=1,
                        asset_id="AST-005",
                        asset_name="Kubernetes Ingress Gateway",
                        cve_id="CVE-2024-21626",
                        vulnerability_name="runc Container Breakout",
                        exploit_probability=0.76,
                    ),
                    AttackPathHop(
                        step_number=2,
                        asset_id="AST-002",
                        asset_name="Customer Portal Web App",
                        cve_id="CVE-2023-34362",
                        vulnerability_name="MOVEit Transfer RCE",
                        exploit_probability=0.88,
                    ),
                    AttackPathHop(
                        step_number=3,
                        asset_id="AST-001",
                        asset_name="Core Banking DB Cluster",
                        cve_id="CVE-2021-44228",
                        vulnerability_name="Log4Shell RCE",
                        exploit_probability=0.95,
                    ),
                ],
            ),
            AttackPath(
                path_id="PATH-002",
                entry_point_asset_id="AST-010",
                target_asset_id="AST-004",
                cumulative_exploit_probability=0.67,
                path_length=2,
                hops=[
                    AttackPathHop(
                        step_number=1,
                        asset_id="AST-010",
                        asset_name="Corporate Exchange Email Server",
                        cve_id="CVE-2023-23397",
                        vulnerability_name="Outlook NTLM Hash Leak",
                        exploit_probability=0.82,
                    ),
                    AttackPathHop(
                        step_number=2,
                        asset_id="AST-004",
                        asset_name="Active Directory Primary DC",
                        cve_id=None,
                        vulnerability_name="NTLM Relay / Pass-The-Hash Privilege Escalation",
                        exploit_probability=0.81,
                    ),
                ],
            ),
        ]
        
        return TopologyResponse(
            total_nodes=len(assets),
            total_edges=len(connections),
            network_connections=connections,
            users=users,
            critical_attack_paths=attack_paths,
            neo4j_status="Connected (Member 2 Integration Stub)",
        )

    def get_compliance_mappings(self) -> ComplianceResponse:
        controls = mock_loader.get_controls()
        
        mappings = []
        for ctrl in controls:
            for fw, reqs in ctrl.get("compliance_mappings", {}).items():
                mappings.append(
                    ControlComplianceMapping(
                        control_id=ctrl["id"],
                        control_name=ctrl["name"],
                        framework=fw,
                        mapped_requirements=reqs,
                    )
                )
        
        frameworks = [
            FrameworkComplianceSummary(
                framework_name="NIST Cybersecurity Framework (CSF 2.0)",
                code="NIST_CSF",
                overall_compliance_score=78.5,
                implemented_controls_count=4,
                total_required_controls_count=6,
                gap_areas=["PR.AC Access Control", "DE.CM Security Continuous Monitoring"],
            ),
            FrameworkComplianceSummary(
                framework_name="ISO/IEC 27001:2022 Security Controls",
                code="ISO_27001",
                overall_compliance_score=82.0,
                implemented_controls_count=5,
                total_required_controls_count=6,
                gap_areas=["A.9 Access Control Policies"],
            ),
            FrameworkComplianceSummary(
                framework_name="CIS Critical Security Controls v8",
                code="CIS_CONTROLS",
                overall_compliance_score=71.0,
                implemented_controls_count=3,
                total_required_controls_count=6,
                gap_areas=["V8-12 Network Infrastructure Management"],
            ),
        ]
        
        return ComplianceResponse(frameworks=frameworks, control_mappings=mappings)


topology_service = TopologyService()
