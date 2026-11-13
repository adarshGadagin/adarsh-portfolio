/* ==========================================================================
   PORTFOLIO STANDALONE BUNDLE — ADARSH GADAGIN
   Self-contained script that works both when opened directly via file://
   and when served via HTTP / Vite / Vercel.
   ========================================================================== */

(function () {
  'use strict';

  /* ==========================================================================
     1. UTILITIES
     ========================================================================== */
  function debounce(func, wait = 100) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function playUiSound(type = 'click') {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === 'konami') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.3);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'action') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch {
      // Ignore if blocked by browser policy
    }
  }

  function showToast(message = 'Action completed', duration = 2500) {
    let toast = document.getElementById('toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notice';
      toast.className = 'toast-notice';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>${message}</span>
    `;
    toast.classList.add('show');
    clearTimeout(toast._toastTimer);
    toast._toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // Fallback
      }
    }
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    textArea.remove();
    return successful;
  }

  /* ==========================================================================
     2. THEME CONTROLLER
     ========================================================================== */
  const THEME_STORAGE_KEY = 'adarsh_portfolio_theme';
  let currentThemePreference = 'dark';
  try {
    currentThemePreference = localStorage.getItem(THEME_STORAGE_KEY) || 'system';
  } catch {
    currentThemePreference = 'system';
  }

  function getEffectiveTheme(preference) {
    if (preference === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return preference;
  }

  function applyTheme(preference) {
    currentThemePreference = preference;
    const effectiveTheme = getEffectiveTheme(preference);
    document.documentElement.setAttribute('data-theme', effectiveTheme);

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', effectiveTheme === 'dark' ? '#08090C' : '#F8FAFC');
    }

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      const isDark = effectiveTheme === 'dark';
      toggleBtn.setAttribute('aria-label', `Current theme: ${preference} (${effectiveTheme}). Click to change.`);
      toggleBtn.setAttribute('title', `Theme: ${preference} (Click to toggle)`);
      toggleBtn.innerHTML = isDark
        ? `<svg class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <circle cx="12" cy="12" r="4"></circle>
             <path d="M12 2v2"></path>
             <path d="M12 20v2"></path>
             <path d="m4.93 4.93 1.41 1.41"></path>
             <path d="m17.66 17.66 1.41 1.41"></path>
             <path d="M2 12h2"></path>
             <path d="M20 12h2"></path>
             <path d="m6.34 17.66-1.41 1.41"></path>
             <path d="m19.07 4.93-1.41 1.41"></path>
           </svg>`
        : `<svg class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
           </svg>`;
    }
  }

  function cycleTheme() {
    let nextPreference;
    if (currentThemePreference === 'system') {
      const isSysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      nextPreference = isSysDark ? 'light' : 'dark';
    } else if (currentThemePreference === 'dark') {
      nextPreference = 'light';
    } else {
      nextPreference = 'dark';
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextPreference);
    } catch {}
    applyTheme(nextPreference);
  }

  function initTheme() {
    applyTheme(currentThemePreference);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (currentThemePreference === 'system') {
        applyTheme('system');
      }
    });
    const toggleBtn = document.getElementById('theme-toggle');
    toggleBtn?.addEventListener('click', cycleTheme);
  }

  /* ==========================================================================
     3. PRELOADER CONTROLLER (HACKER TERMINAL & DELAYED CURTAIN REVEAL)
     ========================================================================== */
  function initLoader() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const preloader = document.getElementById('page-preloader');
    const bar = document.getElementById('preloader-bar');
    const percentText = document.getElementById('preloader-percent');
    const statusText = document.getElementById('preloader-status');
    const log1 = document.getElementById('preloader-log-1');
    const log2 = document.getElementById('preloader-log-2');
    const canvas = document.getElementById('preloader-matrix-canvas');

    let matrixAnimId;
    if (canvas && !prefersReducedMotion) {
      const ctx = canvas.getContext('2d');
      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);

      window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      });

      const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/{}$#*+=~';
      const fontSize = 14;
      const columns = Math.floor(width / fontSize);
      const drops = Array(columns).fill(1);

      function drawMatrix() {
        ctx.fillStyle = 'rgba(3, 4, 6, 0.08)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#10B981';
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = chars.charAt(Math.floor(Math.random() * chars.length));
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
        matrixAnimId = requestAnimationFrame(drawMatrix);
      }
      drawMatrix();
    }

    function completeLoader() {
      if (preloader) {
        preloader.classList.add('preloader-done');
        setTimeout(() => {
          preloader.style.display = 'none';
          if (matrixAnimId) cancelAnimationFrame(matrixAnimId);
        }, 700);
      }

      setTimeout(() => {
        document.body.classList.add('page-loaded');

        const heroElements = document.querySelectorAll('.hero .reveal-on-scroll');
        heroElements.forEach((el, index) => {
          if (!prefersReducedMotion) {
            setTimeout(() => {
              el.classList.add('is-visible');
            }, index * 90);
          } else {
            el.classList.add('is-visible');
          }
        });
      }, 350);
    }

    if (prefersReducedMotion || !preloader) {
      completeLoader();
      return;
    }

    let currentProgress = 0;
    const duration = 1400;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      currentProgress = Math.round(easeProgress * 100);

      if (bar) bar.style.width = `${currentProgress}%`;
      if (percentText) percentText.textContent = `${currentProgress}%`;

      if (currentProgress < 30) {
        if (log1) log1.innerHTML = `<span class="p-prompt">$</span> <span class="p-green">kernel.init()</span>: boot hardware abstraction...`;
        if (log2) log2.innerHTML = `<span class="p-prompt">$</span> <span class="p-dim">loading memory & pointer registers [C]...</span>`;
        if (statusText) statusText.textContent = `INITIALIZING SYSTEM (${currentProgress}%)...`;
      } else if (currentProgress < 65) {
        if (log1) log1.innerHTML = `<span class="p-prompt">$</span> <span class="p-green">drivers.verify()</span>: ESP32, RFID & systems OK`;
        if (log2) log2.innerHTML = `<span class="p-prompt">$</span> <span class="p-dim">allocating memory & data structures...</span>`;
        if (statusText) statusText.textContent = `CONFIGURING ARCHITECTURE (${currentProgress}%)...`;
      } else if (currentProgress < 95) {
        if (log1) log1.innerHTML = `<span class="p-prompt">$</span> <span class="p-green">graphics.mount()</span>: rasterizer & UI tokens ready`;
        if (log2) log2.innerHTML = `<span class="p-prompt">$</span> <span class="p-dim">mounting command palette & 3D dynamics...</span>`;
        if (statusText) statusText.textContent = `COMPILING PORTFOLIO (${currentProgress}%)...`;
      } else {
        if (log1) log1.innerHTML = `<span class="p-prompt">$</span> <span class="p-green">auth.status()</span>: ACCESS_GRANTED // 200 OK`;
        if (log2) log2.innerHTML = `<span class="p-prompt">$</span> <span class="p-green">All systems operational. Launching...</span>`;
        if (statusText) {
          statusText.textContent = `STATUS: ACCESS GRANTED`;
          statusText.style.color = '#34D399';
        }
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(completeLoader, 550);
      }
    }
    requestAnimationFrame(tick);
  }

  /* ==========================================================================
     4. NAVIGATION CONTROLLER
     ========================================================================== */
  function initNavigation() {
    const header = document.getElementById('header');
    const navMenu = document.getElementById('nav-menu');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function handleScroll() {
      if (window.scrollY > 20) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    if (mobileToggle && navMenu) {
      function toggleMenu() {
        const isOpen = navMenu.classList.toggle('open');
        mobileToggle.setAttribute('aria-expanded', String(isOpen));
        mobileToggle.innerHTML = isOpen
          ? `<svg class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
             </svg>`
          : `<svg class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <line x1="4" x2="20" y1="12" y2="12"></line>
               <line x1="4" x2="20" y1="6" y2="6"></line>
               <line x1="4" x2="20" y1="18" y2="18"></line>
             </svg>`;
      }

      function closeMenu() {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          mobileToggle.setAttribute('aria-expanded', 'false');
          mobileToggle.innerHTML = `
            <svg class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>`;
        }
      }

      mobileToggle.addEventListener('click', toggleMenu);
      document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
          closeMenu();
        }
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
      });
      navLinks.forEach((link) => link.addEventListener('click', closeMenu));
    }

    if ('IntersectionObserver' in window && sections.length > 0) {
      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

      sections.forEach((section) => sectionObserver.observe(section));
    }
  }

  /* ==========================================================================
     5. SCROLL CONTROLLER
     ========================================================================== */
  function initScroll() {
    const progressBar = document.getElementById('scroll-progress-bar');
    const backToTopBtn = document.getElementById('back-to-top-btn');

    function onScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

      if (progressBar && docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
        progressBar.style.width = `${progress}%`;
      }

      if (backToTopBtn) {
        if (scrollTop > 450) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    backToTopBtn?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const headerHeight = document.getElementById('header')?.offsetHeight || 72;
          const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
          history.pushState(null, '', targetId);
        }
      });
    });
  }

  /* ==========================================================================
     6. CUSTOM CURSOR
     ========================================================================== */
  function initCursor() {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    let cursor = document.querySelector('.custom-cursor');
    let cursorDot = document.querySelector('.custom-cursor-dot');
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.className = 'custom-cursor';
      document.body.appendChild(cursor);
    }
    if (!cursorDot) {
      cursorDot = document.createElement('div');
      cursorDot.className = 'custom-cursor-dot';
      document.body.appendChild(cursorDot);
    }

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let isHovering = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
      cursorDot.style.opacity = '1';
      cursor.style.opacity = '1';
    }, { passive: true });

    function renderCursor() {
      cursorX += (mouseX - cursorX) * 0.22;
      cursorY += (mouseY - cursorY) * 0.22;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    const interactiveTargets = 'a, button, input, [role="button"], [role="option"], .skill-card, .project-card, .certificate-card, .social-card, .interest-chip, .journey-milestone';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveTargets)) {
        if (!isHovering) {
          isHovering = true;
          cursor.classList.add('hovering');
        }
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveTargets)) {
        isHovering = false;
        cursor.classList.remove('hovering');
      }
    });

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorDot.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      cursorDot.style.opacity = '1';
    });
  }

  /* ==========================================================================
     7. KONAMI CODE (INTERACTIVE UNIX SHELL — ADARSH-OS)
     ========================================================================== */
  const KONAMI_SEQUENCE = [
    'arrowup', 'arrowup', 'arrowdown', 'arrowdown',
    'arrowleft', 'arrowright', 'arrowleft', 'arrowright',
    'b', 'a'
  ];

  function normalizeKey(key) {
    const k = key.toLowerCase();
    if (k === 'up') return 'arrowup';
    if (k === 'down') return 'arrowdown';
    if (k === 'left') return 'arrowleft';
    if (k === 'right') return 'arrowright';
    return k;
  }

  let previouslyFocusedElement = null;
  let isShellInitialized = false;
  const commandHistory = [];
  let historyIndex = -1;

  const VIRTUAL_FILES = {
    'about.md': `## Adarsh Gadagin
2nd-Year B.Tech Computer Science & Engineering student at REVA University, Bangalore.
Passionate about software engineering, exploring artificial intelligence, and understanding low-level systems under the hood.`,

    'skills.json': `{
  "languages": ["C", "C++", "Java", "Python", "JavaScript"],
  "focus": ["Systems Programming", "Web Development", "AI/ML", "IoT"],
  "embedded": ["ESP32", "RFID (MFRC522)", "SPI / GPIO", "Relays"],
  "tools": ["Git", "GitHub", "VS Code", "Vite", "Linux"]
}`,

    'projects.txt': `Featured Projects:
1. 2D Graphics Editor (C)
   - Rasterization, primitives, memory structures, serialization
   - Source: https://github.com/adarshGadagin/2d-graphics-editor

2. Smart Door Access System (ESP32 / C++)
   - RFID UID authentication, optocoupled relay, fail-safe lock`,

    'certs.txt': `IBM SkillsBuild Verified Credentials:
- Python for Data Science
- Data Analysis using Python
- Data Visualization using Python`,

    'contact.txt': `Get in touch:
- Email:    adarshgadagin@gmail.com
- GitHub:   https://github.com/adarshGadagin
- LinkedIn: https://www.linkedin.com/in/adarsh-gadagin/`,

    'secret.key': `0x534543524554: [EASTER_EGG_FOUND] 🏆
"Talk is cheap. Show me the code." — Linus Torvalds`
  };

  function openEasterEgg() {
    const modalOverlay = document.getElementById('konami-modal');
    const input = document.getElementById('terminal-input');
    if (!modalOverlay) return;

    previouslyFocusedElement = document.activeElement;
    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');

    playUiSound('konami');

    if (!isShellInitialized) {
      setupInteractiveTerminal();
      isShellInitialized = true;
    }

    setTimeout(() => {
      input?.focus();
    }, 60);
  }

  function closeEasterEgg() {
    const modalOverlay = document.getElementById('konami-modal');
    if (!modalOverlay) return;

    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');

    if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
      previouslyFocusedElement.focus();
    }
  }

  function setupInteractiveTerminal() {
    const output = document.getElementById('terminal-output');
    const input = document.getElementById('terminal-input');
    const body = document.getElementById('terminal-body');
    const closeDot = document.getElementById('t-close-dot');

    if (!output || !input) return;

    closeDot?.addEventListener('click', closeEasterEgg);

    body?.addEventListener('click', () => {
      input.focus();
    });

    printInitialBanner(output);

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const rawCmd = input.value.trim();
        input.value = '';

        if (rawCmd) {
          commandHistory.push(rawCmd);
          historyIndex = commandHistory.length;
        }

        printCommandLine(output, rawCmd);
        if (rawCmd) {
          executeCommand(rawCmd, output);
        }
        scrollTerminalToBottom(body);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          input.value = commandHistory[historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          input.value = commandHistory[historyIndex] || '';
        } else {
          historyIndex = commandHistory.length;
          input.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        handleTabCompletion(input);
      }
    });
  }

  function printInitialBanner(output) {
    const banner = document.createElement('div');
    banner.className = 'terminal-line';
    banner.innerHTML = `
<div style="color: #38BDF8; font-weight: 700; margin-bottom: 6px;">
  ╔═══════════════════════════════════════════════════════════════╗<br>
  ║                     ADARSH-OS (v2.4.0)                        ║<br>
  ║        Type <span style="color:#34D399">'help'</span> for commands • <span style="color:#A78BFA">'neofetch'</span> for specs         ║<br>
  ╚═══════════════════════════════════════════════════════════════╝
</div>
<div style="color: #94A3B8; margin-bottom: 8px;">
  Host: Adarsh Gadagin • REVA Dept. of CSE • Bangalore, IN<br>
  Logged in as: <span style="color:#34D399">adarsh</span> (interactive bash shell)
</div>`;
    output.appendChild(banner);
  }

  function printCommandLine(output, cmd) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `
      <span class="terminal-prompt-prefix">
        <span class="t-user">adarsh@adarsh-os</span>:<span class="t-path">~</span><span class="t-dollar">$</span>
      </span>
      <span style="color:#F8FAFC; margin-left: 6px;">${escapeHtml(cmd)}</span>
    `;
    output.appendChild(line);
  }

  function executeCommand(rawCmd, output) {
    playUiSound('action');
    const parts = rawCmd.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    const res = document.createElement('div');
    res.className = 'terminal-line';

    switch (command) {
      case 'help':
      case '?':
        res.innerHTML = `
<div style="color:#38BDF8; font-weight:600; margin-bottom:6px;">AVAILABLE COMMANDS:</div>
<div style="display:grid; grid-template-columns: 130px 1fr; row-gap: 6px; column-gap: 8px; color:#CBD5E1; align-items:center;">
  <div><span class="t-cmd">neofetch</span></div><div>System architecture & developer specs</div>
  <div><span class="t-cmd">ls</span></div><div>List virtual directory files</div>
  <div><span class="t-cmd">cat &lt;file&gt;</span></div><div>Display file content (e.g. cat about.md)</div>
  <div><span class="t-cmd">projects</span></div><div>View featured software & hardware projects</div>
  <div><span class="t-cmd">skills</span></div><div>Display competency bars & technical stack</div>
  <div><span class="t-cmd">whoami</span></div><div>Print current user session identity</div>
  <div><span class="t-cmd">date</span></div><div>Current local date & time (Bangalore, IST)</div>
  <div><span class="t-cmd">matrix</span></div><div>Simulate cyber digital rain burst</div>
  <div><span class="t-cmd">quote</span></div><div>Print inspirational engineering quote</div>
  <div><span class="t-cmd">theme</span></div><div>Toggle portfolio dark / light theme</div>
  <div><span class="t-cmd">echo &lt;msg&gt;</span></div><div>Print text back to terminal</div>
  <div><span class="t-cmd">clear</span></div><div>Clear terminal screen</div>
  <div><span class="t-cmd">sudo &lt;cmd&gt;</span></div><div>Execute command with root privileges</div>
  <div><span class="t-cmd">exit</span></div><div>Close developer shell session</div>
</div>`;
        break;

      case 'neofetch':
        res.innerHTML = `
<div style="display:flex; gap: 20px; align-items: flex-start; color:#CBD5E1; margin: 4px 0;">
  <pre style="color:#38BDF8; font-weight:700; line-height:1.2; margin:0;">
    /\\_/\\    
   ( o.o )   
    > ^ <    
  </pre>
  <div>
    <div style="color:#34D399; font-weight:700; margin-bottom:4px;">adarsh@adarsh-os</div>
    <div style="color:#64748B; margin-bottom:6px;">-----------------------</div>
    <div><span class="t-cyan">OS:</span> Adarsh-OS v2.4 (x86_64 Linux)</div>
    <div><span class="t-cyan">Host:</span> REVA University — Dept. of CSE</div>
    <div><span class="t-cyan">Standing:</span> 2nd-Year B.Tech Computer Science</div>
    <div><span class="t-cyan">Kernel:</span> 6.8.0-sys-bangalore</div>
    <div><span class="t-cyan">Uptime:</span> 2 years (Continuous Learning)</div>
    <div><span class="t-cyan">Shell:</span> bash 5.2.15</div>
    <div><span class="t-cyan">Languages:</span> C, C++, Java, Python, JavaScript</div>
    <div><span class="t-cyan">Philosophy:</span> <span style="color:#FBBF24;">"Talk is cheap. Show me the code."</span></div>
  </div>
</div>`;
        break;

      case 'ls':
      case 'dir':
        res.innerHTML = `
<div style="display:flex; flex-wrap:wrap; gap: 10px; margin: 4px 0;">
  <span class="t-cmd">about.md</span>
  <span class="t-cmd">skills.json</span>
  <span class="t-cmd">projects.txt</span>
  <span class="t-cmd">certs.txt</span>
  <span class="t-cmd">contact.txt</span>
  <span class="t-cmd" style="color:#FCA5A5; border-color:rgba(239,68,68,0.3); background:rgba(239,68,68,0.08);">secret.key</span>
</div>`;
        break;

      case 'cat':
        if (!args[0]) {
          res.innerHTML = `<div class="t-res-error">cat: missing file operand. Try 'cat about.md' or 'ls'</div>`;
        } else {
          const fileName = args[0].toLowerCase();
          if (VIRTUAL_FILES[fileName]) {
            res.innerHTML = `<div class="t-res-card"><pre style="color:#E2E8F0; margin:0; white-space:pre-wrap; line-height:1.5;">${escapeHtml(VIRTUAL_FILES[fileName])}</pre></div>`;
          } else {
            res.innerHTML = `<div class="t-res-error">cat: ${escapeHtml(args[0])}: No such file or directory</div>`;
          }
        }
        break;

      case 'projects':
        res.innerHTML = `
<div class="t-res-card" style="line-height:1.6;">
  <div style="margin-bottom:8px;">
    <span class="t-cmd">1. 2D Graphics Editor (C)</span><br>
    <span class="t-dim">Primitive rasterization, geometry manipulation, binary serialization.</span><br>
    <a href="https://github.com/adarshGadagin/2d-graphics-editor" target="_blank" rel="noopener noreferrer" style="color:#34D399; text-decoration:underline;">→ https://github.com/adarshGadagin/2d-graphics-editor</a>
  </div>
  <div>
    <span class="t-cmd">2. Smart Door Access System (C++ / ESP32)</span><br>
    <span class="t-dim">RFID 13.56 MHz UID authentication, optocoupled 12V relay, fail-safe lock.</span>
  </div>
</div>`;
        break;

      case 'skills':
        res.innerHTML = `
<div class="t-res-card" style="line-height:1.7;">
  <div>C Systems      [<span style="color:#34D399;">████████████████░░░░</span>] 80%</div>
  <div>C++ / DSA      [<span style="color:#34D399;">██████████████░░░░░░</span>] 75%</div>
  <div>Python Data    [<span style="color:#38BDF8;">██████████████░░░░░░</span>] 75%</div>
  <div>Java OOP       [<span style="color:#A78BFA;">████████████░░░░░░░░</span>] 65%</div>
  <div>Web Frontend   [<span style="color:#34D399;">████████████████░░░░</span>] 80%</div>
  <div>Embedded / IoT [<span style="color:#FBBF24;">█████████████░░░░░░░</span>] 70%</div>
</div>`;
        break;

      case 'whoami':
        res.innerHTML = `
<div class="t-res-success">
  <span style="color:#38BDF8; font-weight:700;">@</span>
  <span><strong>adarsh</strong> — 2nd-Year B.Tech CSE, REVA University Bangalore</span>
</div>`;
        break;

      case 'date':
        res.innerHTML = `
<div class="t-res-success">
  <span style="color:#38BDF8; font-weight:700;">⏱</span>
  <span>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</span>
</div>`;
        break;

      case 'echo':
        res.innerHTML = `<div class="t-res-info">${escapeHtml(args.join(' '))}</div>`;
        break;

      case 'quote':
        res.innerHTML = `
<div class="t-res-card" style="border-left: 3px solid #818CF8;">
  <div style="color:#F8FAFC; font-style:italic;">"Talk is cheap. Show me the code."</div>
  <div style="color:#818CF8; font-size:0.75rem; margin-top:3px;">— Linus Torvalds</div>
</div>`;
        break;

      case 'theme':
        cycleTheme();
        res.innerHTML = `
<div class="t-res-success">
  <span style="color:#34D399; font-weight:700;">✓ [OK]</span>
  <span>Portfolio visual theme toggled successfully.</span>
</div>`;
        break;

      case 'matrix':
        res.innerHTML = `
<div class="t-res-card" style="border-left: 3px solid #10B981; font-family:monospace; line-height:1.3; color:#10B981;">
  01000001 01100100 01100001 01110010 01110011 01101000 00100000<br>
  01000111 01100001 01100100 01100001 01100111 01101001 01101110<br>
  <span style="color:#34D399; font-weight:600;">[SYSTEM]: MATRIX CONSTRUCT INITIALIZED // ACCESS_OVERRIDE_ENABLED</span>
</div>`;
        break;

      case 'clear':
      case 'cls':
        output.innerHTML = '';
        return;

      case 'sudo':
        res.innerHTML = `
<div class="t-res-error">
  <span style="font-weight:700;">[AUTH ERROR]</span>
  <span>User 'visitor' is not in sudoers file. Incident reported to Santa Claus 🎅</span>
</div>`;
        break;

      case 'exit':
      case 'quit':
        closeEasterEgg();
        return;

      default:
        res.innerHTML = `
<div class="t-res-error">
  <span>command not found: <code>${escapeHtml(command)}</code>. Type <kbd class="t-cmd" style="font-size:0.7rem; padding:0 5px;">help</kbd> for commands.</span>
</div>`;
        break;
        break;
    }

    output.appendChild(res);
  }

  function handleTabCompletion(input) {
    const val = input.value;
    const words = val.split(' ');
    const availableCommands = [
      'help', 'neofetch', 'ls', 'cat', 'projects', 'skills',
      'whoami', 'date', 'matrix', 'quote', 'theme', 'clear', 'sudo', 'exit'
    ];
    const fileNames = Object.keys(VIRTUAL_FILES);

    if (words.length === 1) {
      const match = availableCommands.find((c) => c.startsWith(words[0].toLowerCase()));
      if (match) input.value = match + ' ';
    } else if (words.length === 2 && words[0].toLowerCase() === 'cat') {
      const match = fileNames.find((f) => f.startsWith(words[1].toLowerCase()));
      if (match) input.value = `cat ${match}`;
    }
  }

  function scrollTerminalToBottom(body) {
    if (body) {
      body.scrollTop = body.scrollHeight;
    }
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function initKonami() {
    let konamiIndex = 0;
    const modalOverlay = document.getElementById('konami-modal');
    const closeBtn = document.getElementById('konami-close-btn');

    window.addEventListener('keydown', (e) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) {
        return;
      }
      const key = normalizeKey(e.key);
      if (key === KONAMI_SEQUENCE[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === KONAMI_SEQUENCE.length) {
          openEasterEgg();
          konamiIndex = 0;
        }
      } else {
        konamiIndex = (key === KONAMI_SEQUENCE[0]) ? 1 : 0;
      }
    });

    closeBtn?.addEventListener('click', closeEasterEgg);
    modalOverlay?.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeEasterEgg();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay?.classList.contains('active')) {
        closeEasterEgg();
      }
    });
  }

  /* ==========================================================================
     8. COMMAND PALETTE
     ========================================================================== */
  function scrollToSection(selector) {
    const el = document.querySelector(selector);
    if (el) {
      const headerHeight = document.getElementById('header')?.offsetHeight || 72;
      const targetPosition = el.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      history.pushState(null, '', selector);
    }
  }

  async function copyEmail() {
    const emailText = document.getElementById('contact-email-text')?.textContent?.trim() || 'adarshgadagin@gmail.com';
    await copyToClipboard(emailText);
    showToast('Email copied to clipboard!');
  }

  function toggleThemeAction() {
    cycleTheme();
    showToast('Theme updated');
  }

  function setSystemThemeAction() {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, 'system');
    } catch {}
    applyTheme('system');
    showToast('Theme set to system preference');
  }

  const COMMANDS = [
    { id: 'nav-home', title: 'Go to Home', category: 'Navigation', shortcut: 'G H', action: () => scrollToSection('#hero'), icon: 'home' },
    { id: 'nav-about', title: 'Go to About', category: 'Navigation', shortcut: 'G A', action: () => scrollToSection('#about'), icon: 'user' },
    { id: 'nav-skills', title: 'Go to Skills', category: 'Navigation', shortcut: 'G S', action: () => scrollToSection('#skills'), icon: 'zap' },
    { id: 'nav-work', title: 'Go to Projects / Work', category: 'Navigation', shortcut: 'G W', action: () => scrollToSection('#work'), icon: 'folder' },
    { id: 'nav-cert', title: 'Go to Certificates', category: 'Navigation', shortcut: 'G C', action: () => scrollToSection('#certificates'), icon: 'award' },
    { id: 'nav-contact', title: 'Go to Contact', category: 'Navigation', shortcut: 'G M', action: () => scrollToSection('#contact'), icon: 'mail' },
    { id: 'act-email', title: 'Copy Email Address', category: 'Actions', shortcut: '↵', action: () => copyEmail(), icon: 'copy' },
    { id: 'act-theme-toggle', title: 'Toggle Dark / Light Mode', category: 'Actions', shortcut: 'T', action: () => toggleThemeAction(), icon: 'sun-moon' },
    { id: 'act-theme-system', title: 'Set Theme to System Preference', category: 'Actions', shortcut: '', action: () => setSystemThemeAction(), icon: 'laptop' },
    { id: 'link-github', title: 'Open GitHub Profile', category: 'Links', shortcut: '↗', action: () => window.open('https://github.com/adarshGadagin', '_blank'), icon: 'github' },
    { id: 'link-linkedin', title: 'Open LinkedIn Profile', category: 'Links', shortcut: '↗', action: () => window.open('https://www.linkedin.com/in/adarsh-gadagin/', '_blank'), icon: 'linkedin' },
    { id: 'dev-hud', title: 'Activate Developer Diagnostics (HUD)', category: 'System', shortcut: 'Konami', action: () => openEasterEgg(), icon: 'terminal' }
  ];

  function initCommandPalette() {
    const modal = document.getElementById('command-palette-modal');
    const openBtn = document.getElementById('command-palette-btn');
    const input = document.getElementById('cmd-palette-input');
    const resultsContainer = document.getElementById('cmd-palette-results');
    if (!modal || !input || !resultsContainer) return;

    let selectedIndex = 0;
    let filteredCommands = [...COMMANDS];
    let prevFocused = null;

    function getIconSvg(iconName) {
      switch (iconName) {
        case 'home': return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>';
        case 'user': return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
        case 'zap': return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>';
        case 'folder': return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg>';
        case 'award': return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path></svg>';
        case 'mail': return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>';
        case 'copy': return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>';
        case 'sun-moon': return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>';
        case 'laptop': return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"></path></svg>';
        case 'github': return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path></svg>';
        case 'linkedin': return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>';
        default: return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" x2="20" y1="19" y2="19"></line></svg>';
      }
    }

    function renderResults() {
      resultsContainer.innerHTML = '';
      if (filteredCommands.length === 0) {
        resultsContainer.innerHTML = '<div class="cmd-empty-state"><span>No matching commands found.</span></div>';
        return;
      }
      let currentCategory = '';
      filteredCommands.forEach((cmd, idx) => {
        if (cmd.category !== currentCategory) {
          currentCategory = cmd.category;
          const catEl = document.createElement('div');
          catEl.className = 'cmd-category-header';
          catEl.textContent = currentCategory;
          resultsContainer.appendChild(catEl);
        }
        const itemEl = document.createElement('div');
        itemEl.className = `cmd-item ${idx === selectedIndex ? 'selected' : ''}`;
        itemEl.setAttribute('role', 'option');
        itemEl.setAttribute('id', `cmd-opt-${idx}`);
        itemEl.setAttribute('aria-selected', String(idx === selectedIndex));
        itemEl.innerHTML = `
          <div class="cmd-item-left">
            <span class="cmd-item-icon">${getIconSvg(cmd.icon)}</span>
            <span class="cmd-item-title">${cmd.title}</span>
          </div>
          ${cmd.shortcut ? `<kbd class="cmd-item-badge">${cmd.shortcut}</kbd>` : ''}
        `;
        itemEl.addEventListener('mouseenter', () => {
          selectedIndex = idx;
          updateSelection();
        });
        itemEl.addEventListener('click', () => executeCommand(cmd));
        resultsContainer.appendChild(itemEl);
      });
      scrollSelectedIntoView();
    }

    function updateSelection() {
      const items = resultsContainer.querySelectorAll('.cmd-item');
      items.forEach((item, idx) => {
        const isSelected = idx === selectedIndex;
        item.classList.toggle('selected', isSelected);
        item.setAttribute('aria-selected', String(isSelected));
      });
      scrollSelectedIntoView();
    }

    function scrollSelectedIntoView() {
      const selectedEl = resultsContainer.querySelector('.cmd-item.selected');
      selectedEl?.scrollIntoView({ block: 'nearest' });
    }

    function executeCommand(cmd) {
      playUiSound('action');
      closePalette();
      setTimeout(() => cmd.action(), 100);
    }

    function openPalette() {
      prevFocused = document.activeElement;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      input.value = '';
      filteredCommands = [...COMMANDS];
      selectedIndex = 0;
      renderResults();
      setTimeout(() => input.focus(), 40);
    }

    function closePalette() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      if (prevFocused && typeof prevFocused.focus === 'function') prevFocused.focus();
    }

    input.addEventListener('input', () => {
      const query = input.value.toLowerCase().trim();
      if (!query) {
        filteredCommands = [...COMMANDS];
      } else {
        filteredCommands = COMMANDS.filter((cmd) =>
          cmd.title.toLowerCase().includes(query) ||
          cmd.category.toLowerCase().includes(query) ||
          cmd.shortcut.toLowerCase().includes(query)
        );
      }
      selectedIndex = 0;
      renderResults();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (filteredCommands.length > 0) {
          selectedIndex = (selectedIndex + 1) % filteredCommands.length;
          updateSelection();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (filteredCommands.length > 0) {
          selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
          updateSelection();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) executeCommand(filteredCommands[selectedIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closePalette();
      }
    });

    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (modal.classList.contains('active')) {
          closePalette();
        } else {
          openPalette();
        }
      }
    });

    openBtn?.addEventListener('click', openPalette);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closePalette();
    });
  }

  /* ==========================================================================
     9. ANIMATIONS & 3D INTERACTIVE CARDS
     ========================================================================== */
  function initAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isPointerFine = window.matchMedia('(pointer: fine)').matches;

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!prefersReducedMotion && 'IntersectionObserver' in window && revealElements.length > 0) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -40px 0px', threshold: 0.08 });

      revealElements.forEach((el) => revealObserver.observe(el));
    } else {
      revealElements.forEach((el) => el.classList.add('is-visible'));
    }

    // 3D Card Hover
    const targetCards = document.querySelectorAll(
      '.skill-card, .project-card, .certificate-card, .social-card, .education-card'
    );

    targetCards.forEach((card) => {
      let bounds;
      card.addEventListener('mouseenter', () => {
        bounds = card.getBoundingClientRect();
        card.style.transition = 'transform 0.12s ease-out, box-shadow 0.25s ease, border-color 0.25s ease';
      });

      card.addEventListener('mousemove', (e) => {
        if (!bounds) bounds = card.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        if (!isPointerFine || prefersReducedMotion) return;

        const centerX = bounds.width / 2;
        const centerY = bounds.height / 2;
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        const isProject = card.classList.contains('project-card');
        const maxTilt = isProject ? 3.5 : 5.5;

        const rotateX = (-deltaY * maxTilt).toFixed(2);
        const rotateY = (deltaX * maxTilt).toFixed(2);

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.018, 1.018, 1.018) translateZ(4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0)';
      });
    });

    // Journey Timeline
    const milestones = document.querySelectorAll('.journey-milestone');
    milestones.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        milestones.forEach((m) => m.classList.remove('active'));
        item.classList.add('active');
      });
    });

    // 2D Graphics Canvas Demo
    const toolbarBtns = document.querySelectorAll('.toolbar-btn');
    const demoSvg = document.getElementById('graphics-preview-canvas');
    if (demoSvg && toolbarBtns.length > 0) {
      const shapeConfigs = {
        all: `
          <g stroke="currentColor" stroke-dasharray="3 3" opacity="0.3">
            <line x1="20" y1="90" x2="280" y2="90" />
            <line x1="150" y1="20" x2="150" y2="160" />
          </g>
          <rect x="35" y="45" width="75" height="55" rx="4" fill="rgba(129, 140, 248, 0.15)" stroke="#818CF8" stroke-width="2" />
          <circle cx="210" cy="72" r="32" fill="rgba(56, 189, 248, 0.15)" stroke="#38BDF8" stroke-width="2" />
          <polygon points="150,110 110,165 190,165" fill="rgba(167, 139, 250, 0.15)" stroke="#A78BFA" stroke-width="2" />
          <line x1="40" y1="140" x2="105" y2="160" stroke="#34D399" stroke-width="2" stroke-linecap="round" />
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
          if (shapeConfigs[tool]) demoSvg.innerHTML = shapeConfigs[tool];
        });
      });
    }
  }

  /* ==========================================================================
     10. SETUP & INITIALIZATION
     ========================================================================== */
  function setupEmailCopy() {
    const copyBtn = document.getElementById('copy-email-btn');
    const emailVal = document.getElementById('contact-email-text');
    if (!copyBtn || !emailVal) return;

    copyBtn.addEventListener('click', async () => {
      const textToCopy = emailVal.textContent?.trim() || 'adarshgadagin@gmail.com';
      const success = await copyToClipboard(textToCopy);
      if (success) {
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = `
          <svg class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Copied!`;
        showToast('Email address copied to clipboard!');
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = `
            <svg class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
            </svg>
            Copy`;
        }, 2500);
      }
    });
  }

  function setupLocalTime() {
    const timeEl = document.getElementById('bangalore-time');
    if (!timeEl) return;
    function updateTime() {
      try {
        const now = new Date();
        const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const formatter = new Intl.DateTimeFormat('en-GB', options);
        timeEl.textContent = `${formatter.format(now)} IST`;
      } catch {
        timeEl.textContent = 'Bangalore, IN';
      }
    }
    updateTime();
    setInterval(updateTime, 1000);
  }

  function initApp() {
    initLoader();
    initTheme();
    initNavigation();
    initScroll();
    initAnimations();
    initCursor();
    initCommandPalette();
    initKonami();
    setupEmailCopy();
    setupLocalTime();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();

