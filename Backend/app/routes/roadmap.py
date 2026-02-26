from __future__ import annotations

from fastapi import APIRouter, Request

from app.models.schemas import RoadmapResponse
from app.services.roadmap_generator import roadmap_generator


router = APIRouter(tags=["roadmap"])


@router.get("/roadmap", response_model=RoadmapResponse)
def get_roadmap(request: Request) -> RoadmapResponse:
    last_prediction = getattr(request.app.state, "last_prediction", None)
    missing_skills = []

    if isinstance(last_prediction, dict):
        missing_skills = list(last_prediction.get("missing_skills", []))

    payload = roadmap_generator.generate(missing_skills)
    return RoadmapResponse(**payload)
