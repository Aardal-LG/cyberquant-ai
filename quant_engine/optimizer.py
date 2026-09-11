import json
from pathlib import Path

from ortools.linear_solver import pywraplp


BASE_DIR = Path(__file__).resolve().parent
PARAMETERS_FILE = BASE_DIR / "parameters.json"


def load_parameters():
    with open(PARAMETERS_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def optimize_controls():
    parameters = load_parameters()

    budget = parameters["budget"]["total_usd"]
    controls = parameters["controls"]

    solver = pywraplp.Solver.CreateSolver("SCIP")

    if solver is None:
        raise RuntimeError("OR-Tools SCIP solver is unavailable")

    decisions = {}

    for control in controls:
        control_id = control["id"]

        decisions[control_id] = solver.IntVar(
            0,
            1,
            f"select_{control_id}"
        )

    solver.Add(
        sum(
            control["cost_usd"] * decisions[control["id"]]
            for control in controls
        )
        <= budget
    )

    solver.Maximize(
        sum(
            control["risk_reduction_factor"]
            * decisions[control["id"]]
            for control in controls
        )
    )

    status = solver.Solve()

    if status != pywraplp.Solver.OPTIMAL:
        raise RuntimeError("No optimal solution found")

    selected_controls = []
    total_cost = 0.0
    total_reduction_score = 0.0

    for control in controls:
        control_id = control["id"]

        if decisions[control_id].solution_value() > 0.5:
            selected_controls.append(control_id)

            total_cost += control["cost_usd"]
            total_reduction_score += control["risk_reduction_factor"]

    return {
        "budget_usd": budget,
        "selected_control_ids": selected_controls,
        "total_investment_cost_usd": total_cost,
        "total_risk_reduction_score": total_reduction_score
    }


if __name__ == "__main__":
    result = optimize_controls()

    print()
    print("======================================")
    print("         BUDGET OPTIMIZER")
    print("======================================")
    print(f"Budget: ${result['budget_usd']:,.2f}")
    print(
        "Selected controls:",
        ", ".join(result["selected_control_ids"])
    )
    print(
        f"Total investment: "
        f"${result['total_investment_cost_usd']:,.2f}"
    )
    print(
        f"Risk reduction score: "
        f"{result['total_risk_reduction_score']:.2f}"
    )
    print("======================================")
    print()
