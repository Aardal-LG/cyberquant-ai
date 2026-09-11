import json
from pathlib import Path

from monte_carlo import run_simulation
from optimizer import optimize_controls


BASE_DIR = Path(__file__).resolve().parent
PARAMETERS_FILE = BASE_DIR / "parameters.json"


def load_parameters():
    with open(PARAMETERS_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def calculate_combined_reduction(selected_controls, controls):
    reduction_remaining = 1.0

    for control in controls:
        if control["id"] in selected_controls:
            factor = control["risk_reduction_factor"]
            reduction_remaining *= (1 - factor)

    return 1 - reduction_remaining


def calculate_rosi(simulation, optimization, parameters):
    pre_control_eal = simulation["eal_usd"]

    selected_controls = optimization["selected_control_ids"]
    investment = optimization["total_investment_cost_usd"]

    combined_reduction = calculate_combined_reduction(
        selected_controls,
        parameters["controls"]
    )

    post_control_eal = pre_control_eal * (
        1 - combined_reduction
    )

    net_risk_reduction = (
        pre_control_eal - post_control_eal
    )

    rosi_percent = (
        (net_risk_reduction - investment)
        / investment
    ) * 100

    return {
        "pre_control_eal_usd": pre_control_eal,
        "post_control_eal_usd": post_control_eal,
        "net_risk_reduction_usd": net_risk_reduction,
        "investment_usd": investment,
        "combined_risk_reduction": combined_reduction,
        "rosi_percent": rosi_percent,
        "selected_control_ids": selected_controls
    }
if __name__ == "__main__":
    result = calculate_rosi()

    print()
    print("======================================")
    print("       FINANCIAL RISK & ROSI")
    print("======================================")

    print(
        f"Pre-control EAL:  "
        f"${result['pre_control_eal_usd']:,.2f}"
    )

    print(
        f"Post-control EAL: "
        f"${result['post_control_eal_usd']:,.2f}"
    )

    print(
        f"Net risk reduction: "
        f"${result['net_risk_reduction_usd']:,.2f}"
    )

    print(
        f"Investment: "
        f"${result['investment_usd']:,.2f}"
    )

    print(
        f"Combined risk reduction: "
        f"{result['combined_risk_reduction'] * 100:.2f}%"
    )

    print(
        f"ROSI: "
        f"{result['rosi_percent']:.2f}%"
    )

    print(
        "Selected controls:",
        ", ".join(result["selected_control_ids"])
    )

    print("======================================")
    print()
