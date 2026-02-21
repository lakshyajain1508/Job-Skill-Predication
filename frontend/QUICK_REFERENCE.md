# CareerPilot AI - Quick Reference

## 🎯 Project Overview

A premium AI SaaS career intelligence platform with Next.js frontend. Users can upload resumes, analyze skills, view market trends, and get personalized learning roadmaps.

## 📁 Complete File Structure

```
frontend/
│
├── app/                                    # Next.js App Router
│   ├── layout.tsx                         # Root layout component
│   ├── page.tsx                           # Landing page (/)
│   ├── globals.css                        # Global CSS & animations
│   ├── analyze/
│   │   └── page.tsx                       # Resume analysis page (/analyze)
│   ├── dashboard/
│   │   └── page.tsx                       # Analytics dashboard (/dashboard)
│   └── roadmap/
│       └── page.tsx                       # Career roadmap page (/roadmap)
│
├── components/                            # Reusable components
│   ├── Navbar.tsx                         # Navigation with mobile menu
│   ├── UploadBox.tsx                      # Drag-drop file upload
│   ├── SkillTags.tsx                      # Multi-select skill input
│   ├── ScoreGauge.tsx                     # Circular progress gauge
│   ├── Charts.tsx                         # Radar & bar charts
│   └── RoadmapTimeline.tsx               # Interactive timeline
│
├── services/
│   └── api.ts                             # API service layer (mock fallback)
│
├── public/                                # Static assets
│
├── Configuration Files
│   ├── package.json                       # Dependencies & scripts
│   ├── tsconfig.json                      # TypeScript config
│   ├── next.config.ts                     # Next.js config
│   ├── tailwind.config.ts                 # Tailwind CSS config
│   ├── postcss.config.js                  # PostCSS plugins
│   ├── Dockerfile                         # Docker image config
│   ├── docker-compose.yml                 # Multi-container setup
│   ├── vercel.json                        # Vercel deployment
│   ├── .env.example                       # Environment template
│   ├── .gitignore                         # Git ignore rules
│   └── .dockerignore                      # Docker ignore rules
│
├── Documentation
│   ├── README.md                          # Main documentation
│   ├── DEVELOPMENT.md                     # Development setup guide
│   ├── DEPLOYMENT.md                      # Deployment instructions
│   └── QUICK_REFERENCE.md                # This file
│
└── node_modules/                          # Dependencies (git ignored)
```

## 🚀 Quick Commands

```bash
# Setup
npm install                    # Install dependencies
cp .env.example .env.local    # Create env file

# Development
npm run dev                    # Start dev server (localhost:3000)
npm run lint                   # Check code quality

# Production
npm run build                  # Build for production
npm start                      # Start production server

# Docker
docker build -t careerpilot:latest .      # Build image
docker run -p 3000:3000 careerpilot       # Run container
docker-compose up                          # Start with backend
```

## 📄 File Descriptions

### Pages

| File | Route | Purpose |
|------|-------|---------|
| `app/page.tsx` | `/` | Landing page with Hero & CTA |
| `app/analyze/page.tsx` | `/analyze` | Resume upload & analysis form |
| `app/dashboard/page.tsx` | `/dashboard` | Analytics dashboard |
| `app/roadmap/page.tsx` | `/roadmap` | Career roadmap timeline |

### Components

| Component | Purpose |
|-----------|---------|
| `Navbar.tsx` | Header navigation (responsive) |
| `UploadBox.tsx` | Drag-drop file upload area |
| `SkillTags.tsx` | Skills input with suggestions |
| `ScoreGauge.tsx` | Animated circular gauge |
| `Charts.tsx` | Radar + bar charts (Recharts) |
| `RoadmapTimeline.tsx` | Timeline with weekly tasks |

### Services

| File | Purpose |
|------|---------|
| `services/api.ts` | API client with mock fallback |

### Styling

| File | Purpose |
|------|---------|
| `app/globals.css` | Global styles, animations, custom classes |
| `tailwind.config.ts` | Tailwind configuration, colors |
| `postcss.config.js` | PostCSS plugins (Tailwind, autoprefixer) |

### Config

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts, metadata |
| `tsconfig.json` | TypeScript compiler options |
| `next.config.ts` | Next.js configuration |
| `.env.example` | Environment variables template |

### Docker

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage production image |
| `docker-compose.yml` | Frontend + Backend orchestration |
| `.dockerignore` | Files excluded from Docker image |

### Docs

