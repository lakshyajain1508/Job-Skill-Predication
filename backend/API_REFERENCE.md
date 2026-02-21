# API Reference

Complete documentation of all CareerPilot AI backend API endpoints.

## Base URL
```
http://localhost:8000
```

## Authentication
Currently, no authentication is required. Future versions will support JWT tokens.

## Response Format

All responses are JSON with the following structure:

### Success Response (200 OK)
```json
{
  "data": { ... },
  "status": "success",
  "timestamp": "2024-02-15T10:30:00Z"
}
```

### Error Response (400+ errors)
```json
{
  "detail": "Error message",
  "status": "error",
  "error_code": "INVALID_INPUT"
}
```

## Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Endpoints

### 1. Health Check

#### GET `/health`
Check if server is running.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-02-15T10:30:00Z",
  "version": "1.0.0"
}
```

**cURL:**
```bash
curl http://localhost:8000/health
```

**Python:**
```python
import requests

response = requests.get("http://localhost:8000/health")
print(response.json())
```

---

### 2. Resume Analysis

#### POST `/api/analyze-resume`
Analyze a resume and extract skills.

**Request:**
```
Content-Type: multipart/form-data

Parameters:
- file: Binary file (PDF/DOC/DOCX)
- skills: JSON array of skills (optional)
- target_role: String (optional)
```

**Request Body:**
```json
{
  "resume_text": "I have 5 years experience with Python, JavaScript, and React...",
  "skills_provided": ["Python", "React", "Node.js"],
  "target_role": "Full Stack Developer"
}
```

**Response (200 OK):**
```json
{
  "employability_score": 78.5,
  "experience_months": 60,
  "key_strengths": [
    {
      "skill": "Python",
      "level": 85,
      "category": "Language"
    },
    {
      "skill": "React",
      "level": 80,
      "category": "Frontend"
    }
  ],
  "missing_skills": [
    {
      "skill": "TypeScript",
      "demand": 87,
      "importance": "High",
      "category": "Language"
    },
    {
      "skill": "Docker",
      "demand": 72,
      "importance": "Medium",
      "category": "DevOps"
    }
  ],
  "strengths": [
    "Strong frontend experience",
    "Full stack capability"
  ],
  "career_recommendations": [
    "Consider Docker to improve DevOps skills",
    "TypeScript would increase marketability"
  ],
  "next_steps": ["Learn Docker", "Master TypeScript"]
}
```

**cURL:**
```bash
curl -X POST http://localhost:8000/api/analyze-resume \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "5 years Python, JavaScript, React experience",
    "skills_provided": ["Python", "React"],
    "target_role": "Full Stack Developer"
  }'
```

**Python:**
```python
import requests

response = requests.post(
    "http://localhost:8000/api/analyze-resume",
    json={
        "resume_text": "5 years Python and React development",
        "skills_provided": ["Python", "React"],
        "target_role": "Full Stack Developer"
    }
)
print(response.json())
```

**Notes:**
- File upload support coming soon
- Skills are case-insensitive
- Target role is optional but improves analysis

---

### 3. Skill Gap Analysis

#### POST `/api/skill-gap`
Compare user skills with market requirements for a target role.

**Request Body:**
```json
{
  "skills": ["Python", "SQL", "Pandas"],
  "target_role": "Data Engineer",
  "experience_months": 36
}
```

**Response (200 OK):**
```json
{
  "target_role": "Data Engineer",
  "current_skills": [
    {
      "skill": "Python",
      "level": 85,
      "demand": 95,
      "match": "Excellent"
    },
    {
      "skill": "SQL",
      "level": 72,
      "demand": 92,
      "match": "Good"
    },
    {
      "skill": "Pandas",
      "level": 68,
      "demand": 80,
      "match": "Good"
    }
  ],
  "required_skills": [
    {
      "skill": "Spark",
      "demand": 88,
      "importance": "Critical",
      "learning_hours": 40
    },
    {
      "skill": "AWS",
      "demand": 85,
      "importance": "High",
      "learning_hours": 30
    },
    {
      "skill": "Scala",
      "demand": 60,
      "importance": "Medium",
      "learning_hours": 50
    }
  ],
  "gap_analysis": {
    "matching_skills": 3,
    "missing_skills": 3,
    "extra_skills": 0,
    "gap_percentage": 50.0,
    "readiness_score": 50.0
  },
  "priority_skills": [
    {
      "priority": 1,
      "skill": "Spark",
      "reason": "Critical for role, high demand",
      "learning_time": "4 weeks"
    },
    {
      "priority": 2,
      "skill": "AWS",
      "reason": "High demand in market",
      "learning_time": "3 weeks"
    }
  ],
  "learning_path": {
    "immediate": ["Spark", "AWS"],
    "short_term": ["Scala"],
    "nice_to_have": ["Kubernetes"]
  },
  "recommendations": [
    "Focus on Spark first as it's critical",
    "AWS knowledge will increase job prospects by 40%",
    "You're on the right track with current skills"
  ]
}
```

**cURL:**
```bash
curl -X POST http://localhost:8000/api/skill-gap \
  -H "Content-Type: application/json" \
  -d '{
    "skills": ["Python", "SQL", "Pandas"],
    "target_role": "Data Engineer",
    "experience_months": 36
  }'
