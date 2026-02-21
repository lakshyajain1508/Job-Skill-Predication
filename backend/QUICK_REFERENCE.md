# Backend Quick Reference

Fast lookup for common commands and configurations.

## 🚀 Quick Start

```bash
# 1. Navigate to backend
cd e:\JobSkills\backend

# 2. Create virtual environment
python -m venv venv
venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run server
python run.py
```

**Server running at**: http://localhost:8000

## 📌 Core Commands

### Running the Server

```bash
# Basic run
python run.py

# With custom port
python run.py --port 8001

# With reload (auto-restart on changes)
python run.py --reload

# Production mode (4 workers)
python run.py --workers 4

# All options
python run.py --host 0.0.0.0 --port 8000 --reload --workers 4
```

### Python & Package Management

```bash
# Activate virtual environment
venv\Scripts\activate

# Deactivate
deactivate

# Install packages
pip install -r requirements.txt

# Add new package
pip install package-name

# Update requirements
pip freeze > requirements.txt

# List installed packages
pip list

# Check outdated packages
pip list --outdated
```

### Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_file.py

# Run verbose
pytest -v

# Show print output
pytest -s
```

### Code Quality

```bash
# Format code
black .

# Check formatting
black --check .

# Lint code
flake8 .

# Type check
mypy app/

# All checks together
black . && flake8 . && mypy app/
```

## 🔌 API Endpoints

### Health Check
```bash
curl http://localhost:8000/health
```

### Skill Gap Analysis
```bash
curl -X POST http://localhost:8000/api/skill-gap \
  -H "Content-Type: application/json" \
  -d '{"skills": ["Python", "SQL"], "target_role": "Data Engineer"}'
```

### Job Trends
```bash
curl http://localhost:8000/api/job-trends
```

### Dashboard Data
```bash
curl http://localhost:8000/api/dashboard-data
```

### Generate Roadmap
```bash
curl -X POST http://localhost:8000/api/generate-roadmap \
  -H "Content-Type: application/json" \
  -d '{"targetRole": "Data Engineer", "targetSkills": ["Python", "SQL"], "currentExperience": 12}'
```

### API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py              Main app
│   ├── config.py            Settings
│   ├── routes/              API endpoints
│   │   ├── analyze.py
│   │   ├── skill_gap.py
│   │   ├── dashboard.py
│   │   └── roadmap.py
│   ├── services/            Business logic
│   │   ├── dataset_loader.py
│   │   ├── skill_extractor.py
│   │   ├── job_market_engine.py
│   │   ├── gap_analyzer.py
│   │   └── roadmap_generator.py
│   ├── models/
│   │   └── schemas.py       Pydantic models
│   └── utils/
│       └── helpers.py       Utilities
├── dataset/                 CSV files
├── tests/                   Test suite
├── requirements.txt         Dependencies
├── run.py                   Entry point
└── README.md, SETUP.md, etc. Documentation
```

## ⚙️ Configuration

### Main Config File
- **Location**: `app/config.py`
- **Override with**: Environment variables

### Environment Variables
- **Template**: `.env.example`
- **Usage**: Copy to `.env` and modify

Common variables:
```bash
DEBUG=False
API_PORT=8000
CORS_ORIGINS=http://localhost:3000
LOG_LEVEL=info
DATASET_DIR=./dataset
```

## 🔍 Troubleshooting Quick Fixes

### Port Already in Use
```bash
python run.py --port 8001
```

### Module Not Found
```bash
pip install -r requirements.txt
```

### Dataset Not Loading
- Verify files exist in `dataset/` folder
- Check filenames match exactly
- Server uses fallback data if missing

### CORS Errors
Edit `app/config.py` and add your frontend origin to `CORS_ORIGINS`

### Slow Performance
- Add `--reload` for development hot-reload
- Use `--workers 1` to reduce startup time
- Check dataset file sizes

## 📊 Dashboard Data Structure

```json
{
  "overview": {
    "employability_score": 75,
    "market_rank": "65th percentile"
  },
  "skill_distribution": {
    "languages": {"level": 80},
    "frontend": {"level": 75},
    "backend": {"level": 70}
  }
}
```

