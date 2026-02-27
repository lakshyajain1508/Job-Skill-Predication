from __future__ import annotations

from typing import Dict, List

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
    growthIndex: Dict[str, float] = Field(default_factory=dict)
    volatility: Dict[str, int] = Field(default_factory=dict)
    saturation: Dict[str, str] = Field(default_factory=dict)


class RoadmapStep(BaseModel):
    title: str
    duration: str
    modules: List[str]


class RoadmapResponse(BaseModel):
    steps: List[RoadmapStep]


class UploadResponse(BaseModel):
    detected_skills: List[str]
    total_detected: int


class PortfolioRequest(BaseModel):
    skills: List[str] = Field(default_factory=list, description="User skill list for market intelligence")


class SkillGrowthIndexResponse(BaseModel):
    growth: Dict[str, float]


class SkillVolatilityResponse(BaseModel):
    volatility: Dict[str, int]


class SaturationResponse(BaseModel):
    saturation: Dict[str, str]


class PortfolioResponse(BaseModel):
    salary_projection: str
    growth_potential: int
    risk_level: str


class CareerRiskResponse(BaseModel):
    career_risk_score: int
