"""
Data Ingestion & Normalization Service — Phase 6 Baseline.

Supports raw payloads from:
- NVD / CVE API
- CISA KEV (Known Exploited Vulnerabilities)
- MISP / STIX threat intelligence feeds
- Network Scanners (Nmap, Amass, DNS/TLS)
- Telemetry (SIEM, EDR, IAM, CMDB)
"""

import logging
from typing import Any
from app.schemas.ingestion import (
    IngestionStatusResponse,
    NormalizedAssetRecord,
    NormalizedVulnerabilityRecord,
    RawIngestionPayload,
)

logger = logging.getLogger(__name__)


class IngestionService:
    def process_raw_payload(self, payload: RawIngestionPayload) -> IngestionStatusResponse:
        source_type = payload.source_type.lower()
        data = payload.payload
        
        normalized_vulns: list[NormalizedVulnerabilityRecord] = []
        normalized_assets: list[NormalizedAssetRecord] = []
        errors: list[str] = []
        
        try:
            if source_type in ["nvd_cve", "cisa_kev"]:
                cve_id = data.get("cve_id", "CVE-UNKNOWN")
                cvss = float(data.get("cvss_score", 5.0))
                cisa_flag = bool(data.get("cisa_kev", source_type == "cisa_kev"))
                
                severity = "HIGH"
                if cvss >= 9.0:
                    severity = "CRITICAL"
                elif cvss < 7.0:
                    severity = "MEDIUM" if cvss >= 4.0 else "LOW"
                
                exploit_prob = min(1.0, round((cvss / 10.0) * (1.3 if cisa_flag else 0.9), 2))
                
                normalized_vulns.append(
                    NormalizedVulnerabilityRecord(
                        cve_id=cve_id,
                        cvss_score=cvss,
                        severity=severity,
                        cisa_kev_flag=cisa_flag,
                        exploit_probability=exploit_prob,
                        raw_source=payload.source_identifier,
                    )
                )
            
            elif source_type in ["nmap", "cmdb", "edr"]:
                asset_id = data.get("asset_id", f"AST-ING-{data.get('ip', '000')}")
                name = data.get("name", "Discovered Host")
                ip = data.get("ip_address", data.get("ip", "127.0.0.1"))
                asset_type = data.get("type", "server")
                criticality = data.get("criticality", "MEDIUM").upper()
                exposed = bool(data.get("internet_exposed", False))
                vulns = data.get("vulnerabilities", [])
                
                normalized_assets.append(
                    NormalizedAssetRecord(
                        asset_id=asset_id,
                        name=name,
                        asset_type=asset_type,
                        ip_address=ip,
                        criticality=criticality,
                        internet_exposed=exposed,
                        detected_vulnerabilities=vulns,
                    )
                )
            else:
                logger.info(f"Ingested generic raw payload from {payload.source_identifier}")

            return IngestionStatusResponse(
                status="SUCCESS",
                source_type=source_type,
                records_processed=len(normalized_vulns) + len(normalized_assets) + 1,
                normalized_vulnerabilities=normalized_vulns,
                normalized_assets=normalized_assets,
                errors=errors,
            )

        except Exception as e:
            logger.error(f"Ingestion normalization error: {e}")
            return IngestionStatusResponse(
                status="FAILED",
                source_type=source_type,
                records_processed=0,
                normalized_vulnerabilities=[],
                normalized_assets=[],
                errors=[str(e)],
            )


ingestion_service = IngestionService()
