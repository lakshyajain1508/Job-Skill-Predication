# Backend Setup Guide

Complete step-by-step guide to set up and run the CareerPilot AI backend.

## Prerequisites Check

Before starting, ensure you have:

```bash
# Check Python version (3.10+)
python --version

# Check pip is installed
pip --version
```

## 📦 Step 1: Install Dependencies

### Option A: Manual Installation
```bash
cd e:\JobSkills\backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Option B: Direct Installation
```bash
cd e:\JobSkills\backend
pip install fastapi uvicorn pandas scikit-learn python-multipart pydantic numpy
```

### Verify Installation
```bash
python -c "import fastapi; print(f'FastAPI {fastapi.__version__} installed')"
```

## 📊 Step 2: Prepare Dataset Files

### Create Dataset Directory
```bash
mkdir dataset
```

### Dataset Files Required

Create these CSV files in `e:\JobSkills\backend\dataset\`:

#### 1. job_market_skills.csv
```csv
skill,demand_percentage,experience_months,difficulty
Python,95,36,Intermediate
JavaScript,88,24,Intermediate
SQL,92,30,Intermediate
AWS,85,24,Advanced
Docker,78,18,Intermediate
React,82,20,Intermediate
Machine Learning,81,48,Advanced
```

#### 2. data_science_jobs.csv
```csv
job_title,required_skills,salary_range,experience_level,growth_rate
Data Engineer,Python;SQL;Spark;AWS,120000-180000,Senior,15
Data Scientist,Python;ML;Statistics;SQL,110000-170000,Mid-Level,18
ML Engineer,Python;TensorFlow;AWS;Docker,130000-190000,Senior,22
Analytics Engineer,SQL;Python;BI Tools,100000-150000,Mid-Level,12
```

#### 3. resumes_dataset.csv
```csv
resume_id,skills,experience_months,education,target_role
1,Python;JavaScript;React,24,Bachelor,Full Stack Developer
2,Python;Machine Learning;SQL,48,Master,Data Scientist
3,Java;Spring Boot;Docker,36,Bachelor,Backend Engineer
4,Python;NumPy;Pandas;TensorFlow,60,Master,ML Engineer
```

#### 4. skill_career_recommendation.csv
```csv
skill,related_roles,importance_level,learning_path,resources
Python,Data Science;Backend;ML,Critical,Beginner -> Intermediate -> Advanced,Python.org;Codecademy
JavaScript,Frontend;Full Stack,High,Beginner -> Intermediate,MDN;udemy.com
SQL,Data;Backend,Critical,Beginner -> Intermediate,Mode SQL;LeetCodeSQL
Docker,DevOps;Full Stack,Medium,Intermediate -> Advanced,Docker Docs;Pluralsight
```

### Option: Use Sample Data Generator

```python
# Create a script to generate sample data
import os
import pandas as pd

os.makedirs('dataset', exist_ok=True)

# Job Market Skills
job_market = pd.DataFrame({
    'skill': ['Python', 'JavaScript', 'SQL', 'AWS', 'Docker', 'React', 'Machine Learning'],
    'demand_percentage': [95, 88, 92, 85, 78, 82, 81],
    'experience_months': [36, 24, 30, 24, 18, 20, 48],
    'difficulty': ['Intermediate', 'Intermediate', 'Intermediate', 'Advanced', 'Intermediate', 'Intermediate', 'Advanced']
})
job_market.to_csv('dataset/job_market_skills.csv', index=False)

# Data Science Jobs
data_science = pd.DataFrame({
    'job_title': ['Data Engineer', 'Data Scientist', 'ML Engineer'],
    'required_skills': ['Python;SQL;Spark;AWS', 'Python;ML;Statistics;SQL', 'Python;TensorFlow;AWS;Docker'],
    'salary_range': ['120000-180000', '110000-170000', '130000-190000'],
    'experience_level': ['Senior', 'Mid-Level', 'Senior'],
    'growth_rate': [15, 18, 22]
})
data_science.to_csv('dataset/data_science_jobs.csv', index=False)

# Resumes
resumes = pd.DataFrame({
    'resume_id': [1, 2, 3, 4],
    'skills': ['Python;JavaScript;React', 'Python;ML;SQL', 'Java;Spring Boot;Docker', 'Python;NumPy;Pandas;TensorFlow'],
    'experience_months': [24, 48, 36, 60],
    'education': ['Bachelor', 'Master', 'Bachelor', 'Master'],
    'target_role': ['Full Stack Developer', 'Data Scientist', 'Backend Engineer', 'ML Engineer']
})
resumes.to_csv('dataset/resumes_dataset.csv', index=False)

# Skill Recommendations
recommendations = pd.DataFrame({
    'skill': ['Python', 'JavaScript', 'SQL', 'Docker'],
    'related_roles': ['Data Science;Backend;ML', 'Frontend;Full Stack', 'Data;Backend', 'DevOps;Full Stack'],
    'importance_level': ['Critical', 'High', 'Critical', 'Medium'],
    'learning_path': ['Beginner->Intermediate->Advanced'] * 4,
    'resources': ['Python.org', 'MDN', 'Mode SQL', 'Docker Docs']
})
recommendations.to_csv('dataset/skill_career_recommendation.csv', index=False)

