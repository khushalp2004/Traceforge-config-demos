from fastapi import APIRouter
from app.core.config import settings
import sys

router = APIRouter()

@router.get("/")
async def get_dashboard():
    return {
        "service": settings.PROJECT_NAME,
        "status": "running",
        "environment": settings.ENVIRONMENT,
        "pythonVersion": f"{sys.version_info.major}.{sys.version_info.minor}"
    }

@router.get("/dashboard")
async def get_dashboard_stats():
    return {
        "uptime": "1d 2h",
        "requests": 123,
        "errors": 4,
        "memoryUsage": "50MB",
        "cpuUsage": "2%",
        "activeConnections": 12
    }