```

**Python:**
```python
import requests

gap = requests.post(
    "http://localhost:8000/api/skill-gap",
    json={
        "skills": ["Python", "SQL"],
        "target_role": "Data Engineer",
        "experience_months": 24
    }
).json()

print(f"Gap: {gap['gap_analysis']['gap_percentage']}%")
print(f"Priority skills: {[s['skill'] for s in gap['priority_skills']]}")
```

**Parameters:**
- `skills` (required): List of current skills
- `target_role` (required): Target job position
- `experience_months` (optional): Years of experience (default: 12)

---

### 4. Job Market Trends

#### GET `/api/job-trends`
Get current job market trends and skill demand.

**Query Parameters:**
- `top_n` (optional): Number of top skills to return (default: 10)
- `role_filter` (optional): Filter by job role

**Response (200 OK):**
```json
{
  "trends": {
    "most_demanded_skills": [
      {
        "skill": "Python",
        "demand_percentage": 95,
        "trend": "up",
        "positions": 15000,
        "avg_salary": 125000
      },
      {
        "skill": "SQL",
        "demand_percentage": 92,
        "trend": "stable",
        "positions": 12000,
        "avg_salary": 120000
      }
    ],
    "emerging_skills": [
      {
        "skill": "Rust",
        "growth_rate": 35,
        "positions": 500
      },
      {
        "skill": "Go",
        "growth_rate": 28,
        "positions": 800
      }
    ],
    "declining_skills": [
      {
        "skill": "Flash",
        "decline_rate": 80,
        "positions": 50
      }
    ]
  },
  "top_roles": [
    {
      "role": "Data Engineer",
      "demand": 92,
      "salary_range": "120000-180000",
      "growth": 15
    },
    {
      "role": "Full Stack Developer",
      "demand": 88,
      "salary_range": "100000-160000",
      "growth": 12
    }
  ],
  "market_overview": {
    "total_jobs": 150000,
    "avg_salary": 115000,
    "top_companies": ["Google", "Amazon", "Microsoft"],
    "growth_projection": "12.5% YoY"
  },
  "timestamp": "2024-02-15T10:30:00Z"
}
```

**cURL:**
```bash
curl "http://localhost:8000/api/job-trends?top_n=15"
```

**Python:**
```python
import requests

trends = requests.get(
    "http://localhost:8000/api/job-trends",
    params={"top_n": 15}
).json()

print("Most demanded skills:")
for skill in trends['trends']['most_demanded_skills']:
    print(f"  {skill['skill']}: {skill['demand_percentage']}%")
