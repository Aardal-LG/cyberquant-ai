"""
Optimize Service — Integration interface for Member 4 (OR-Tools Knapsack / MILP Optimization & ROSI Calculator).

Member 4 Integration Note:
Plug in your OR-Tools MILP solver logic to optimize security control selection dynamically based on budget constraints.
"""

from app.schemas.optimization import OptimizationRequest, OptimizationResponse, OptimizationResult, SecurityControl
from app.services.mock_loader import mock_loader


class OptimizeService:
    def optimize_security_investment(self, request: OptimizationRequest) -> OptimizationResponse:
        raw_controls = mock_loader.get_controls()
        controls_list = [SecurityControl(**c) for c in raw_controls]
        
        # Simple greedy knapsack heuristic algorithm for mock execution
        # (Member 4 will replace with OR-Tools MILP solver)
        budget = request.budget_usd
        sorted_controls = sorted(
            controls_list,
            key=lambda c: (c.risk_reduction_factor / c.cost_usd) if c.cost_usd > 0 else 0,
            reverse=True,
        )
        
        selected_controls: list[SecurityControl] = []
        total_cost = 0.0
        combined_risk_reduction = 0.0
        
        # Mandatory controls first
        if request.mandated_control_ids:
            for ctrl in controls_list:
                if ctrl.id in request.mandated_control_ids and ctrl.cost_usd <= budget - total_cost:
                    selected_controls.append(ctrl)
                    total_cost += ctrl.cost_usd
                    combined_risk_reduction += ctrl.risk_reduction_factor
        
        # Fill remaining budget
        for ctrl in sorted_controls:
            if ctrl not in selected_controls and (total_cost + ctrl.cost_usd <= budget):
                selected_controls.append(ctrl)
                total_cost += ctrl.cost_usd
                combined_risk_reduction += ctrl.risk_reduction_factor
        
        pre_eal = 1250000.0
        # Diminishing returns formula for risk reduction
        effective_reduction_percent = min(0.85, combined_risk_reduction * 0.9)
        post_eal = round(pre_eal * (1.0 - effective_reduction_percent), 2)
        net_risk_reduction = round(pre_eal - post_eal, 2)
        net_financial_benefit = round(net_risk_reduction - total_cost, 2)
        rosi = round((net_financial_benefit / total_cost) * 100.0, 2) if total_cost > 0 else 0.0
        
        summary = OptimizationResult(
            budget_usd=budget,
            selected_control_ids=[c.id for c in selected_controls],
            total_investment_cost_usd=total_cost,
            pre_control_eal_usd=pre_eal,
            post_control_eal_usd=post_eal,
            net_risk_reduction_usd=net_risk_reduction,
            net_financial_benefit_usd=net_financial_benefit,
            return_on_security_investment_percent=rosi,
            post_control_var_95_usd=round(post_eal * 1.8, 2),
            post_control_cvar_95_usd=round(post_eal * 2.4, 2),
            algorithm_version="OR-Tools MILP v1.0 (Member 4 Integration Stub)",
        )
        
        return OptimizationResponse(
            request_budget=budget,
            selected_controls=selected_controls,
            summary=summary,
        )


optimize_service = OptimizeService()
