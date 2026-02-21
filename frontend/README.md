# CareerPilot AI - Frontend

A premium AI SaaS career intelligence platform built with Next.js, featuring resume analysis, skill gap detection, market trend analysis, and personalized career roadmaps.

## 🚀 Features

- **Landing Page**: Hero section with AI explanation and CTA
- **Resume Analysis**: Upload resume and get AI-powered employability score
- **Dashboard**: Beautiful analytics with:
  - Employability Score Gauge
  - Skill Radar Chart
  - Market Demand Analysis
  - AI-generated Insights
- **Roadmap**: Personalized weekly learning paths with task breakdowns
- **Premium Design**: Glassmorphism cards, animated gradients, smooth animations
- **Mock Data Fallback**: Works offline with fallback data if backend is unavailable

## 🛠 Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Styling**: Tailwind CSS 3.4+
- **Charts**: Recharts 2.12+
- **Animations**: Framer Motion 11+
- **Icons**: Lucide React 0.408+
- **HTTP Client**: Axios 1.7+
- **Language**: TypeScript 5.3+

## 📋 Prerequisites

- Node.js 18+ or latest
- npm or yarn package manager
- FastAPI backend running on `http://localhost:8000`

## 🚀 Quick Start

1. **Install dependencies**:
```bash
npm install
# or
yarn install
```

2. **Run development server**:
```bash
npm run dev
# or
yarn dev
```

3. **Open in browser**:
```
http://localhost:3000
```

## 📁 Project Structure

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout with Navbar
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles
│   ├── analyze/
│   │   └── page.tsx            # Resume analysis page
│   ├── dashboard/
│   │   └── page.tsx            # Analytics dashboard
│   └── roadmap/
│       └── page.tsx            # Career roadmap page
│
├── components/
│   ├── Navbar.tsx              # Navigation bar with mobile menu
│   ├── UploadBox.tsx           # Resume upload component
│   ├── SkillTags.tsx           # Skill input/tag component
│   ├── ScoreGauge.tsx          # Animated circular gauge
│   ├── Charts.tsx              # Radar & bar charts
│   └── RoadmapTimeline.tsx     # Timeline component
│
├── services/
│   └── api.ts                  # API service with mock fallback
│
├── styles/                     # Global CSS
├── public/                     # Static assets
├── package.json                # Dependencies
├── next.config.ts              # Next.js config
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind CSS config
└── postcss.config.js           # PostCSS plugins
```

## 🔌 API Endpoints

The frontend connects to these FastAPI endpoints (with mock fallback):

```
POST   /analyze-resume          → Resume analysis
POST   /skill-gap               → Skill gap analysis
GET    /job-trends              → Job market trends
POST   /generate-roadmap        → Personalized roadmap
GET    /dashboard-data          → Dashboard analytics
```

### Request Examples

**Analyze Resume**:
```bash
curl -X POST http://localhost:8000/analyze-resume \
  -F "file=@resume.pdf" \
  -F "skills=[\"JavaScript\", \"React\"]" \
  -F "target_role=Full Stack Developer"
```

**Get Skill Gap**:
```bash
curl -X POST http://localhost:8000/skill-gap \
  -H "Content-Type: application/json" \
  -d '{"skills": ["JavaScript", "Python"]}'
```

## 🎨 Design Features

- **Animated Gradient Background**: Flowing gradient backdrop
- **Glassmorphism Cards**: Frosted glass effect with blur
- **Smooth Animations**: Framer Motion transitions
- **Color Scheme**:
  - Primary: Sky Blue (`#0ea5e9`)
  - Accent: Indigo (`#6366f1`)
  - Highlight: Pink (`#ec4899`)
  - Dark: Slate (`#0f1419`)

## 🔑 Key Components

### ScoreGauge
Animated circular gauge showing employability score with dynamic coloring.

```tsx
<ScoreGauge score={72} label="Employability Score" />
```

### Charts
Combined radar chart (skills) and bar chart (market demand).

```tsx
<Charts 
  skillsRadar={skillsData}
  marketDemand={marketData}
/>
```

### RoadmapTimeline
Interactive timeline with weekly learning tasks and difficulty levels.

```tsx
<RoadmapTimeline weeks={weeklyPlan} />
```

### UploadBox
Drag-and-drop file upload with visual feedback.

```tsx
<UploadBox onFileUpload={handleFile} loading={isLoading} />
```

### SkillTags
Multi-select skill input with suggestions.

```tsx
<SkillTags 
  skills={userSkills}
  onSkillsChange={setSkills}
/>
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Mobile menu with hamburger navigation
- Adaptive layouts for all screen sizes

## 🌙 Dark Mode

Pre-configured dark mode with custom color palette:
- Integrated into Tailwind config
- All components support dark theme
- Custom scrollbar styling

## ⚙️ Environment Variables

Create a `.env.local` file (optional):

```
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

## 🗂 Build & Deploy

**Build for production**:
```bash
npm run build
npm start
```

**Deployment**:
- Vercel: Connect GitHub repo, auto-deploy on push
- Docker: Use Node 18+ image
- Static hosting: `npm run build` generates `.next` folder

## 🔄 Mock Data

If backend is unavailable, the app automatically uses mock data for:
- Resume analysis results
- Skill gap analysis
- Job market trends
- Generated roadmaps
- Dashboard analytics

This allows full feature testing without a backend.

## 🐛 Troubleshooting

**Port 3000 already in use**:
```bash
npm run dev -- -p 3001
```

**Backend connection error**:
- Check if FastAPI is running on `http://localhost:8000`
- App will use mock data as fallback
- Check browser console for API errors

**Build fails**:
```bash
rm -rf node_modules .next
npm install
npm run build
```

## 📄 License

MIT License - Feel free to use this project

## 🤝 Contributing

Pull requests welcome! Please ensure:
- TypeScript types are complete
- Components are properly documented
- Animations are performance-optimized
- Mobile responsiveness is tested

## 📞 Support

For issues or questions, check:
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Recharts Docs](https://recharts.org)
- [Framer Motion Docs](https://www.framer.com/motion)

---

Built with ❤️ for career advancement
