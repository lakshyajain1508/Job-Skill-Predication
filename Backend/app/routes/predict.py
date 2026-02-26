from __future__ import annotations

from fastapi import APIRouter, Request

from app.models.schemas import PredictionResponse, SkillRequest
from app.services.data_loader import data_loader
from app.services.prediction_model import prediction_model
from app.services.skill_gap_engine import analyze_skill_gap


router = APIRouter(tags=["prediction"])


@router.post("/predict", response_model=PredictionResponse)
def predict_skill_gap(payload: SkillRequest, request: Request) -> PredictionResponse:
    user_skills = payload.skills or []
    predicted_role = prediction_model.predict_closest_role(user_skills)

    target_role = (payload.target_role or "").strip()
    role_for_analysis = target_role if target_role else predicted_role

    role_skills = data_loader.get_role_skills(role_for_analysis)
    if not role_skills and predicted_role:
        role_skills = data_loader.get_role_skills(predicted_role)

    analysis = analyze_skill_gap(user_skills, role_skills)
    career_prediction = predicted_role if predicted_role else (role_for_analysis.title() or "Data Scientist")

    response = PredictionResponse(
        match_score=analysis["match_score"],
        missing_skills=analysis["missing_skills"][:10],
        career_prediction=career_prediction,
    )

    request.app.state.last_prediction = response.model_dump()
    return response
