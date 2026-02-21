# Backend Development Guide

Guide for developers working on the CareerPilot AI backend.

## 🛠 Development Setup

### 1. Clone & Setup
```bash
cd e:\JobSkills\backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install dev dependencies
pip install pytest pytest-cov black flake8 mypy
```

### 2. Project Structure
```
app/
├── main.py              # FastAPI app instance
├── config.py            # Configuration
├── routes/              # API endpoints
├── services/            # Business logic
├── models/
│   └── schemas.py       # Pydantic models
└── utils/
    └── helpers.py       # Helpers
```

## 📝 Code Style

### Formatting with Black
```bash
# Format single file
black app/main.py

# Format entire project
black .

# Check formatting without changing
black --check .
```

### Linting with Flake8
```bash
# Check code style
flake8 app/

# Ignore specific errors
flake8 app/ --ignore=E501,W503
```

### Type Checking with MyPy
```bash
# Check types
mypy app/

# Generate report
mypy app/ --html htmlreport
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_skill_extractor.py

# Run with verbose output
pytest -v

# Run and show print statements
pytest -s
```

### Writing Tests
```python
# tests/test_services.py
import pytest
from app.services.skill_extractor import SkillExtractor

@pytest.fixture
def extractor():
    return SkillExtractor()

def test_extract_from_text(extractor):
    skills = extractor.extract_from_text("I know Python and JavaScript")
    assert "python" in skills
    assert "javascript" in skills

def test_extract_empty_text(extractor):
    skills = extractor.extract_from_text("")
    assert len(skills) == 0
```

### Test Coverage
```bash
# Generate coverage report
pytest --cov=app --cov-report=html

# View report
start htmlcov/index.html
```

## 🔧 Adding New Features

### 1. Create New Endpoint

#### Step 1: Define Schema
In `app/models/schemas.py`:
```python
from pydantic import BaseModel
from typing import List

class MyRequest(BaseModel):
    param1: str
    param2: int

class MyResponse(BaseModel):
    result: str
    scores: List[float]
```

#### Step 2: Create Route
In `app/routes/my_feature.py`:
```python
from fastapi import APIRouter
from app.models.schemas import MyRequest, MyResponse

router = APIRouter(prefix="/api", tags=["my-feature"])

@router.post("/my-endpoint")
async def my_endpoint(request: MyRequest) -> MyResponse:
    """
    Detailed docstring for API docs
    """
    # Implementation
    return MyResponse(result="...", scores=[...])
```

#### Step 3: Register Route
In `app/main.py`:
```python
from app.routes import my_feature

app.include_router(my_feature.router)
```

### 2. Create New Service

In `app/services/my_service.py`:
```python
import logging

logger = logging.getLogger(__name__)

class MyService:
    def __init__(self, dependency):
        self.dependency = dependency
        logger.info("MyService initialized")
    
    def on_startup(self):
        """Called when app starts"""
        logger.info("Starting MyService")
    
    def on_shutdown(self):
        """Called when app stops"""
        logger.info("Stopping MyService")
    
    def process(self, data):
        """Main processing logic"""
        return self.dependency.get_data()
```

Initialize in `app/main.py`:
```python
from app.services.my_service import MyService

my_service = MyService(dependency)

@app.on_event("startup")
async def startup():
    my_service.on_startup()

@app.on_event("shutdown")
async def shutdown():
    my_service.on_shutdown()
```

### 3. Add Dataset Processing

Edit `app/services/dataset_loader.py`:
```python
def load_my_dataset(self):
    """Load new dataset"""
    try:
        df = pd.read_csv(self.dataset_dir / "my_data.csv")
        logger.info(f"Loaded {len(df)} rows")
        return df
    except FileNotFoundError:
        logger.warning("Dataset not found, using empty fallback")
        return pd.DataFrame()
```

## 🔄 Working with Datasets

### Load CSV
```python
import pandas as pd

df = pd.read_csv("dataset/job_market_skills.csv")
print(df.head())
print(df.info())
```

### Analyze Data
```python
# Top skills by demand
top_skills = df.nlargest(10, 'demand_percentage')

# Group by category
by_category = df.groupby('category')['skill'].count()

# Filter data
advanced_skills = df[df['difficulty'] == 'Advanced']
```

### Save Modified Data
```python
df.to_csv("dataset/modified.csv", index=False)
```

## 🐛 Debugging

### Add Logging
```python
import logging

logger = logging.getLogger(__name__)

logger.debug("Debug message")
logger.info("Info message")
logger.warning("Warning message")
logger.error("Error message")
```