| File | Purpose |
|------|---------|
| `README.md` | Main documentation & features |
| `DEVELOPMENT.md` | Dev setup, workflow, debugging |
| `DEPLOYMENT.md` | Deployment guides (Vercel, Docker, etc) |
| `QUICK_REFERENCE.md` | This file - commands & overview |

## 🎨 Design System

### Colors

```
Primary: #0ea5e9 (Sky)
Secondary: #6366f1 (Indigo)
Accent: #ec4899 (Pink)
Dark BG: #0f1419 (Dark slate)
```

### Custom CSS Classes

```css
.glassmorphism        /* Frosted glass effect */
.text-gradient        /* Gradient text effect */
.animated-gradient    /* Animating gradient bg */
.glow                 /* Glowing shadow */
```

### Animations

- Fade & slide transitions (Framer Motion)
- Hover scale effects
- Staggered children animations
- Auto-rotating gradients

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/analyze-resume` | Analyze uploaded resume |
| POST | `/skill-gap` | Get skill gap analysis |
| GET | `/job-trends` | Get market trends |
| POST | `/generate-roadmap` | Generate roadmap |
| GET | `/dashboard-data` | Get dashboard data |

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All pages are mobile-first responsive.

## 🔑 Environment Variables

```
NEXT_PUBLIC_API_BASE=http://localhost:8000    # Backend URL
DEBUG=false                                    # Debug mode
```

## 🎯 Key Packages

| Package | Version | Purpose |
|---------|---------|---------|
| Next.js | 15.1.0 | React framework |
| React | 18.3.1 | UI library |
| TypeScript | 5.3.3 | Type safety |
| Tailwind CSS | 3.4.1 | Styling |
| Recharts | 2.12.0 | Charts |
| Framer Motion | 11.0.0 | Animations |
| Lucide Icons | 0.408.0 | Icons |
| Axios | 1.7.4 | HTTP client |

## 🚀 Deployment Platforms

### Recommended: Vercel
- Auto-detects Next.js
- Zero config deployment
- Free tier available

### Also Supported
- Docker + Any Docker host
- AWS ECS / AppRunner
- Railway, Fly.io, Netlify
- DigitalOcean, manual VPS

See `DEPLOYMENT.md` for detailed guides.

## 📊 Performance Tips

1. **Image Optimization**: Use Next.js `Image` component
2. **Code Splitting**: Automatic with dynamic imports
3. **Caching**: Set proper cache headers
4. **CDN**: Use Cloudflare or similar
5. **Monitoring**: Integrate Sentry, LogRocket

## 🐛 Debugging Tips

### Check API Connection
```bash
curl http://localhost:8000/health
```

### View Network Requests
- Open DevTools (F12)
- Network tab
- Check request/response

### Debug TypeScript
- Use `as const` for type inference
- Hover over variables for types
- Check `.tsx` file type hints

## 🎓 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts](https://recharts.org)
- [Framer Motion](https://www.framer.com/motion)
- [React](https://react.dev)

## 💡 Common Tasks

### Add New Page
```bash
mkdir app/newpage
touch app/newpage/page.tsx
```

### Add New Component
```bash
touch components/NewComponent.tsx
```

### Update Styles
Edit `tailwind.config.ts` or `app/globals.css`

### Connect New API
Add method to `services/api.ts`, add mock data

## 🔒 Security Notes

1. Never commit `.env.local` - it's gitignored
2. Use `NEXT_PUBLIC_` prefix only for public vars
3. Validate all API inputs
4. Keep dependencies updated: `npm audit`
5. Use HTTPS in production

## 📈 Scaling Strategy

For high traffic:
1. Use CDN for static assets
2. Enable caching headers
3. Load balance API endpoints
4. Monitor with Sentry/DataDog
5. Scale horizontally with containers

## 🤝 Development Workflow

1. Create feature branch: `git checkout -b feature/name`
2. Make changes & test locally
3. Commit: `git commit -m "feat: description"`
4. Push: `git push origin feature/name`
5. Create PR → Review → Merge

## 📞 Support Checklist

- [ ] Backend running on :8000?
- [ ] `.env.local` configured?
- [ ] `npm install` completed?
- [ ] Port 3000 free?
- [ ] Node.js 18+?

## ✨ What's Next?

1. ✅ Frontend complete
2. → Setup backend (FastAPI)
3. → Deploy to Vercel/Docker
4. → Add more features
5. → Scale for production

---

**Version**: 1.0.0  
**Last Updated**: Feb 2026  
**Status**: Ready for development
