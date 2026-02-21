# CareerPilot AI - Development Setup Guide

## 📋 Prerequisites

- **Node.js**: v18.0 or higher
- **npm**: v9+ or yarn v3+
- **Git**: For version control
- **FastAPI Backend**: Running on `http://localhost:8000`

Check versions:
```bash
node --version   # v18.x.x
npm --version    # v9.x.x
git --version    # git version 2.x.x
```

## 🚀 Initial Setup

### 1. Clone Repository

```bash
cd e:\JobSkills
# If not already there
```

### 2. Install Dependencies

Navigate to frontend folder:
```bash
cd frontend
npm install
# or
yarn install
```

This will install:
- Next.js 15
- Tailwind CSS 3.4
- Recharts 2.12
- Framer Motion 11
- Lucide Icons
- TypeScript 5.3
- And other dependencies

### 3. Verify Installation

```bash
npm list
```

Should show all dependencies installed successfully.

## 🔧 Environment Setup

### Create Local Environment File

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_BASE=http://localhost:8000
DEBUG=false
```

**Note**: Variables prefixed with `NEXT_PUBLIC_` are exposed to browser.

### Configure vs Backend

Ensure FastAPI backend is configured to accept requests from frontend:
- Backend should run on `http://localhost:8000`
- Enable CORS for `http://localhost:3000`

## 👨‍💻 Development Workflow

### Start Development Server

```bash
npm run dev
# or
yarn dev
```

Server starts at `http://localhost:3000`

Features:
- Hot Module Reloading (HMR)
- Automatic page refresh on changes
- Fast refresh for components
- Source maps for debugging

### Project Structure Navigation

```
frontend/
├── app/                    # Pages & layouts
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── analyze/           # Analyze page
│   ├── dashboard/         # Dashboard page
│   └── roadmap/           # Roadmap page
│
├── components/            # Reusable components
│   ├── Navbar.tsx         # Navigation
│   ├── UploadBox.tsx      # File upload
│   ├── SkillTags.tsx      # Skills input
│   ├── ScoreGauge.tsx     # Gauge chart
│   ├── Charts.tsx         # Data charts
│   └── RoadmapTimeline.tsx # Timeline
│
├── services/              # API integration
│   └── api.ts            # API service
│
└── styles/               # Stylesheets
```

## 📝 Coding Standards

### TypeScript

Always use TypeScript for new files:
```tsx
interface Props {
  score: number;
  label: string;
}

export default function Component({ score, label }: Props) {
  return <div>{label}: {score}</div>
}
```

### Component Structure

```tsx
"use client";  // Mark as client component

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  prop1: string;
  prop2?: number;
}

export default function MyComponent({ prop1, prop2 }: Props) {
  const [state, setState] = useState("");

  const handleClick = () => {
    setState("new value");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={handleClick}
    >
      {prop1}
    </motion.div>
  );
}
```

### Naming Conventions

- **Components**: PascalCase (`MyComponent.tsx`)
- **Hooks**: Camel case starting with `use` (`useData`)
- **Files**: kebab-case or PascalCase for components
- **CSS classes**: snake_case or kebab-case
- **Variables**: camelCase

### ESLint & Formatting

Check for issues:
```bash
npm run lint
```

Format code (manual):
- Use VS Code auto-format (Alt+Shift+F)
- Or configure Prettier

## 🧪 Testing

Create test files alongside components:

Example: `ScoreGauge.test.tsx`
```tsx
import { render, screen } from '@testing-library/react';
import ScoreGauge from './ScoreGauge';

describe('ScoreGauge', () => {
  it('displays the score', () => {
    render(<ScoreGauge score={75} />);
    expect(screen.getByText('75')).toBeInTheDocument();
  });
});
```

Run tests (when configured):
```bash
npm run test
```

## 🎨 Styling Guide

### Tailwind CSS Classes

Use Tailwind for styling:
```tsx
<div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
  <h2 className="text-2xl font-bold text-white">Title</h2>
  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded transition-colors">
    Click
  </button>
</div>
```

