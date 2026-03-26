# El Precio del Poder: Mexico's Drug War Data Journalism Project

An interactive, cinematic scrollytelling data journalism experience tracing Mexico's narcotrafficking violence across six presidential administrations (1990-2024). This project explores the question: "How did we get here?" by presenting a journalistically rigorous yet visually stunning narrative of political decisions and their cascading human costs.

## Project Overview

**Topic**: Data Journalism - Interactive Storytelling about Mexico's Drug War
**Course**: CPSC 481 - Data Analytics and Communication
**Objective**: Present complex data through compelling interactive visualizations, smooth transitions, and immersive scrollytelling that makes readers *feel*, *understand*, and *care* about the data.

### The Hook
The experience opens with El Mencho's death (February 22, 2026) — one of the most wanted drug lords in history — then rewinds through time to answer: how did Mexico's narcotrafficking problem become this destructive?

## Story Structure

### Section 0: The Hook (Hero)
- Opens with El Mencho's death announcement
- Establishes scale: 500,000+ lives lost
- Poses the central question: "How did we get here?"

### Section 1: Who Was El Mencho?
- Introduces El Mencho and CJNG dominance
- Context on cartel leadership and rise
- Maps CJNG territorial control

### Section 2: The Timeline
- Visual timeline of six presidents (1990-2024)
- Key statistics and death tolls per administration
- Animated transitions between eras

### Section 3: When the War Began (Calderón)
- December 11, 2006: Military deployment begins
- The "Kingpin Strategy" and its unintended consequences
- Violence spike visualization: +130% homicides (2006-2011)

### Section 4: The Rise of CJNG
- Evolution from La Tuta's Knights Templar to CJNG dominance
- Cartel fragmentation and territorial expansion
- AMLO era (2018-2024) and "Abrazos No Balazos" policy failure

### Section 5: Data Exploration
- Interactive comparison of presidential administrations
- Homicide timeline and trends
- State-level violence intensity maps

### Section 6: Conclusion
- Synthesis of findings
- Current situation post-El Mencho
- Memorial and reflection

## Tech Stack

### Core Framework
- **Next.js 16** - React framework with App Router
- **React 19.2** - UI library
- **TailwindCSS v4** - Utility-first styling

### Animation & Interaction
- **Framer Motion** - Scroll-triggered animations, parallax effects, spring physics
- **react-intersection-observer** - Detect when elements enter viewport

### Data Visualization
- **Recharts** - Line charts, bar charts, area charts for data visualization
- **SVG/GeoJSON** - Mexico maps and cartel territory visualization

### Typography
- **Playfair Display** (serif) - Headlines, editorial feel
- **Source Sans 3** (sans-serif) - Body text, readability

### Design System
- Custom dark cinematic theme with blood-red accents
- 3-5 color palette: Deep black, dark grays, blood red, crimsons
- Film grain overlay for documentary aesthetic

## Key Features

### Scrollytelling Mechanics
- **Full-page sections** with sticky scroll effects
- **Scroll-triggered animations** that reveal data as you progress
- **Progress bar** at top showing scroll position
- **Smooth easing** and spring physics for natural motion

### Data Visualizations
- **Homicide Timeline Chart**: Line graph showing deaths 1990-2026 with presidential eras highlighted
- **President Comparison Chart**: Stacked bar chart comparing total deaths per administration
- **Mexico Territory Maps**: Choropleth maps showing violence intensity by state, with cartel territory overlays
- **Death Counter**: Animated counters that spring-animate from 0 to actual values
- **Cartel Evolution Timeline**: Network diagram showing cartel fragmentation over time

### Interactive Elements
- **Responsive design** - Mobile-first, works on all screen sizes
- **Hover effects** - Subtle interactions on charts and cards
- **Image reveals** - Photos fade in on scroll with cinematic timing
- **Data cards** - Statistics highlight key findings with animated counters

## Data Sources

### Primary Datasets
- **INEGI (Instituto Nacional de Estadística y Geografía)**
  - Homicides by state, 1990-2024
  - URL: https://datamx.io/sv/dataset/homicidios-dolosos-registrados-en-mexico-por-entidad-1990-2023

- **World Bank - Homicide Rate Data**
  - Homicides per 100,000 population (normalized)
  - URL: https://data.worldbank.org/indicator/VC.IHR.PSRC.P5

- **RNPED (Registro Nacional de Personas Desaparecidas)**
  - Missing/disappeared persons database
  - Focus: Drug war-related disappearances 2006-2024

- **GitHub Repositories**
  - Mexico GeoJSON data: PhantomInsights/mexico-geojson
  - Cartel timeline and homicide datasets

