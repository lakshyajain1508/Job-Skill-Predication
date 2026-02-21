# CareerPilot AI - Backend API

A FastAPI-based backend for career intelligence analytics and AI-powered skill gap analysis.

## 🚀 Features

- **Resume Analysis** - Extract skills from resume files
- **Skill Gap Detection** - Compare user skills with market requirements
- **Job Market Analytics** - Track skill demand and job trends
- **AI Roadmap Generation** - Create personalized learning paths
- **Dashboard Data** - Comprehensive career analytics

## 📋 Prerequisites

- Python 3.10 or higher
- pip package manager
- CSV datasets in `/dataset` folder

## 🛠 Installation

### 1. Install Dependencies

```bash
cd e:\JobSkills\backend
pip install -r requirements.txt
```

### 2. Prepare Datasets

Place CSV files in the `/dataset` folder:
- `job_market_skills.csv`
- `data_science_jobs.csv`
- `resumes_dataset.csv`
- `skill_career_recommendation.csv`

**Note**: If CSV files are missing, the API will still work with fallback data.

### 3. Run the Server

```bash
python run.py
```

Or with options:
```bash
python run.py --port 8001 --reload
```

Server will be available at: **http://localhost:8000**

## 📚 API Endpoints

### Health Check
```
GET /health
```
Returns server status.

### Resume Analysis
```
POST /api/analyze-resume
Content-Type: multipart/form-data

Parameters:
- file: Resume file (PDF/DOCX)
- skills: JSON list of skills
- target_role: Target job role

Response:
{
  "employability_score": 75.0,
  "key_strengths": ["Python", "React"],
  "missing_skills": [
    {"skill": "AWS", "demand": 92, "importance": "high"}
  ],
  "career_recommendations": [...]
}
```

### Skill Gap Analysis
```
POST /api/skill-gap
Content-Type: application/json

Body:
{
  "skills": ["Python", "JavaScript"],
  "target_role": "Data Engineer"
}

Response:
{
  "current_skills": [{"skill": "Python", "level": 75}],
  "required_skills": [{"skill": "SQL", "level": 90}],
  "gap_percentage": 45.5,
  "priority_skills": ["SQL", "Spark"]
}
```

### Job Market Trends
```
GET /api/job-trends
GET /api/dashboard-data

Response:
{
  "trends": [...],
  "top_skills": [...],
  "top_roles": [...]
}
```

### Generate Roadmap
```
POST /api/generate-roadmap
Content-Type: application/json

Body:
{
  "targetRole": "Data Engineer",
  "targetSkills": ["Python", "SQL"],
  "currentExperience": 12
}

Response:
{
  "weeks": [
    {
      "week": 1,
      "focus": "Data Fundamentals",
      "tasks": [...],
      "difficulty": "Beginner",
      "estimatedHours": 20
    }
  ],
  "totalHours": 80,
  "targetRole": "Data Engineer"
}
```

## 🏗 Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI entry point
│   ├── config.py               # Configuration settings
│   │
│   ├── routes/                 # API route handlers
│   │   ├── analyze.py
│   │   ├── skill_gap.py
│   │   ├── roadmap.py
│   │   └── dashboard.py
│   │
│   ├── services/               # Business logic
│   │   ├── dataset_loader.py   # Load CSV datasets
│   │   ├── skill_extractor.py  # Extract skills from text
│   │   ├── job_market_engine.py # Market analysis
│   │   ├── gap_analyzer.py     # Skill gap calculation
│   │   └── roadmap_generator.py # Roadmap creation
│   │
│   ├── models/                 # Pydantic schemas
│   │   └── schemas.py          # Request/response models
│   │
│   ├── utils/                  # Helper functions
│   │   └── helpers.py          # Utility functions
│   │
│   └── __init__.py
│
├── dataset/                    # CSV data files
│   ├── job_market_skills.csv
│   ├── data_science_jobs.csv
│   ├── resumes_dataset.csv
│   └── skill_career_recommendation.csv
│
├── run.py                      # Entry point script
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

## 🔌 Services

### DatasetLoader
Loads and manages CSV datasets.

```python
loader = DatasetLoader(dataset_dir)
loader.load_all_datasets()
skills = loader.get_all_skills()
demand = loader.get_skill_demand()
```

### SkillExtractor
Extracts skills from text using keyword matching.

```python
extractor = SkillExtractor()
skills = extractor.extract_from_text("I know Python and Machine Learning")
# Returns: ["python", "machine learning"]
```

### JobMarketEngine
Analyzes job market trends and skill demand.

