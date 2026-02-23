import pandas as pd
from pathlib import Path
from typing import Optional
import logging
import re

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
            csv_files = list(self.dataset_dir.rglob("*.csv"))
            if not csv_files:
                logger.warning(f"No CSV files found under dataset directory: {self.dataset_dir}")
                return False

            loaded_any = False

            # Prefer explicit files from provided datasets
            job_skills_path = next((p for p in csv_files if p.name.lower() == "job_skills.csv"), None)
            future_jobs_path = next((p for p in csv_files if p.name.lower() == "future_jobs_dataset.csv"), None)
            job_postings_path = next((p for p in csv_files if p.name.lower() == "job_postings.csv"), None)

            if job_skills_path and future_jobs_path:
                df_job_skills = pd.read_csv(job_skills_path)
                df_future_jobs = pd.read_csv(future_jobs_path)
                self.job_market_df = pd.concat([df_job_skills, df_future_jobs], ignore_index=True, sort=False)
                logger.info(
                    f"Loaded job market datasets: {job_skills_path.name} ({len(df_job_skills)} rows), "
                    f"{future_jobs_path.name} ({len(df_future_jobs)} rows)"
                )
                loaded_any = True
            elif job_skills_path:
                self.job_market_df = pd.read_csv(job_skills_path)
                logger.info(f"Loaded {job_skills_path.name}: {len(self.job_market_df)} rows")
                loaded_any = True
            elif future_jobs_path:
                self.job_market_df = pd.read_csv(future_jobs_path)
                logger.info(f"Loaded {future_jobs_path.name}: {len(self.job_market_df)} rows")
                loaded_any = True

            if job_postings_path:
                self.data_science_df = pd.read_csv(job_postings_path)
                logger.info(f"Loaded {job_postings_path.name}: {len(self.data_science_df)} rows")
                loaded_any = True

            return loaded_any

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
                    for value in self.job_market_df[col].dropna().tolist():
                        all_skills.extend(self._split_skills(value))

        if self.data_science_df is not None:
            for col in self.data_science_df.columns:
                if 'skill' in col.lower():
                    for value in self.data_science_df[col].dropna().tolist():
                        all_skills.extend(self._split_skills(value))

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

    def _split_skills(self, raw_value) -> list:
        """Split raw skill cells into normalized individual skills."""
        if raw_value is None:
            return []

        text = str(raw_value).strip()
        if not text:
            return []

        # Remove common list wrappers/quotes
        cleaned = (
            text.replace("[", " ")
            .replace("]", " ")
            .replace("\"", " ")
            .replace("'", " ")
            .replace("\n", ",")
            .replace("\r", ",")
        )
        parts = re.split(r"[,;|/]+", cleaned)

        result = []
        for part in parts:
            token = re.sub(r"\s+", " ", part).strip().lower()
            if token and token not in {"nan", "none", "null"}:
                result.append(token)

        return result

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
