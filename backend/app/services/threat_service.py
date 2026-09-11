"""
Threat Service — Integration interface for Member 3 (GBDT / XGBoost + DBSCAN Anomaly Detection).

Member 3 Integration Note:
Replace or wrap the mock payload methods below with live GBDT exploit likelihood predictions
and DBSCAN clustering anomaly outputs when Member 3 delivers their python module/package.
"""

from datetime import datetime
from app.schemas.vulnerability import ThreatAnomaliesListResponse, ThreatAnomalyResponse
from app.services.mock_loader import mock_loader


class ThreatService:
    def get_detected_anomalies(self) -> ThreatAnomaliesListResponse:
        vulnerabilities = mock_loader.get_vulnerabilities()
        assets = mock_loader.get_assets()
        
        anomalies = [
            ThreatAnomalyResponse(
                anomaly_id="ANOM-2026-001",
                asset_id="AST-002",
                cve_id="CVE-2023-34362",
                anomaly_score=0.94,
                detection_method="DBSCAN Traffic Spike Clustering (Member 3 Stub)",
                gbdt_exploit_probability=0.88,
                status="ACTIVE_INVESTIGATION",
                timestamp=datetime.utcnow().isoformat() + "Z",
            ),
            ThreatAnomalyResponse(
                anomaly_id="ANOM-2026-002",
                asset_id="AST-001",
                cve_id="CVE-2021-44228",
                anomaly_score=0.98,
                detection_method="GBDT High Exploit Likelihood Prediction (Member 3 Stub)",
                gbdt_exploit_probability=0.95,
                status="CRITICAL_ALERT",
                timestamp=datetime.utcnow().isoformat() + "Z",
            ),
            ThreatAnomalyResponse(
                anomaly_id="ANOM-2026-003",
                asset_id="AST-004",
                cve_id="CVE-2023-23397",
                anomaly_score=0.82,
                detection_method="DBSCAN Auth Anomaly (Member 3 Stub)",
                gbdt_exploit_probability=0.82,
                status="MONITORING",
                timestamp=datetime.utcnow().isoformat() + "Z",
            ),
        ]
        
        return ThreatAnomaliesListResponse(
            total_anomalies=len(anomalies),
            high_priority_count=2,
            anomalies=anomalies,
        )


threat_service = ThreatService()
