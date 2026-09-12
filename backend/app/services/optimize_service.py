"""
Optimize Service — Integration interface for Member 4 (OR-Tools Knapsack / MILP Optimization & ROSI Calculator).

Member 4 Integration Note:
Plug in your OR-Tools MILP solver logic to optimize security control selection dynamically based on budget constraints.
"""
from quant_engine.run_engine import run_engine
from app.schemas.optimization import OptimizationRequest, OptimizationResponse, OptimizationResult, SecurityControl
from app.services.mock_loader import mock_loader
from app.services.ml_service import ml_service


class OptimizeService:
    def optimize_security_investment(self, request: OptimizationRequest) -> OptimizationResponse:
        predictions = ml_service.predict_vulnerabilities(mock_loader.get_vulnerabilities())
        quant_results = run_engine(
            exploit_probabilities=predictions.values(),
            budget_usd=request.budget_usd,
            mandated_control_ids=request.mandated_control_ids,
        )

        optimization = quant_results["optimization"]
        financial = quant_results["financial_impact"]
        monte_carlo = quant_results["monte_carlo"]

        selected_ids = optimization["selected_control_ids"]

        raw_controls = mock_loader.get_controls()
        controls_list = [SecurityControl(**c) for c in raw_controls]

        selected_controls = [
            ctrl for ctrl in controls_list
            if ctrl.id in selected_ids
        ]

        summary = OptimizationResult(
            budget_usd=optimization["budget_usd"],
            selected_control_ids=selected_ids,
            total_investment_cost_usd=optimization["total_investment_cost_usd"],
            pre_control_eal_usd=monte_carlo["eal_usd"],
            post_control_eal_usd=financial["post_control_eal_usd"],
            net_risk_reduction_usd=financial["net_risk_reduction_usd"],
            net_financial_benefit_usd=financial["net_risk_reduction_usd"] - optimization["total_investment_cost_usd"],
            return_on_security_investment_percent=financial["rosi_percent"],
            post_control_var_95_usd=monte_carlo["var_95_usd"],
            post_control_cvar_95_usd=monte_carlo["cvar_95_usd"],
            algorithm_version="OR-Tools MILP v1.0 (Member 4 Quant Engine)",
        )

        return OptimizationResponse(
            request_budget=request.budget_usd,
            selected_controls=selected_controls,
            summary=summary,
        )
optimize_service = OptimizeService()

