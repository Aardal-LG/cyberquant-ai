"""Threat intelligence service backed by the existing GBDT and DBSCAN models."""

from datetime import datetime, timezone

from app.schemas.vulnerability import ThreatAnomaliesListResponse, ThreatAnomalyResponse
from app.services.ml_service import ml_service
from app.services.mock_loader import mock_loader


class ThreatService:
    def get_detected_anomalies(self) -> ThreatAnomaliesListResponse:
        predictions = ml_service.predict_vulnerabilities(mock_loader.get_vulnerabilities())
        vulnerable_assets = {
            asset["id"]: asset.get("associated_vulnerabilities", [])
            for asset in mock_loader.get_assets()
        }
        user_assets = {
            user["user_id"]: user.get("accessible_assets", [])
            for user in mock_loader.get_users()
        }

        anomalies = []
        detected_logs = ml_service.detect_log_anomalies()
        for index, log in detected_logs[detected_logs["is_anomaly"]].iterrows():
            accessible_assets = user_assets.get(log["user_id"], [])
            asset_id = next((asset for asset in accessible_assets if vulnerable_assets.get(asset)), None)
            if asset_id is None:
                asset_id = next(asset for asset, cves in vulnerable_assets.items() if cves)
            cve_id = max(vulnerable_assets[asset_id], key=lambda cve: predictions.get(cve, 0.0))
            probability = predictions[cve_id]
            anomaly_score = min(1.0, (float(log["traffic_mb"]) + float(log["failed_logins"]) * 10) / 1000)
            anomalies.append(ThreatAnomalyResponse(
                anomaly_id=f"ANOM-ML-{index + 1:03d}",
                asset_id=asset_id,
                cve_id=cve_id,
                anomaly_score=round(anomaly_score, 4),
                detection_method="DBSCAN behavioral anomaly + GBDT exploit likelihood",
                gbdt_exploit_probability=round(probability, 6),
                status="CRITICAL_ALERT" if probability >= 0.8 else "ACTIVE_INVESTIGATION",
                timestamp=datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            ))

        return ThreatAnomaliesListResponse(
            total_anomalies=len(anomalies),
            high_priority_count=sum(item.gbdt_exploit_probability >= 0.8 for item in anomalies),
            anomalies=anomalies,
        )


threat_service = ThreatService()
