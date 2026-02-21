import re
from typing import List


def clean_skill_text(text: str) -> str:
    """Clean and normalize skill text"""
    if not text:
        return ""
    # Convert to lowercase and remove special characters
    text = text.lower().strip()
    text = re.sub(r"[^\w\s\+\#\.]", "", text)
    return text


def extract_keywords(text: str, keywords: List[str]) -> List[str]:
    """Extract matching keywords from text"""
    if not text:
        return []

    text = text.lower()
    found_skills = []

    for keyword in keywords:
        keyword_clean = clean_skill_text(keyword).lower()
        if keyword_clean in text or keyword_clean.replace("+", "").replace("#", "") in text:
            if keyword not in found_skills:
                found_skills.append(keyword)

    return found_skills


def calculate_similarity(list1: List[str], list2: List[str]) -> float:
    """Calculate similarity between two lists (Jaccard similarity)"""
    if not list1 or not list2:
        return 0.0

    set1 = set(item.lower() for item in list1)
    set2 = set(item.lower() for item in list2)

    intersection = len(set1 & set2)
    union = len(set1 | set2)

    if union == 0:
        return 0.0

    return intersection / union


def get_difficulty_label(percentage: float) -> str:
    """Get difficulty label based on percentage"""
    if percentage >= 80:
        return "Beginner"
    elif percentage >= 60:
        return "Intermediate"
    else:
        return "Advanced"
