from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import APP_NAME, APP_VERSION, VALID_DATASET_DIRS
from app.routes.analytics import router as analytics_router
from app.routes.predict import router as predict_router
from app.routes.roadmap import router as roadmap_router
from app.routes.upload import router as upload_router
from app.services.data_loader import data_loader
from app.services.prediction_model import prediction_model


app = FastAPI(title=APP_NAME, version=APP_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router)
app.include_router(analytics_router)
app.include_router(roadmap_router)
app.include_router(upload_router)


@app.on_event("startup")
def startup_event() -> None:
    data_loader.load_all()
    prediction_model.initialize()
    app.state.last_prediction = None


@app.get("/")
def health_check() -> dict:
    return {
        "status": "ok",
        "service": APP_NAME,
        "version": APP_VERSION,
        "dataset_dirs": [str(path) for path in VALID_DATASET_DIRS],
    }
