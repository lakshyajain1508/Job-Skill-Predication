from __future__ import annotations


ROADMAP_LIBRARY = {
    "python": ["Advanced Python Syntax", "Data Structures in Python", "Performance Optimization"],
    "sql": ["Joins and Subqueries", "Window Functions", "Query Optimization"],
    "machine learning": ["Supervised Learning", "Model Evaluation", "Scikit-learn Workflows"],
    "statistics": ["Probability Foundations", "Hypothesis Testing", "A/B Test Interpretation"],
    "deep learning": ["Neural Networks", "Tensor Operations", "Model Tuning"],
    "nlp": ["Text Preprocessing", "Embedding Basics", "Prompt-driven NLP Apps"],
    "power bi": ["Data Modeling", "DAX Essentials", "Dashboard Storytelling"],
    "tableau": ["Calculated Fields", "Visual Design Best Practices", "Interactive Dashboards"],
    "mlops": ["Model Deployment Basics", "Monitoring Pipelines", "CI/CD for ML"],
}


class RoadmapGenerator:
    def generate(self, missing_skills: list[str]) -> dict:
        if not missing_skills:
            missing_skills = ["machine learning", "statistics", "data visualization"]

        steps = []
        for skill in missing_skills[:6]:
            key = skill.strip().lower()
            modules = ROADMAP_LIBRARY.get(
                key,
                [
                    f"{skill.title()} Fundamentals",
                    f"Applied {skill.title()} Project",
                    f"{skill.title()} Interview Readiness",
                ],
            )

            steps.append(
                {
                    "title": f"{skill.title()} Advanced",
                    "duration": "2 weeks",
                    "modules": modules,
                }
            )

        return {"steps": steps}


roadmap_generator = RoadmapGenerator()