## 🎯 Skill Categories

Available skill categories:
- Languages (Python, JavaScript, Java, etc.)
- Frontend (React, Vue, HTML, CSS, etc.)
- Backend (Django, FastAPI, Node.js, etc.)
- Database (SQL, MongoDB, PostgreSQL, etc.)
- Data/ML (TensorFlow, Pandas, scikit-learn, etc.)
- Cloud/DevOps (AWS, Docker, Kubernetes, etc.)
- Tools (Git, Linux, Git, etc.)

## 🔐 Security Notes

- No authentication required (v1.0)
- CORS enabled for localhost:3000
- Input validation via Pydantic
- Future versions will have JWT auth

## 📦 Key Dependencies

```
fastapi==0.104.1
uvicorn==0.24.0
pandas==2.1.3
scikit-learn==1.3.2
pydantic==2.5.0
python-multipart==0.0.6
numpy==1.24.3
```

## 🚢 Deployment

### Docker

```bash
# Build image
docker build -t careerpilot-backend .

# Run container
docker run -p 8000:8000 careerpilot-backend
```

### Using Docker Compose

```bash
cd e:\JobSkills
docker-compose up
```

This starts both frontend and backend!

## 📈 Performance Targets

- **Response time**: <150ms average
- **Throughput**: 500+ requests/sec
- **Uptime**: 99%+
- **API availability**: 99.9%

## 🔗 Integration with Frontend

Frontend expects backend at:
```
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

Automatic fallback to mock data if backend unavailable.

## 📚 Documentation Files

Quick navigation:
- **README.md** - Overview
- **SETUP.md** - Installation
- **API_REFERENCE.md** - All endpoints
- **DEVELOPMENT.md** - Developer guide
- **ROADMAP.md** - Future plans
- **INDEX.md** - Full index

## 🎓 Learning Path

1. Read `README.md` (5 min)
2. Follow `SETUP.md` (15 min)
3. Test endpoints in `API_REFERENCE.md` (10 min)
4. Study `DEVELOPMENT.md` (30 min)
5. Check `ROADMAP.md` for future (10 min)

## 🔗 Useful Links

- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **Pydantic Docs**: https://docs.pydantic.dev/
- **Pandas Docs**: https://pandas.pydata.org/docs/
- **Scikit-learn**: https://scikit-learn.org/stable/

## 👥 Getting Help

1. **Setup**: See `SETUP.md` → Troubleshooting
2. **API**: See `API_REFERENCE.md`
3. **Code**: See `DEVELOPMENT.md`
4. **Issues**: Open GitHub issue
5. **Email**: contact@careerpilot.ai

## ✅ Health Check

Done setting up? Test health endpoint:
```bash
curl http://localhost:8000/health
# Should return: {"status":"OK","timestamp":"..."}
```

## 🎯 Next Steps After Setup

1. **Get test data**: Place CSV files in `dataset/`
2. **Test endpoints**: Visit `/docs` for interactive testing
3. **Understand code**: Read `DEVELOPMENT.md`
4. **Add features**: Create new routes and services
5. **Deploy**: Use Docker or cloud platform

## 🔄 Development Workflow

```bash
# 1. Activate environment
venv\Scripts\activate

# 2. Run with reload
python run.py --reload

# 3. Make changes (auto-reloads)

# 4. Test with curl or Postman

# 5. Check code quality
black . && flake8 . && mypy app/

# 6. Run tests
pytest

# 7. Commit changes
git add . && git commit -m "feat: description"
```

## 🆘 Emergency Fixes

```bash
# Kill process on port 8000 (Windows)
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Clear Python cache
find . -type d -name __pycache__ -exec rm -r {} +

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Fresh environment
rm -r venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

## 📊 API Response Times

Expected response times:
- Health check: <10ms
- Skill gap: <50ms
- Job trends: <100ms
- Roadmap generation: <200ms
- Dashboard data: <150ms

If slower, check:
- Dataset file sizes
- System resources
- Network latency
- Database connections

---

**Last Updated**: February 2026

**Version**: 1.0.0

**Status**: ✅ Production Ready
