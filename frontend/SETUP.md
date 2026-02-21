# 🚀 CareerPilot AI - Getting Started Checklist

## Pre-Setup (5 mins)

- [ ] Have Node.js 18+ installed
  ```bash
  node --version
  ```
  
- [ ] Have npm 9+ installed
  ```bash
  npm --version
  ```

- [ ] Navigate to project
  ```bash
  cd e:\JobSkills\frontend
  ```

---

## Setup (10 mins)

1. **Install Dependencies** (5-10 mins)
   ```bash
   npm install
   ```
   
   Expected output should end with:
   ```
   added XXX packages in XXXs
   ```

2. **Configure Environment** (1 min)
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` (optional):
   ```
   NEXT_PUBLIC_API_BASE=http://localhost:8000
   ```

3. **Verify Installation** (1 min)
   ```bash
   npm list
   ```

---

## Development (Ongoing)

### Start Development Server

```bash
npm run dev
```

Expected output:
```
  ▲ Next.js 15.x.x
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in XXXms
```

### Open in Browser
- Visit: **http://localhost:3000**
- Should see: **Landing page with "CareerPilot AI"**

---

## First Time Using the App

### 1️⃣ Explore Landing Page
- [x] View hero section
- [x] Read AI explanation
- [x] See CTA buttons

### 2️⃣ Test Analyze Page
- Navigate to: **http://localhost:3000/analyze**
- [x] Try uploading a file (test file OK)
- [x] Add some skills
- [x] Select a role
- [x] Click "Analyze Resume" (uses mock data if backend unavailable)

### 3️⃣ View Dashboard
- Navigate to: **http://localhost:3000/dashboard**
- [x] See employability score gauge
- [x] View skill radar chart
- [x] Check market demand
- [x] Read AI insights

### 4️⃣ Check Roadmap
- Navigate to: **http://localhost:3000/roadmap**
- [x] View weekly plan
- [x] Try changing role (top buttons)
- [x] See timeline animation

### 5️⃣ Test Responsiveness
- Press: **F12** (Open DevTools)
- Click: **Toggle device toolbar** (or Ctrl+Shift+M)
- Test: Mobile, tablet, desktop views

---

## Backend Integration (Optional but Recommended)

### Setup FastAPI Backend
```bash
# In separate terminal, outside this folder
git clone your-backend-repo
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python main.py
```

Expected: Backend running on `http://localhost:8000`

### Connect Frontend to Backend
No changes needed! Frontend already configured to:
- Try connecting to backend on startup
- Use mock data if backend unavailable
- Automatically retry with real data if backend comes online

---

## Customization Tasks

### Change Colors
Edit: `tailwind.config.ts`
```typescript
primary: {
  500: '#your-color-hex',
},
```

### Update Content
Edit: `app/page.tsx`, `components/Navbar.tsx`, etc.

### Add New Page
```bash
mkdir app/newpage
touch app/newpage/page.tsx
```

### Add New Component
```bash
touch components/MyComponent.tsx
```

---

## Debugging Common Issues

### ❌ "Port 3000 already in use"
```bash
npm run dev -- -p 3001
# Now use http://localhost:3001
```

### ❌ White screen / No content
- [ ] Check DevTools Console (F12)
- [ ] Look for red error messages
- [ ] Restart dev server: Ctrl+C, then `npm run dev`

### ❌ API errors in console
- This is OK! App uses mock data
- If you want real data, ensure backend is running on :8000
- Check: `curl http://localhost:8000/dashboard-data`

### ❌ Styling looks broken
```bash
npm run dev
# If still broken, restart:
# 1. Ctrl+C
# 2. rm -rf .next
# 3. npm run dev
```

### ❌ Can't access page after navigation
- Refresh browser (F5)
- Clear cache: Ctrl+Shift+Delete
- Check URL in address bar

---

## Testing Before Production

### Build Check
```bash
npm run build
```
Should complete without errors.

### Production Test
```bash
npm run build
npm start
```
Visit: **http://localhost:3000**

---

## Deployment Quick Start

### Option 1: Vercel (Easiest) ⭐
1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import repository
4. Set `NEXT_PUBLIC_API_BASE` env var
5. Click Deploy!

### Option 2: Docker
```bash
docker build -t careerpilot .
docker run -p 3000:3000 careerpilot
```

### Option 3: Manual VPS
See `DEPLOYMENT.md` for detailed steps

---

## Project Structure Quick Links

| Folder | Contains | Edit for |
|--------|----------|----------|
| `app/` | Pages | Most content changes |
| `components/` | UI components | Reusable elements |
| `services/` | API calls | Backend integration |
| `app/globals.css` | Global styles | App-wide styling |

---

## Next Steps

- [ ] Install & run dev server
- [ ] Test all 4 pages
- [ ] Set up backend (if available)
- [ ] Customize colors/content
- [ ] Deploy to Vercel/Docker
- [ ] Share with team!

---

## Documentation Files

| File | For | Read time |
|------|-----|-----------|
| `README.md` | Overview & features | 5 mins |
| `DEVELOPMENT.md` | Dev setup & workflow | 15 mins |
| `DEPLOYMENT.md` | Deployment guides | 15 mins |
| `QUICK_REFERENCE.md` | Quick lookup | 3 mins |

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **F12** | Open DevTools |
| **Ctrl+Shift+M** | Toggle mobile view |
| **Ctrl+Shift+C** | Inspect element |
| **Ctrl+R** | Refresh page |
| **Ctrl+C** | Stop dev server |

---

## Important Notes

⚠️ **Before committing code:**
- Never commit `.env.local`
- Never commit `node_modules/`
- Both are in `.gitignore` already

💡 **Performance tips:**
- Hot reload works automatically (just save files)
- Use <F12> DevTools for debugging
- Check browser console for errors

🔒 **Security:**
- Keep `NEXT_PUBLIC_` vars public data only
- Private keys go in `.env.local` without prefix
- Validate all user inputs

---

## Getting Help

### If something breaks:

1. Check error in DevTools Console (F12)
2. Read error message carefully
3. Search error in docs
4. Try solutions in DEVELOPMENT.md
5. Check backend running: `curl http://localhost:8000/health`

### Useful commands:

```bash
npm run dev              # Run dev server
npm run build           # Test build
npm run lint            # Check code
npm list               # See dependencies
npm audit              # Check vulnerabilities
```

---

## Success Checklist

- [ ] ✅ Node.js & npm installed
- [ ] ✅ Dependencies installed (`npm install`)
- [ ] ✅ Dev server running (`npm run dev`)
- [ ] ✅ Landing page loads in browser
- [ ] ✅ Can navigate to all pages
- [ ] ✅ Analyze page works
- [ ] ✅ Dashboard displays charts
- [ ] ✅ Roadmap timeline shows
- [ ] ✅ Mobile view responsive

**Once all checked - You're ready to code! 🎉**

---

## Support Resources

- Next.js: https://nextjs.org/docs
- Tailwind: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs
- React: https://react.dev

---

**Ready? Let's build! 🚀**

```bash
cd e:\JobSkills\frontend
npm install
npm run dev
```

Then visit: **http://localhost:3000**
