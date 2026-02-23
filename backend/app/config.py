from pathlib import Path
from typing import List, Union
from pydantic_settings import BaseSettings
from pydantic import ConfigDict, Field, field_validator
import json


class Settings(BaseSettings):
    """Application configuration settings"""

    model_config = ConfigDict(env_file=".env", case_sensitive=False, extra='ignore')

    # API Settings
    api_title: str = Field(default="CareerPilot AI", alias="API_TITLE")
    api_version: str = Field(default="1.0.0", alias="API_VERSION")
    debug: bool = Field(default=True, alias="DEBUG")

    # Server Settings
    host: str = Field(default="0.0.0.0", alias="API_HOST")
    port: int = Field(default=8000, alias="API_PORT")

    # Dataset paths
    dataset_dir: Path = Field(default=Path(__file__).parent.parent / "Dataset", alias="DATASET_DIR")

    # Dataset files
    job_market_csv: str = Field(default="job_market_skills.csv", alias="JOB_MARKET_CSV")
    data_science_csv: str = Field(default="data_science_jobs.csv", alias="DATA_SCIENCE_CSV")
    resumes_csv: str = Field(default="resumes_dataset.csv", alias="RESUMES_CSV")
    skill_recommendation_csv: str = Field(default="skill_career_recommendation.csv", alias="SKILL_RECOMMENDATION_CSV")

    # CORS
    cors_origins: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"], 
        alias="CORS_ORIGINS"
    )

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        """Parse CORS origins from JSON string, comma-separated string, or list"""
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            # Try JSON parsing first
            try:
                parsed = json.loads(v)
                if isinstance(parsed, list):
                    return parsed
            except (json.JSONDecodeError, ValueError):
                pass
            # Fall back to comma-separated parsing
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    @field_validator("dataset_dir", mode="before")
    @classmethod
    def resolve_dataset_dir(cls, v):
        """Resolve dataset directory from absolute/relative/env values."""
        if not v:
            return v

        raw_path = Path(v)
        if raw_path.is_absolute():
            return raw_path

        backend_root = Path(__file__).parent.parent
        workspace_root = backend_root.parent
        candidates = [
            (backend_root / raw_path),
            (workspace_root / raw_path),
            (workspace_root / "Dataset"),
            (workspace_root / "dataset"),
        ]

        for candidate in candidates:
            if candidate.exists():
                return candidate

        return backend_root / raw_path
    
    # Logging
    log_level: str = Field(default="info", alias="LOG_LEVEL")


settings = Settings()
