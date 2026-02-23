from fastapi import APIRouter, UploadFile, File, Form
from typing import List
import logging
import re

from app.models.schemas import ResumeAnalysisResponse, SkillInfo
from app.services import SkillExtractor, GapAnalyzer

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["analyze"])

# Dependencies
skill_extractor = SkillExtractor()
gap_analyzer = None  # Will be injected from main.py


def set_gap_analyzer(analyzer: GapAnalyzer):
    """Set the gap_analyzer instance"""
    global gap_analyzer
    gap_analyzer = analyzer


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
    """
    try:
        # Initialize services if not provided
        analyzer = gap_analyzer
        if analyzer is None:
            from app.main import gap_analyzer as ga
            analyzer = ga

        # Extract skills from resume text
        resume_text = ""
        if file and file.filename:
            try:
                content = await file.read()
                # Simple text extraction (in production, use pdf/docx libraries)
                resume_text = content.decode("utf-8", errors="ignore")
            except Exception as e:
                logger.warning(f"Could not read resume file: {e}")

        # Candidate name extraction: prefer labeled 'Name:' then fallback to first non-empty line
        candidate_name = None
        candidate_age = None
        if resume_text:
            m = re.search(r"(?m)^\s*Name\s*[:\-]\s*(.+)$", resume_text)
            if m:
                candidate_name = m.group(1).strip()
            else:
                for line in resume_text.splitlines():
                    ln = line.strip()
                    if ln:
                        candidate_name = ln
                        break

            # Candidate age extraction from common patterns
            age_match = re.search(r"(?i)\bage\s*[:\-]?\s*(\d{1,2})\b", resume_text)
            if not age_match:
                dob_year_match = re.search(r"(?i)\b(?:dob|date of birth)\s*[:\-]?\s*(?:\d{1,2}[\-/]\d{1,2}[\-/])?(\d{4})\b", resume_text)
                if dob_year_match:
                    try:
                        from datetime import datetime

                        birth_year = int(dob_year_match.group(1))
                        calculated_age = datetime.now().year - birth_year
                        if 10 <= calculated_age <= 90:
                            candidate_age = calculated_age
                    except Exception:
                        pass
            else:
                try:
                    parsed_age = int(age_match.group(1))
                    if 10 <= parsed_age <= 90:
                        candidate_age = parsed_age
                except Exception:
                    pass

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

        # Calculate employability score based on skill match
        employability_score = 60.0  # Base score
        if extracted_skills:
            employability_score = min(95.0, 60.0 + (len(extracted_skills) * 3))

        # Get missing skills if role provided
        missing_skills = []
        recommendations = []
        
        if target_role and analyzer:
            try:
                gap_data = analyzer.get_missing_skills_with_demand(extracted_skills, target_role)
                missing_skills = [
                    SkillInfo(skill=s["skill"], demand=s["demand"], importance=s["importance"]) for s in gap_data
                ]
                
                # Generate recommendations based on missing skills
                if missing_skills:
                    recommendations = [
                        f"Focus on mastering {missing_skills[0].skill} - it's in high demand ({missing_skills[0].demand}% market demand)",
                        f"Priority: {', '.join([s.skill for s in missing_skills[:3]])}",
                        "Build projects to demonstrate skills",
                        "Network with professionals in your target role",
                        "Stay updated with latest technologies in your field",
                    ]
                else:
                    recommendations = [
                        f"Great! You have strong coverage for {target_role}",
                        "Continue building real-world projects",
                        "Keep learning emerging technologies",
                    ]
            except Exception as e:
                logger.error(f"Error analyzing gaps: {e}")
                recommendations = [
                    f"Focus on mastering {key_strengths[0] if key_strengths else 'core skills'}",
                    "Build projects to demonstrate skills",
                    "Network with professionals in your target role",
                    "Stay updated with latest technologies",
                ]
        else:
            # Default recommendations if no role specified
            recommendations = [
                f"Focus on mastering {key_strengths[0] if key_strengths else 'core skills'}",
                "Build projects to demonstrate skills",
                "Network with professionals in your target role",
                "Stay updated with latest technologies",
            ]

        return ResumeAnalysisResponse(
            employability_score=employability_score,
            key_strengths=key_strengths,
            missing_skills=missing_skills[:5],
            career_recommendations=recommendations,
            candidate_name=candidate_name,
            candidate_age=candidate_age,
            extracted_skills=extracted_skills,
        )

    except Exception as e:
        logger.error(f"Error analyzing resume: {str(e)}")
        return ResumeAnalysisResponse(
            employability_score=0.0,
            key_strengths=[],
            missing_skills=[],
            career_recommendations=["Please upload a valid resume"],
            candidate_name=None,
            candidate_age=None,
            extracted_skills=[],
        )