```

---

### 5. Dashboard Data

#### GET `/api/dashboard-data`
Get comprehensive dashboard data (combination of multiple endpoints).

**Query Parameters:**
- `user_skills` (optional): Comma-separated list of current skills
- `target_role` (optional): Filter recommendations by target role

**Response (200 OK):**
```json
{
  "overview": {
    "employability_score": 75,
    "score_trend": "up",
    "score_change": 5,
    "market_rank": "65th percentile",
    "skill_level": "Intermediate"
  },
  "skill_distribution": {
    "languages": {
      "skill": "Languages",
      "level": 80,
      "demand": 95
    },
    "frontend": {
      "skill": "Frontend",
      "level": 75,
      "demand": 88
    },
    "backend": {
      "skill": "Backend",
      "level": 70,
      "demand": 92
    },
    "database": {
      "skill": "Database",
      "level": 60,
      "demand": 85
    },
    "devops": {
      "skill": "DevOps",
      "level": 55,
      "demand": 78
    }
  },
  "market_insights": {
    "top_opportunities": [
      {
        "skill": "Rust",
        "opportunity_score": 95,
        "growth": 35,
        "salary_boost": 25000
      }
    ],
    "at_risk_skills": [
      {
        "skill": "Flash",
        "decline_rate": 80,
        "recommendation": "Consider retiring this skill"
      }
    ]
  },
  "score_history": [
    {"date": "2024-01-15", "score": 70},
    {"date": "2024-01-22", "score": 72},
    {"date": "2024-01-29", "score": 73},
    {"date": "2024-02-05", "score": 74},
    {"date": "2024-02-15", "score": 75}
  ],
  "next_steps": [
    "Learn Rust to increase scores by 15 points",
    "Master DevOps to become full stack ready"
  ]
}
```

**cURL:**
```bash
curl "http://localhost:8000/api/dashboard-data?user_skills=Python,React&target_role=Full%20Stack"
```

**Python:**
```python
import requests

dashboard = requests.get(
    "http://localhost:8000/api/dashboard-data",
    params={
        "user_skills": "Python,React,Node.js",
        "target_role": "Full Stack Developer"
    }
).json()

