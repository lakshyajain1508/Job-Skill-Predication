from fastapi import APIRouter, Body
from typing import List
import logging

from app.models.schemas import SkillGapResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["skill-gap"])

# Dependencies
gap_analyzer = None  # Will be injected from main.py


def set_gap_analyzer(analyzer):
    """Set the gap_analyzer instance"""
    global gap_analyzer
    gap_analyzer = analyzer


@router.post("/skill-gap", response_model=SkillGapResponse)
async def analyze_skill_gap(
    skills: List[str] = Body(..., embed=True),
    target_role: str = Body(None, embed=True),
):
    """
    Analyze skill gap between user and market requirements

    Args:
        skills: List of user's current skills
        target_role: Target job role
    """
    try:
        analyzer = gap_analyzer
        if analyzer is None:
            from app.main import gap_analyzer as ga
            analyzer = ga

        target_role = target_role or "Software Engineer"

        # Get gap analysis
        gap_data = analyzer.analyze_gap(skills, [])

        # Get market requirements
        role_data = analyzer.job_market_engine.get_role_market_fit(target_role)
        required_skills_data = role_data.get("required_skills", [])

        current_skills = [{"skill": s, "level": 75} for s in gap_data["matching_skills"][:5]]

        required_skills = [
            {"skill": s["skill"], "level": min(int(s["demand"] / 10) * 10, 100)} for s in required_skills_data[:5]
        ]

        priority_skills = analyzer.get_priority_skills(skills, target_role)

        return SkillGapResponse(
            current_skills=current_skills,
            required_skills=required_skills,
            gap_percentage=gap_data["gap_percentage"],
            priority_skills=priority_skills,
        )

    except Exception as e:
        logger.error(f"Error analyzing skill gap: {str(e)}")
        return SkillGapResponse(
            current_skills=[],
            required_skills=[],
            gap_percentage=0.0,
            priority_skills=[],
        )
