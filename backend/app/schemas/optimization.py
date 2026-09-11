from typing import Optional
from pydantic import BaseModel, Field


class SecurityControl(BaseModel):
    id: str = Field(..., example="CTRL-001")
    name: str = Field(..., example="Next-Gen EDR Deployment")
    category: str = Field(..., example="Endpoint Security")
    cost_usd: float = Field(..., example=120000.0)
    risk_reduction_factor: float = Field(..., ge=0.0, le=1.0, example=0.35)
    compliance_mappings: dict[str, list[str]] = Field(
        default_factory=dict,
        example={"NIST_800_53": ["DE.CM-4"], "ISO_27001": ["A.12.2.1"]},
    )


class OptimizationRequest(BaseModel):
    budget_usd: float = Field(..., gt=0.0, example=350000.0)
    target_risk_reduction_percent: Optional[float] = Field(None, example=50.0)
    mandated_control_ids: Optional[list[str]] = Field(default_factory=list, example=["CTRL-001"])


class OptimizationResult(BaseModel):
    budget_usd: float = Field(..., example=350000.0)
    selected_control_ids: list[str] = Field(..., example=["CTRL-001", "CTRL-003", "CTRL-005"])
    total_investment_cost_usd: float = Field(..., example=340000.0)
    pre_control_eal_usd: float = Field(..., example=1250000.0)
    post_control_eal_usd: float = Field(..., example=397250.0)
    net_risk_reduction_usd: float = Field(..., example=852750.0)
    net_financial_benefit_usd: float = Field(..., example=512750.0)
    return_on_security_investment_percent: float = Field(..., example=150.81)
    post_control_var_95_usd: float = Field(..., example=714000.0)
    post_control_cvar_95_usd: float = Field(..., example=969000.0)
    algorithm_version: str = Field(default="OR-Tools MILP v1.0 (Member 4)")


class OptimizationResponse(BaseModel):
    request_budget: float
    selected_controls: list[SecurityControl]
    summary: OptimizationResult
