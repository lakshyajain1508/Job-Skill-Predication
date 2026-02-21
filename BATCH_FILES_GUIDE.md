# CareerPilot AI - Batch Files Quick Guide

All batch files are located in: `e:\JobSkills\`

## 📊 Batch Files Summary

| File | Purpose | When to Use | Time |
|------|---------|-------------|------|
| `RUN_PROJECT.bat` | Complete setup + launch | First time or full restart | 5-10 min |
| `QUICK_START.bat` | Fast launch only | Regular development | 30 sec |
| `SETUP_ONLY.bat` | Setup without launching | Manual control | 3-5 min |
| `HEALTH_CHECK.bat` | Verify services running | Troubleshooting | 5 sec |
| `STOP_AND_CLEANUP.bat` | Stop services + cleanup | End of session | 1 min |

---

## 🎯 Quick Decision Tree

### First Time Using CareerPilot AI?
```
→ Double-click: RUN_PROJECT.bat
→ Wait 5-10 minutes
→ Press Enter when prompted
→ Two new windows open
→ Go to http://localhost:3000
```

### Already Set Up, Want Quick Start?
```
→ Double-click: QUICK_START.bat
→ Wait 30 seconds
→ Two windows open
→ Go to http://localhost:3000
```

### Want to Set Up Only (Start Manually)?
```
→ Double-click: SETUP_ONLY.bat
→ Wait 3-5 minutes
→ Press Enter
→ Now run QUICK_START.bat to launch services
```

### Services Not Working?
```
→ Double-click: HEALTH_CHECK.bat
→ Check output for errors
→ Review service windows for logs
→ Try QUICK_START.bat again
```

### Ending Work Session?
```
→ Close both service windows, OR
→ Double-click: STOP_AND_CLEANUP.bat
→ Optionally delete node_modules and venv
```

---

## 📋 Detailed File Information

### RUN_PROJECT.bat
**Full name:** Complete Project Setup and Launch

**What it does:**
1. Checks prerequisites (Python, Node.js, npm)
2. Installs frontend npm dependencies
3. Creates backend Python virtual environment
4. Installs backend pip dependencies
5. Creates environment configuration files
6. Starts backend server in new window
7. Starts frontend server in new window
8. Displays URLs and status information

**Usage:**
```bash
# Simply double-click the file
RUN_PROJECT.bat

# Or run from command line
cd e:\JobSkills
RUN_PROJECT.bat
```

**Expected Output:**
```
[1/6] Checking Prerequisites... ✓
[2/6] Setting up Frontend... ✓
[3/6] Setting up Backend... ✓
[4/6] Verifying configuration files... ✓
[5/6] Preparing to launch services... ✓
[6/6] Launching services... ✓

Services are starting...
Frontend: http://localhost:3000
Backend: http://localhost:8000
```

**Time to Complete:**
- First run: 5-10 minutes (dependencies install)
- Subsequent runs: ~1 minute (if you stop and restart)

**Requirements:**
- Python 3.10+ installed
- Node.js 18+ installed
- npm installed
- 500MB free disk space

---

### QUICK_START.bat
**Full name:** Quick Service Launch

**What it does:**
1. Checks for existing Node.js processes
2. Checks for existing Python processes
3. Starts backend server in new window
4. Starts frontend server in new window
5. Displays service URLs

**Usage:**
```bash
# Double-click the file
QUICK_START.bat

# Or run from command line (after first setup)
cd e:\JobSkills
QUICK_START.bat
```

**Timeline:** ~30 seconds

**Requirements:**
- Must have run RUN_PROJECT.bat at least once
- Frontend node_modules must exist
- Backend venv must exist

**Good For:**
- Daily development work
- Quick server restarts
- Testing changes

---

### SETUP_ONLY.bat
**Full name:** Setup Without Launching

**What it does:**
1. Checks Python installation
2. Checks Node.js installation
3. Installs frontend dependencies (npm install)
4. Creates backend virtual environment
5. Installs backend dependencies (pip install)
6. Creates configuration files
7. Does NOT start any services

**Usage:**
```bash
# Double-click the file
SETUP_ONLY.bat

# Then manually start services
# Open command prompt in e:\JobSkills
cd frontend
npm run dev

# In another command prompt
cd backend
venv\Scripts\activate.bat
python run.py
```

**Timeline:** 3-5 minutes first run, <1 minute subsequent

**Good For:**
- Testing setup process
- Manual debugging
- Understanding project structure
- Custom startup configurations

---

### HEALTH_CHECK.bat
**Full name:** Service Health Verification

**What it does:**
1. Attempts HTTP request to backend health endpoint
2. Checks if services are accessible
3. Displays available URLs
4. Provides diagnostic information

**Usage:**
```bash
# Double-click the file
HEALTH_CHECK.bat
```

**Example Output:**
```
Checking Backend Health...

{"status":"OK","version":"1.0.0"}

Backend API Docs: http://localhost:8000/docs
Frontend: http://localhost:3000
```

**Timeline:** ~5 seconds

**When to Use:**
- Verify services are running
- Check connectivity
- Troubleshoot connection issues
- Confirm URLs are accessible

---

### STOP_AND_CLEANUP.bat
**Full name:** Stop Services and Optional Cleanup

**What it does:**
1. Terminates Node.js processes (frontend)
2. Terminates Python processes (backend)
3. Optionally deletes node_modules folder
4. Optionally deletes venv folder
5. Optionally deletes Next.js build (.next)

**Usage:**
```bash
# Double-click the file
STOP_AND_CLEANUP.bat

