from typing import Optional
from pydantic import BaseModel, Field


class FinancialRiskMetrics(BaseModel):
    composite_technical_risk_score: float = Field(..., example=78.4)
    expected_annual_loss_usd: float = Field(..., example=1250000.0)
    value_at_risk_95_usd: float = Field(..., example=2100000.0)
    conditional_var_95_usd: float = Field(..., example=2850000.0)
    annual_loss_frequency: float = Field(..., example=4.2)
    average_loss_magnitude_usd: float = Field(..., example=297619.0)
    high_risk_asset_count: int = Field(..., example=7)
    critical_vulnerability_count: int = Field(..., example=3)


class LossDistributionSample(BaseModel):
    percentile: str = Field(..., example="P95")
    loss_usd: float = Field(..., example=2100000.0)


class FinancialRiskResponse(BaseModel):
    metrics: FinancialRiskMetrics
    simulation_method: str = Field(default="Monte Carlo 10,000 Iterations (Member 4)")
    loss_distribution: Optional[list[LossDistributionSample]] = None
