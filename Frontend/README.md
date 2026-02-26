# SkillGap AI Frontend

This frontend is a React + Vite single-page application for **AI-driven job-skill prediction UX**. It provides a modern animated interface for:

- Building a user skill profile
- Simulating AI skill-gap analysis results
- Showing roadmap milestones
- Visualizing analytics trends with charts

---

## What has been added in the frontend

Compared to a default Vite starter, this frontend has been expanded with:

1. **Multi-page product flow** using React Router:
	 - `/` Home
	 - `/dashboard`
	 - `/skills`
	 - `/results`
	 - `/roadmap`
	 - `/analytics`

2. **App shell + navigation system**:
	 - Sticky animated top `Navbar`
	 - Context-aware `Sidebar` (hidden on Home route)
	 - Route transitions using Framer Motion + `PageFrame`

3. **Advanced visual system**:
	 - Global glassmorphism + neon style classes in `index.css`
	 - Animated aurora + grid overlays
	 - Cursor-follow glow effect
	 - Three.js particle-wave full-screen background

4. **Interactive UI logic by page**:
	 - Count-up KPI cards, collapsible roadmap, dynamic skill tags, loading state simulation, chart rendering

5. **Reusable component layer**:
	 - `AnimatedCard`, `LoadingSkeleton`, `AIOrb`, `Navbar`, `Sidebar`, and multiple background components

6. **Performance-oriented build configuration**:
	 - Route-level lazy loading
	 - Suspense fallback skeletons
	 - Manual vendor chunk splitting in Vite config

---

## Tech stack

- **Core**: React 19, React DOM 19, Vite 7
- **Routing**: React Router DOM
- **Animation**: Framer Motion, GSAP
- **3D/Canvas visuals**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Charts**: Recharts
- **UI helpers**: React Icons, clsx
- **Styling**: Tailwind CSS v4 + custom CSS utility classes

---

## Project structure

```text
src/
	App.jsx
	main.jsx
	index.css
	App.css
	animations/
		variants.js
	components/
		AIOrb.jsx
		AnimatedCard.jsx
		CursorGlow.jsx
		DataFlowBackground.jsx
		LoadingSkeleton.jsx
		Navbar.jsx
		NeuralGridBackground.jsx
		ParticleWaveBackground.jsx
		Sidebar.jsx
	pages/
		Home.jsx
		Dashboard.jsx
		SkillInput.jsx
		Results.jsx
		Roadmap.jsx
		Analytics.jsx
	styles/
		theme.css
```

---

## App architecture and flow

### Entry point (`main.jsx`)

- Mounts React app to `#root`
- Wraps app in `BrowserRouter`
- Enables development checks with `StrictMode`

### Root composition (`App.jsx`)

#### Key functions/components

- `PageFrame({ children })`
	- Shared route transition wrapper (`initial`, `animate`, `exit` motion states)
	- Ensures each page enters/exits with smooth motion + blur

- `App()`
	- Uses `useLocation()` to track current route
	- Uses `useMemo()` to compute `showSidebar` (`pathname !== '/'`)
	- Renders global visual layers + navigation + routed page content

#### Global layout layers in render order

1. `ParticleWaveBackground`
2. `.animated-aurora` overlay
3. `.grid-overlay`
4. `CursorGlow`
5. `Navbar`
6. Content area containing optional `Sidebar` + routed page `<main>`

#### Route management

- Uses lazy imports for all pages
- Wraps routes in `Suspense` with `LoadingSkeleton` fallback
- Uses `AnimatePresence` + key by pathname for per-route animation
- Redirects unknown routes to `/`

---

## Page-by-page detailed documentation

## 1) Home page (`pages/Home.jsx`)

### Purpose

Landing page for product introduction, value proposition, and user CTA.

### Local constants

- `features`: array of 3 feature cards (title, description, icon)

### Functions/hooks used

- `Home()`
	- `ctaRef = useRef(null)` used to target CTA button
	- `useEffect()` starts GSAP pulse tween on CTA (scale yoyo loop)
	- Cleanup kills tween on unmount

### Sections

1. **Floating helper**: `AIOrb`
2. **Ambient glows**: absolute decorative neon blobs
3. **Hero block**:
	 - Product identity text
	 - Main title + description
	 - Primary and secondary CTA buttons
4. **AI Signal Feed panel**:
	 - Static list of trend signals (label + value)
5. **Feature card grid**:
	 - Maps `features` into `AnimatedCard`
6. **How It Works timeline**:
	 - 3-step process with numbered nodes
7. **Bottom conversion CTA**:
	 - “Begin Now” card with icon

---

## 2) Dashboard page (`pages/Dashboard.jsx`)

### Purpose

Displays headline AI metrics and demand momentum as a dashboard summary.

