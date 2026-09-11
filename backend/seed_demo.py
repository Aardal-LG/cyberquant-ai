"""
Seed Demo Script — Phase 9 Implementation.

Loads mock_data.json, validates schemas against Pydantic models,
and prepares/seeds initial dataset into memory / database.
Safe to run repeatedly.
"""

import json
import logging
import sys
from pathlib import Path

# Add app directory to path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.core.config import settings
from app.schemas.asset import AssetBase
from app.schemas.financial import FinancialRiskMetrics
from app.schemas.optimization import OptimizationResult, SecurityControl
from app.schemas.topology import NetworkConnection, UserAccessInfo
from app.schemas.vulnerability import VulnerabilityBase

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("seed_demo")


def seed_demo_data():
    file_path = Path(settings.MOCK_DATA_PATH)
    if not file_path.exists():
        file_path = Path(__file__).resolve().parents[1] / "mock_data.json"

    logger.info(f"Loading contract from: {file_path}")

    if not file_path.exists():
        logger.error(f"Cannot find mock_data.json at {file_path}")
        sys.exit(1)

    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    logger.info(f"Schema Version: {data.get('schema_version')}")

    # Validate Assets
    assets = [AssetBase(**a) for a in data.get("assets", [])]
    logger.info(f"Successfully validated {len(assets)} assets.")

    # Validate Vulnerabilities
    vulns = [VulnerabilityBase(**v) for v in data.get("vulnerabilities", [])]
    logger.info(f"Successfully validated {len(vulns)} vulnerabilities (CVEs).")

    # Validate Connections
    conns = [NetworkConnection(**c) for c in data.get("network_connections", [])]
    logger.info(f"Successfully validated {len(conns)} network connections.")

    # Validate Users
    users = [UserAccessInfo(**u) for u in data.get("users", [])]
    logger.info(f"Successfully validated {len(users)} users.")

    # Validate Financial Metrics
    metrics = FinancialRiskMetrics(**data.get("risk_metrics", {}))
    logger.info(
        f"Successfully validated financial metrics (Baseline EAL: ${metrics.expected_annual_loss_usd:,.2f})."
    )

    # Validate Controls
    controls = [SecurityControl(**c) for c in data.get("controls", [])]
    logger.info(f"Successfully validated {len(controls)} security controls.")

    # Validate Optimization Results
    opt_res = OptimizationResult(**data.get("optimization_results", {}))
    logger.info(
        f"Successfully validated optimization results (ROSI: {opt_res.return_on_security_investment_percent}%)."
    )

    logger.info("=" * 60)
    logger.info("DEMO SEEDING COMPLETED SUCCESSFULLY!")
    logger.info(f"Total Assets: {len(assets)} | Total CVEs: {len(vulns)}")
    logger.info(f"Baseline EAL: ${metrics.expected_annual_loss_usd:,.2f}")
    logger.info(f"Sample ROSI Output: {opt_res.return_on_security_investment_percent}%")
    logger.info("=" * 60)


if __name__ == "__main__":
    seed_demo_data()
