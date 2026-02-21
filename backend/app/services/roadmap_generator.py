from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

# Predefined roadmap templates
ROADMAP_TEMPLATES = {
    "python": [
        {
            "week": 1,
            "focus": "Python Fundamentals",
            "tasks": [
                "Learn Python basics (variables, data types, operators)",
                "Practice control flow (if/else, loops)",
                "Solve 5 beginner coding challenges",
            ],
            "estimatedHours": 20,
        },
        {
            "week": 2,
            "focus": "Functions & Modules",
            "tasks": [
                "Master function definitions and parameters",
                "Learn about scope and closures",
                "Create and use Python modules",
            ],
            "estimatedHours": 18,
        },
        {
            "week": 3,
            "focus": "OOP Concepts",
            "tasks": [
                "Understand classes and objects",
                "Learn inheritance and polymorphism",
                "Build 2 small OOP projects",
            ],
            "estimatedHours": 22,
        },
        {
            "week": 4,
            "focus": "Data Processing",
            "tasks": [
                "Introduction to Pandas library",
                "DataFrames and data manipulation",
                "Analyze real datasets",
            ],
            "estimatedHours": 20,
        },
    ],
    "machine learning": [
        {
            "week": 1,
            "focus": "ML Fundamentals",
            "tasks": [
                "Understand supervised vs unsupervised learning",
                "Learn about training, validation, testing",
                "Study evaluation metrics (accuracy, precision, recall)",
            ],
            "estimatedHours": 18,
        },
        {
            "week": 2,
            "focus": "Scikit-learn Basics",
            "tasks": [
                "Install and setup scikit-learn",
                "Train simple classification models",
                "Perform hyperparameter tuning",
            ],
            "estimatedHours": 20,
        },
        {
            "week": 3,
            "focus": "Feature Engineering",
            "tasks": [
                "Feature scaling and normalization",
                "Feature selection techniques",
                "Handle missing values and outliers",
            ],
            "estimatedHours": 22,
        },
        {
            "week": 4,
            "focus": "Real Project",
            "tasks": [
                "Build end-to-end ML pipeline",
                "Deploy model using Flask/FastAPI",
                "Document and present results",
            ],
            "estimatedHours": 30,
        },
    ],
    "web development": [
        {
            "week": 1,
            "focus": "Frontend Basics",
            "tasks": [
                "Master HTML5 and semantic markup",
                "CSS3 styling and responsive design",
                "Learn CSS Flexbox and Grid",
            ],
            "estimatedHours": 20,
        },
        {
            "week": 2,
            "focus": "JavaScript Essentials",
            "tasks": [
                "JavaScript fundamentals and DOM manipulation",
                "Event handling and async programming",
                "Practice with beginner projects",
            ],
            "estimatedHours": 22,
        },
        {
            "week": 3,
            "focus": "Frontend Framework",
            "tasks": [
                "Choose framework (React/Vue/Angular)",
                "Learn component-based architecture",
                "Build interactive components",
            ],
            "estimatedHours": 25,
        },
        {
            "week": 4,
            "focus": "Backend & API",
            "tasks": [
                "Learn backend framework (Node/Python/Java)",
                "Create RESTful APIs",
                "Connect frontend to backend",
            ],
            "estimatedHours": 28,
        },
    ],
    "cloud": [
        {
            "week": 1,
            "focus": "Cloud Fundamentals",
            "tasks": [
                "Understand cloud computing concepts",
                "Learn about AWS, Azure, GCP",
                "Knowledge of Regions and Availability Zones",
            ],
            "estimatedHours": 16,
        },
        {
            "week": 2,
            "focus": "Compute Services",
            "tasks": [
                "Learn about EC2/VMs",
                "Container services (ECS, EKS)",
                "Serverless computing (Lambda, Cloud Functions)",
            ],
            "estimatedHours": 20,
        },
        {
            "week": 3,
            "focus": "Storage & Databases",
            "tasks": [
                "Object storage (S3, Cloud Storage)",
                "Managed databases (RDS, BigQuery)",
                "Data backup and disaster recovery",
            ],
            "estimatedHours": 22,
        },
        {
            "week": 4,
            "focus": "DevOps & Security",
            "tasks": [
                "CI/CD pipelines and automation",
                "Infrastructure as Code (Terraform)",
                "Cloud security best practices",
            ],
            "estimatedHours": 24,
        },
    ],
}