# When prompted, answer y/n for each option
"Do you want to perform full cleanup? (y/n)"
"Continue with cleanup (y/n)?"
```

**Timeline:** ~1 minute

**When to Use:**
- End of development session
- Prepare for complete rebuild
- Clean up disk space
- Remove corrupted dependencies

**Warning:** 
Deleting node_modules and venv will require reinstall on next RUN_PROJECT.bat

---

## 🚀 Typical Development Day Workflow

### Morning: First Load of Day
```
1. Open e:\JobSkills folder
2. Double-click: QUICK_START.bat
3. Wait ~30 seconds
4. Open http://localhost:3000
5. Start coding!
```

### Throughout Day
```
- Frontend file changes → Auto-reload in browser
- Backend file changes → Auto-reload on server
- Test with http://localhost:8000/docs
```

### End of Day: Shutdown
```
Option A: Close both service windows manually
Option B: Double-click STOP_AND_CLEANUP.bat
→ Choose whether to cleanup (usually: no)
```

### Next Day: Resume
```
→ Repeat "Morning: First Load of Day"
```

---

## 🆘 Troubleshooting with Batch Files

### Services Not Starting?
```
1. Run: HEALTH_CHECK.bat
2. Check output for error messages
3. Look at service windows for logs
4. Try: QUICK_START.bat again
5. If still fails, try: RUN_PROJECT.bat for full rebuild
```

### Port Already in Use?
```
1. Option A: Run STOP_AND_CLEANUP.bat to kill processes
2. Option B: Edit backend\.env
   Change: API_PORT=8000 → API_PORT=8001
3. Edit frontend\.env.local
   Change: API_BASE=http://localhost:8000 → http://localhost:8001
```

### Dependencies Corrupted?
```
1. Run: STOP_AND_CLEANUP.bat
2. Choose: y for full cleanup
3. Run: RUN_PROJECT.bat
4. Wait for complete reinstall
```

### Can't Remember What to Do?
```
→ This file: BATCH_FILES_GUIDE.md
→ Or: README.md in e:\JobSkills
```

---

## ⚡ Pro Tips

✅ **Keep service windows visible** - You can see real-time logs  
✅ **Don't close service windows** - Services will stop  
✅ **Use HEALTH_CHECK.bat** - Verify everything is working  
✅ **Edit .env files** - Change port, debug mode, etc  
✅ **Check API docs** - Go to http://localhost:8000/docs  
✅ **Refresh browser** - If frontend looks wrong  
✅ **Check console** - Press F12 in browser for frontend logs  

---

## 🎯 Decision Matrix

**I want to...**

- "Start fresh for the first time"
  → `RUN_PROJECT.bat`

- "Code after first setup"
  → `QUICK_START.bat`

- "Just install, I'll start manually"
  → `SETUP_ONLY.bat`

- "Check if services are running"
  → `HEALTH_CHECK.bat`

- "Stop and cleanup"
  → `STOP_AND_CLEANUP.bat`

- "Fix corrupted setup"
  → `STOP_AND_CLEANUP.bat` (delete all) → `RUN_PROJECT.bat`

- "Change API port"
  → Edit `backend\.env` → `QUICK_START.bat`

- "Debug service startup"
  → `SETUP_ONLY.bat` → Start services manually in separate windows

---

## 📞 Getting Help

**Batch file not working?**
1. Open command prompt
2. Navigate to: `cd e:\JobSkills`
3. Run the script directly to see full error output
4. Check error message carefully
5. Review README.md for solution

**Services not starting?**
1. Run: `HEALTH_CHECK.bat`
2. Check both service windows for error messages
3. Look at the error output for clues
4. Try QUICK_START.bat again

**Still stuck?**
1. Check: `backend/SETUP.md` for backend help
2. Check: `frontend/README.md` for frontend help
3. Check: `ANALYSIS_AND_INTEGRATION.md` for integration help

---

## ✅ Quick Verification

**Make sure all batch files exist in e:\JobSkills:**
- [ ] RUN_PROJECT.bat
- [ ] QUICK_START.bat
- [ ] SETUP_ONLY.bat
- [ ] HEALTH_CHECK.bat
- [ ] STOP_AND_CLEANUP.bat

**Make sure both folders exist:**
- [ ] frontend/
- [ ] backend/

**Confirm by listing directory:**
```bash
# In command prompt
cd e:\JobSkills
dir *.bat
dir
```

Should show both batch files and two directories (frontend, backend)

---

## 🎓 Understanding Batch Files

If you're curious about what these batch files do, they're readable text files:

1. Right-click any `.bat` file
2. Select "Edit with Notepad"
3. Read through the commands
4. All lines are commented explaining what they do

---

## 🔗 Related Files

- **Main Documentation:** `README.md`
- **Integration Analysis:** `ANALYSIS_AND_INTEGRATION.md`
- **Backend Docs:** `backend/README.md`, `backend/SETUP.md`
- **Frontend Docs:** `frontend/README.md`
- **API Reference:** `backend/API_REFERENCE.md`

---

## 🎉 You're All Set!

All batch files are ready to use. Simply:

1. Navigate to: `e:\JobSkills`
2. Double-click: `RUN_PROJECT.bat`
3. Wait for services to start
4. Open: `http://localhost:3000`
5. Enjoy CareerPilot AI!

---

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Status:** ✅ Ready to Use
