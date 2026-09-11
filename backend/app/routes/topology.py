from fastapi import APIRouter
from app.schemas.topology import TopologyResponse
from app.services.topology_service import topology_service

router = APIRouter(prefix="/topology", tags=["Asset Topology & Neo4j (Member 2)"])


@router.get(
    "",
    response_model=TopologyResponse,
    summary="Get network graph nodes, edges, user access, and critical attack paths",
)
def get_topology():
    """
    Retrieve asset topology network graph and critical attack path traversals.
    Member 2 Integration Endpoint: Neo4j graph & attack path algorithm.
    """
    return topology_service.get_topology_graph()
