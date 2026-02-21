from fastapi import APIRouter, UploadFile, File, Form
from typing import List
import logging

from app.models.schemas import ResumeAnalysisResponse, SkillInfo
from app.services import SkillExtractor, GapAnalyzer

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["analyze"])

# Dependencies
skill_extractor = SkillExtractor()


@router.post("/analyze-resume", response_model=ResumeAnalysisResponse)
async def analyze_resume(
    file: UploadFile = File(None),
    skills: str = Form(None),
    target_role: str = Form(None),
):
    """
    Analyze resume and extract skills

    Args:
        file: Resume file (PDF/DOCX)
        skills: JSON list of user skills
        target_role: Target job role
        gap_analyzer: Service instance
    """
    try:
        # Initialize services if not provided
        if gap_analyzer is None:
            from app.main import gap_analyzer as ga
            gap_analyzer = ga

        # Extract skills from resume text
        resume_text = ""
        if file and file.filename:
            try:
                content = await file.read()
                # Simple text extraction (in production, use pdf/docx libraries)
                resume_text = content.decode("utf-8", errors="ignore")
            except Exception as e:
                logger.warning(f"Could not read resume file: {e}")

        # Combine with provided skills
        extracted_skills = skill_extractor.extract_from_text(resume_text)

        if skills:
            import json

            try:
                provided_skills = json.loads(skills)
                extracted_skills = list(set(extracted_skills + provided_skills))
            except:
                pass

        # Get key strengths
        key_strengths = extracted_skills[:5] if extracted_skills else ["Communication", "Problem Solving"]

        # Get missing skills if role provided
        missing_skills = []
        if target_role:
            gap_data = gap_analyzer.get_missing_skills_with_demand(extracted_skills, target_role)
            missing_skills = [
                SkillInfo(skill=s["skill"], demand=s["demand"], importance=s["importance"]) for s in gap_data
            ]

        # Career recommendations
        recommendations = [
            f"Focus on mastering {key_strengths[0] if key_strengths else 'core skills'}",
            "Build projects to demonstrate skills",
            "Network with professionals in your target role",
            "Stay updated with latest technologies",
        ]

        return ResumeAnalysisResponse(
            employability_score=75.0,
            key_strengths=key_strengths,
            missing_skills=missing_skills[:5],
            career_recommendations=recommendations,
        )

    except Exception as e:
        logger.error(f"Error analyzing resume: {str(e)}")
        return ResumeAnalysisResponse(
            employability_score=0.0,
            key_strengths=[],
            missing_skills=[],
            career_recommendations=["Please upload a valid resume"],
        )
