from __future__ import annotations

from typing import List

from pydantic import BaseModel, Field


class SkillRequest(BaseModel):
    skills: List[str] = Field(default_factory=list, description="User skill list")
    target_role: str | None = Field(default=None, description="Desired target role")


class PredictionResponse(BaseModel):
    match_score: int
    missing_skills: List[str]
    career_prediction: str


class DashboardResponse(BaseModel):
    skill_match: int
    market_demand: int
    missing_skills_count: int
    career_prediction: str


class DemandTrendPoint(BaseModel):
    month: str
    demand: int


class GrowthPoint(BaseModel):
    skill: str
    growth: int


class RadarPoint(BaseModel):
    subject: str
    A: int


class AnalyticsResponse(BaseModel):
    demandTrend: List[DemandTrendPoint]
    growthData: List[GrowthPoint]
    radarSkills: List[RadarPoint]


class RoadmapStep(BaseModel):
    title: str
    duration: str
    modules: List[str]


class RoadmapResponse(BaseModel):
    steps: List[RoadmapStep]


class UploadResponse(BaseModel):
    detected_skills: List[str]
    total_detected: int
