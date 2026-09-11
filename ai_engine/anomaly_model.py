import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import DBSCAN


def detect_anomalies(logs):
    """
    Detect behavioral anomalies using DBSCAN.

    Parameters:
        logs (pandas.DataFrame):
            Login/network behavioral logs.

    Returns:
        pandas.DataFrame:
            Original logs with cluster and anomaly columns.
    """

    features = [
        "login_count",
        "failed_logins",
        "traffic_mb",
        "session_duration"
    ]

    # Select behavioral features
    X = logs[features]

    # Scale the features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Create DBSCAN model
    dbscan = DBSCAN(
        eps=0.5,
        min_samples=5
    )

    # Detect clusters/anomalies
    labels = dbscan.fit_predict(X_scaled)

    # Don't modify the original DataFrame
    result = logs.copy()

    # Add DBSCAN results
    result["cluster"] = labels

    # -1 means anomaly
    result["is_anomaly"] = labels == -1

    return result