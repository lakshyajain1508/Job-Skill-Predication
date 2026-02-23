from pydantic import BaseModel
from typing import List, Optional


# Request Models
class SkillJobRequest(BaseModel):
    """Request model for skill-job analysis"""

    skills: List[str]
    targetRole: Optional[str] = None


class RoadmapRequest(BaseModel):
    """Request model for roadmap generation"""

    targetRole: str
    targetSkills: List[str]
    currentExperience: Optional[int] = 0  # In months


# Response Models
class SkillInfo(BaseModel):
    """Single skill information"""

    skill: str
    demand: float
    importance: str = "medium"


class ResumeAnalysisResponse(BaseModel):
    """Response for resume analysis"""

    employability_score: float
    key_strengths: List[str]
    missing_skills: List[SkillInfo]
    career_recommendations: List[str]
    candidate_name: Optional[str] = None
    candidate_age: Optional[int] = None
    extracted_skills: List[str] = []


class SkillGapResponse(BaseModel):
    """Response for skill gap analysis"""

    current_skills: List[dict]
    required_skills: List[dict]
    gap_percentage: float
    priority_skills: List[str]


class JobTrendsResponse(BaseModel):
    """Response for job market trends"""

    trends: List[dict]
    top_roles: List[dict]
    top_skills: List[dict]


class RoadmapWeek(BaseModel):
    """Single week in roadmap"""

    week: int
    focus: str
    tasks: List[str]
    difficulty: str
    estimatedHours: int


class RoadmapResponse(BaseModel):
    """Response for roadmap generation"""

    weeks: List[RoadmapWeek]
    totalHours: int
    targetRole: str


class DashboardDataResponse(BaseModel):
    """Response for dashboard data"""

    employability_score: float
    score_trend: List[dict]
    skills_radar: List[dict]
    market_demand: List[dict]
    insights: List[str]


class HealthResponse(BaseModel):
    """Health check response"""

    status: str
    message: str
