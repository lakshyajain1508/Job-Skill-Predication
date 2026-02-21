# CareerPilot AI - Complete Project Setup Guide

Welcome to CareerPilot AI - the AI-powered career intelligence and skill analysis platform!

## 🚀 Quick Start (Recommended for First Time)

### Option 1: Automatic Setup & Run (EASIEST)
Double-click this file to automatically set up and start everything:
```
RUN_PROJECT.bat
```

This script will:
- ✅ Check Python and Node.js installation
- ✅ Install frontend dependencies (npm)
- ✅ Install backend dependencies (pip)
- ✅ Create configuration files
- ✅ Start both frontend and backend servers

**Time:** ~5-10 minutes on first run

### Option 2: Setup First, Then Run
If you want to separate setup and running:

1. **First time only** - Run setup:
   ```
   SETUP_ONLY.bat
   ```

2. **Then** - Start services:
   ```
   RUN_PROJECT.bat
   ```

### Option 3: Quick Start (Subsequent Runs)
After first setup, simply run:
```
QUICK_START.bat
```

## 📋 Prerequisites

Before running any batch files, ensure you have installed:

### Required Software
1. **Python 3.10 or higher**
   - Download: https://www.python.org/downloads/
   - Verify: Open PowerShell and run `python --version`

2. **Node.js (LTS version)**
   - Download: https://nodejs.org/
   - Verify: Open PowerShell and run `node --version`

3. **npm** (comes with Node.js)
   - Verify: Open PowerShell and run `npm --version`

### Optional but Recommended
- **VS Code** - For code editing and debugging
- **Postman** - For API testing
- **Git** - For version control

## 📁 Project Structure

```
JobSkills/
├── RUN_PROJECT.bat           ← Main script to run everything
├── QUICK_START.bat           ← Quick start after first setup
├── SETUP_ONLY.bat            ← Setup without running services
├── HEALTH_CHECK.bat          ← Check if services are running
│
├── frontend/                 ← Next.js React application
│   ├── app/                  ← App pages (landing, analyze, dashboard, roadmap)
│   ├── components/           ← Reusable React components
│   ├── services/             ← API service layer
│   ├── public/               ← Static assets
│   ├── .env.local            ← Frontend environment config
│   ├── package.json          ← npm dependencies
│   └── README.md             ← Frontend documentation
│
└── backend/                  ← FastAPI Python application
    ├── app/                  ← FastAPI application code
    │   ├── main.py          ← Main FastAPI app
    │   ├── config.py        ← Configuration
    │   ├── routes/          ← API endpoints
    │   ├── services/        ← Business logic
    │   ├── models/          ← Data schemas
    │   └── utils/           ← Helper functions
    │
    ├── dataset/             ← CSV data files (place your data here)
    ├── venv/                ← Python virtual environment (auto-created)
    ├── .env                 ← Backend environment config
    ├── requirements.txt     ← Python dependencies
    ├── run.py              ← Entry script
    ├── README.md           ← Backend documentation
    └── SETUP.md            ← Backend setup guide
```

## 🎯 Available Batch Files

### 1. **RUN_PROJECT.bat** (Main Launcher)
Complete automated setup and launch of entire project.

**What it does:**
- Checks prerequisites (Python, Node.js)
- Installs dependencies (first time only)
- Creates config files
- Starts both frontend and backend
- Opens new windows for each service

**When to use:** First time setup or complete restart

**Expected output:**
```
[1/6] Checking Prerequisites... ✓
[2/6] Setting up Frontend... ✓
[3/6] Setting up Backend... ✓
[4/6] Verifying configuration files... ✓
[5/6] Preparing to launch services... ✓
[6/6] Launching services... ✓
```

---

### 2. **QUICK_START.bat** (Fast Launcher)
Quick start for subsequent runs (after initial setup).

**What it does:**
- Starts backend in new window
- Starts frontend in new window
- No reinstallation of dependencies

**When to use:** Every time after RUN_PROJECT.bat setup