### Key Statistics Used
```
Salinas (1988-1994):     ~75,000 deaths (~12,500/year)
Zedillo (1994-2000):     ~78,000 deaths (~13,000/year)
Fox (2000-2006):         ~60,000 deaths (~10,000/year)
Calderón (2006-2012):   ~121,000 deaths (~20,000/year) [+100%]
Peña Nieto (2012-2018): ~157,000 deaths (~26,000/year)
AMLO (2018-2024):       ~195,000 deaths (~32,500/year)
Sheinbaum (2024-2026):  ~67,600 deaths (~33,800/year)
```

## Visual Assets

### Generated Images
- `el-mencho-silhouette.jpg` - Dark silhouette with dramatic red lighting
- `mexico-dark-map.jpg` - Stylized map with glowing violence hotspots
- `military-silhouette.jpg` - Soldiers in tactical gear, sunset backdrop
- `memorial-candles.jpg` - Vigil candles in darkness, emotional impact
- `hero-bg.jpg` - Abstract dark background with red smoke wisps
- `cartel-infographic.jpg` - Network diagram showing cartel connections
- `violence-data-bg.jpg` - Data visualization grid background

## Component Structure

```
/components
├── scroll-provider.tsx          # Context for scroll state management
├── scroll-section.tsx           # Base section wrapper
├── death-counter.tsx            # Animated counter component
├── president-card.tsx           # President info card
├── marquee-text.tsx             # Scrolling text effect
├── statistic-card.tsx           # Statistics display
├── section-with-image.tsx       # Section with background image
├── /charts
│   ├── homicide-timeline.tsx    # Line chart of homicides 1990-2026
│   ├── president-comparison.tsx # Bar chart comparing administrations
│   ├── mexico-map.tsx           # Choropleth map of Mexico
│   └── cartel-timeline.tsx      # Cartel evolution timeline
└── /sections
    ├── hero-section.tsx         # Hook section
    ├── el-mencho-section.tsx    # Who was El Mencho
    ├── timeline-section.tsx     # Six presidents timeline
    ├── war-begins-section.tsx   # Calderón era (2006-2012)
    ├── cjng-rise-section.tsx    # CJNG dominance & AMLO era
    ├── data-exploration-section.tsx # Interactive data comparison
    └── conclusion-section.tsx   # Conclusion & reflection
```

## Styling System

### Color Palette
- **Background**: `#0a0a0a` (Deep black)
- **Foreground**: `#e8e8e8` (Off-white)
- **Primary**: `#8b0000` (Dark blood red)
- **Accent**: `#b91c1c` (Bright crimson)
- **Muted**: `#1a1a1a` (Dark gray)
- **Card**: `#111111` (Slightly lighter black)

### Typography
- **Headings**: Playfair Display (serif, 400-900 weights)
- **Body**: Source Sans 3 (sans-serif, 300-700 weights)
- **Data/Monospace**: SF Mono (via font-mono)

### Visual Effects
- **Film grain overlay** at 3% opacity for cinematic feel
- **Text shadows** on headings for depth
- **Blood drip gradients** for visual interest
- **Pulse animations** on death counters
- **Scroll-triggered fades** and parallax effects

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation
```bash
# Using the shadcn CLI (recommended)
npx shadcn-cli@latest init

# Or clone this repository
git clone https://github.com/FabricioPons/final_project_cpsc481.git
cd final_project_cpsc481

# Install dependencies
npm install
# or
pnpm install
```

### Running Locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production
```bash
npm run build
npm start
```

## Deployment

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository directly to Vercel for automatic deployments.

## Performance Optimization

- **Lazy loading** of images and charts
- **Code splitting** by route
- **Optimized Recharts** with custom renderers
- **CSS containment** for animation performance
- **Minimal JavaScript** with Framer Motion's GPU acceleration

## Accessibility

- **Semantic HTML** (section, main, article tags)
- **ARIA labels** on interactive elements
- **Color contrast** compliance (WCAG AA)
- **Keyboard navigation** support
- **Screen reader** friendly with proper heading hierarchy
- **Alt text** on all meaningful images

## Credits

**Project**: CPSC 481 Final Project - Data Analytics and Communication
**Created**: 2026

### Data Sources
- INEGI - Mexican Statistics Institute
- World Bank - Development Indicators
- DEA - Drug Enforcement Administration
- News archives and academic papers

### Design Inspiration
- The New York Times Interactive Features
- The Pudding - Data Storytelling
- Reuters Graphics
- BBC Data Journalism

---

**Note**: This is a data journalism project designed to inform and educate about Mexico's drug war. All statistics and data are sourced from official government databases and academic research. The project aims to present facts objectively while creating an emotionally resonant experience.
