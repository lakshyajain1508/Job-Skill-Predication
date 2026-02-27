from __future__ import annotations

import math
import re
from dataclasses import dataclass, field
from threading import Lock
from typing import Any

import pandas as pd

from app.config import DEFAULT_TOP_SKILLS
from app.services.data_loader import DATE_CANDIDATES, SKILL_CANDIDATES, _pick_column, _split_skills, data_loader


SALARY_CANDIDATES = [
    "salary",
    "avg_salary",
    "annual_salary",
    "salary_in_usd",
    "salary_usd",
    "compensation",
    "pay",
]

RESUME_SKILL_CANDIDATES = [
    "resume_skills",
    "candidate_skills",
    "applicant_skills",
    "profile_skills",
    "skills",
]


@dataclass
class IntelligenceCache:
    growth_index: dict[str, float] = field(default_factory=dict)
    volatility: dict[str, int] = field(default_factory=dict)
    saturation_ratio: dict[str, float] = field(default_factory=dict)
    saturation_label: dict[str, str] = field(default_factory=dict)
    avg_salary_lpa: float = 12.0
    demand_index: dict[str, float] = field(default_factory=dict)


class MarketIntelligenceService:
    def __init__(self) -> None:
        self._lock = Lock()
        self._cache = IntelligenceCache()

    def prime_cache(self, force: bool = False) -> IntelligenceCache:
        with self._lock:
            if self._cache.growth_index and not force:
                return self._cache

            cache = IntelligenceCache()
            data_cache = data_loader.load_all()
            skill_monthly_counts: dict[str, dict[str, int]] = {}
            job_skill_counts: dict[str, int] = {}
            resume_skill_counts: dict[str, int] = {}
            salary_values: list[float] = []

            for _, frame in data_cache.csv_tables.items():
                if frame.empty:
                    continue

                date_col = _pick_column(frame, DATE_CANDIDATES)
                skill_col = _pick_column(frame, SKILL_CANDIDATES)
                resume_skill_col = _pick_column(frame, RESUME_SKILL_CANDIDATES)
                salary_col = _pick_column(frame, SALARY_CANDIDATES)

                if skill_col:
                    self._collect_skill_counts(
                        frame=frame,
                        skill_col=skill_col,
                        date_col=date_col,
                        monthly_store=skill_monthly_counts,
                        aggregate_store=job_skill_counts,
                    )

                if resume_skill_col:
                    self._collect_resume_counts(frame, resume_skill_col, resume_skill_counts)

                if salary_col:
                    salary_values.extend(self._extract_salary_values(frame[salary_col]))

            if not job_skill_counts:
                job_skill_counts = {
                    skill.lower(): max(5 - i, 1) * 10
                    for i, skill in enumerate(DEFAULT_TOP_SKILLS[:8])
                }

            if not resume_skill_counts:
                resume_skill_counts = {
                    skill: max(int(count * 1.15), 1)
                    for skill, count in job_skill_counts.items()
                }

            cache.growth_index = self._calculate_growth_index(skill_monthly_counts, job_skill_counts)
            cache.volatility = self._calculate_volatility(skill_monthly_counts, job_skill_counts)
            cache.saturation_ratio, cache.saturation_label = self._calculate_saturation(
                job_skill_counts,
                resume_skill_counts,
            )
            cache.avg_salary_lpa = self._estimate_salary_lpa(salary_values, job_skill_counts)
            cache.demand_index = self._build_demand_index(job_skill_counts)

            self._cache = cache
            return self._cache

    def calculate_growth_index(self) -> dict[str, float]:
        cache = self.prime_cache()
        return {skill.title(): round(value, 4) for skill, value in cache.growth_index.items()}

    def calculate_volatility(self) -> dict[str, int]:
        cache = self.prime_cache()
        return {skill.title(): value for skill, value in cache.volatility.items()}

    def detect_saturation(self, skills: list[str] | None = None) -> dict[str, str]:
        cache = self.prime_cache()
        if skills:
            normalized = [self._normalize_skill_name(skill) for skill in skills if str(skill).strip()]
            return {
                skill.title(): cache.saturation_label.get(skill, "Medium Saturation")
                for skill in normalized
            }
        return {skill.title(): label for skill, label in cache.saturation_label.items()}

    def portfolio_analysis(self, skills: list[str]) -> dict[str, Any]:
        cache = self.prime_cache()
        normalized_skills = [self._normalize_skill_name(skill) for skill in skills if str(skill).strip()]

        if not normalized_skills:
            return {
                "salary_projection": f"{max(cache.avg_salary_lpa - 2, 4):.0f}-{cache.avg_salary_lpa + 2:.0f} LPA",
                "growth_potential": 50,
                "risk_level": "Medium",
            }

        growth_values = [cache.growth_index.get(skill, 0.0) for skill in normalized_skills]
        demand_values = [cache.demand_index.get(skill, 0.4) for skill in normalized_skills]
        volatility_values = [cache.volatility.get(skill, 50) for skill in normalized_skills]
        saturation_values = [self._saturation_to_score(cache.saturation_label.get(skill, "Medium Saturation")) for skill in normalized_skills]

        growth_factor = max(0.1, 1 + (sum(growth_values) / len(growth_values)))
        demand_factor = max(0.25, sum(demand_values) / len(demand_values))
        salary_center = cache.avg_salary_lpa * (0.7 + demand_factor * 0.5) * min(growth_factor, 1.8)
        salary_center = max(4.0, min(60.0, salary_center))

        low = max(3.0, salary_center * 0.85)
        high = min(65.0, salary_center * 1.2)

        growth_potential = int(round(min(100, max(0, ((sum(growth_values) / len(growth_values)) + demand_factor) * 45 + 35))))

        risk_score = int(round(min(100, max(0, (sum(volatility_values) / len(volatility_values)) * 0.6 + (sum(saturation_values) / len(saturation_values)) * 0.4))))
        if risk_score >= 67:
            risk_level = "High"
        elif risk_score >= 34:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        return {
            "salary_projection": f"{low:.0f}-{high:.0f} LPA",
            "growth_potential": growth_potential,
            "risk_level": risk_level,
        }

    def career_risk_score(self, skills: list[str]) -> dict[str, int]:
        cache = self.prime_cache()
        normalized_skills = [self._normalize_skill_name(skill) for skill in skills if str(skill).strip()]
        if not normalized_skills:
            return {"career_risk_score": 50}

        scores: list[float] = []
        for skill in normalized_skills:
            volatility_score = float(cache.volatility.get(skill, 50))
            saturation_score = float(self._saturation_to_score(cache.saturation_label.get(skill, "Medium Saturation")))
            growth_value = float(cache.growth_index.get(skill, 0.0))

            risk = (volatility_score * 0.4) + (saturation_score * 0.4) - (growth_value * 100 * 0.2)
            scores.append(risk)

        normalized = int(round(min(100, max(0, sum(scores) / len(scores)))))
        return {"career_risk_score": normalized}

    def _collect_skill_counts(
        self,
        frame: pd.DataFrame,
        skill_col: str,
        date_col: str | None,
        monthly_store: dict[str, dict[str, int]],
        aggregate_store: dict[str, int],
    ) -> None:
        subset_columns = [skill_col] + ([date_col] if date_col else [])
        subset = frame[subset_columns].dropna(subset=[skill_col]).copy()
        if subset.empty:
            return

        if date_col:
            subset["_period"] = pd.to_datetime(subset[date_col], errors="coerce").dt.to_period("M").astype(str)
            subset.loc[subset["_period"].isin(["NaT"]), "_period"] = "unknown"
        else:
            subset["_period"] = "unknown"

        for _, row in subset.iterrows():
            period = str(row.get("_period", "unknown"))
            for skill in _split_skills(row[skill_col]):
                normalized = self._normalize_skill_name(skill)
                if not normalized:
                    continue
                aggregate_store[normalized] = aggregate_store.get(normalized, 0) + 1
                if normalized not in monthly_store:
                    monthly_store[normalized] = {}
                monthly_store[normalized][period] = monthly_store[normalized].get(period, 0) + 1

    def _collect_resume_counts(self, frame: pd.DataFrame, skill_col: str, store: dict[str, int]) -> None:
        subset = frame[[skill_col]].dropna()
        if subset.empty:
            return

        for value in subset[skill_col].tolist():
            for skill in _split_skills(str(value)):
                normalized = self._normalize_skill_name(skill)
                if normalized:
                    store[normalized] = store.get(normalized, 0) + 1

    def _calculate_growth_index(
        self,
        skill_monthly_counts: dict[str, dict[str, int]],
        job_skill_counts: dict[str, int],
    ) -> dict[str, float]:
        growth: dict[str, float] = {}
        tracked_skills = self._top_skills(job_skill_counts, limit=20)

        for skill in tracked_skills:
            month_counts = skill_monthly_counts.get(skill, {})
            valid_periods = [p for p in month_counts.keys() if p and p != "unknown"]
            valid_periods.sort()

            if len(valid_periods) >= 2:
                past_count = month_counts[valid_periods[0]]
                current_count = month_counts[valid_periods[-1]]
            else:
                total = job_skill_counts.get(skill, 1)
                past_count = max(1, int(total * 0.7))
                current_count = total

            if past_count <= 0:
                past_count = 1

            growth[skill] = (current_count - past_count) / past_count

        return growth

    def _calculate_volatility(
        self,
        skill_monthly_counts: dict[str, dict[str, int]],
        job_skill_counts: dict[str, int],
    ) -> dict[str, int]:
        tracked_skills = self._top_skills(job_skill_counts, limit=20)
        raw_volatility: dict[str, float] = {}

        for skill in tracked_skills:
            month_counts = skill_monthly_counts.get(skill, {})
            values = [count for month, count in sorted(month_counts.items()) if month != "unknown"]
            if len(values) < 2:
                total = job_skill_counts.get(skill, 1)
                values = [max(1, int(total * 0.7)), total]

            stdev = float(pd.Series(values, dtype="float64").std(ddof=0))
            raw_volatility[skill] = stdev

        max_vol = max(raw_volatility.values()) if raw_volatility else 1.0
        if max_vol <= 0:
            max_vol = 1.0

        return {
            skill: int(round(min(100, max(0, (value / max_vol) * 100))))
            for skill, value in raw_volatility.items()
        }

    def _calculate_saturation(
        self,
        job_skill_counts: dict[str, int],
        resume_skill_counts: dict[str, int],
    ) -> tuple[dict[str, float], dict[str, str]]:
        ratio: dict[str, float] = {}
        label: dict[str, str] = {}

        tracked_skills = self._top_skills(job_skill_counts, limit=20)
        for skill in tracked_skills:
            jobs = max(1, int(job_skill_counts.get(skill, 0)))
            resumes = max(0, int(resume_skill_counts.get(skill, 0)))
            saturation = resumes / jobs
            ratio[skill] = saturation

            if saturation >= 1.4:
                level = "High Saturation"
            elif saturation >= 0.8:
                level = "Medium Saturation"
            else:
                level = "Low Saturation"
            label[skill] = level

        return ratio, label

    def _extract_salary_values(self, series: pd.Series) -> list[float]:
        values: list[float] = []
        for raw in series.dropna().astype(str).tolist():
            parsed = self._parse_salary_to_lpa(raw)
            if parsed is not None and math.isfinite(parsed):
                values.append(parsed)
        return values

    def _parse_salary_to_lpa(self, text: str) -> float | None:
        clean = text.lower().replace(",", "")
        nums = [float(num) for num in re.findall(r"\d+(?:\.\d+)?", clean)]
        if not nums:
            return None

        value = sum(nums[:2]) / min(2, len(nums))
        if "k" in clean and value < 1000:
            value *= 1000

        if value > 1000:
            value = value / 100000

        return max(2.5, min(80.0, value))

    def _estimate_salary_lpa(self, salary_values: list[float], job_skill_counts: dict[str, int]) -> float:
        if salary_values:
            avg = float(sum(salary_values) / len(salary_values))
            return max(4.0, min(60.0, avg))

        top_total = sum(self._top_skills(job_skill_counts, limit=8, return_counts=True))
        inferred = 8.0 + min(12.0, top_total / 120.0)
        return round(inferred, 2)

    def _build_demand_index(self, job_skill_counts: dict[str, int]) -> dict[str, float]:
        max_count = max(job_skill_counts.values()) if job_skill_counts else 1
        if max_count <= 0:
            max_count = 1

        return {
            skill: min(1.0, max(0.0, count / max_count))
            for skill, count in job_skill_counts.items()
        }

    def _top_skills(
        self,
        counts: dict[str, int],
        limit: int,
        return_counts: bool = False,
    ) -> list[Any]:
        sorted_items = sorted(counts.items(), key=lambda item: item[1], reverse=True)[:limit]
        if return_counts:
            return [count for _, count in sorted_items]
        return [skill for skill, _ in sorted_items]

    def _normalize_skill_name(self, value: str) -> str:
        return re.sub(r"\s+", " ", str(value).strip().lower())

    def _saturation_to_score(self, label: str) -> int:
        mapping = {
            "Low Saturation": 25,
            "Medium Saturation": 55,
            "High Saturation": 85,
        }
        return mapping.get(label, 55)


market_intelligence = MarketIntelligenceService()
