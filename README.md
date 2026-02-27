# Job Skill Predication (SkillGap AI)

Full-stack AI-powered app that predicts career fit from user skills, identifies missing skills, and generates a learning roadmap based on job-market data.

## Project Overview

This project has two main parts:

- **Backend (FastAPI + ML utilities)**
  - Loads CSV job datasets
  - Builds a role-skill matrix
  - Predicts closest career role using TF-IDF + cosine similarity
  - Computes skill-gap, analytics, market intelligence, and roadmap steps
- **Frontend (React + Vite)**
  - Multi-page dashboard experience
  - Collects profile + skills + resume
  - Calls backend APIs and visualizes predictions/analytics

## Tech Stack

- **Backend**: FastAPI, Uvicorn, Pandas, NumPy, scikit-learn, Pydantic
- **Frontend**: React 19, Vite, React Router, Framer Motion, Recharts, Axios, Tailwind CSS v4

## Repository Structure

```text
Backend/
  app/
    main.py                 # FastAPI app setup + startup initialization
    config.py               # App constants + dataset discovery paths
    models/schemas.py       # Request/response models
    routes/                 # API endpoints
    services/               # Core business and ML logic
  requirements.txt
  run.py

Frontend/
  src/
    App.jsx                 # Route shell and page routing
    pages/                  # Home, Dashboard, SkillInput, Results, Roadmap, Analytics
    api/                    # Axios client + endpoint wrappers
  package.json

Dataset/
  Data Science Job Postings & Skills (2024)/
```

## How It Works (End-to-End)

1. **Backend startup** (`Backend/app/main.py`)
   - Loads all CSV files from configured dataset directories
   - Builds unified `role -> skills` and market-demand aggregates
   - Initializes prediction model (TF-IDF vectors per role)
   - Primes intelligence cache (growth, volatility, saturation, salary estimates)

2. **User input flow** (`Frontend/src/pages/SkillInput.jsx`)
   - User enters profile + target role + skill tags
   - Optional resume upload calls `/upload-resume` for keyword-based skill extraction
   - Frontend calls:
     - `POST /predict`
     - `POST /intelligence/portfolio`
   - Response is stored in `sessionStorage` and user is routed to results

3. **Prediction logic** (`Backend/app/routes/predict.py`)
   - Predict closest role from user skills
   - Use target role (if given) to compute gap; fallback to predicted role
   - Return:
     - `match_score`
     - `missing_skills`
     - `career_prediction`
   - Save latest prediction in app state for dashboard/roadmap personalization

4. **Visualization and intelligence**
   - **Dashboard** (`GET /dashboard`) mixes defaults + latest prediction
   - **Analytics** (`GET /analytics`) returns demand trend, growth index, volatility, radar points
   - **Results page** uses saturation and career risk APIs
   - **Roadmap** (`GET /roadmap`) generates milestones from missing skills

## Backend API Summary

- `GET /` — health check + discovered dataset directories
- `POST /predict` — core skill-gap prediction
- `GET /dashboard` — dashboard KPIs
- `GET /analytics` — chart-ready analytics payload
- `GET /roadmap` — personalized roadmap from last prediction
- `POST /upload-resume` — detect skills from uploaded file text
- `GET /intelligence/growth` — growth index by skill
- `GET /intelligence/volatility` — volatility score by skill
- `GET /intelligence/saturation` — saturation labels by skill
- `POST /intelligence/portfolio` — salary/growth/risk-level projection
- `POST /intelligence/risk` — numeric career risk score

## Local Setup

### 1) Backend

```powershell
cd Backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will run at: `http://localhost:8000`

### 2) Frontend

```powershell
cd Frontend
npm install
npm run dev
```

Frontend will run at: `http://localhost:5173`

## Environment Configuration

Frontend API base URL (optional):

- `Frontend/.env`

```env
VITE_API_URL=http://localhost:8000
```

Dataset root override (optional, backend):

- Set `DATASET_ROOT` if your CSV files are outside default scan paths.

Example (PowerShell):

```powershell
$env:DATASET_ROOT="D:\Job-Skill-Predication\Dataset"
```

## Notes

- If APIs fail, frontend service wrappers return safe fallback payloads so UI remains functional.
- `/roadmap` depends on the latest `/predict` call (stored in backend app state).
- Resume parsing is keyword matching over text extraction (UTF-8/Latin-1 decode, regex skill search).
