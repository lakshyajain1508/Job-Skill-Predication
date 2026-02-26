from __future__ import annotations

import re

from fastapi import APIRouter, File, UploadFile

from app.models.schemas import UploadResponse
from app.services.data_loader import data_loader


router = APIRouter(tags=["upload"])


def _extract_text_from_file(content: bytes) -> str:
    text = content.decode("utf-8", errors="ignore")
    if not text.strip():
        text = content.decode("latin-1", errors="ignore")
    return text.lower()


def _keyword_match_skills(text: str, candidates: list[str]) -> list[str]:
    found: list[str] = []
    for skill in sorted(set(candidates), key=len, reverse=True):
        pattern = rf"\b{re.escape(skill.lower())}\b"
        if re.search(pattern, text):
            found.append(skill.title())
    return found


@router.post("/upload-resume", response_model=UploadResponse)
async def upload_resume(file: UploadFile = File(...)) -> UploadResponse:
    content = await file.read()
    text = _extract_text_from_file(content)

    candidate_skills = data_loader.top_skills(limit=80)
    detected_skills = _keyword_match_skills(text, candidate_skills)

    return UploadResponse(detected_skills=detected_skills[:30], total_detected=len(detected_skills[:30]))