### Functions/components

- `CountUp({ end, suffix = '' })`
	- Local animated counter
	- Uses `useState` for displayed value
	- Uses `useEffect` with `setInterval` to increment across fixed frames
	- Cleans timer on unmount

- `Dashboard()`
	- Creates `cards` array containing KPI metadata
	- Renders KPI cards and two analytics panels

### Sections

1. **Header**: dashboard title and subtitle label
2. **KPI cards grid**:
	 - Skill Match Score
	 - Market Demand Index
	 - Missing Skills
	 - Career Prediction
3. **Demand Momentum Stream panel**:
	 - Horizontal animated progress bars for demand categories
4. **AI Notes panel**:
	 - Static recommendation note cards

---

## 3) Skill Input page (`pages/SkillInput.jsx`)

### Purpose

Collects user profile inputs and skill tags prior to running analysis.

### State and derived logic

- `skills` (default: `['Python', 'SQL']`)
- `tagInput` (current text entry)
- `form` object:
	- `fullName`, `email`, `targetRole`, `experience`
- `canSubmit = useMemo(...)`
	- Enables submit action when required fields are filled

### Functions

- `addSkill()`
	- Trims `tagInput`
	- Prevents empty and duplicate entries
	- Appends new skill to `skills`
	- Clears `tagInput`

### Sections

1. **Header**: page title
2. **Profile form grid**:
	 - Floating-label text inputs generated by mapping key/label pairs
3. **Skill Tags block**:
	 - Existing tags with remove action (`HiXMark` button)
	 - Input + Enter key handling + add button
4. **Actions row**:
	 - “Upload Resume” button
	 - “Run AI Skill Analysis” button (disabled until `canSubmit`)

---

## 4) Results page (`pages/Results.jsx`)

### Purpose

Simulates AI analysis output and displays readiness + gap insights.

### State and effects

- `loading` state initialized to `true`
- `useEffect()` sets timeout (1700ms) then shows results
- Cleanup clears timeout

### Conditional rendering flow

- **Loading mode**:
	- “AI THINKING...” status row with animated dots
	- Skeleton placeholders for sections

- **Loaded mode**:
	- Full results dashboard

### Loaded sections

1. **Header**: result title
2. **Overall Match radial card**:
	 - Circular conic-gradient visualization with readiness %
3. **Skill Comparison panel**:
	 - Progress bars for major skill areas
4. **Missing Skills panel**:
	 - Chip list of gap skills
5. **AI Recommendation card**:
	 - Suggested path + summary
	 - Growth probability badge

---

## 5) Roadmap page (`pages/Roadmap.jsx`)

### Purpose

Presents staged learning milestones with expandable module details.

### Data and state

- `roadmapSteps`: static array of milestone objects
	- `title`, `duration`, `modules[]`
- `openIndex` state controls which milestone accordion is expanded

### Functions/interactions

- Toggle handler in button:
	- `setOpenIndex(open ? -1 : index)`
	- Collapses active card when clicked again

### Sections

1. **Header**
2. **Vertical timeline container** with connector line
3. **Milestone accordion cards**:
	 - Card header (title + duration + chevron)
	 - Animated expand/collapse area for modules

---

## 6) Analytics page (`pages/Analytics.jsx`)

### Purpose

Shows chart-based market and skill analytics.

### Data constants

- `demandData` for line chart
- `growthData` for bar chart
- `radarData` for radar chart

### Functions/components

- `Analytics()` renders 3 chart panels with Framer Motion wrappers
- Uses Recharts primitives:
	- `LineChart`, `BarChart`, `RadarChart`
	- `ResponsiveContainer`, axes, tooltips, grid, legend

### Sections

1. **Header**
2. **Demand Trend Graph** (line chart)
3. **Skill Growth Chart** (bar chart + gradient fill)
4. **Radar Skill Chart** (radar polygon)

---

## Shared component documentation

## `components/Navbar.jsx`

### Purpose

Top navigation with desktop links and mobile drawer.

### Functions/hooks

- `Navbar()` state:
	- `scrolled`: toggles nav style after scroll threshold
	- `menuOpen`: controls mobile menu visibility
	- `logoRef`: GSAP animated glow target

- Effects:
	1. Adds/removes scroll listener (`window.scrollY > 24`)
	2. Auto-closes mobile menu on route change
	3. Runs GSAP yoyo glow tween for logo badge

### Sections

- Brand badge
- Desktop nav links with active underline animation
- CTA button (“Start Predicting”)
- Mobile menu toggle + animated dropdown panel

## `components/Sidebar.jsx`

### Purpose

Icon-only side navigation for non-home routes.

### Behavior

- Uses `NavLink` to derive active state
- Applies active neon style + hover motion scale/lift
- Hidden on small screens (`md:block`)

