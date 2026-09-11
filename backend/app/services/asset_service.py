from typing import Optional
from app.schemas.asset import AssetListResponse, AssetResponse
from app.services.mock_loader import mock_loader


class AssetService:
    def get_all_assets(self, criticality: Optional[str] = None) -> AssetListResponse:
        raw_assets = mock_loader.get_assets()
        
        parsed_assets = []
        for a in raw_assets:
            if criticality and a.get("criticality", "").upper() != criticality.upper():
                continue
            
            # Simple technical risk score estimation for demo
            base_score = 50.0
            if a.get("criticality") == "CRITICAL":
                base_score += 30.0
            elif a.get("criticality") == "HIGH":
                base_score += 20.0
            
            if a.get("internet_exposed"):
                base_score += 15.0
            
            if len(a.get("associated_vulnerabilities", [])) > 0:
                base_score += 10.0 * len(a.get("associated_vulnerabilities", []))
            
            risk_score = min(100.0, round(base_score, 1))
            
            parsed_assets.append(
                AssetResponse(
                    id=a["id"],
                    name=a["name"],
                    type=a["type"],
                    ip_address=a["ip_address"],
                    criticality=a["criticality"],
                    internet_exposed=a["internet_exposed"],
                    owner=a.get("owner"),
                    associated_vulnerabilities=a.get("associated_vulnerabilities", []),
                    security_posture=a["security_posture"],
                    risk_score=risk_score,
                )
            )

        return AssetListResponse(total=len(parsed_assets), assets=parsed_assets)

    def get_asset_by_id(self, asset_id: str) -> Optional[AssetResponse]:
        assets_res = self.get_all_assets()
        for asset in assets_res.assets:
            if asset.id == asset_id:
                return asset
        return None


asset_service = AssetService()
