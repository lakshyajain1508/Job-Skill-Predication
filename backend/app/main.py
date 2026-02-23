from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.config import settings
from app.routes import analyze_router, skill_gap_router, roadmap_router, dashboard_router
from app.services import DatasetLoader, SkillExtractor, JobMarketEngine, GapAnalyzer, RoadmapGenerator
from app.models.schemas import HealthResponse

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title=settings.api_title, version=settings.api_version)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=("*" if settings.debug else settings.cors_origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services as global singletons
logger.info("Initializing services...")

# Dataset loader
dataset_loader = DatasetLoader(settings.dataset_dir)
dataset_loaded = dataset_loader.load_all_datasets()

if dataset_loaded:
    logger.info("✓ Datasets loaded successfully")
else:
    logger.warning("⚠ Could not load all datasets. Using fallback data.")

# Skill extractor
skill_extractor = SkillExtractor()

# Job market engine
job_market_engine = JobMarketEngine(dataset_loader)

# Gap analyzer
gap_analyzer = GapAnalyzer(job_market_engine, skill_extractor)

# Roadmap generator
roadmap_generator = RoadmapGenerator(gap_analyzer)

logger.info("✓ All services initialized successfully")


# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint

    Returns:
        Service status and availability
    """
    return HealthResponse(
        status="healthy",
        message="CareerPilot AI backend is running",
    )


# Include routers
app.include_router(analyze_router)
app.include_router(skill_gap_router)
app.include_router(roadmap_router)
app.include_router(dashboard_router)

# Inject services into routers
from app.routes.analyze import set_gap_analyzer as set_analyze_gap_analyzer
from app.routes.skill_gap import set_gap_analyzer as set_skill_gap_analyzer
from app.routes.roadmap import set_roadmap_generator
from app.routes.dashboard import set_job_market_engine

set_analyze_gap_analyzer(gap_analyzer)
set_skill_gap_analyzer(gap_analyzer)
set_roadmap_generator(roadmap_generator)
set_job_market_engine(job_market_engine)


@app.on_event("startup")
async def startup_event():
    """Called when server starts"""
    logger.info(f"✓ {settings.api_title} v{settings.api_version} started")
    logger.info(f"✓ Available at http://{settings.host}:{settings.port}")


@app.on_event("shutdown")
async def shutdown_event():
    """Called when server shuts down"""
    logger.info(f"✓ {settings.api_title} shut down")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
    )
