from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel, Field


class IngestionSourceType(str):
    NVD_CVE = "nvd_cve"
    CISA_KEV = "cisa_kev"
    MISP_STIX = "misp_stix"
    NMAP = "nmap"
    AMASS = "amass"
    DNS_TLS = "dns_tls"
    SIEM = "siem"
    EDR = "edr"
    IAM = "iam"
    CMDB = "cmdb"


class RawIngestionPayload(BaseModel):
    source_type: str = Field(..., example="nvd_cve")
    source_identifier: str = Field(..., example="NVD_API_V2")
    payload: dict[str, Any] = Field(...)
    ingested_at: datetime = Field(default_factory=datetime.utcnow)


class NormalizedVulnerabilityRecord(BaseModel):
    cve_id: str
    cvss_score: float
    severity: str
    cisa_kev_flag: bool
    exploit_probability: float
    raw_source: str


class NormalizedAssetRecord(BaseModel):
    asset_id: str
    name: str
    asset_type: str
    ip_address: str
    criticality: str
    internet_exposed: bool
    detected_vulnerabilities: list[str]


class IngestionStatusResponse(BaseModel):
    status: str = Field(..., example="SUCCESS")
    source_type: str = Field(..., example="nvd_cve")
    records_processed: int = Field(..., example=1)
    normalized_vulnerabilities: list[NormalizedVulnerabilityRecord] = Field(default_factory=list)
    normalized_assets: list[NormalizedAssetRecord] = Field(default_factory=list)
    errors: list[str] = Field(default_factory=list)