### Custom Styles

Global styles in `globals.css`:
```css
.glassmorphism {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 12px;
}

.text-gradient {
  background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

Use in components:
```tsx
<div className="glassmorphism">
  <h1 className="text-gradient">Title</h1>
</div>
```

### Color Palette

From `tailwind.config.ts`:
- **Primary**: Cyan (`#0ea5e9`)
- **Secondary**: Indigo (`#6366f1`)
- **Accent**: Pink (`#ec4899`)
- **Dark**: Slate (`#0f1419` - `#111827`)

## 🔄 API Integration

### Using API Service

```tsx
import { apiService } from "@/services/api";

export default function Component() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiService.getDashboardData();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch:", error);
        // Mock data used as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return loading ? <div>Loading...</div> : <div>{/*...*/}</div>;
}
```

### Error Handling

```tsx
try {
  const response = await apiService.analyzeResume(formData);
  setResult(response);
} catch (error) {
  setError("Failed to analyze. Please try again.");
  console.error(error);
}
```

## 🐛 Debugging

### Browser DevTools

1. Open DevTools (F12)
2. Check Console for errors
3. Use React DevTools extension
4. Check Network tab for API calls

### VS Code Debugging

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug full stack",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "runtimeArgs": ["dev"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Common Issues

**Port 3000 already in use**:
```bash
npm run dev -- -p 3001
```

**API connection errors**:
- Check if backend is running
- Verify `NEXT_PUBLIC_API_BASE` in `.env.local`
- Check browser console for CORS errors

**Build errors**:
```bash
rm -rf .next node_modules
npm install
npm run build
```

## 📦 Building for Production

### Build Process

```bash
npm run build
```

This:
- Compiles TypeScript
- Optimizes images
- Minifies CSS/JS
- Creates `.next` folder

### Start Production Server

```bash
npm start
```

Serves optimized app on `http://localhost:3000`

### Analyze Build Size

```bash
npm run build --analyze
```

(Requires `@next/bundle-analyzer`)

## 🚀 Git Workflow

### Feature Branch

```bash
git checkout -b feature/my-feature
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin feature/my-feature
```

### Commit Messages

Follow conventional commits:
- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`
- `style: format code`
- `refactor: restructure code`
- `test: add tests`

### Pull Request

1. Push to feature branch
2. Create PR on GitHub
3. Request review
4. Merge to main

## 📚 Additional Resources

### Next.js Documentation
- [App Router](https://nextjs.org/docs/app)
- [Pages & Layouts](https://nextjs.org/docs/app/building-your-application/routing)
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

### Tailwind CSS
- [Utility-First CSS](https://tailwindcss.com/docs)
- [Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Dark Mode](https://tailwindcss.com/docs/dark-mode)

### Framer Motion
- [Animation Documentation](https://www.framer.com/motion)
- [Gesture Animation](https://www.framer.com/motion-start)
- [Advanced Patterns](https://www.framer.com/motion-patterns)

### React Documentation
- [React Hooks](https://react.dev/reference/react)
- [Component Patterns](https://react.dev/learn)

## 💡 Tips & Tricks

### Hot Module Replacement (HMR)

Hot reload enabled by default. Save file to see changes instantly.

### Performance Optimization

- Use `React.memo()` for expensive components
- Lazy load with `dynamic()` import
- Optimize images with Next.js Image component

### State Management

For complex state, consider:
- Context API (built-in)
- Zustand (lightweight)
- Redux (if needed)

### Browser Extensions

Recommended:
- React Developer Tools
- Redux DevTools
- Next.js DevTools

## 🤝 Contributing

1. Follow coding standards above
2. Test changes locally
3. Document new features
4. Submit PR for review

## 📞 Support

Issues? Check:
- README.md
- DEPLOYMENT.md
- Component JSDoc comments
- Browser console errors

---

Happy coding! 🎉
