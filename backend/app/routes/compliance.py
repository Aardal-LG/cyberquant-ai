from fastapi import APIRouter
from app.schemas.compliance import ComplianceResponse
from app.services.topology_service import topology_service

router = APIRouter(prefix="/compliance", tags=["Compliance Mapping (Member 2)"])


@router.get(
    "",
    response_model=ComplianceResponse,
    summary="Get compliance framework mappings (NIST, ISO 27001, CIS)",
)
def get_compliance():
    """
    Retrieve security control mappings across compliance frameworks.
    Member 2 Integration Endpoint: Compliance mapping matrix.
    """
    return topology_service.get_compliance_mappings()