```python
engine = JobMarketEngine(dataset_loader)
trends = engine.get_market_trends()
top_skills = engine.get_top_skills(10)
```

### GapAnalyzer
Calculates skill gaps and employability scores.

```python
analyzer = GapAnalyzer(job_market_engine, skill_extractor)
gap = analyzer.analyze_gap(user_skills, required_skills)
score = analyzer.calculate_employability_score(skills, role)
```

### RoadmapGenerator
Generates learning roadmaps.

```python
generator = RoadmapGenerator(gap_analyzer)
roadmap = generator.generate_roadmap(role, skills, experience_months=12)
```

## 🔧 Configuration

Edit `app/config.py` to customize:
- `API_TITLE`: API name
- `HOST`: Server host
- `PORT`: Server port
- `DATASET_DIR`: Path to datasets
- `CORS_ORIGINS`: Allowed origins

Environment variables can override config:
```bash
DEBUG=true python run.py
```

## 🧪 Testing Endpoints

### Using cURL

```bash
# Health check
curl http://localhost:8000/health

# Get job trends
curl http://localhost:8000/api/job-trends

# Skill gap analysis
curl -X POST http://localhost:8000/api/skill-gap \
  -H "Content-Type: application/json" \
  -d '{
    "skills": ["Python", "React"],
    "target_role": "Full Stack Developer"
  }'

# Generate roadmap
curl -X POST http://localhost:8000/api/generate-roadmap \
  -H "Content-Type: application/json" \
  -d '{
    "targetRole": "Data Engineer",
    "targetSkills": ["Python", "SQL"],
    "currentExperience": 6
  }'
```

### Using Python

```python
import requests

# Skill gap
response = requests.post(
    "http://localhost:8000/api/skill-gap",
    json={
        "skills": ["Python", "Machine Learning"],
        "target_role": "ML Engineer"
    }
)
print(response.json())
```

### Using Postman

1. Open Postman
2. Create new POST request
3. Set URL: `http://localhost:8000/api/skill-gap`
4. Set Body (JSON):
```json
{
  "skills": ["Python", "TensorFlow"],
  "target_role": "ML Engineer"
}
```
5. Click Send

## 📊 Skills Database

The following skill categories are supported:

- **Languages**: Python, JavaScript, Java, C#, Go, Rust, Ruby, SQL
- **Frontend**: React, Vue, Angular, HTML, CSS, Tailwind
- **Backend**: Node.js, Django, Flask, FastAPI, Spring
- **Database**: MongoDB, PostgreSQL, MySQL, Redis
- **Data/ML**: Machine Learning, TensorFlow, PyTorch, Pandas
- **Cloud/DevOps**: AWS, GCP, Azure, Docker, Kubernetes
- **Tools**: Git, Jira, Linux, Agile

## 🔐 Security

- CORS enabled for frontend origin
- Input validation with Pydantic
- Error handling with logging
- No sensitive data in responses

## 📈 Performance

- Lazy loading of datasets
- In-memory caching for skill demand
- Lightweight models for fast inference
- Async API endpoints

## 🐛 Troubleshooting

### "ModuleNotFoundError: No module named 'fastapi'"
```bash
pip install -r requirements.txt
```

### "Dataset not found"
Place CSV files in `/dataset` folder. API will use fallback data if missing.

### Port 8000 already in use
```bash
python run.py --port 8001
```

### CORS errors
Check `app/config.py` and add your frontend origin to `CORS_ORIGINS`.

## 📚 API Documentation

When running, interactive docs are available at:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🚀 Deployment

### Docker

```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "run.py"]
```

### Run with Docker

```bash
docker build -t careerpilot-backend .
docker run -p 8000:8000 careerpilot-backend
```

### Production

```bash
python run.py --workers 4 --port 8000
```

Use Gunicorn or similar for production deployment.

## 🔄 Frontend Connection

Frontend expects these environment variables:
```
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

The frontend will automatically:
- Try connecting to backend
- Use mock data if backend is offline
- Retry if backend comes online

## 📖 Resources

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Pydantic Docs](https://docs.pydantic.dev/)
- [Pandas Docs](https://pandas.pydata.org/docs/)
- [Scikit-learn Docs](https://scikit-learn.org/stable/)

## 📞 Support

For issues or questions:
1. Check `/health` endpoint
2. Review logs for errors
3. Verify dataset files exist
4. Check CORS configuration

## 📄 License

MIT License - Feel free to use this project

---

**Status**: ✅ Ready for development and deployment

**Last Updated**: February 2026

**Version**: 1.0.0
