# Adarsh Gadagin — Personal Portfolio

A modern, high-polish personal portfolio website for **Adarsh Gadagin**, a 2nd-year B.Tech Computer Science & Engineering student at REVA University, Bangalore.

Built with a dark-first **creative engineering studio** aesthetic inspired by Apple, Stripe, Raycast, and Nothing. Positions Adarsh as a curious, technically grounded student actively building and exploring programming, web development, AI/ML, and systems.

---

## ⚡ Features

- **Dual Theme System**: Dark mode (default), clean light mode, and system preference with `localStorage` persistence.
- **Raycast-Style Command Menu**: Quick access via `⌘K` / `Ctrl+K` or header button for seamless keyboard navigation, instant section jumps, theme switching, and actions.
- **Developer HUD (Easter Egg)**: Activated via the classic Konami code (`↑ ↑ ↓ ↓ ← → ← → B A`) or Command Menu, rendering an engineering terminal with diagnostics and system status.
- **Interactive Projects Showcase**:
  - **2D Graphics Editor in C**: Demonstrates rasterization, geometry primitives, and serialization with an interactive live SVG canvas toolbar.
  - **Smart Door Access System**: IoT-based embedded access control system using ESP32, RFID verification, and relay solenoid lock with system architecture diagrams.
- **Verified Credentials**: Showcases IBM SkillsBuild certificates in Python, Data Analysis, and Data Visualization.
- **High Performance & Accessibility**: 100% vanilla HTML5, CSS3, and modern ES modules. Zero heavy framework bloat. Full keyboard navigation and `prefers-reduced-motion` compliance.

---

## 🛠️ Tech Stack

- **Markup & Structure**: Semantic HTML5 with complete OpenGraph metadata
- **Styling**: Vanilla CSS with custom tokens, fluid typography, and responsive breakpoints
- **Interactions**: Vanilla JavaScript (ES6+ modules)
- **Tooling & Build**: [Vite](https://vitejs.dev/)

---

## 📁 Project Structure

```text
portfolio/
├── index.html              # Production entry point
├── css/
│   ├── main.css            # Design tokens (dark/light), typography, components
│   ├── animations.css      # Purposeful micro-interactions, reduced-motion rules
│   └── responsive.css      # Breakpoints (desktop, laptop, tablet, mobile)
├── js/
│   ├── main.js             # Application coordinator
│   ├── loader.js           # Smooth page entrance sequence
│   ├── theme.js            # Dark / Light / System theme controller
│   ├── navigation.js       # Sticky header, scroll-spy, mobile drawer
│   ├── scroll.js           # Scroll progress bar, back-to-top button
│   ├── cursor.js           # Custom follower cursor with spring lerp
│   ├── commandPalette.js   # Command palette (⌘K / Ctrl+K)
│   ├── konami.js           # Konami code listener & Engineering HUD
│   ├── animations.js       # Card spotlights, journey sweep, 2D graphics preview
│   └── utils.js            # Audio feedback synthesizer, clipboard, toast helpers
├── public/
│   └── favicon.svg         # Monogram SVG favicon
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 🌐 Deployment on Vercel

1. Push this repository to GitHub.
2. In Vercel, click **Add New Project** and import your repository.
3. Vercel automatically detects the Vite framework settings:
   - **Build Command**: `vite build` (or `npm run build`)
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Click **Deploy**.
