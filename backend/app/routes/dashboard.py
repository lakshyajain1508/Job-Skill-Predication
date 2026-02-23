from fastapi import APIRouter
import logging
import pandas as pd

from app.models.schemas import DashboardDataResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["dashboard"])

# Dependencies
job_market_engine = None  # Will be injected from main.py


def set_job_market_engine(engine):
    """Set the job_market_engine instance"""
    global job_market_engine
    job_market_engine = engine


@router.get("/dashboard-data", response_model=DashboardDataResponse)
async def get_dashboard_data():
    """
    Get dashboard data with analytics overview

    Returns:
        Dashboard statistics and trends
    """
    try:
        engine = job_market_engine
        if engine is None:
            from app.main import job_market_engine as jme
            engine = jme

        # Get top skills
        top_skills = engine.get_top_skills(5)

        # Get skill radar data
        skills_radar = [
            {"skill": "Technical Skills", "value": 78},
            {"skill": "Problem Solving", "value": 72},
            {"skill": "Communication", "value": 65},
            {"skill": "Leadership", "value": 60},
            {"skill": "Adaptability", "value": 75},
        ]

        # Market demand (dataset-driven)
        market_demand = [{"skill": s["skill"], "demand": s["demand"]} for s in top_skills if s.get("skill")]

        # Score trend
        score_trend = [
            {"month": "Jan", "score": 58},
            {"month": "Feb", "score": 62},
            {"month": "Mar", "score": 65},
            {"month": "Apr", "score": 68},
            {"month": "May", "score": 70},
            {"month": "Jun", "score": 72},
        ]

        # AI Insights from dataset demand
        insights = []
        if top_skills:
            insights.append(f"Top in-demand skill in current dataset: {top_skills[0]['skill']} ({top_skills[0]['demand']}%)")
            if len(top_skills) > 1:
                insights.append(f"Also prioritize {top_skills[1]['skill']} to improve market fit")
        if not insights:
            insights = ["No market-demand insights available from dataset yet"]

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
async def get_job_trends():
    """
    Get job market trends and skill demand analysis

    Returns:
        Market trends and top in-demand skills
    """
    try:
        engine = job_market_engine
        if engine is None:
            from app.main import job_market_engine as jme
            engine = jme

        trends = engine.get_market_trends()
        top_skills = engine.get_top_skills(10)

        # Build monthly trend data from posting dates when available
        trend_data = []
        market_df = getattr(engine.dataset_loader, "job_market_df", None)
        if market_df is not None and "posting_date" in market_df.columns:
            try:
                dates = pd.to_datetime(market_df["posting_date"], errors="coerce")
                monthly = dates.dropna().dt.to_period("M").value_counts().sort_index()
                for period, count in monthly.tail(6).items():
                    trend_data.append({"month": period.strftime("%b"), "demand": int(count)})
            except Exception:
                trend_data = []

        # Fallback when posting_date is unavailable
        if not trend_data:
            for i, skill in enumerate(top_skills[:6], start=1):
                trend_data.append({"month": f"M{i}", "demand": float(skill.get("demand", 0))})

        # Build top roles from job titles in available datasets
        top_roles = []
        role_frames = []
        if market_df is not None and "job_title" in market_df.columns:
            role_frames.append(market_df["job_title"].dropna().astype(str))

        ds_df = getattr(engine.dataset_loader, "data_science_df", None)
        if ds_df is not None and "job_title" in ds_df.columns:
            role_frames.append(ds_df["job_title"].dropna().astype(str))

        if role_frames:
            combined = pd.concat(role_frames, ignore_index=True)
            counts = combined.value_counts().head(5)
            total = int(counts.sum()) if len(counts) > 0 else 1
            for role, cnt in counts.items():
                top_roles.append({"role": role, "demand": round((int(cnt) / total) * 100, 2)})

        return {
            "trends": trend_data,
            "top_skills": top_skills[:5],
            "top_roles": top_roles,
            "timestamp": "2026-02-21",
        }

    except Exception as e:
        logger.error(f"Error getting job trends: {str(e)}")
        return {"trends": [], "top_skills": [], "top_roles": []}
