"""Adapter connecting FastAPI services to the existing ML modules."""

from pathlib import Path

import pandas as pd

from ai_engine.anomaly_model import detect_anomalies
from ai_engine.exploit_model import predict_exploit_probability


class MLService:
    def predict_vulnerabilities(self, vulnerabilities: list[dict]) -> dict[str, float]:
        return {
            vulnerability["cve_id"]: predict_exploit_probability(vulnerability)
            for vulnerability in vulnerabilities
        }

    def detect_log_anomalies(self) -> pd.DataFrame:
        logs_path = Path(__file__).resolve().parents[3] / "ai_engine" / "data" / "logs.csv"
        return detect_anomalies(pd.read_csv(logs_path))


ml_service = MLService()
