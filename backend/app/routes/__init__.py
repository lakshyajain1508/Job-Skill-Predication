from .analyze import router as analyze_router
from .skill_gap import router as skill_gap_router
from .roadmap import router as roadmap_router
from .dashboard import router as dashboard_router

__all__ = [
    "analyze_router",
    "skill_gap_router",
    "roadmap_router",
    "dashboard_router",
]
