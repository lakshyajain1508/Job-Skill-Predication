from __future__ import annotations

from fastapi import APIRouter

from app.models.schemas import (
    CareerRiskResponse,
    PortfolioRequest,
    PortfolioResponse,
    SaturationResponse,
    SkillGrowthIndexResponse,
    SkillVolatilityResponse,
)
from app.services.market_intelligence import market_intelligence


router = APIRouter(prefix="/intelligence", tags=["intelligence"])


@router.get("/growth", response_model=SkillGrowthIndexResponse)
async def get_growth_index() -> SkillGrowthIndexResponse:
    return SkillGrowthIndexResponse(growth=market_intelligence.calculate_growth_index())


@router.get("/volatility", response_model=SkillVolatilityResponse)
async def get_volatility() -> SkillVolatilityResponse:
    return SkillVolatilityResponse(volatility=market_intelligence.calculate_volatility())


@router.get("/saturation", response_model=SaturationResponse)
async def get_saturation() -> SaturationResponse:
    return SaturationResponse(saturation=market_intelligence.detect_saturation())


@router.post("/portfolio", response_model=PortfolioResponse)
async def post_portfolio(payload: PortfolioRequest) -> PortfolioResponse:
    result = market_intelligence.portfolio_analysis(payload.skills)
    return PortfolioResponse(**result)


@router.post("/risk", response_model=CareerRiskResponse)
async def post_risk(payload: PortfolioRequest) -> CareerRiskResponse:
    return CareerRiskResponse(**market_intelligence.career_risk_score(payload.skills))