### Debug in FastAPI
```python
# In your route
import pdb

@app.get("/debug")
def debug_endpoint():
    pdb.set_trace()  # Will break here
    return {"status": "ok"}
```

### Inspect Requests/Responses
```python
from fastapi import Request

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"{request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Status: {response.status_code}")
    return response
```

## 🚀 Performance Optimization

### Caching
```python
from functools import lru_cache

@lru_cache(maxsize=128)
def expensive_function(param):
    # Cached results
    return compute(param)
```

### Async Operations
```python
import asyncio

async def process_async():
    tasks = [async_task_1(), async_task_2()]
    results = await asyncio.gather(*tasks)
    return results
```

### Database Connection Pooling
```python
from sqlalchemy import create_engine
from sqlalchemy.pool import NullPool

engine = create_engine(
    DATABASE_URL,
    poolclass=NullPool,  # For SQLite
    pool_size=20,        # For production databases
    max_overflow=40
)
```

## 📦 Dependency Management

### Add New Package
```bash
pip install package-name
pip freeze > requirements.txt
```

### Update Packages
```bash
pip install --upgrade package-name
pip list --outdated
pip install -U -r requirements.txt
```

### Remove Package
```bash
pip uninstall package-name
pip freeze > requirements.txt
```

## 🔐 Security Best Practices

### Input Validation
Use Pydantic models (already done!)

### SQL Injection Prevention
Use parameterized queries:
```python
# Good
df[df['skill'] == user_input]

# Avoid
df.query(f"skill == '{user_input}'")
```

### CORS Configuration
In `app/config.py`:
```python
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
]
```

### Environment Variables
```python
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("API_KEY", "default")
```

## 📊 Monitoring

### Health Checks
```bash
curl http://localhost:8000/health
```

### Metrics Endpoint
```python
from prometheus_client import Counter, Histogram

requests_total = Counter('requests_total', 'Total requests')
request_duration = Histogram('request_duration', 'Request duration')

@app.get("/metrics")
def metrics():
    return {"requests": requests_total._value}
```

### Logging Setup
In `app/main.py`:
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
```

## 🚢 Deployment Checklist

- [ ] All tests passing (`pytest`)
- [ ] Code formatted (`black .`)
- [ ] No linting errors (`flake8 .`)
- [ ] Type checking passing (`mypy .`)
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Dataset files present
- [ ] CORS configured for production
- [ ] Error handling complete
- [ ] Logging configured
- [ ] Documentation updated

## 🔗 API Versioning

### Current Version
API is currently at v1 (implied by `/api/` prefix)

### Future Versions
```python
# For v2
app.include_router(router_v1, prefix="/api/v1")
app.include_router(router_v2, prefix="/api/v2")
```

## 📚 Useful Commands

```bash
# Activate virtual environment
venv\Scripts\activate

# Deactivate
deactivate

# Check Python version
python --version

# Run server
python run.py

# Run tests
pytest -v

# Format code
black .

# Check code style
flake8 .

# Type check
mypy .

# Generate requirements
pip freeze > requirements.txt

# Clean cache
find . -type d -name __pycache__ -exec rm -r {} +
```

## 🎯 Common Issues & Solutions

### Issue: Circular imports
**Solution**: Reorganize imports, move to separate modules

### Issue: Slow startup
**Solution**: Lazy load large datasets, use async initialization

### Issue: Memory leak
**Solution**: Proper cleanup in shutdown handlers, use generators for large data

### Issue: API timeout
**Solution**: Move heavy computation to background tasks, increase timeout values

## 📖 Architecture Decisions

### Why Pydantic?
- Type validation
- Automatic documentation
- JSON serialization
- IDE autocompletion

### Why Pandas?
- CSV handling
- Data manipulation
- Statistical operations
- Widely known by ML engineers

### Why Scikit-learn?
- ML algorithms
- Data preprocessing
- Feature engineering
- Well-documented

### Why Singleton Pattern?
- Single instance per service
- Avoid reloading datasets
- Shared state management
- Memory efficient

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
git add .

# Commit
git commit -m "feat: add my feature"

# Push
git push origin feature/my-feature

# Create Pull Request on GitHub
```

## 📞 Contact & Support

For questions about backend development:
1. Check this guide
2. Review service documentation
3. Look at test examples
4. Check FastAPI official docs

---

**Status**: ✅ Development Ready

**Version**: 1.0.0

**Last Updated**: February 2026
