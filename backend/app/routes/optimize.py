from fastapi import APIRouter
from app.schemas.optimization import OptimizationRequest, OptimizationResponse
from app.services.optimize_service import optimize_service

router = APIRouter(prefix="/optimize", tags=["Investment Optimizer (Member 4)"])


@router.post(
    "",
    response_model=OptimizationResponse,
    summary="Optimize security control selection under budget constraint and calculate ROSI",
)
def optimize_controls(request: OptimizationRequest):
    """
    Optimize security control allocation for a specified budget constraint.
    Member 4 Integration Endpoint: OR-Tools MILP optimization & ROSI calculation.
    """
    return optimize_service.optimize_security_investment(request)
