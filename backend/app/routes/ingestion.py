from fastapi import APIRouter
from app.schemas.ingestion import IngestionStatusResponse, RawIngestionPayload
from app.services.ingestion_service import ingestion_service

router = APIRouter(prefix="/ingest", tags=["Data Ingestion & Normalization"])


@router.post(
    "",
    response_model=IngestionStatusResponse,
    summary="Ingest and normalize security data from NVD, CISA KEV, Nmap, SIEM, EDR, CMDB",
)
def ingest_data(payload: RawIngestionPayload):
    """
    Ingest raw security payload from external data sources and normalize into CyberQuant AI schemas.
    """
    return ingestion_service.process_raw_payload(payload)
