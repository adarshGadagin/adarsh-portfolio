# Adarsh Gadagin — Personal Portfolio

[![Website](https://img.shields.io/badge/Portfolio-Live-38BDF8?style=flat-square)](https://github.com/adarshGadagin)
[![GitHub](https://img.shields.io/badge/GitHub-adarshGadagin-181717?style=flat-square&logo=github)](https://github.com/adarshGadagin)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Adarsh%20Gadagin-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/adarsh-gadagin/)
[![Email](https://img.shields.io/badge/Email-adarshgadagin%40gmail.com-EA4335?style=flat-square&logo=gmail)](mailto:adarshgadagin@gmail.com)

A modern, high-polish developer portfolio for **Adarsh Gadagin**, a 2nd-year B.Tech Computer Science & Engineering student at REVA University, Bangalore.

Built with a dark-first **creative engineering studio** aesthetic inspired by Apple, Stripe, Raycast, and Nothing. Positions Adarsh as a curious, technically grounded engineer actively building across low-level systems, C/C++, embedded IoT, AI/ML, and modern web architectures.

---

## ⚡ Key Features

- **Hacker Terminal Preloader**: Solid obsidian shield with a real-time digital matrix rain canvas and diagnostic boot ticker (`kernel.init()`, memory registration, driver verification, `ACCESS_GRANTED`). Features a theatrical curtain lift with a deliberate delay to ensure zero content overlap.
- **Interactive UNIX Shell (`adarsh@adarsh-os:~$`)**: Activated via the classic Konami code (`↑ ↑ ↓ ↓ ← → ← → B A`) or Command Menu. A full bash-style CLI emulator with:
  - Command history navigation (`↑` / `↓`) and `Tab` auto-completion.
  - Commands: `neofetch`, `skills`, `projects`, `cat <file>`, `ls`, `whoami`, `date`, `matrix`, `theme`, `quote`, `clear`, `sudo`.
- **Interactive 3D Magnetic Card Physics**: Real-time cursor-tracking perspective tilt (`rotateX`/`rotateY`) on skill cards, projects, certificates, and social cards, paired with dynamic radial spotlight glows and micro-elevations.
- **Raycast-Style Command Menu**: Quick access via `⌘K` / `Ctrl+K` or header button for keyboard navigation, instant section jumps, actions, and theme switching.
- **Dual Theme Engine**: Dark mode (default), clean light mode, and system preference with `localStorage` persistence.
- **Featured Projects**:
  - [2D Graphics Editor in C](https://github.com/adarshGadagin/2d-graphics-editor): Demonstrates primitive rasterization, geometry manipulation, and file serialization with an interactive live SVG canvas studio.
  - **Smart Door Access System**: Embedded access control using ESP32, 13.56 MHz RFID verification, SPI/GPIO, and optocoupled relay solenoid lock.
- **Verified Credentials**: IBM SkillsBuild credentials in Python for Data Science, Data Analysis, and Data Visualization.
- **Zero-Dependency & Universal Compatibility**: 100% vanilla HTML5, CSS3, and modern JavaScript. Works out of the box via direct double-click (`file:///`) or on any modern static web host.

---

## 🛠️ Tech Stack

- **Markup & Semantics**: Semantic HTML5 with complete OpenGraph metadata
- **Styling**: Vanilla CSS3 with custom design tokens, fluid typography, and responsive breakpoints
- **Interactions & 3D Math**: Vanilla JavaScript (ES6+ modular architecture & standalone bundle)
- **Tooling & Build**: [Vite](https://vitejs.dev/)

---

## 📁 Project Structure

```text
portfolio/
├── index.html              # Production entry point (relative paths)
├── favicon.svg             # Monogram SVG favicon
├── css/
│   ├── main.css            # Design tokens (dark/light), typography, interactive shell
│   ├── animations.css      # Matrix preloader, 3D card tilt, reduced-motion rules
│   └── responsive.css      # Fluid breakpoints (desktop, laptop, tablet, mobile)
├── js/
│   ├── bundle.js           # Universal standalone bundle (supports file:// & web servers)
│   ├── main.js             # Modular application coordinator
│   ├── loader.js           # Hacker terminal preloader & matrix stream controller
│   ├── theme.js            # Dark / Light / System theme controller
│   ├── navigation.js       # Sticky header, scroll-spy, mobile drawer
│   ├── scroll.js           # Scroll progress bar, back-to-top button
│   ├── cursor.js           # Follower cursor with spring lerp
│   ├── commandPalette.js   # Command palette controller (⌘K / Ctrl+K)
│   ├── konami.js           # Konami code listener & UNIX Shell engine
│   ├── animations.js       # 3D magnetic card tilt, spotlight glow, 2D canvas demo
│   └── utils.js            # Web Audio synthesizer, clipboard, toast helpers
├── public/
│   └── favicon.svg         # Favicon asset
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Running Locally

### Option A: Direct Open (No setup required)
Simply double-click `index.html` or open it in any web browser (`file:///.../index.html`). All styles, scripts, preloaders, and 3D interactions work immediately without needing Node.js or a web server.

### Option B: Local Dev Server with Vite
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

## 👤 Author

**Adarsh Gadagin**  
- GitHub: [@adarshGadagin](https://github.com/adarshGadagin)  
- LinkedIn: [Adarsh Gadagin](https://www.linkedin.com/in/adarsh-gadagin/)  
- Email: [adarshgadagin@gmail.com](mailto:adarshgadagin@gmail.com)  
- Institution: REVA University, Bangalore (B.Tech Computer Science & Engineering)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