class RoadmapGenerator:
    """Generate AI-powered career roadmaps"""

    def __init__(self, gap_analyzer):
        """Initialize with dependencies"""
        self.gap_analyzer = gap_analyzer

    def generate_roadmap(self, target_role: str, target_skills: List[str], current_experience: int = 0) -> Dict:
        """
        Generate a personalized learning roadmap

        Args:
            target_role: Target career role
            target_skills: Skills to focus on
            current_experience: Experience in months
        """
        # Get priority skills
        priority_skills = self.gap_analyzer.get_priority_skills([], target_role, limit=3)

        # Find matching roadmap template
        roadmap_weeks = self._get_roadmap_template(target_role, target_skills)

        # Adjust based on experience
        if current_experience > 24:
            # Accelerate for experienced users
            roadmap_weeks = self._accelerate_roadmap(roadmap_weeks, 0.8)

        # Add custom notes
        total_hours = sum(week["estimatedHours"] for week in roadmap_weeks)

        return {
            "target_role": target_role,
            "priority_skills": priority_skills,
            "weeks": roadmap_weeks,
            "total_hours": total_hours,
            "estimated_weeks": len(roadmap_weeks),
            "difficulty_level": self._get_difficulty_level(len(priority_skills)),
            "recommendations": self._get_recommendations(target_role, priority_skills),
        }

    def _get_roadmap_template(self, target_role: str, target_skills: List[str]) -> List[Dict]:
        """Get roadmap template based on role and skills"""
        role_lower = target_role.lower()

        # Match skills to templates
        for skill in target_skills:
            skill_lower = skill.lower()
            for template_key in ROADMAP_TEMPLATES:
                if skill_lower in template_key or template_key in skill_lower:
                    return ROADMAP_TEMPLATES[template_key]

        # Try to match role name
        for template_key in ROADMAP_TEMPLATES:
            if template_key in role_lower:
                return ROADMAP_TEMPLATES[template_key]

        # Default: web development
        return ROADMAP_TEMPLATES.get("web development", [])

    def _accelerate_roadmap(self, roadmap: List[Dict], factor: float = 0.8) -> List[Dict]:
        """Accelerate roadmap for experienced users"""
        accelerated = []

        for week in roadmap:
            week_copy = week.copy()
            week_copy["estimatedHours"] = round(week_copy["estimatedHours"] * factor)
            accelerated.append(week_copy)

        return accelerated

    def _get_difficulty_level(self, skills_count: int) -> str:
        """Determine difficulty level"""
        if skills_count > 5:
            return "Advanced"
        elif skills_count > 3:
            return "Intermediate"
        else:
            return "Beginner"

    def _get_recommendations(self, target_role: str, priority_skills: List[str]) -> List[str]:
        """Get learning recommendations"""
        recommendations = [
            f"Start with {priority_skills[0] if priority_skills else 'the fundamentals'}",
            "Build projects weekly to reinforce learning",
            "Join online communities related to your target role",
            "Set aside 15-20 hours per week for dedicated learning",
            "Connect with mentors and industry professionals",
        ]

        if "engineer" in target_role.lower():
            recommendations.append("Focus on coding projects and system design")

        if "data" in target_role.lower():
            recommendations.append("Work with real datasets and practice data manipulation")

        return recommendations

    def get_week_details(self, week_num: int, target_role: str, target_skills: List[str]) -> Dict:
        """Get detailed plan for a specific week"""
        roadmap = self.generate_roadmap(target_role, target_skills)

        if week_num <= 0 or week_num > len(roadmap["weeks"]):
            return {"error": f"Week {week_num} not found in roadmap"}

        week_data = roadmap["weeks"][week_num - 1]

        return {
            "week": week_num,
            "focus": week_data["focus"],
            "tasks": week_data["tasks"],
            "estimatedHours": week_data["estimatedHours"],
            "resources": self._get_resources(week_data["focus"]),
        }

    def _get_resources(self, focus_topic: str) -> List[Dict]:
        """Get learning resources for a topic"""
        resources = [
            {
                "type": "course",
                "name": f"Udemy: {focus_topic} Course",
                "url": f"https://www.udemy.com/search/?q={focus_topic.replace(' ', '%20')}",
            },
            {
                "type": "documentation",
                "name": f"Official {focus_topic} Documentation",
                "url": "https://docs.example.com",
            },
            {"type": "practice", "name": f"LeetCode/HackerRank - {focus_topic} Problems", "url": "https://leetcode.com"},
            {"type": "community", "name": f"Stack Overflow - {focus_topic} Q&A", "url": "https://stackoverflow.com"},
        ]

        return resources
