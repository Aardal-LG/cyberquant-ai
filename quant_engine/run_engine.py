import json

from monte_carlo import run_simulation
from optimizer import optimize_controls
from rosi import calculate_rosi,load_parameters
def run_engine():
    parameters = load_parameters()

    monte_carlo_results = run_simulation()

    optimization_results = optimize_controls()

    rosi_results = calculate_rosi(
        monte_carlo_results,
        optimization_results,
        parameters
    )

    return {
        "monte_carlo": {
            "iterations": monte_carlo_results["iterations"],
            "exploit_probabilities": monte_carlo_results[
                "exploit_probabilities"
            ],
            "eal_usd": monte_carlo_results["eal_usd"],
            "var_95_usd": monte_carlo_results["var_95_usd"],
            "cvar_95_usd": monte_carlo_results["cvar_95_usd"]
        },

        "optimization": {
            "budget_usd": optimization_results["budget_usd"],
            "selected_control_ids": optimization_results[
                "selected_control_ids"
            ],
            "total_investment_cost_usd": optimization_results[
                "total_investment_cost_usd"
            ],
            "total_risk_reduction_score": optimization_results[
                "total_risk_reduction_score"
            ]
        },

        "financial_impact": {
            "post_control_eal_usd": rosi_results[
                "post_control_eal_usd"
            ],
            "net_risk_reduction_usd": rosi_results[
                "net_risk_reduction_usd"
            ],
            "combined_risk_reduction": rosi_results[
                "combined_risk_reduction"
            ],
            "rosi_percent": rosi_results["rosi_percent"]
        }
    }
if __name__ == "__main__":
	results = run_engine()
	print(json.dumps(results,indent=2))
