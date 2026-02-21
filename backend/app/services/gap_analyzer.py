from typing import List, Dict
import logging

logger = logging.getLogger(__name__)


class GapAnalyzer:
    """Analyze skill gaps between user and requirements"""

    def __init__(self, job_market_engine, skill_extractor):
        """Initialize with dependencies"""
        self.job_market_engine = job_market_engine
        self.skill_extractor = skill_extractor

    def analyze_gap(self, user_skills: List[str], required_skills: List[str]) -> Dict:
        """
        Analyze gap between user skills and required skills

        Gap = Required Skills - User Skills
        """
        user_skills_normalized = self._normalize_skills(user_skills)
        required_skills_normalized = self._normalize_skills(required_skills)

        # Calculate gap
        matching_skills = set(user_skills_normalized) & set(required_skills_normalized)
        missing_skills = set(required_skills_normalized) - set(user_skills_normalized)
        extra_skills = set(user_skills_normalized) - set(required_skills_normalized)

        # Calculate employability score
        if required_skills_normalized:
            employability_score = (len(matching_skills) / len(required_skills_normalized)) * 100
        else:
            employability_score = 100.0

        return {
            "matching_skills": sorted(list(matching_skills)),
            "missing_skills": sorted(list(missing_skills)),
            "extra_skills": sorted(list(extra_skills)),
            "employability_score": round(employability_score, 2),
            "gap_percentage": round(100 - employability_score, 2),
            "total_required": len(required_skills_normalized),
            "total_user": len(user_skills_normalized),
            "total_matching": len(matching_skills),
        }

    def calculate_employability_score(self, user_skills: List[str], role: str) -> float:
        """Calculate employability score for a role"""
        role_data = self.job_market_engine.get_role_market_fit(role)
        required_skills = [s["skill"] for s in role_data.get("required_skills", [])]

        gap_analysis = self.analyze_gap(user_skills, required_skills)
        return gap_analysis["employability_score"]

    def get_missing_skills_with_demand(self, user_skills: List[str], role: str) -> List[Dict]:
        """Get missing skills with market demand data"""
        role_data = self.job_market_engine.get_role_market_fit(role)
        required_skills = [s["skill"] for s in role_data.get("required_skills", [])]

        gap_analysis = self.analyze_gap(user_skills, required_skills)
        missing_skills = gap_analysis["missing_skills"]

        # Add demand info
        missing_with_demand = []
        for skill in missing_skills:
            demand = self.job_market_engine.get_skill_demand_percentage(skill)
            importance = self._get_skill_importance(demand)

            missing_with_demand.append({"skill": skill, "demand": demand, "importance": importance})

        # Sort by demand
        missing_with_demand.sort(key=lambda x: x["demand"], reverse=True)

        return missing_with_demand

    def get_priority_skills(self, user_skills: List[str], role: str, limit: int = 5) -> List[str]:
        """Get top priority skills to learn"""
        missing = self.get_missing_skills_with_demand(user_skills, role)
        return [skill["skill"] for skill in missing[:limit]]

    def get_skill_learning_path(self, user_skills: List[str], role: str) -> Dict:
        """Create a learning path structured by difficulty"""
        missing_skills = self.get_missing_skills_with_demand(user_skills, role)

        # Categorize by importance/priority
        path = {"critical": [], "high": [], "medium": [], "low": []}

        for skill in missing_skills:
            importance = skill["importance"]
            if importance in path:
                path[importance].append(skill["skill"])

        return {
            "role": role,
            "current_skills_count": len(self._normalize_skills(user_skills)),
            "required_skills_count": len(missing_skills) + len(self._normalize_skills(user_skills)),
            "learning_path": path,
            "total_missing": len(missing_skills),
        }

    def _normalize_skills(self, skills: List[str]) -> List[str]:
        """Normalize skill list"""
        if not skills:
            return []
        return self.skill_extractor.extract_from_list(skills)

    def _get_skill_importance(self, demand: float) -> str:
        """Get importance level based on demand"""
        if demand >= 70:
            return "critical"
        elif demand >= 50:
            return "high"
        elif demand >= 30:
            return "medium"
        else:
            return "low"

    def get_key_strengths(self, user_skills: List[str], role: str) -> List[str]:
        """Get user's key strengths for a role"""
        role_data = self.job_market_engine.get_role_market_fit(role)
        required_skills = {s["skill"]: s["demand"] for s in role_data.get("required_skills", [])}

        user_skills_normalized = self._normalize_skills(user_skills)

        # Find strengths that match the role
        strengths = []
        for skill in user_skills_normalized:
            if skill in required_skills and required_skills[skill] > 50:
                strengths.append(skill)

        return sorted(strengths)[:5] if strengths else user_skills_normalized[:5]
