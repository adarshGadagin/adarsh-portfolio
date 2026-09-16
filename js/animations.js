/* ==========================================================================
   ANIMATIONS & SPOTLIGHT CONTROLLER
   IntersectionObserver reveals, spotlight glow, journey sweep, graphics demo
   ========================================================================== */

export function initAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- 1. Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if (!prefersReducedMotion && 'IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    });

    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach((el) => {
      el.classList.add('is-visible');
    });
  }

  // --- 2. Spotlight Mouse Glow on Primary Interactive Cards ---
  // Restrained to primary project cards, skill cards, and journey cards
  const spotlightCards = document.querySelectorAll('.skill-card, .project-card, .journey-card');

  spotlightCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // --- 3. Journey Milestones Sweep Animation ---
  initJourneyTimeline();

  // --- 4. Interactive 2D Graphics Canvas Demo ---
  initGraphicsEditorDemo();
}

/**
 * Journey timeline interactive milestones
 */
function initJourneyTimeline() {
  const milestones = document.querySelectorAll('.journey-milestone');
  if (milestones.length === 0) return;

  milestones.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      milestones.forEach((m) => m.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

/**
 * Interactive preview for 2D Graphics Editor project card
 */
function initGraphicsEditorDemo() {
  const toolbarBtns = document.querySelectorAll('.toolbar-btn');
  const demoSvg = document.getElementById('graphics-preview-canvas');

  if (!demoSvg || toolbarBtns.length === 0) return;

  const shapeConfigs = {
    all: `
      <!-- Grid Reference Lines -->
      <g stroke="currentColor" stroke-dasharray="3 3" opacity="0.3">
        <line x1="20" y1="90" x2="280" y2="90" />
        <line x1="150" y1="20" x2="150" y2="160" />
      </g>
      <!-- Drawn Primitive Elements -->
      <rect x="35" y="45" width="75" height="55" rx="4" fill="rgba(129, 140, 248, 0.15)" stroke="#818CF8" stroke-width="2" />
      <circle cx="210" cy="72" r="32" fill="rgba(56, 189, 248, 0.15)" stroke="#38BDF8" stroke-width="2" />
      <polygon points="150,110 110,165 190,165" fill="rgba(167, 139, 250, 0.15)" stroke="#A78BFA" stroke-width="2" />
      <line x1="40" y1="140" x2="105" y2="160" stroke="#34D399" stroke-width="2" stroke-linecap="round" />
      <!-- Selected Anchor Point Handles -->
      <circle cx="35" cy="45" r="3" fill="#FFFFFF" stroke="#818CF8" stroke-width="1.5" />
      <circle cx="110" cy="100" r="3" fill="#FFFFFF" stroke="#818CF8" stroke-width="1.5" />
      <circle cx="210" cy="40" r="3" fill="#FFFFFF" stroke="#38BDF8" stroke-width="1.5" />
    `,
    rect: `
      <g stroke="currentColor" stroke-dasharray="3 3" opacity="0.3">
        <line x1="20" y1="90" x2="280" y2="90" />
      </g>
      <rect x="60" y="45" width="180" height="90" rx="6" fill="rgba(129, 140, 248, 0.2)" stroke="#818CF8" stroke-width="2.5" />
      <circle cx="60" cy="45" r="4" fill="#FFFFFF" stroke="#818CF8" stroke-width="2" />
      <circle cx="240" cy="45" r="4" fill="#FFFFFF" stroke="#818CF8" stroke-width="2" />
      <circle cx="60" cy="135" r="4" fill="#FFFFFF" stroke="#818CF8" stroke-width="2" />
      <circle cx="240" cy="135" r="4" fill="#FFFFFF" stroke="#818CF8" stroke-width="2" />
      <text x="150" y="95" text-anchor="middle" font-family="monospace" font-size="11" fill="#818CF8">RECT (x:60, y:45, w:180, h:90)</text>
    `,
    circle: `
      <g stroke="currentColor" stroke-dasharray="3 3" opacity="0.3">
        <line x1="20" y1="90" x2="280" y2="90" />
        <line x1="150" y1="20" x2="150" y2="160" />
      </g>
      <circle cx="150" cy="90" r="55" fill="rgba(56, 189, 248, 0.2)" stroke="#38BDF8" stroke-width="2.5" />
      <circle cx="150" cy="90" r="3" fill="#FFFFFF" stroke="#38BDF8" stroke-width="2" />
      <circle cx="205" cy="90" r="4" fill="#FFFFFF" stroke="#38BDF8" stroke-width="2" />
      <text x="150" y="105" text-anchor="middle" font-family="monospace" font-size="11" fill="#38BDF8">CIRCLE (cx:150, cy:90, r:55)</text>
    `,
    triangle: `
      <polygon points="150,35 70,145 230,145" fill="rgba(167, 139, 250, 0.2)" stroke="#A78BFA" stroke-width="2.5" />
      <circle cx="150" cy="35" r="4" fill="#FFFFFF" stroke="#A78BFA" stroke-width="2" />
      <circle cx="70" cy="145" r="4" fill="#FFFFFF" stroke="#A78BFA" stroke-width="2" />
      <circle cx="230" cy="145" r="4" fill="#FFFFFF" stroke="#A78BFA" stroke-width="2" />
      <text x="150" y="115" text-anchor="middle" font-family="monospace" font-size="11" fill="#A78BFA">TRIANGLE (3 vertices)</text>
    `,
    line: `
      <line x1="40" y1="50" x2="260" y2="130" stroke="#34D399" stroke-width="3" stroke-linecap="round" />
      <circle cx="40" cy="50" r="4" fill="#FFFFFF" stroke="#34D399" stroke-width="2" />
      <circle cx="260" cy="130" r="4" fill="#FFFFFF" stroke="#34D399" stroke-width="2" />
      <text x="150" y="80" text-anchor="middle" font-family="monospace" font-size="11" fill="#34D399">LINE [Bresenham / DDA]</text>
    `
  };

  toolbarBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toolbarBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const tool = btn.getAttribute('data-tool') || 'all';
      if (shapeConfigs[tool]) {
        demoSvg.innerHTML = shapeConfigs[tool];
      }
    });
  });
}
