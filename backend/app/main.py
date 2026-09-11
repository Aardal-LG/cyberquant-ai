from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routes import assets, compliance, ingestion, optimize, risk, threats, topology

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "CyberQuant AI — Continuous Cyber Risk Quantification & Investment Optimization Backend REST API. "
        "Unified integration gateway for Neo4j attack paths (Member 2), ML threat intelligence (Member 3), "
        "and Monte Carlo / OR-Tools optimization (Member 4)."
    ),
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# Set CORS Middlewares
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.get("/health", tags=["Health & System"])
def health_check():
    """System health check endpoint."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }


# Include V1 Routers
api_v1_prefix = settings.API_V1_STR
app.include_router(assets.router, prefix=api_v1_prefix)
app.include_router(threats.router, prefix=api_v1_prefix)
app.include_router(risk.router, prefix=api_v1_prefix)
app.include_router(optimize.router, prefix=api_v1_prefix)
app.include_router(compliance.router, prefix=api_v1_prefix)
app.include_router(topology.router, prefix=api_v1_prefix)
app.include_router(ingestion.router, prefix=api_v1_prefix)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
