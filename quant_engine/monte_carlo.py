import json
from pathlib import Path

import numpy as np


BASE_DIR = Path(__file__).resolve().parent
PARAMETERS_FILE = BASE_DIR / "parameters.json"
MOCK_DATA_FILE = BASE_DIR.parent / "mock_data.json"


def load_json(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)


def get_exploit_probabilities(mock_data):
    probabilities = []

    def search(value):
        if isinstance(value, dict):
            for key, item in value.items():
                if key == "exploit_probability":
                    if isinstance(item, (int, float)):
                        probabilities.append(float(item))
                else:
                    search(item)

        elif isinstance(value, list):
            for item in value:
                search(item)

    search(mock_data)

    return probabilities


def run_simulation():
    parameters = load_json(PARAMETERS_FILE)
    mock_data = load_json(MOCK_DATA_FILE)

    iterations = parameters["simulation"]["iterations"]
    seed = parameters["simulation"]["random_seed"]

    min_loss = parameters["severity"]["min_usd"]
    mode_loss = parameters["severity"]["mode_usd"]
    max_loss = parameters["severity"]["max_usd"]

    probabilities = get_exploit_probabilities(mock_data)

    if not probabilities:
        raise ValueError(
            "No exploit probabilities found in mock_data.json"
        )

    rng = np.random.default_rng(seed)

    losses = np.zeros(iterations)

    for probability in probabilities:
        frequency = rng.poisson(
            lam=probability,
            size=iterations
        )

        severity = rng.triangular(
            left=min_loss,
            mode=mode_loss,
            right=max_loss,
            size=iterations
        )

        losses += frequency * severity

    eal = np.mean(losses)

    var_95 = np.percentile(losses, 95)

    tail_losses = losses[losses >= var_95]

    cvar_95 = np.mean(tail_losses)

    return {
        "iterations": iterations,
        "exploit_probabilities": probabilities,
        "eal_usd": float(eal),
        "var_95_usd": float(var_95),
        "cvar_95_usd": float(cvar_95)
    }


if __name__ == "__main__":
    results = run_simulation()

    print()
    print("======================================")
    print("       MONTE CARLO LOSS ENGINE")
    print("======================================")
    print(f"Iterations: {results['iterations']:,}")
    print(
        "Exploit probabilities:",
        results["exploit_probabilities"]
    )
    print(f"EAL:      ${results['eal_usd']:,.2f}")
    print(f"95% VaR:  ${results['var_95_usd']:,.2f}")
    print(f"95% CVaR: ${results['cvar_95_usd']:,.2f}")
    print("======================================")
    print()
