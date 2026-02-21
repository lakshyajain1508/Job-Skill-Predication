import pandas as pd
from pathlib import Path
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class DatasetLoader:
    """Load and manage all CSV datasets"""

    def __init__(self, dataset_dir: Path):
        """Initialize dataset loader with directory path"""
        self.dataset_dir = dataset_dir
        self.job_market_df = None
        self.data_science_df = None
        self.resumes_df = None
        self.skill_recommendation_df = None

    def load_all_datasets(self) -> bool:
        """Load all CSV files from dataset directory"""
        try:
            # Load job market skills
            job_market_path = self.dataset_dir / "job_market_skills.csv"
            if job_market_path.exists():
                self.job_market_df = pd.read_csv(job_market_path)
                logger.info(f"Loaded job_market_skills.csv: {len(self.job_market_df)} rows")
            else:
                logger.warning(f"job_market_skills.csv not found at {job_market_path}")

            # Load data science jobs
            data_science_path = self.dataset_dir / "data_science_jobs.csv"
            if data_science_path.exists():
                self.data_science_df = pd.read_csv(data_science_path)
                logger.info(f"Loaded data_science_jobs.csv: {len(self.data_science_df)} rows")
            else:
                logger.warning(f"data_science_jobs.csv not found at {data_science_path}")

            # Load resumes
            resumes_path = self.dataset_dir / "resumes_dataset.csv"
            if resumes_path.exists():
                self.resumes_df = pd.read_csv(resumes_path)
                logger.info(f"Loaded resumes_dataset.csv: {len(self.resumes_df)} rows")
            else:
                logger.warning(f"resumes_dataset.csv not found at {resumes_path}")

            # Load skill recommendations
            skill_rec_path = self.dataset_dir / "skill_career_recommendation.csv"
            if skill_rec_path.exists():
                self.skill_recommendation_df = pd.read_csv(skill_rec_path)
                logger.info(f"Loaded skill_career_recommendation.csv: {len(self.skill_recommendation_df)} rows")
            else:
                logger.warning(f"skill_career_recommendation.csv not found at {skill_rec_path}")

            return True

        except Exception as e:
            logger.error(f"Error loading datasets: {str(e)}")
            return False

    def get_all_skills(self) -> list:
        """Extract all unique skills from datasets"""
        skills = set()

        # From job market
        if self.job_market_df is not None:
            for col in self.job_market_df.columns:
                if col.lower() in ['skill', 'skills']:
                    skills.update(self.job_market_df[col].dropna().str.lower().unique())

        # From data science jobs
        if self.data_science_df is not None:
            for col in self.data_science_df.columns:
                if 'skill' in col.lower():
                    skills.update(self.data_science_df[col].dropna().str.lower().unique())

        return sorted(list(skills))

    def get_skill_demand(self) -> dict:
        """Calculate skill demand frequency"""
        skill_demand = {}

        # Combine all job datasets
        all_skills = []

        if self.job_market_df is not None:
            for col in self.job_market_df.columns:
                if 'skill' in col.lower():
                    all_skills.extend(self.job_market_df[col].dropna().tolist())

        if self.data_science_df is not None:
            for col in self.data_science_df.columns:
                if 'skill' in col.lower():
                    all_skills.extend(self.data_science_df[col].dropna().tolist())

        # Count frequency
        total_jobs = len(all_skills) if all_skills else 1
        for skill in all_skills:
            skill_lower = str(skill).lower().strip()
            if skill_lower:
                if skill_lower not in skill_demand:
                    skill_demand[skill_lower] = 0
                skill_demand[skill_lower] += 1

        # Calculate percentages
        for skill in skill_demand:
            skill_demand[skill] = round((skill_demand[skill] / total_jobs) * 100, 2)

        return skill_demand

    def get_role_skills(self, role: str) -> dict:
        """Get required skills for a specific role"""
        if self.skill_recommendation_df is None:
            return {}

        role_lower = role.lower()

        # Filter by role
        try:
            matching = self.skill_recommendation_df[
                self.skill_recommendation_df.apply(
                    lambda row: role_lower in str(row).lower(), axis=1
                )
            ]

            if len(matching) > 0:
                # Extract skills from matching rows
                skills = []
                for col in matching.columns:
                    if 'skill' in col.lower():
                        skills.extend(matching[col].dropna().unique().tolist())
                return {"role": role, "required_skills": list(set(skills))}

        except Exception as e:
            logger.error(f"Error getting role skills: {str(e)}")

        return {"role": role, "required_skills": []}

    def is_loaded(self) -> bool:
        """Check if datasets are loaded"""
        return (
            self.job_market_df is not None
            or self.data_science_df is not None
            or self.resumes_df is not None
            or self.skill_recommendation_df is not None
        )