**Time:** ~30 seconds

---

### 3. **SETUP_ONLY.bat** (Setup without Running)
Only performs setup, doesn't start services.

**What it does:**
- Installs frontend dependencies
- Creates Python virtual environment
- Installs backend dependencies
- Creates configuration files
- Does NOT start services

**When to use:** 
- First time setup in isolation
- If you want to start services manually
- Testing setup without running servers

**Then start manually with:** `QUICK_START.bat`

---

### 4. **HEALTH_CHECK.bat** (Service Status)
Check if frontend and backend services are running.

**What it does:**
- Attempts to reach backend health endpoint
- Shows available URLs
- Provides diagnostic information

**When to use:** 
- Verify services are running
- Troubleshooting connection issues
- Check endpoint accessibility

---

## 🌐 Accessing the Application

Once services are running:

### Frontend (User Interface)
- **URL:** http://localhost:3000
- **Status:** "CareerPilot Frontend" window
- **Features:** Interactive resume upload, skill analysis, roadmap view

### Backend API
- **Base URL:** http://localhost:8000
- **API Docs (Swagger):** http://localhost:8000/docs
- **Alternative Docs (ReDoc):** http://localhost:8000/redoc
- **Health Check:** http://localhost:8000/health

### Available Endpoints
```
GET  /health                    - Server health check
POST /api/analyze-resume        - Analyze resume file
POST /api/skill-gap             - Calculate skill gaps
GET  /api/job-trends            - Get job market trends
GET  /api/dashboard-data        - Get dashboard data
POST /api/generate-roadmap      - Generate learning roadmap
```

## 🔧 Troubleshooting

### Issue: "Python is not installed"
**Solution:**
1. Download Python from https://www.python.org/downloads/
2. During installation, CHECK "Add Python to PATH"
3. Restart command prompt
4. Verify: `python --version`

### Issue: "Node.js is not installed"
**Solution:**
1. Download Node.js from https://nodejs.org/
2. Install using default settings
3. Restart command prompt
4. Verify: `node --version`

### Issue: Port 8000 already in use
**Solution:**
1. Edit `backend/.env` file
2. Change `API_PORT=8000` to `API_PORT=8001`
3. Edit `frontend/.env.local`
4. Change `NEXT_PUBLIC_API_BASE=http://localhost:8000` to `http://localhost:8001`
5. Restart services

### Issue: Port 3000 already in use
**Solution:**
1. Close other Node.js applications
2. Or run: `npm run dev -- -p 3001` in frontend window

### Issue: Services won't start
**Solution:**
1. Delete `frontend/node_modules` folder
2. Delete `backend/venv` folder
3. Run `RUN_PROJECT.bat` again

