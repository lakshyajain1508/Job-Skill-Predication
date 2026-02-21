import re
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

# Common technical skills database
TECHNICAL_SKILLS = {
    # Languages
    "python": ["python", "py"],
    "javascript": ["javascript", "js"],
    "typescript": ["typescript", "ts"],
    "java": ["java"],
    "csharp": ["c#", "csharp"],
    "go": ["golang", "go"],
    "rust": ["rust"],
    "ruby": ["ruby"],
    "php": ["php"],
    "swift": ["swift"],
    "kotlin": ["kotlin"],
    "r": ["r (programming)", "r-language"],
    "scala": ["scala"],
    "sql": ["sql", "mysql", "postgresql", "sqlserver"],
    # Frontend
    "react": ["react", "reactjs"],
    "vue": ["vue", "vuejs"],
    "angular": ["angular"],
    "html": ["html", "html5"],
    "css": ["css", "css3", "scss", "sass"],
    "tailwind": ["tailwind", "tailwindcss"],
    "bootstrap": ["bootstrap"],
    # Backend
    "nodejs": ["nodejs", "node.js", "node"],
    "django": ["django"],
    "flask": ["flask"],
    "fastapi": ["fastapi"],
    "spring": ["spring", "springboot"],
    "express": ["express", "expressjs"],
    ".net": [".net", "dotnet"],
    # Databases
    "mongodb": ["mongodb", "mongo"],
    "postgresql": ["postgresql", "postgres", "pg"],
    "mysql": ["mysql"],
    "redis": ["redis"],
    "dynamodb": ["dynamodb"],
    "cassandra": ["cassandra"],
    # Data & ML
    "machine learning": ["machine learning", "ml", "deep learning"],
    "tensorflow": ["tensorflow"],
    "pytorch": ["pytorch"],
    "scikit-learn": ["scikit-learn", "sklearn"],
    "pandas": ["pandas"],
    "numpy": ["numpy"],
    "opencv": ["opencv"],
    "nlp": ["nlp", "natural language processing"],
    "data science": ["data science"],
    # Cloud & DevOps
    "aws": ["aws", "amazon web services"],
    "gcp": ["gcp", "google cloud"],
    "azure": ["azure", "microsoft azure"],
    "docker": ["docker", "dockerization"],
    "kubernetes": ["kubernetes", "k8s"],
    "jenkins": ["jenkins"],
    "ci/cd": ["ci/cd", "continuous integration"],
    "terraform": ["terraform"],
    "ansible": ["ansible"],
    # Other tools
    "git": ["git", "github", "gitlab"],
    "linux": ["linux", "ubuntu"],
    "windows": ["windows"],
    "graphql": ["graphql"],
    "rest api": ["rest api", "restful"],
    "websocket": ["websocket"],
    "apache": ["apache"],
    "nginx": ["nginx"],
    "jira": ["jira"],
    "agile": ["agile", "scrum"],
}

# Reverse mapping for faster lookup
SKILLS_REVERSE = {}
for main_skill, aliases in TECHNICAL_SKILLS.items():
    for alias in aliases:
        SKILLS_REVERSE[alias.lower()] = main_skill


class SkillExtractor:
    """Extract skills from resume text"""

    def __init__(self):
        """Initialize skill extractor"""
        self.all_skills = list(TECHNICAL_SKILLS.keys())

    def extract_from_text(self, text: str) -> List[str]:
        """Extract skills from resume text"""
        if not text:
            return []

        text = text.lower()
        found_skills = set()

        # Use regex and keyword matching
        for skill, aliases in TECHNICAL_SKILLS.items():
            for alias in aliases:
                # Create word boundary pattern
                pattern = r"\b" + re.escape(alias) + r"\b"
                if re.search(pattern, text, re.IGNORECASE):
                    found_skills.add(skill)
                    break

        return sorted(list(found_skills))

    def extract_from_list(self, skills_list: List[str]) -> List[str]:
        """Extract and normalize skills from a list"""
        normalized_skills = set()

        for skill in skills_list:
            if not skill:
                continue

            skill_clean = skill.lower().strip()

            # Direct match
            if skill_clean in SKILLS_REVERSE:
                normalized_skills.add(SKILLS_REVERSE[skill_clean])
            # Check main skills
            elif skill_clean.lower() in self.all_skills:
                normalized_skills.add(skill_clean.lower())
            # Partial match
            else:
                for main_skill, aliases in TECHNICAL_SKILLS.items():
                    if any(alias.lower() in skill_clean for alias in aliases):
                        normalized_skills.add(main_skill)
                        break

        return sorted(list(normalized_skills))

    def get_skill_category(self, skill: str) -> str:
        """Categorize skill"""
        skill_lower = skill.lower()

        categories = {
            "language": ["python", "javascript", "java", "csharp", "go", "rust", "ruby", "php", "sql", "r", "kotlin", "scala"],
            "frontend": ["react", "vue", "angular", "html", "css", "tailwind", "bootstrap"],
            "backend": ["nodejs", "django", "flask", "fastapi", "spring", ".net", "express"],
            "database": ["mongodb", "postgresql", "mysql", "redis", "dynamodb", "cassandra"],
            "data_ml": ["machine learning", "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy", "nlp"],
            "cloud_devops": ["aws", "gcp", "azure", "docker", "kubernetes", "jenkins", "ci/cd", "terraform"],
            "tools": ["git", "jira", "linux", "agile"],
        }

        for category, skills in categories.items():
            if skill_lower in skills:
                return category

        return "other"

    def get_all_skills(self) -> List[str]:
        """Get all available skills"""
        return sorted(self.all_skills)
