from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status

from app.schemas.asset import AssetListResponse, AssetResponse
from app.services.asset_service import asset_service

router = APIRouter(prefix="/assets", tags=["Assets"])


@router.get("", response_model=AssetListResponse, summary="Get all inventory assets")
def get_assets(
    criticality: Optional[str] = Query(
        None, description="Filter by criticality: CRITICAL, HIGH, MEDIUM, LOW"
    )
):
    """Retrieve asset inventory list with security posture and technical risk scores."""
    return asset_service.get_all_assets(criticality=criticality)


@router.get(
    "/{asset_id}", response_model=AssetResponse, summary="Get specific asset details"
)
def get_asset_details(asset_id: str):
    """Fetch details for a single asset by unique asset ID."""
    asset = asset_service.get_asset_by_id(asset_id)
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Asset with ID '{asset_id}' not found",
        )
    return asset
