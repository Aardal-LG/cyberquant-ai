"""
Automated FastAPI Endpoint Validation Script
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_endpoints():
    print("Testing GET /health...")
    r = client.get("/health")
    assert r.status_code == 200, f"Health check failed: {r.text}"
    print(f"  Result: {r.json()}")

    print("\nTesting GET /api/v1/assets...")
    r = client.get("/api/v1/assets")
    assert r.status_code == 200, f"Get assets failed: {r.text}"
    data = r.json()
    assert data["total"] == 20
    print(f"  Result: Total assets = {data['total']}")

    print("\nTesting GET /api/v1/assets/AST-001...")
    r = client.get("/api/v1/assets/AST-001")
    assert r.status_code == 200
    print(f"  Result: Asset AST-001 name = '{r.json()['name']}'")

    print("\nTesting GET /api/v1/threats/anomalies...")
    r = client.get("/api/v1/threats/anomalies")
    assert r.status_code == 200
    data = r.json()
    print(f"  Result: Total anomalies = {data['total_anomalies']}")

    print("\nTesting GET /api/v1/risk/financial...")
    r = client.get("/api/v1/risk/financial")
    assert r.status_code == 200
    data = r.json()
    print(f"  Result: Baseline EAL = ${data['metrics']['expected_annual_loss_usd']:,.2f}")

    print("\nTesting POST /api/v1/optimize...")
    payload = {"budget_usd": 350000.0}
    r = client.post("/api/v1/optimize", json=payload)
    assert r.status_code == 200
    data = r.json()
    print(f"  Result: ROSI = {data['summary']['return_on_security_investment_percent']}%")

    print("\nTesting GET /api/v1/compliance...")
    r = client.get("/api/v1/compliance")
    assert r.status_code == 200
    data = r.json()
    print(f"  Result: Frameworks count = {len(data['frameworks'])}")

    print("\nTesting GET /api/v1/topology...")
    r = client.get("/api/v1/topology")
    assert r.status_code == 200
    data = r.json()
    print(f"  Result: Total nodes = {data['total_nodes']}, edges = {data['total_edges']}")

    print("\nTesting POST /api/v1/ingest...")
    ingest_payload = {
        "source_type": "cisa_kev",
        "source_identifier": "TEST_CISA_FEED",
        "payload": {
            "cve_id": "CVE-2026-9999",
            "cvss_score": 9.5,
            "cisa_kev": True
        }
    }
    r = client.post("/api/v1/ingest", json=ingest_payload)
    assert r.status_code == 200
    data = r.json()
    print(f"  Result: Status = {data['status']}, Source = {data['source_type']}")

    print("\n" + "="*50)
    print("ALL API ENDPOINTS TESTED AND PASSED SUCCESSFULLY!")
    print("="*50)


if __name__ == "__main__":
    test_endpoints()
