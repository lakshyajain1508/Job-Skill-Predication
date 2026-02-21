from fastapi import APIRouter, Body
from typing import List
import logging

from app.models.schemas import RoadmapResponse, RoadmapWeek

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["roadmap"])


@router.post("/generate-roadmap", response_model=RoadmapResponse)
async def generate_roadmap(
    targetRole: str = Body(..., embed=True),
    targetSkills: List[str] = Body(default=[], embed=True),
    currentExperience: int = Body(default=0, embed=True),
):
    """
    Generate personalized career learning roadmap

    Args:
        targetRole: Target career role
        targetSkills: Skills to focus on
        currentExperience: Experience in months
        roadmap_generator: Service instance
    """
    try:
        if roadmap_generator is None:
            from app.main import roadmap_generator as rg

            roadmap_generator = rg

        # Generate roadmap
        roadmap_data = roadmap_generator.generate_roadmap(targetRole, targetSkills, currentExperience)

        # Convert to response format
        weeks = [
            RoadmapWeek(
                week=w["week"],
                focus=w["focus"],
                tasks=w["tasks"],
                difficulty=_get_difficulty(w["estimatedHours"]),
                estimatedHours=w["estimatedHours"],
            )
            for w in roadmap_data["weeks"]
        ]

        return RoadmapResponse(
            weeks=weeks,
            totalHours=roadmap_data["total_hours"],
            targetRole=targetRole,
        )

    except Exception as e:
        logger.error(f"Error generating roadmap: {str(e)}")
        # Return empty roadmap
        return RoadmapResponse(
            weeks=[],
            totalHours=0,
            targetRole=targetRole,
        )


def _get_difficulty(hours: int) -> str:
    """Determine difficulty from hours"""
    if hours >= 25:
        return "Advanced"
    elif hours >= 20:
        return "Intermediate"
    else:
        return "Beginner"
