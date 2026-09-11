"""
Seed CyberQuant AI demo data into Neo4j.

Usage:

    python seed_demo.py

The script:
1. Loads mock_data.json
2. Converts the project's JSON format into the Neo4j graph format
3. Creates Neo4j constraints
4. Inserts nodes
5. Inserts relationships
6. Can safely be run repeatedly because ingestion uses MERGE
"""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any

from app.services.topology_service import topology_service


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent
MOCK_DATA_PATH = BASE_DIR / "mock_data.json"


# ================================================================
# Load
# ================================================================

def load_mock_data() -> dict[str, Any]:
    logger.info("Loading demo data from %s", MOCK_DATA_PATH)

    if not MOCK_DATA_PATH.exists():
        raise FileNotFoundError(
            f"mock_data.json not found at {MOCK_DATA_PATH}"
        )

    with MOCK_DATA_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


# ================================================================
# Normalization
# ================================================================

def normalize_assets(data: dict[str, Any]) -> list[dict[str, Any]]:
    rows = []

    for asset in data.get("assets", []):
        rows.append(
            {
                "asset_id": asset["id"],
                "name": asset["name"],
                "asset_type": asset.get("type"),
                "hostname": asset.get("name"),
                "ip": asset.get("ip_address"),
                "criticality": asset.get("criticality"),
                "exposure": (
                    "internet-facing"
                    if asset.get("internet_exposed", False)
                    else "internal"
                ),
                "owner": asset.get("owner"),
            }
        )

    return rows


def normalize_vulnerabilities(
    data: dict[str, Any],
) -> list[dict[str, Any]]:
    rows = []

    for vuln in data.get("vulnerabilities", []):
        rows.append(
            {
                "cve_id": vuln["id"]
                if "id" in vuln
                else vuln.get("cve_id"),
                "name": vuln.get("name"),
                "description": vuln.get("description"),
                "cvss": vuln.get("cvss"),
                "severity": vuln.get("severity"),
                "kev_flag": vuln.get(
                    "kev_flag",
                    vuln.get("known_exploited", False),
                ),
                "exploit_age_days": vuln.get(
                    "exploit_age_days",
                    0,
                ),
            }
        )

    return [
        row
        for row in rows
        if row.get("cve_id")
    ]


def normalize_users(
    data: dict[str, Any],
) -> list[dict[str, Any]]:
    rows = []

    for user in data.get("users", []):
        rows.append(
            {
                "user_id": user["user_id"],
                "username": user.get("username"),
                "name": user.get(
                    "full_name",
                    user.get("name"),
                ),
                "role": user.get("role"),
                "access_level": user.get("access_level"),
            }
        )

    return rows


def normalize_controls(
    data: dict[str, Any],
) -> list[dict[str, Any]]:
    rows = []

    for control in data.get("controls", []):
        rows.append(
            {
                "control_id": control["id"],
                "name": control["name"],
                "category": control.get("category"),
                "cost_usd": control.get("cost_usd", 0),
                "risk_reduction_factor": control.get(
                    "risk_reduction_factor",
                    0,
                ),
            }
        )

    return rows


# ================================================================
# Relationships
# ================================================================

def build_vulnerability_edges(
    data: dict[str, Any],
) -> list[dict[str, str]]:
    edges = []

    for asset in data.get("assets", []):
        asset_id = asset["id"]

        for vulnerability in asset.get(
            "associated_vulnerabilities",
            [],
        ):
            edges.append(
                {
                    "asset_id": asset_id,
                    "cve_id": vulnerability,
                }
            )

    return edges


def build_access_edges(
    data: dict[str, Any],
) -> list[dict[str, Any]]:
    edges = []

    for user in data.get("users", []):
        for asset_id in user.get(
            "accessible_assets",
            [],
        ):
            edges.append(
                {
                    "user_id": user["user_id"],
                    "asset_id": asset_id,
                    "access_level": user.get(
                        "access_level"
                    ),
                }
            )

    return edges


def build_connection_edges(
    data: dict[str, Any],
) -> list[dict[str, Any]]:
    edges = []

    for connection in data.get(
        "network_connections",
        [],
    ):
        edges.append(
            {
                "src_id": connection["source_asset_id"],
                "dst_id": connection["target_asset_id"],
                "port": connection.get("port"),
                "protocol": connection.get("protocol"),
            }
        )

    return edges


def build_control_mapping_edges(
    data: dict[str, Any],
) -> list[dict[str, Any]]:
    edges = []

    for control in data.get("controls", []):
        control_id = control["id"]

        for framework, clauses in control.get(
            "compliance_mappings",
            {},
        ).items():

            for clause in clauses:
                edges.append(
                    {
                        "control_id": control_id,
                        "framework": framework,
                        "clause": clause,
                    }
                )

    return edges


# ================================================================
# Seed
# ================================================================

def seed_neo4j(data: dict[str, Any]) -> None:
    logger.info("Connecting to Neo4j...")

    topology_service.ensure_constraints()

    assets = normalize_assets(data)
    vulnerabilities = normalize_vulnerabilities(data)
    users = normalize_users(data)
    controls = normalize_controls(data)

    vulnerability_edges = build_vulnerability_edges(data)
    access_edges = build_access_edges(data)
    connection_edges = build_connection_edges(data)
    control_mapping_edges = build_control_mapping_edges(data)

    # Nodes
    asset_count = topology_service.ingest_assets(assets)

    vulnerability_count = (
        topology_service.ingest_vulnerabilities(
            vulnerabilities
        )
    )

    user_count = topology_service.ingest_users(users)

    control_count = topology_service.ingest_controls(
        controls
    )

    # Relationships
    vuln_edge_count = topology_service.ingest_has_vuln(
        vulnerability_edges
    )

    access_edge_count = topology_service.ingest_can_access(
        access_edges
    )

    connection_count = topology_service.ingest_connected_to(
        connection_edges
    )

    mapping_edge_count = (
        topology_service.ingest_control_maps_to(
            control_mapping_edges
        )
    )

    logger.info(
        "Neo4j seeding completed."
    )

    logger.info(
        "Nodes: assets=%d vulnerabilities=%d users=%d controls=%d",
        asset_count,
        vulnerability_count,
        user_count,
        control_count,
    )

    logger.info(
        "Relationships: HAS_VULN=%d CAN_ACCESS=%d "
        "CONNECTED_TO=%d MAPS_TO=%d",
        vuln_edge_count,
        access_edge_count,
        connection_count,
        mapping_edge_count,
    )


# ================================================================
# Main
# ================================================================

def main() -> None:
    logger.info("=" * 60)
    logger.info("CyberQuant AI — Neo4j Demo Seeder")
    logger.info("=" * 60)

    try:
        data = load_mock_data()

        logger.info(
            "Schema version: %s",
            data.get("schema_version"),
        )

        seed_neo4j(data)

        logger.info("=" * 60)
        logger.info("DEMO SEEDING COMPLETED SUCCESSFULLY")
        logger.info("=" * 60)

    except Exception:
        logger.exception("Demo seeding failed.")
        raise

    finally:
        topology_service.close()


if __name__ == "__main__":
    main()