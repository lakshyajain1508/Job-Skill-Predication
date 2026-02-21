from typing import Dict, List
import logging

logger = logging.getLogger(__name__)


class JobMarketEngine:
    """Analyze job market trends and skill demand"""

    def __init__(self, dataset_loader):
        """Initialize with dataset loader"""
        self.dataset_loader = dataset_loader
        self.skill_demand_cache = None

    def calculate_skill_demand(self) -> Dict[str, float]:
        """Calculate skill demand percentage from job postings"""
        if self.skill_demand_cache is not None:
            return self.skill_demand_cache

        self.skill_demand_cache = self.dataset_loader.get_skill_demand()
        return self.skill_demand_cache

    def get_top_skills(self, limit: int = 10) -> List[Dict]:
        """Get top in-demand skills"""
        demand = self.calculate_skill_demand()

        # Sort by demand
        sorted_skills = sorted(demand.items(), key=lambda x: x[1], reverse=True)

        return [
            {"skill": skill, "demand": demand_pct, "importance": self._get_importance(demand_pct)}
            for skill, demand_pct in sorted_skills[:limit]
        ]

    def get_skill_demand_percentage(self, skill: str) -> float:
        """Get demand percentage for a specific skill"""
        demand = self.calculate_skill_demand()
        return demand.get(skill.lower(), 0.0)

    def get_trending_skills(self) -> List[Dict]:
        """Get trending skills (high demand)"""
        top_skills = self.get_top_skills(15)

        return [s for s in top_skills if s["demand"] > 30]

    def get_job_market_overview(self) -> Dict:
        """Get overall job market overview"""
        demand = self.calculate_skill_demand()

        return {
            "total_unique_skills": len(demand),
            "top_10_skills": self.get_top_skills(10),
            "trending_skills": self.get_trending_skills(),
            "average_skill_demand": round(sum(demand.values()) / len(demand), 2) if demand else 0,
        }

    def get_role_market_fit(self, role: str) -> Dict:
        """Analyze job market for a specific role"""
        role_data = self.dataset_loader.get_role_skills(role)
        required_skills = role_data.get("required_skills", [])

        skill_demands = []
        for skill in required_skills:
            demand = self.get_skill_demand_percentage(skill)
            skill_demands.append({"skill": skill, "demand": demand})

        # Sort by demand
        skill_demands.sort(key=lambda x: x["demand"], reverse=True)

        return {
            "role": role,
            "required_skills": skill_demands,
            "total_required": len(required_skills),
            "average_demand": round(sum(s["demand"] for s in skill_demands) / len(skill_demands), 2) if skill_demands else 0,
        }

    def _get_importance(self, demand_percentage: float) -> str:
        """Categorize importance based on demand"""
        if demand_percentage >= 70:
            return "critical"
        elif demand_percentage >= 50:
            return "high"
        elif demand_percentage >= 30:
            return "medium"
        else:
            return "low"

    def get_market_trends(self) -> Dict:
        """Get market trends analysis"""
        top_skills = self.get_top_skills(20)

        # Group by importance
        by_importance = {"critical": [], "high": [], "medium": [], "low": []}

        for skill in top_skills:
            importance = skill["importance"]
            if importance in by_importance:
                by_importance[importance].append(skill["skill"])

        return {
            "timestamp": "2026-02-21",
            "top_skills": top_skills[:10],
            "by_importance": by_importance,
            "total_analyzed_skills": len(self.calculate_skill_demand()),
        }
