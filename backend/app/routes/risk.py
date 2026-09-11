from fastapi import APIRouter
from app.schemas.financial import FinancialRiskResponse
from app.services.risk_service import risk_service

router = APIRouter(prefix="/risk", tags=["Financial Risk Engine (Member 4)"])


@router.get(
    "/financial",
    response_model=FinancialRiskResponse,
    summary="Get Monte Carlo financial risk metrics (EAL, 95% VaR, 95% CVaR)",
)
def get_financial_risk():
    """
    Retrieve Expected Annual Loss (EAL), 95% Value at Risk (VaR), and 95% Conditional VaR.
    Member 4 Integration Endpoint: Monte Carlo simulation metrics.
    """
    return risk_service.get_financial_risk_summary()