print(f"Employability: {dashboard['overview']['employability_score']}%")
print(f"Skill Radar Data: {dashboard['skill_distribution']}")
```

---

### 6. Generate Roadmap

#### POST `/api/generate-roadmap`
Generate a personalized learning roadmap.

**Request Body:**
```json
{
  "targetRole": "Machine Learning Engineer",
  "targetSkills": ["Python", "TensorFlow", "PyTorch", "Computer Vision"],
  "currentExperience": 24,
  "currentSkills": ["Python", "Pandas", "NumPy"],
  "accelerated": false
}
```

**Response (200 OK):**
```json
{
  "targetRole": "Machine Learning Engineer",
  "totalWeeks": 4,
  "totalHours": 120,
  "difficulty": "Advanced",
  "expectation": "4 weeks of focused learning",
  "startDate": "2024-02-15",
  "endDate": "2024-03-14",
  "weeks": [
    {
      "week": 1,
      "title": "ML Fundamentals & Theory",
      "focus": "Understanding machine learning concepts",
      "difficulty": "Intermediate",
      "hours": 30,
      "topics": [
        "Supervised vs Unsupervised Learning",
        "Feature Engineering Basics",
        "Model Evaluation Metrics"
      ],
      "tasks": [
        {
          "day": "Monday-Tuesday",
          "task": "Linear Regression from Scratch",
          "duration": "2 days",
          "resources": ["Coursera ML by Andrew Ng", "scikit-learn docs"]
        },
        {
          "day": "Wednesday-Thursday",
          "task": "Decision Trees and Ensemble Methods",
          "duration": "2 days",
          "resources": ["StatQuest ML playlist", "scikit-learn docs"]
        },
        {
          "day": "Friday+Weekend",
          "task": "Hands-on Project: Iris Classification",
          "duration": "3 days",
          "resources": ["GitHub datasets", "Kaggle notebooks"]
        }
      ],
      "skills_covered": ["ML Theory", "Feature Engineering", "Model Evaluation"],
      "skillsToLearn": ["Supervised Learning", "Feature Engineering"]
    },
    {
      "week": 2,
      "title": "Deep Learning & TensorFlow",
      "focus": "Neural networks and TensorFlow framework",
      "difficulty": "Advanced",
      "hours": 35,
      "topics": [
        "Neural Network Basics",
        "Backpropagation",
        "TensorFlow/Keras API",
        "CNN Architectures"
      ],
      "tasks": [
        {
          "day": "Monday-Tuesday",
          "task": "Neural Networks from Scratch",
          "duration": "2 days",
          "resources": ["3Blue1Brown Neural Networks", "TensorFlow tutorials"]
        },
        {
          "day": "Wednesday-Thursday",
          "task": "Build CNN with Keras",
          "duration": "2 days",
          "resources": ["Keras documentation", "TensorFlow courses"]
        },
        {
          "day": "Friday+Weekend",
          "task": "Project: MNIST Digit Recognition",
          "duration": "3 days",
          "resources": ["TensorFlow datasets", "Kaggle solutions"]
        }
      ],
      "skills_covered": ["Neural Networks", "TensorFlow", "CNN"],
      "skillsToLearn": ["Deep Learning", "TensorFlow/Keras"]
    },
    {
      "week": 3,
      "title": "Advanced Deep Learning & PyTorch",
      "focus": "PyTorch and advanced architectures",
      "difficulty": "Advanced",
      "hours": 35,
      "topics": [
        "PyTorch Fundamentals",
        "RNN & LSTM",
        "Transfer Learning",
        "Model Optimization"
      ],
      "tasks": [
        {
          "day": "Monday-Tuesday",
          "task": "PyTorch Basics and Tensors",
          "duration": "2 days",
          "resources": ["PyTorch tutorials", "FastAI", "Deep Learning Book"]
        },
        {
          "day": "Wednesday-Thursday",
          "task": "RNN & LSTM Networks",
          "duration": "2 days",
          "resources": ["PyTorch RNN docs", "CS224N materials"]
        },
        {
          "day": "Friday+Weekend",
          "task": "Project: Sentiment Analysis with LSTM",
          "duration": "3 days",
          "resources": ["PyTorch examples", "HuggingFace"]
        }
      ],
      "skills_covered": ["PyTorch", "RNN/LSTM", "Transfer Learning"],
      "skillsToLearn": ["PyTorch", "Advanced DL"]
    },
    {
      "week": 4,
      "title": "Computer Vision & Real-world Applications",
      "focus": "Visual recognition and practical ML",
      "difficulty": "Expert",
      "hours": 20,
      "topics": [
        "Image Classification",
        "Object Detection",
        "Semantic Segmentation",
        "Production ML"
      ],
      "tasks": [
        {
          "day": "Monday-Wednesday",
          "task": "Transfer Learning for Image Classification",
          "duration": "3 days",
          "resources": ["ResNet, VGG papers", "PyTorch pretrained models"]
        },
        {
          "day": "Thursday-Friday",
          "task": "Final Project: Custom Image Classifier",
          "duration": "2 days",
          "resources": ["Your datasets", "PyTorch deployment"]
        },
        {
          "day": "Weekend",
          "task": "Portfolio & Documentation",
          "duration": "1 day",
          "resources": ["GitHub, Medium"]
        }
      ],
      "skills_covered": ["Computer Vision", "Model Deployment"],
      "skillsToLearn": ["Computer Vision", "Production ML"]
    }
  ],
  "milestones": [
    {
      "week": 1,
      "milestone": "Complete 3 ML projects",
      "importance": "Critical"
    },
    {
      "week": 2,
      "milestone": "Build and train your first CNN",
      "importance": "Critical"
    },
    {
      "week": 3,
      "milestone": "Master PyTorch framework",
      "importance": "High"
    },
    {
      "week": 4,
      "milestone": "Complete capstone project",
      "importance": "Critical"
    }
  ],
  "resources": [
    {
      "type": "Course",
      "title": "Deep Learning Specialization",
      "platform": "Coursera",
      "cost": "Paid",
      "duration": "4 months",
      "rating": 4.8
    },
    {
      "type": "Book",
      "title": "Deep Learning",
      "authors": "Goodfellow, Bengio, Courville",
      "cost": "Free Online",
      "rating": 4.9
    },
    {
      "type": "Documentation",
      "title": "PyTorch Official Tutorials",
      "platform": "pytorch.org",
      "cost": "Free",
      "rating": 4.8
    }
  ],
  "recommendations": [
    "Consider joining a study group to stay motivated",
    "Build projects alongside learning for better retention",
    "Focus on understanding concepts before memorizing",
    "Practice on real datasets from Kaggle",
    "This is an ambitious roadmap - adjust pace as needed"
  ],
  "summaryTips": [
    "Dedicate 2-3 hours daily for best results",
    "Projects are more important than courses",
    "Join ML community for support (r/MachineLearning, Twitter)",
    "Create a portfolio on GitHub and blog"
  ]
}
```

**cURL:**
```bash
curl -X POST http://localhost:8000/api/generate-roadmap \
  -H "Content-Type: application/json" \
  -d '{
    "targetRole": "ML Engineer",
    "targetSkills": ["Python", "TensorFlow", "PyTorch"],
    "currentExperience": 24,
    "currentSkills": ["Python", "Pandas"],
    "accelerated": false
  }'