### Issue: "Connection refused" errors
**Solution:**
1. Wait 5-10 seconds for services to fully start
2. Refresh browser (http://localhost:3000)
3. Check both "CareerPilot Frontend" and "CareerPilot Backend" windows are open

## 📊 First Run Timeline

**Typical execution times:**

| Step | Time | What it's doing |
|------|------|-----------------|
| Prerequisites check | 5 sec | Verifying Python & Node.js |
| Frontend npm install | 2-3 min | Installing 168 packages |
| Backend pip install | 1-2 min | Installing 8 packages |
| Config creation | 10 sec | Setting up .env files |
| Backend startup | 5 sec | Starting FastAPI server |
| Frontend startup | 10 sec | Starting Next.js dev server |
| **Total** | **~4-6 min** | Complete setup |

## 📝 Configuration Files

### Frontend Config (.env.local)
```
NEXT_PUBLIC_API_BASE=http://localhost:8000
NEXT_PUBLIC_API_TIMEOUT=10000
```

### Backend Config (.env)
```
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True
DATASET_DIR=./dataset
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
LOG_LEVEL=info
```

**Edit these files to customize:**
- API port numbers
- Debug mode
- CORS origins for different deployment

## 📚 Additional Documentation

For detailed information, see:

### Backend Documentation
- `backend/README.md` - Overview and features
- `backend/SETUP.md` - Detailed installation guide
- `backend/API_REFERENCE.md` - Complete API documentation
- `backend/DEVELOPMENT.md` - Development guidelines
- `backend/ROADMAP.md` - Future plans
- `backend/QUICK_REFERENCE.md` - Quick command reference

### Frontend Documentation
- `frontend/README.md` - Frontend overview
- `frontend/SETUP.md` - Frontend setup guide (if exists)

## 🎓 Usage Examples

### Test Backend API with curl
```bash
REM Health check
curl http://localhost:8000/health

REM Skill gap analysis
curl -X POST http://localhost:8000/api/skill-gap ^
  -H "Content-Type: application/json" ^
  -d "{\"skills\": [\"Python\", \"SQL\"], \"target_role\": \"Data Engineer\"}"

REM View API docs
start http://localhost:8000/docs
```

### Test Frontend
1. Open http://localhost:3000
2. Click "Get Started" to go to analysis page
3. Upload resume or fill in skills
4. See recommendations and roadmap

## ⚙️ Manual Service Control

If you prefer to start services manually:

### Start Backend (Manual)
```bash
cd backend
venv\Scripts\activate.bat
python run.py --reload
```

### Start Frontend (Manual)
```bash
cd frontend
npm run dev
```

## 🔄 Stopping Services

### To stop services:
1. Close the "CareerPilot Frontend" window (Ctrl+C in window)
2. Close the "CareerPilot Backend" window (Ctrl+C in window)
3. Services will be terminated

### To stop main launcher:
Close the main batch file window

## 🐛 Getting Help

### Check Logs
- **Frontend logs:** In "CareerPilot Frontend" window
- **Backend logs:** In "CareerPilot Backend" window

### Common Log Messages

**Good signs:**
```
✓ Compiled / in 10.6s                    [Frontend is ready]
Application startup complete             [Backend is ready]
```

**Error signs:**
```
ERROR Failed to connect                  [Backend not responding]
EADDRINUSE: address already in use       [Port is in use]
ModuleNotFoundError                      [Dependencies not installed]
```

## 📈 System Requirements

### Minimum
- Windows 7 or higher (Windows 10+ recommended)
- Python 3.10+
- Node.js 18+
- 4GB RAM
- 500MB free disk space

### Recommended
- Windows 10/11
- Python 3.11+
- Node.js 20 LTS
- 8GB RAM
- 1GB free disk space

## 🚀 Next Steps

1. **First Run:** Double-click `RUN_PROJECT.bat`
2. **Wait:** Let it complete setup (5-10 minutes)
3. **Access:** Open http://localhost:3000
4. **Try:** Upload resume and see AI recommendations
5. **Develop:** Edit files and see hot-reload in action

## 💡 Pro Tips

✅ **Keep both service windows visible** - Makes it easy to see errors  
✅ **Check logs first** - Most issues are visible in the windows  
✅ **Use .env files** - Change config without editing code  
✅ **API docs helpful** - Try endpoints at http://localhost:8000/docs  
✅ **Refresh browser** - If frontend looks wrong, refresh (Ctrl+R)  

## 🔗 Useful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Hooks Guide](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Python Docs](https://docs.python.org/3/)

## 📞 Support

If you encounter issues:

1. **Check troubleshooting** section above
2. **Review log output** in service windows
3. **Check documentation** in backend/frontend folders
4. **Verify prerequisites** are installed correctly
5. **Restart services** using QUICK_START.bat

## ✅ Verification Checklist

After running RUN_PROJECT.bat, verify:

- [ ] Two new windows appeared ("CareerPilot Frontend" and "CareerPilot Backend")
- [ ] No red error messages in either window
- [ ] Frontend window shows "ready in X seconds"
- [ ] Backend window shows "Application startup complete"
- [ ] http://localhost:3000 loads in browser
- [ ] http://localhost:8000/health returns OK status
- [ ] http://localhost:8000/docs shows API documentation


 

