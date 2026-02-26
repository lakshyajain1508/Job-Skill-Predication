from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path
from threading import Lock
from typing import Dict, List

import pandas as pd

from app.config import DEFAULT_TOP_SKILLS, VALID_DATASET_DIRS


ROLE_CANDIDATES = [
    "job_title",
    "title",
    "role",
    "position",
    "career",
    "occupation",
    "job_role",
]

SKILL_CANDIDATES = [
    "job_skills",
    "skills",
    "required_skills",
    "key_skills",
    "skill",
    "technologies",
    "tags",
]

DATE_CANDIDATES = ["date", "posted_date", "posting_date", "created_at", "month", "year_month"]


def _normalize_text(value: str) -> str:
    return re.sub(r"\s+", " ", str(value).strip().lower())


def _split_skills(text: str) -> List[str]:
    parts = re.split(r"[,;|/\n\t]", str(text))
    cleaned = []
    for part in parts:
        token = _normalize_text(part)
        if token and len(token) >= 2:
            cleaned.append(token)
    return cleaned


def _pick_column(df: pd.DataFrame, candidates: List[str]) -> str | None:
    lower_map = {column.lower().strip(): column for column in df.columns}
    for candidate in candidates:
        if candidate in lower_map:
            return lower_map[candidate]
    return None


@dataclass
class DataCache:
    csv_tables: Dict[str, pd.DataFrame] = field(default_factory=dict)
    unified_role_skill: pd.DataFrame = field(default_factory=lambda: pd.DataFrame(columns=["role", "skill"]))
    role_to_skills: Dict[str, List[str]] = field(default_factory=dict)
    skill_frequency: Dict[str, int] = field(default_factory=dict)
    monthly_demand: List[dict] = field(default_factory=list)
    dataset_files: List[str] = field(default_factory=list)


class DataLoader:
    def __init__(self) -> None:
        self._cache = DataCache()
        self._lock = Lock()

    @property
    def cache(self) -> DataCache:
        return self._cache

    def load_all(self, force_reload: bool = False) -> DataCache:
        with self._lock:
            if self._cache.csv_tables and not force_reload:
                return self._cache

            cache = DataCache()
            csv_files = self._discover_csv_files()
            cache.dataset_files = [str(path) for path in csv_files]

            for path in csv_files:
                try:
                    frame = pd.read_csv(path, low_memory=False, on_bad_lines="skip")
                    cache.csv_tables[path.stem] = frame
                except Exception:
                    continue

            self._build_unified_views(cache)
            self._cache = cache
            return self._cache

    def _discover_csv_files(self) -> List[Path]:
        csv_files: List[Path] = []
        for root in VALID_DATASET_DIRS:
            csv_files.extend(list(root.rglob("*.csv")))
        return csv_files

    def _build_unified_views(self, cache: DataCache) -> None:
        role_skill_rows: List[dict] = []
        monthly_frames: List[pd.DataFrame] = []

        for _, df in cache.csv_tables.items():
            if df.empty:
                continue

            role_col = _pick_column(df, ROLE_CANDIDATES)
            skill_col = _pick_column(df, SKILL_CANDIDATES)

            if role_col and skill_col:
                subset = df[[role_col, skill_col]].dropna()
                for _, row in subset.iterrows():
                    role = _normalize_text(row[role_col])
                    skills = _split_skills(row[skill_col])
                    if not role or not skills:
                        continue
                    for skill in skills:
                        role_skill_rows.append({"role": role, "skill": skill})

            date_col = _pick_column(df, DATE_CANDIDATES)
            if date_col:
                temp = df[[date_col]].dropna().copy()
                if not temp.empty:
                    temp["date"] = pd.to_datetime(temp[date_col], errors="coerce")
                    temp = temp.dropna(subset=["date"])
                    if not temp.empty:
                        monthly = (
                            temp.groupby(temp["date"].dt.to_period("M"))
                            .size()
                            .reset_index(name="count")
                            .sort_values("date")
                        )
                        monthly["month"] = monthly["date"].astype(str)
                        monthly_frames.append(monthly[["month", "count"]])

        unified = pd.DataFrame(role_skill_rows)
        if unified.empty:
            unified = pd.DataFrame(
                [
                    {"role": "data scientist", "skill": "python"},
                    {"role": "data scientist", "skill": "sql"},
                    {"role": "data scientist", "skill": "machine learning"},
                    {"role": "data analyst", "skill": "sql"},
                    {"role": "data analyst", "skill": "power bi"},
                ]
            )

        unified = unified.drop_duplicates().reset_index(drop=True)
        cache.unified_role_skill = unified

        role_to_skills: Dict[str, List[str]] = {}
        for role, group in unified.groupby("role"):
            role_to_skills[role] = sorted(group["skill"].dropna().unique().tolist())
        cache.role_to_skills = role_to_skills

        skill_counts = unified["skill"].value_counts().to_dict()
        if not skill_counts:
            skill_counts = {skill: max(10 - i, 1) for i, skill in enumerate(DEFAULT_TOP_SKILLS)}
        cache.skill_frequency = {str(skill): int(count) for skill, count in skill_counts.items()}

        if monthly_frames:
            monthly_df = pd.concat(monthly_frames, ignore_index=True)
            monthly_df = monthly_df.groupby("month", as_index=False)["count"].sum().sort_values("month")
            cache.monthly_demand = [
                {"month": item["month"], "demand": int(item["count"])}
                for _, item in monthly_df.tail(12).iterrows()
            ]
        else:
            cache.monthly_demand = [
                {"month": m, "demand": v}
                for m, v in zip(["Jan", "Feb", "Mar", "Apr", "May", "Jun"], [45, 51, 58, 63, 69, 74])
            ]

    def all_roles(self) -> List[str]:
        self.load_all()
        return sorted(self._cache.role_to_skills.keys())

    def get_role_skills(self, role: str) -> List[str]:
        self.load_all()
        return self._cache.role_to_skills.get(_normalize_text(role), [])

    def top_skills(self, limit: int = 20) -> List[str]:
        self.load_all()
        return [skill for skill, _ in sorted(self._cache.skill_frequency.items(), key=lambda x: x[1], reverse=True)[:limit]]


data_loader = DataLoader()
