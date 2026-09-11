from typing import Optional
from pydantic import BaseModel, Field


class NetworkConnection(BaseModel):
    source_asset_id: str = Field(..., example="AST-005")
    target_asset_id: str = Field(..., example="AST-002")
    port: int = Field(..., example=443)
    protocol: str = Field(..., example="HTTPS")
    relationship_type: str = Field(..., example="routes_traffic_to")


class UserAccessInfo(BaseModel):
    user_id: str = Field(..., example="USR-001")
    username: str = Field(..., example="admin_jdoe")
    full_name: str = Field(..., example="John Doe")
    role: str = Field(..., example="Domain Admin")
    access_level: str = Field(..., example="PRIVILEGED")
    accessible_assets: list[str] = Field(..., example=["AST-001", "AST-004"])


class AttackPathHop(BaseModel):
    step_number: int = Field(..., example=1)
    asset_id: str = Field(..., example="AST-005")
    asset_name: str = Field(..., example="Kubernetes Ingress Gateway")
    cve_id: Optional[str] = Field(None, example="CVE-2024-21626")
    vulnerability_name: Optional[str] = Field(None, example="runc Container Breakout")
    exploit_probability: float = Field(..., example=0.76)


class AttackPath(BaseModel):
    path_id: str = Field(..., example="PATH-001")
    entry_point_asset_id: str = Field(..., example="AST-005")
    target_asset_id: str = Field(..., example="AST-001")
    cumulative_exploit_probability: float = Field(..., example=0.62)
    path_length: int = Field(..., example=3)
    hops: list[AttackPathHop]


class TopologyResponse(BaseModel):
    total_nodes: int = Field(..., example=20)
    total_edges: int = Field(..., example=8)
    network_connections: list[NetworkConnection]
    users: list[UserAccessInfo]
    critical_attack_paths: list[AttackPath]
    neo4j_status: str = Field(default="Connected (Member 2 Integration Stub)")
