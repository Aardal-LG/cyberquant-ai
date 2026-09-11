from fastapi import APIRouter
from app.schemas.vulnerability import ThreatAnomaliesListResponse
from app.services.threat_service import threat_service

router = APIRouter(prefix="/threats", tags=["Threat Intelligence & ML (Member 3)"])


@router.get(
    "/anomalies",
    response_model=ThreatAnomaliesListResponse,
    summary="Get ML-detected anomalies and GBDT exploit likelihood predictions",
)
def get_threat_anomalies():
    """
    Retrieve threat intelligence anomalies and exploit probabilities.
    Member 3 Integration Endpoint: DBSCAN anomaly detection & GBDT exploit likelihood.
    """
    return threat_service.get_detected_anomalies()
