import json
import logging
from pathlib import Path
from typing import Any, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)


class MockDataLoader:
    _instance: Optional["MockDataLoader"] = None
    _data: Optional[dict[str, Any]] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MockDataLoader, cls).__new__(cls)
        return cls._instance

    def load_data(self, reload: bool = False) -> dict[str, Any]:
        if self._data is not None and not reload:
            return self._data

        file_path = Path(settings.MOCK_DATA_PATH)
        if not file_path.exists():
            # Fallback check relative to execution directory
            fallback_path = Path.cwd() / "mock_data.json"
            if fallback_path.exists():
                file_path = fallback_path
            else:
                logger.error(f"mock_data.json contract not found at {file_path}")
                raise FileNotFoundError(f"Master mock_data.json contract missing at {file_path}")

        try:
            with open(file_path, "r", encoding="utf-8") as f:
                self._data = json.load(f)
                logger.info(f"Loaded master mock_data.json v{self._data.get('schema_version', '1.0')} from {file_path}")
                return self._data
        except Exception as e:
            logger.error(f"Failed to parse mock_data.json: {e}")
            raise e

    def get_assets(self) -> list[dict[str, Any]]:
        data = self.load_data()
        return data.get("assets", [])

    def get_vulnerabilities(self) -> list[dict[str, Any]]:
        data = self.load_data()
        return data.get("vulnerabilities", [])

    def get_network_connections(self) -> list[dict[str, Any]]:
        data = self.load_data()
        return data.get("network_connections", [])

    def get_users(self) -> list[dict[str, Any]]:
        data = self.load_data()
        return data.get("users", [])

    def get_risk_metrics(self) -> dict[str, Any]:
        data = self.load_data()
        return data.get("risk_metrics", {})

    def get_controls(self) -> list[dict[str, Any]]:
        data = self.load_data()
        return data.get("controls", [])

    def get_optimization_results(self) -> dict[str, Any]:
        data = self.load_data()
        return data.get("optimization_results", {})


mock_loader = MockDataLoader()
