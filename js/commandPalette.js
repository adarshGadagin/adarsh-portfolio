/* ==========================================================================
   COMMAND PALETTE CONTROLLER (RAYCAST / SPOTLIGHT STYLE)
   Trigger with Cmd+K / Ctrl+K or Nav Button
   ========================================================================== */

import { playUiSound, copyToClipboard, showToast } from './utils.js';
import { cycleTheme, applyTheme } from './theme.js';
import { openEasterEgg } from './konami.js';

const COMMANDS = [
  // Navigation
  { id: 'nav-home', title: 'Go to Home', category: 'Navigation', shortcut: 'G H', action: () => scrollToSection('#hero'), icon: 'home' },
  { id: 'nav-about', title: 'Go to About', category: 'Navigation', shortcut: 'G A', action: () => scrollToSection('#about'), icon: 'user' },
  { id: 'nav-skills', title: 'Go to Skills', category: 'Navigation', shortcut: 'G S', action: () => scrollToSection('#skills'), icon: 'zap' },
  { id: 'nav-work', title: 'Go to Projects / Work', category: 'Navigation', shortcut: 'G W', action: () => scrollToSection('#work'), icon: 'folder' },
  { id: 'nav-cert', title: 'Go to Certificates', category: 'Navigation', shortcut: 'G C', action: () => scrollToSection('#certificates'), icon: 'award' },
  { id: 'nav-contact', title: 'Go to Contact', category: 'Navigation', shortcut: 'G M', action: () => scrollToSection('#contact'), icon: 'mail' },

  // Actions
  { id: 'act-email', title: 'Copy Email Address', category: 'Actions', shortcut: '↵', action: () => copyEmail(), icon: 'copy' },
  { id: 'act-theme-toggle', title: 'Toggle Dark / Light Mode', category: 'Actions', shortcut: 'T', action: () => toggleThemeAction(), icon: 'sun-moon' },
  { id: 'act-theme-system', title: 'Set Theme to System Preference', category: 'Actions', shortcut: '', action: () => setSystemThemeAction(), icon: 'laptop' },

  // Social / Links
  { id: 'link-github', title: 'Open GitHub Profile', category: 'Links', shortcut: '↗', action: () => window.open('https://github.com/adarshGadagin', '_blank'), icon: 'github' },
  { id: 'link-linkedin', title: 'Open LinkedIn Profile', category: 'Links', shortcut: '↗', action: () => window.open('https://www.linkedin.com/in/adarsh-gadagin/', '_blank'), icon: 'linkedin' },

  // Developer Easter Egg
  { id: 'dev-hud', title: 'Activate Developer Diagnostics (HUD)', category: 'System', shortcut: 'Konami', action: () => openEasterEgg(), icon: 'terminal' }
];

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
  localStorage.setItem('adarsh_portfolio_theme', 'system');
  applyTheme('system');
  showToast('Theme set to system preference');
}

export function initCommandPalette() {
  const modal = document.getElementById('command-palette-modal');
  const openBtn = document.getElementById('command-palette-btn');
  const input = document.getElementById('cmd-palette-input');
  const resultsContainer = document.getElementById('cmd-palette-results');

  if (!modal || !input || !resultsContainer) return;

  let selectedIndex = 0;
  let filteredCommands = [...COMMANDS];
  let previousFocusedEl = null;

  function getIconSvg(iconName) {
    switch (iconName) {
      case 'home':
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>';
      case 'user':
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
      case 'zap':
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>';
      case 'folder':
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg>';
      case 'award':
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path></svg>';
      case 'mail':
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>';
      case 'copy':
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>';
      case 'sun-moon':
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>';
      case 'laptop':
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"></path></svg>';
      case 'github':
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path></svg>';
      case 'linkedin':
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>';
      case 'code':
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>';
      case 'twitter':
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4l11.733 16h4.267l-11.733-16z"></path></svg>';
      case 'terminal':
      default:
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" x2="20" y1="19" y2="19"></line></svg>';
    }
  }

  function renderResults() {
    resultsContainer.innerHTML = '';

    if (filteredCommands.length === 0) {
      resultsContainer.innerHTML = `
        <div class="cmd-empty-state">
          <span>No matching commands found.</span>
        </div>`;
      return;
    }

    // Group by category
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

      itemEl.addEventListener('click', () => {
        executeCommand(cmd);
      });

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
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest' });
    }
  }

  function executeCommand(cmd) {
    playUiSound('action');
    closePalette();
    setTimeout(() => {
      cmd.action();
    }, 100);
  }

  function openPalette() {
    previousFocusedEl = document.activeElement;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    input.value = '';
    filteredCommands = [...COMMANDS];
    selectedIndex = 0;
    renderResults();
    setTimeout(() => {
      input.focus();
    }, 40);
  }

  function closePalette() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    if (previousFocusedEl && typeof previousFocusedEl.focus === 'function') {
      previousFocusedEl.focus();
    }
  }

  // Filter on input
  input.addEventListener('input', () => {
    const query = input.value.toLowerCase().trim();
    if (!query) {
      filteredCommands = [...COMMANDS];
    } else {
      filteredCommands = COMMANDS.filter((cmd) => {
        return (
          cmd.title.toLowerCase().includes(query) ||
          cmd.category.toLowerCase().includes(query) ||
          cmd.shortcut.toLowerCase().includes(query)
        );
      });
    }
    selectedIndex = 0;
    renderResults();
  });

  // Keyboard navigation inside input
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
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closePalette();
    }
  });

  // Global trigger shortcut (Cmd+K / Ctrl+K)
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

  // Open button trigger
  openBtn?.addEventListener('click', openPalette);

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closePalette();
    }
  });
}
