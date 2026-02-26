from __future__ import annotations

import os
from pathlib import Path


APP_NAME = "SkillGap AI — Skill Gap to Job Market Prediction Engine"
APP_VERSION = "1.0.0"

APP_DIR = Path(__file__).resolve().parent
BACKEND_ROOT = APP_DIR.parent
WORKSPACE_ROOT = BACKEND_ROOT.parent

DATASET_SCAN_DIRS = [
    Path(os.getenv("DATASET_ROOT", "")).resolve()
    if os.getenv("DATASET_ROOT")
    else None,
    WORKSPACE_ROOT / "Backend" / "Dataset",
    APP_DIR / "dataset",
]

VALID_DATASET_DIRS = [path for path in DATASET_SCAN_DIRS if path and path.exists()]

DEFAULT_TOP_SKILLS = [
    "python",
    "sql",
    "machine learning",
    "statistics",
    "data visualization",
    "deep learning",
    "nlp",
    "power bi",
    "tableau",
    "aws",
    "azure",
    "git",
]
