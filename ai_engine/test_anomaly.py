import pandas as pd

from anomaly_model import detect_anomalies


logs = pd.read_csv("ai_engine/data/logs.csv")

result = detect_anomalies(logs)

print("Number of anomalies:", result["is_anomaly"].sum())

print("\nAnomalies:")
print(
    result[result["is_anomaly"]]
)