```

**Python:**
```python
import requests

roadmap = requests.post(
    "http://localhost:8000/api/generate-roadmap",
    json={
        "targetRole": "Data Engineer",
        "targetSkills": ["Python", "SQL", "Spark"],
        "currentExperience": 12,
        "currentSkills": ["Python", "SQL"],
        "accelerated": False
    }
).json()

print(f"Total weeks: {roadmap['totalWeeks']}")
print(f"Total hours: {roadmap['totalHours']}")
for week in roadmap['weeks']:
    print(f"Week {week['week']}: {week['title']}")
```

**Parameters:**
- `targetRole` (required): Target job position
- `targetSkills` (required): List of skills to learn
- `currentExperience` (optional): Months of experience (default: 12)
- `currentSkills` (optional): Current skills list
- `accelerated` (optional): Fast-track learning (default: false)

---

## Error Handling

### Common Errors

#### 400 Bad Request
```json
{
  "detail": "Invalid input: skills must be a list",
  "status": "error",
  "error_code": "INVALID_INPUT"
}
```

#### 404 Not Found
```json
{
  "detail": "Endpoint not found",
  "status": "error",
  "error_code": "NOT_FOUND"
}
```

#### 500 Internal Server Error
```json
{
  "detail": "Internal server error",
  "status": "error",
  "error_code": "INTERNAL_ERROR"
}
```

## Rate Limiting
Currently no rate limiting. Future versions may implement:
- 100 requests per minute per IP
- 1000 requests per hour per API key

## Pagination
For endpoints returning large lists, pagination is available:
```
?page=1&page_size=20
```

## WebSocket Support
Real-time updates coming soon:
```
ws://localhost:8000/ws/updates
```

## API Changelog

### v1.0.0 (Current)
- `/health` - Health check
- `/api/analyze-resume` - Resume analysis
- `/api/skill-gap` - Skill gap analysis
- `/api/job-trends` - Job market trends
- `/api/dashboard-data` - Dashboard data
- `/api/generate-roadmap` - Roadmap generation

### v1.1.0 (Planned)
- File upload for resumes
- User authentication
- Favorite roadmaps
- Skill tracking history

### v2.0.0 (Future)
- Advanced ML models
- Personalized recommendations
- Job matching
- Interview preparation

## Testing the API

### Swagger UI
Navigate to: http://localhost:8000/docs

### ReDoc
Navigate to: http://localhost:8000/redoc

### Postman Collection
Download the Postman collection from: `/postman-collection.json`

---

**API Version**: 1.0.0

**Last Updated**: February 2026

**Status**: ✅ Production Ready