## `components/AnimatedCard.jsx`

### Purpose

Reusable elevated card with optional icon, value, subtitle, and child content.

### Behavior

- Uses Framer Motion hover transform
- Uses `clsx` to combine default class set + caller classes

## `components/AIOrb.jsx`

### Purpose

Floating status indicator (“AI Assistant Active”) on large screens.

### Behavior

- Continuous bob + rotate animation loop
- Includes icon ping ring for activity signal

## `components/CursorGlow.jsx`

### Purpose

Cursor-follow highlight effect for desktop screens.

### Functions/hooks

- Tracks pointer position in state
- Uses Framer Motion `useSpring` smoothing
- Cleans pointermove listener on unmount

## `components/LoadingSkeleton.jsx`

### Purpose

Reusable skeleton placeholder with pulse + shimmer effects.

## `components/ParticleWaveBackground.jsx`

### Purpose

GPU-based 3D particle field background (React Three Fiber + custom shader).

### Key internal functions

- `GalaxyParticleMaterial`: custom shader material with attributes for branch, radius, random offset, scale, and color mix
- `GalaxyParticles()`:
	- Builds 20,000-particle geometry via typed arrays
	- Updates shader time uniform + scene rotation each frame
- `ParticleWaveBackground()`:
	- Full-screen fixed `<Canvas>` host
	- Configures camera, renderer options, and clear color

## `components/DataFlowBackground.jsx`

### Purpose

Alternative canvas-based neon data-stream background engine.

### Key helper functions

- Scene/object factories: `createLine`, `createParticle`
- Draw functions: `drawLine`, `buildLinePath`, `drawParticle`
- Utility helpers: `lerp`, `rand`, `randInt`, `pickColor`, `toRgba`, `toHex`

### Main behavior

- Multi-layer parallax line system (`bg`, `mid`, `fg`)
- GSAP pulse timeline + mouse/touch reactive animation
- RequestAnimationFrame render loop with cleanup

## `components/NeuralGridBackground.jsx`

### Purpose

Alternative canvas neural-grid and node-link background.

### Key helper functions

- `clamp`
- `createNodeSet`
- `getAdaptiveNodeCount`

### Main behavior

- Adaptive node count based on viewport/device memory
- Perspective projection + cursor energy links
- Full-screen render loop and cleanup listeners

> Note: `ParticleWaveBackground` is currently used in `App.jsx`. `DataFlowBackground` and `NeuralGridBackground` are available alternatives.

---

## Animation utilities

### `animations/variants.js`

- `fadeUp`
	- Hidden: lower + transparent
	- Show: visible + eased upward motion
- `staggerContainer`
	- Child stagger sequencing for grouped reveal animations

---

## Styling system

### Global style files

- `index.css`
	- Imports Google fonts and Tailwind
	- Defines typography utility classes (`.font-heading`, `.font-ai`)
	- Defines reusable visual primitives:
		- `.glass`, `.neon-border`, `.button-ripple`, `.glow-chip`
	- Defines environment overlays:
		- `.animated-aurora`, `.grid-overlay`
	- Defines keyframes:
		- `aurora`, `ripple`, `pulseDot`, `shimmer`

- `styles/theme.css`
	- Reserved placeholder for future theme tokens

- `App.css`
	- Default Vite starter CSS (currently not used by app pages)

---

## Build and performance notes

### Route/code loading

- All pages are lazy-loaded in `App.jsx`
- Suspense fallback reduces perceived loading latency

### Bundle splitting (`vite.config.js`)

Manual chunk strategy for faster caching and loading:

- `three-vendor`: `three`, `@react-three/*`
- `motion-vendor`: `framer-motion`, `gsap`
- `charts-vendor`: `recharts` and d3 modules
- `icons-vendor`: `react-icons`
- `vendor`: other node modules

### Linting (`eslint.config.js`)

- JS recommended rules + react-hooks + react-refresh preset
- Custom `no-unused-vars` with pattern ignore for uppercase-prefixed vars

---

## Current behavior scope

The current frontend is **UI-driven with mocked/static analytics values**. It does not yet call a backend API for:

- Real user authentication
- Dynamic profile persistence
- Live model inference
- Dataset-backed analytics

This makes the frontend ideal as a polished prototype shell, ready for backend integration.

---

## Run locally

```bash
npm install
npm run dev
```

Optional:

```bash
npm run build
npm run preview
npm run lint
```

---

## Suggested next integration steps

1. Connect `SkillInput` submit action to backend prediction endpoint.
2. Replace static `Results` and `Dashboard` values with API responses.
3. Feed `Analytics` charts from backend aggregate endpoints.
4. Persist roadmap and recommendations per user profile.

