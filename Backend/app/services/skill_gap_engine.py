from __future__ import annotations

import re
from typing import Iterable


def normalize_skills(skills: Iterable[str]) -> set[str]:
    normalized: set[str] = set()
    for skill in skills:
        token = re.sub(r"\s+", " ", str(skill).strip().lower())
        if token:
            normalized.add(token)
    return normalized


def calculate_match_score(user_skills: Iterable[str], role_skills: Iterable[str]) -> int:
    user_set = normalize_skills(user_skills)
    role_set = normalize_skills(role_skills)

    if not role_set:
        return 0

    overlap = user_set.intersection(role_set)
    score = int(round((len(overlap) / len(role_set)) * 100))
    return max(0, min(score, 100))


def find_missing_skills(user_skills: Iterable[str], role_skills: Iterable[str]) -> list[str]:
    user_set = normalize_skills(user_skills)
    role_set = normalize_skills(role_skills)
    missing = sorted(role_set.difference(user_set))
    return missing


def analyze_skill_gap(user_skills: Iterable[str], role_skills: Iterable[str]) -> dict:
    return {
        "match_score": calculate_match_score(user_skills, role_skills),
        "missing_skills": find_missing_skills(user_skills, role_skills),
    }
