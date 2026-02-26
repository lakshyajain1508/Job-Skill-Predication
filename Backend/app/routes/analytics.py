from __future__ import annotations

from fastapi import APIRouter, Request

from app.models.schemas import AnalyticsResponse, DashboardResponse
from app.services.analytics_engine import analytics_engine


router = APIRouter(tags=["analytics"])


@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard(request: Request) -> DashboardResponse:
    defaults = analytics_engine.get_dashboard_defaults()
    last_prediction = getattr(request.app.state, "last_prediction", None)

    if isinstance(last_prediction, dict):
        defaults["skill_match"] = int(last_prediction.get("match_score", defaults["skill_match"]))
        defaults["missing_skills_count"] = len(last_prediction.get("missing_skills", []))
        defaults["career_prediction"] = last_prediction.get("career_prediction", defaults["career_prediction"])

    return DashboardResponse(**defaults)


@router.get("/analytics", response_model=AnalyticsResponse)
def get_analytics() -> AnalyticsResponse:
    payload = analytics_engine.get_analytics_payload()
    return AnalyticsResponse(**payload)
