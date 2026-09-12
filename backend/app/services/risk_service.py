"""
Risk Service — Integration interface for Member 4 (Monte Carlo Financial Risk Engine).

Member 4 Integration Note:
Plug in your Monte Carlo simulation engine (e.g. 10,000 iterations using log-normal or PERT distributions)
to replace or supplement the contract values below.
"""

from app.schemas.financial import FinancialRiskMetrics, FinancialRiskResponse, LossDistributionSample
from app.services.mock_loader import mock_loader
from app.services.ml_service import ml_service
from quant_engine.run_engine import run_engine

class RiskService:
    def get_financial_risk_summary(self) -> FinancialRiskResponse:
        metrics_dict = mock_loader.get_risk_metrics()
        predictions = ml_service.predict_vulnerabilities(mock_loader.get_vulnerabilities())
        quant_results = run_engine(exploit_probabilities=predictions.values())
        metrics = FinancialRiskMetrics(
            composite_technical_risk_score=metrics_dict.get("composite_technical_risk_score", 78.4),
            expected_annual_loss_usd=quant_results["monte_carlo"]["eal_usd"],
            value_at_risk_95_usd=quant_results["monte_carlo"]["var_95_usd"],
            conditional_var_95_usd=quant_results["monte_carlo"]["cvar_95_usd"],
            annual_loss_frequency=metrics_dict.get("annual_loss_frequency", 4.2),
            average_loss_magnitude_usd=metrics_dict.get("average_loss_magnitude_usd", 297619.0),
            high_risk_asset_count=metrics_dict.get("high_risk_asset_count", 7),
            critical_vulnerability_count=metrics_dict.get("critical_vulnerability_count", 3),
        )
        
        loss_distribution = [
            LossDistributionSample(percentile="P50 (Median)", loss_usd=980000.0),
            LossDistributionSample(percentile="P75", loss_usd=1450000.0),
            LossDistributionSample(percentile="P90", loss_usd=1820000.0),
            LossDistributionSample(percentile="P95 (VaR)", loss_usd=metrics.value_at_risk_95_usd),
            LossDistributionSample(percentile="P99 (Tail)", loss_usd=3200000.0),
            LossDistributionSample(percentile="95% CVaR (Expected Tail Loss)", loss_usd=metrics.conditional_var_95_usd),
        ]
        
        return FinancialRiskResponse(
            metrics=metrics,
            simulation_method="Monte Carlo 10,000 Iterations (Member 4 Quant Engine)",

            loss_distribution=loss_distribution,
        )


risk_service = RiskService()
