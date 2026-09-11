from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "cyberquant_worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
)


@celery_app.task(name="app.core.celery_app.ping_worker")
def ping_worker() -> str:
    """Sample background ping task for asynchronous worker validation."""
    return "pong"
