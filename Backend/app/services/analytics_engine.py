from __future__ import annotations

from typing import Any

from app.services.data_loader import data_loader


class AnalyticsEngine:
    def get_dashboard_defaults(self) -> dict[str, Any]:
        top_skill_count = len(data_loader.top_skills(limit=8))
        market_demand = min(95, max(60, 65 + top_skill_count * 3))
        return {
            "skill_match": 72,
            "market_demand": market_demand,
            "missing_skills_count": 5,
            "career_prediction": "Data Scientist",
        }

    def get_analytics_payload(self) -> dict[str, Any]:
        cache = data_loader.load_all()

        demand_trend = cache.monthly_demand

        top_items = sorted(cache.skill_frequency.items(), key=lambda x: x[1], reverse=True)[:6]
        max_count = top_items[0][1] if top_items else 1

        growth_data = [
            {
                "skill": skill.title(),
                "growth": int(round((count / max_count) * 100)),
            }
            for skill, count in top_items
        ]

        radar_skills = [
            {"subject": "Tech Depth", "A": 78},
            {"subject": "Analytics", "A": 82},
            {"subject": "Communication", "A": 66},
            {"subject": "Business", "A": 61},
            {"subject": "AI Use", "A": 74},
        ]

        return {
            "demandTrend": demand_trend,
            "growthData": growth_data,
            "radarSkills": radar_skills,
        }


analytics_engine = AnalyticsEngine()
