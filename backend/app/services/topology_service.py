"""
Neo4j ingestion + graph query service — Tasks 2.4 and 2.5.

Task 2.4:
- Asset, Vulnerability, User, Control nodes
- HAS_VULN, CAN_ACCESS, CONNECTED_TO relationships
- Idempotent MERGE-based ingestion

Task 2.5:
- Shortest paths from internet-facing assets to high-value targets
- Vulnerability information included for each asset on the path
- Uses plain Cypher; no Neo4j GDS plugin required
"""

from __future__ import annotations

from typing import Any, Iterable, Mapping

from neo4j import Driver, GraphDatabase

from app.core.config import settings
from app.schemas.compliance import (
    ComplianceResponse,
    ControlComplianceMapping,
    FrameworkComplianceSummary,
)
from app.schemas.topology import (
    AttackPath,
    AttackPathHop,
    NetworkConnection,
    TopologyResponse,
    UserAccessInfo,
)
from app.services.mock_loader import mock_loader


class TopologyService:
    """Neo4j-backed topology and attack-path service."""

    def __init__(self, driver: Driver | None = None) -> None:
        self._driver = driver or GraphDatabase.driver(
            settings.NEO4J_URI,
            auth=(
                settings.NEO4J_USERNAME,
                settings.NEO4J_PASSWORD,
            ),
        )

    def close(self) -> None:
        self._driver.close()

    # ================================================================
    # Task 2.4 — Schema
    # ================================================================

    def ensure_constraints(self) -> None:
        statements = [
            """
            CREATE CONSTRAINT asset_id IF NOT EXISTS
            FOR (a:Asset)
            REQUIRE a.asset_id IS UNIQUE
            """,
            """
            CREATE CONSTRAINT vuln_id IF NOT EXISTS
            FOR (v:Vulnerability)
            REQUIRE v.cve_id IS UNIQUE
            """,
            """
            CREATE CONSTRAINT user_id IF NOT EXISTS
            FOR (u:User)
            REQUIRE u.user_id IS UNIQUE
            """,
            """
            CREATE CONSTRAINT control_id IF NOT EXISTS
            FOR (c:Control)
            REQUIRE c.control_id IS UNIQUE
            """,
        ]

        with self._driver.session() as session:
            for statement in statements:
                session.run(statement)

    # ================================================================
    # Node ingestion
    # ================================================================

    def ingest_assets(
        self,
        assets: Iterable[Mapping[str, Any]],
    ) -> int:
        query = """
        UNWIND $rows AS row

        MERGE (a:Asset {asset_id: row.asset_id})

        SET a.name = row.name,
            a.asset_type = row.asset_type,
            a.hostname = row.hostname,
            a.ip = row.ip,
            a.criticality = row.criticality,
            a.exposure = row.exposure,
            a.owner = row.owner,
            a.updated_at = timestamp()
        """

        return self._run_batch(query, assets)

    def ingest_vulnerabilities(
        self,
        vulnerabilities: Iterable[Mapping[str, Any]],
    ) -> int:
        query = """
        UNWIND $rows AS row

        MERGE (v:Vulnerability {cve_id: row.cve_id})

        SET v.name = row.name,
            v.description = row.description,
            v.cvss = row.cvss,
            v.severity = row.severity,
            v.kev_flag = row.kev_flag,
            v.exploit_age_days = row.exploit_age_days,
            v.updated_at = timestamp()
        """

        return self._run_batch(query, vulnerabilities)

    def ingest_users(
        self,
        users: Iterable[Mapping[str, Any]],
    ) -> int:
        query = """
        UNWIND $rows AS row

        MERGE (u:User {user_id: row.user_id})

        SET u.username = row.username,
            u.name = row.name,
            u.role = row.role,
            u.access_level = row.access_level,
            u.updated_at = timestamp()
        """

        return self._run_batch(query, users)

    def ingest_controls(
        self,
        controls: Iterable[Mapping[str, Any]],
    ) -> int:
        query = """
        UNWIND $rows AS row

        MERGE (c:Control {control_id: row.control_id})

        SET c.name = row.name,
            c.category = row.category,
            c.cost_usd = row.cost_usd,
            c.risk_reduction_factor = row.risk_reduction_factor,
            c.updated_at = timestamp()
        """

        return self._run_batch(query, controls)

    # ================================================================
    # Relationship ingestion
    # ================================================================

    def ingest_has_vuln(
        self,
        edges: Iterable[Mapping[str, Any]],
    ) -> int:
        query = """
        UNWIND $rows AS row

        MATCH (a:Asset {asset_id: row.asset_id})
        MATCH (v:Vulnerability {cve_id: row.cve_id})

        MERGE (a)-[r:HAS_VULN]->(v)

        SET r.detected_at =
            coalesce(r.detected_at, timestamp())
        """

        return self._run_batch(query, edges)

    def ingest_can_access(
        self,
        edges: Iterable[Mapping[str, Any]],
    ) -> int:
        query = """
        UNWIND $rows AS row

        MATCH (u:User {user_id: row.user_id})
        MATCH (a:Asset {asset_id: row.asset_id})

        MERGE (u)-[r:CAN_ACCESS]->(a)

        SET r.access_level = row.access_level
        """

        return self._run_batch(query, edges)

    def ingest_connected_to(
        self,
        edges: Iterable[Mapping[str, Any]],
    ) -> int:
        query = """
        UNWIND $rows AS row

        MATCH (source:Asset {asset_id: row.src_id})
        MATCH (target:Asset {asset_id: row.dst_id})

        MERGE (source)-[r:CONNECTED_TO]->(target)

        SET r.port = row.port,
            r.protocol = row.protocol
        """

        return self._run_batch(query, edges)

    def ingest_control_maps_to(
        self,
        edges: Iterable[Mapping[str, Any]],
    ) -> int:
        query = """
        UNWIND $rows AS row

        MATCH (c:Control {control_id: row.control_id})

        MERGE (
            f:ComplianceClause {
                framework: row.framework,
                clause: row.clause
            }
        )

        MERGE (c)-[:MAPS_TO]->(f)
        """

        return self._run_batch(query, edges)

    # ================================================================
    # Task 2.5 — Attack paths
    # ================================================================

    def shortest_attack_paths(
        self,
        target_asset_id: str,
        max_hops: int = 6,
    ) -> list[dict[str, Any]]:
        """
        Find shortest network paths from internet-facing assets
        to the requested target.

        Vulnerabilities attached to every asset on the path are
        returned as part of the result.
        """

        max_hops = max(1, min(max_hops, 20))

        query = f"""
        MATCH (target:Asset {{asset_id: $target_id}})
        MATCH (entry:Asset {{exposure: 'internet-facing'}})

        MATCH p =
            shortestPath(
                (entry)-[:CONNECTED_TO*..{max_hops}]->(target)
            )

        RETURN
            entry.asset_id AS entry_point,
            target.asset_id AS target,
            [n IN nodes(p) | n.asset_id] AS path,
            length(p) AS hops,

            [
                n IN nodes(p) |
                {{
                    asset_id: n.asset_id,
                    name: n.name,
                    criticality: n.criticality,
                    vulnerabilities:
                        [(n)-[:HAS_VULN]->(v) |
                            {{
                                cve_id: v.cve_id,
                                name: v.name,
                                cvss: v.cvss,
                                severity: v.severity,
                                kev_flag: v.kev_flag
                            }}
                        ]
                }}
            ] AS path_assets

        ORDER BY hops ASC
        """

        with self._driver.session() as session:
            result = session.run(
                query,
                target_id=target_asset_id,
            )
            return [dict(record) for record in result]

    # ================================================================
    # API topology response
    # ================================================================

    def get_topology_graph(self) -> TopologyResponse:
        raw_connections = mock_loader.get_network_connections()
        raw_users = mock_loader.get_users()
        assets = mock_loader.get_assets()

        connections = [
            NetworkConnection(**connection)
            for connection in raw_connections
        ]

        users = [
            UserAccessInfo(**user)
            for user in raw_users
        ]

        return TopologyResponse(
            total_nodes=len(assets),
            total_edges=len(connections),
            network_connections=connections,
            users=users,
            critical_attack_paths=[],
            neo4j_status=self._neo4j_status(),
        )

    def _neo4j_status(self) -> str:
        try:
            with self._driver.session() as session:
                session.run("RETURN 1").single()

            return "Connected"
        except Exception:
            return "Disconnected"

    # ================================================================
    # Compliance
    # ================================================================

    def get_compliance_mappings(self) -> ComplianceResponse:
        controls = mock_loader.get_controls()

        mappings = []

        for control in controls:
            for framework, requirements in control.get(
                "compliance_mappings",
                {},
            ).items():

                mappings.append(
                    ControlComplianceMapping(
                        control_id=control["id"],
                        control_name=control["name"],
                        framework=framework,
                        mapped_requirements=requirements,
                    )
                )

        frameworks = [
            FrameworkComplianceSummary(
                framework_name="NIST Cybersecurity Framework (CSF 2.0)",
                code="NIST_CSF",
                overall_compliance_score=78.5,
                implemented_controls_count=4,
                total_required_controls_count=6,
                gap_areas=[
                    "PR.AC Access Control",
                    "DE.CM Security Continuous Monitoring",
                ],
            ),
            FrameworkComplianceSummary(
                framework_name="ISO/IEC 27001:2022 Security Controls",
                code="ISO_27001",
                overall_compliance_score=82.0,
                implemented_controls_count=5,
                total_required_controls_count=6,
                gap_areas=[
                    "A.9 Access Control Policies",
                ],
            ),
            FrameworkComplianceSummary(
                framework_name="CIS Critical Security Controls v8",
                code="CIS_CONTROLS",
                overall_compliance_score=71.0,
                implemented_controls_count=3,
                total_required_controls_count=6,
                gap_areas=[
                    "V8-12 Network Infrastructure Management",
                ],
            ),
        ]

        return ComplianceResponse(
            frameworks=frameworks,
            control_mappings=mappings,
        )

    # ================================================================
    # Internal helper
    # ================================================================

    def _run_batch(
        self,
        query: str,
        rows: Iterable[Mapping[str, Any]],
    ) -> int:
        rows = list(rows)

        if not rows:
            return 0

        with self._driver.session() as session:
            session.run(query, rows=rows).consume()

        return len(rows)


topology_service = TopologyService()