from fastapi import APIRouter
import logging

from app.models.schemas import DashboardDataResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["dashboard"])


@router.get("/dashboard-data", response_model=DashboardDataResponse)
async def get_dashboard_data():
    """
    Get dashboard data with analytics overview

    Returns:
        Dashboard statistics and trends
    """
    try:
        if job_market_engine is None:
            from app.main import job_market_engine as jme

            job_market_engine = jme

        # Get top skills
        top_skills = job_market_engine.get_top_skills(5)

        # Get skill radar data
        skills_radar = [
            {"skill": "Technical Skills", "value": 78},
            {"skill": "Problem Solving", "value": 72},
            {"skill": "Communication", "value": 65},
            {"skill": "Leadership", "value": 60},
            {"skill": "Adaptability", "value": 75},
        ]

        # Market demand
        market_demand = [{"skill": s["skill"], "demand": s["demand"]} for s in top_skills]

        # Score trend
        score_trend = [
            {"month": "Jan", "score": 58},
            {"month": "Feb", "score": 62},
            {"month": "Mar", "score": 65},
            {"month": "Apr", "score": 68},
            {"month": "May", "score": 70},
            {"month": "Jun", "score": 72},
        ]

        # AI Insights
        insights = [
            "Your technical skills are above average, focus on soft skills",
            "Machine Learning expertise is highly sought after in your target market",
            "Consider adding DevOps experience to increase marketability",
        ]

        return DashboardDataResponse(
            employability_score=72.0,
            score_trend=score_trend,
            skills_radar=skills_radar,
            market_demand=market_demand,
            insights=insights,
        )

    except Exception as e:
        logger.error(f"Error getting dashboard data: {str(e)}")
        return DashboardDataResponse(
            employability_score=0.0,
            score_trend=[],
            skills_radar=[],
            market_demand=[],
            insights=["Unable to load dashboard data"],
        )


@router.get("/job-trends")
async def get_job_trends(job_market_engine = None):
    """
    Get job market trends and skill demand analysis

    Returns:
        Market trends and top in-demand skills
    """
    try:
        if job_market_engine is None:
            from app.main import job_market_engine as jme

            job_market_engine = jme

        trends = job_market_engine.get_market_trends()
        top_skills = job_market_engine.get_top_skills(10)

        # Create trend data
        trend_data = [
            {"month": "Jan", "demand": 45, "salary": 95},
            {"month": "Feb", "demand": 52, "salary": 98},
            {"month": "Mar", "demand": 48, "salary": 102},
            {"month": "Apr", "demand": 61, "salary": 105},
            {"month": "May", "demand": 55, "salary": 108},
            {"month": "Jun", "demand": 67, "salary": 110},
        ]

        top_roles = [
            {"role": "Full Stack Developer", "demand": 92},
            {"role": "DevOps Engineer", "demand": 88},
            {"role": "Data Engineer", "demand": 85},
            {"role": "ML Engineer", "demand": 82},
        ]

        return {
            "trends": trend_data,
            "top_skills": top_skills[:5],
            "top_roles": top_roles,
            "timestamp": "2026-02-21",
        }

    except Exception as e:
        logger.error(f"Error getting job trends: {str(e)}")
        return {"trends": [], "top_skills": [], "top_roles": []}
