from typing import Optional
from pydantic import BaseModel, Field


class SecurityPosture(BaseModel):
    patch_level: str = Field(..., example="outdated")
    edr_installed: bool = Field(..., example=True)
    mfa_enabled: bool = Field(..., example=True)
    encryption_at_rest: bool = Field(..., example=True)


class AssetBase(BaseModel):
    id: str = Field(..., example="AST-001")
    name: str = Field(..., example="Core Banking DB Cluster")
    type: str = Field(..., example="database")
    ip_address: str = Field(..., example="10.0.1.15")
    criticality: str = Field(..., example="CRITICAL")
    internet_exposed: bool = Field(..., example=False)
    owner: Optional[str] = Field(None, example="Finance Tech Ops")
    associated_vulnerabilities: list[str] = Field(default_factory=list, example=["CVE-2021-44228"])
    security_posture: SecurityPosture


class AssetResponse(AssetBase):
    risk_score: Optional[float] = Field(None, example=85.5)


class AssetListResponse(BaseModel):
    total: int
    assets: list[AssetResponse]
