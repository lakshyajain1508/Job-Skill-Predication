from __future__ import annotations

from dataclasses import dataclass

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.services.data_loader import data_loader


@dataclass
class ModelState:
    fitted: bool = False
    vectorizer: TfidfVectorizer | None = None
    role_names: list[str] | None = None
    role_matrix: any = None


class PredictionModel:
    def __init__(self) -> None:
        self.state = ModelState()

    def initialize(self) -> None:
        cache = data_loader.load_all()
        frame: pd.DataFrame = cache.unified_role_skill
        if frame.empty:
            return

        grouped = frame.groupby("role")["skill"].apply(lambda values: " ".join(sorted(set(values)))).reset_index()
        if grouped.empty:
            return

        vectorizer = TfidfVectorizer(ngram_range=(1, 2), lowercase=True)
        role_matrix = vectorizer.fit_transform(grouped["skill"].tolist())

        self.state.vectorizer = vectorizer
        self.state.role_names = grouped["role"].tolist()
        self.state.role_matrix = role_matrix
        self.state.fitted = True

    def predict_closest_role(self, user_skills: list[str]) -> str:
        if not self.state.fitted:
            self.initialize()

        if not self.state.fitted or not self.state.vectorizer or self.state.role_matrix is None:
            return "Data Scientist"

        cleaned = " ".join(skill.strip().lower() for skill in user_skills if skill and skill.strip())
        if not cleaned:
            return "Data Scientist"

        user_vec = self.state.vectorizer.transform([cleaned])
        similarities = cosine_similarity(user_vec, self.state.role_matrix).flatten()
        if similarities.size == 0:
            return "Data Scientist"

        best_index = int(similarities.argmax())
        return str(self.state.role_names[best_index]).title()


prediction_model = PredictionModel()