print("✅ Dataset files created successfully!")
```

Save as `create_datasets.py` and run:
```bash
python create_datasets.py
```

## 🚀 Step 3: Run the Server

### Start Development Server
```bash
cd e:\JobSkills\backend
python run.py
```

Expected output:
```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### Run with Options
```bash
# Different port
python run.py --port 8001

# Enable hot reload
python run.py --reload

# Multiple workers for production
python run.py --workers 4 --port 8000

# Verbose logging
python run.py --reload --log-level debug
```

### Alternative: Use Uvicorn Directly
```bash
python -m uvicorn app.main:app --reload --port 8000
```

## ✅ Step 4: Verify Server

### Via Browser
Visit these URLs:
- **API Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

### Via Command Line
```bash
# Health check
curl http://localhost:8000/health

# Should return:
# {"status":"OK","timestamp":"2024-02-15T10:30:00"}
```

### Via Python
```python
import requests

response = requests.get("http://localhost:8000/health")
print(response.json())
# Output: {'status': 'OK', 'timestamp': '...'}
```

## 🔌 Step 5: Test API Endpoints

### Test Skill Gap Analysis
```bash
curl -X POST http://localhost:8000/api/skill-gap \
  -H "Content-Type: application/json" \
  -d "{\"skills\": [\"Python\", \"SQL\"], \"target_role\": \"Data Engineer\"}"
```

### Test Job Trends
```bash
curl http://localhost:8000/api/job-trends
```

### Test Dashboard Data
```bash
curl http://localhost:8000/api/dashboard-data
```

### Test Roadmap Generation
```bash
curl -X POST http://localhost:8000/api/generate-roadmap \
  -H "Content-Type: application/json" \
  -d "{\"targetRole\": \"Data Engineer\", \"targetSkills\": [\"Python\", \"SQL\"], \"currentExperience\": 12}"
```

## 🔗 Step 6: Connect Frontend

### In Frontend Configuration
Set environment variable:
```bash
# .env.local in frontend folder
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

### Test Frontend-Backend Connection
1. Start backend: `python run.py`
2. Open another terminal
3. Start frontend: `cd ../frontend && npm run dev`
4. Visit http://localhost:3000
5. Upload a resume - should connect to backend

## 🐳 Step 7: Docker Setup (Optional)

### Build Docker Image
```bash
cd e:\JobSkills\backend

docker build -t careerpilot-backend .
```

### Run in Docker
```bash
docker run -p 8000:8000 careerpilot-backend
```

### Using Docker Compose
From `e:\JobSkills\` root:
```bash
docker-compose up
```

This starts both frontend and backend!

## 🆘 Troubleshooting

### Issue: "Module not found" error
**Solution**:
```bash
pip install -r requirements.txt
python -m pip install --upgrade pip
```

### Issue: Port 8000 already in use
**Solution**:
```bash
# Use different port
python run.py --port 8001

# Or find process using port
# Windows:
netstat -ano | findstr :8000
# Kill process:
taskkill /PID <PID> /F
```

### Issue: Dataset files not loading
**Solution**:
- Check files are in `e:\JobSkills\backend\dataset\`
- Verify file names match exactly (case-sensitive on Linux)
- Check CSV format is valid (comma-separated, UTF-8 encoding)
- Server will use fallback data if files missing

### Issue: CORS errors when connecting frontend
**Solution**:
Edit `app/config.py`:
```python
CORS_ORIGINS = ["http://localhost:3000", "http://localhost:3001"]
```

### Issue: Dataset loading errors
**Solution**:
Add debug logging in `app/main.py`:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

Then restart server to see detailed logs.

## 📝 Environment Variables

Optional environment variables:

```bash
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
API_TITLE="CareerPilot AI"
DEBUG=true

# Dataset
DATASET_DIR=./dataset
FALLBACK_ON_MISSING_DATA=true

# CORS
CORS_ORIGINS=["http://localhost:3000"]

# Logging
LOG_LEVEL=info
```

## ✨ Next Steps

1. **Data**: Customize CSV files with real data
2. **ML Models**: Add sklearn models for better predictions
3. **Database**: Connect to PostgreSQL/MongoDB for persistence
4. **Caching**: Add Redis for performance
5. **Authentication**: Add JWT token validation
6. **Testing**: Create pytest test suite
7. **Deployment**: Deploy to Heroku, Railway, or AWS

## 📚 Learning Resources

- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [Uvicorn Documentation](https://www.uvicorn.org/)
- [Pandas Guide](https://pandas.pydata.org/docs/user_guide/)
- [Scikit-learn Examples](https://scikit-learn.org/stable/auto_examples/)

## 🎯 Common Tasks

### Add New Endpoint
1. Create route in `app/routes/`
2. Define schemas in `app/models/schemas.py`
3. Import in `app/main.py`
4. Test with `/docs`

### Add New Service
1. Create file in `app/services/`
2. Initialize in `main.py` as singleton
3. Inject into routes

### Update Dataset Logic
Edit `app/services/dataset_loader.py`

### Add New Skill
Edit `app/services/skill_extractor.py` TECHNICAL_SKILLS dict

---

**Status**: ✅ Ready for Production

**Version**: 1.0.0

**Last Updated**: February 2026
