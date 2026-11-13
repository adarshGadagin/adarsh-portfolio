/* ==========================================================================
   PORTFOLIO MAIN ENTRYPOINT — ADARSH GADAGIN
   Coordinates modular systems: loader, theme, navigation, scroll,
   animations, custom cursor, command palette, and Konami code.
   ========================================================================== */

import { initLoader } from './loader.js';
import { initTheme } from './theme.js';
import { initNavigation } from './navigation.js';
import { initScroll } from './scroll.js';
import { initAnimations } from './animations.js';
import { initCursor } from './cursor.js';
import { initCommandPalette } from './commandPalette.js';
import { initKonami } from './konami.js';
import { copyToClipboard, showToast } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Modular Systems
  initLoader();
  initTheme();
  initNavigation();
  initScroll();
  initAnimations();
  initCursor();
  initCommandPalette();
  initKonami();

  // 2. Email Copy Interaction
  setupEmailCopy();

  // 3. Local Time Indicator (Bangalore, IST)
  setupLocalTime();

  // 4. Subtle Developer Console Banner
  console.log(
    '%cAdarsh Gadagin — Software Engineering Portfolio%c\nPress %c⌘K / Ctrl+K%c for Command Menu | %c↑ ↑ ↓ ↓ ← → ← → B A%c for Engineering HUD',
    'font-weight: 700; font-size: 13px; color: #38BDF8; font-family: monospace;',
    'font-size: 11px; color: #94A3B8; font-family: monospace;',
    'color: #818CF8; font-weight: 600; font-family: monospace;',
    'color: #94A3B8; font-family: monospace;',
    'color: #34D399; font-weight: 600; font-family: monospace;',
    'color: #94A3B8; font-family: monospace;'
  );
});

/**
 * Copy email to clipboard with user feedback
 */
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

/**
 * Display live Bangalore local time in footer
 */
function setupLocalTime() {
  const timeEl = document.getElementById('bangalore-time');
  if (!timeEl) return;

  function updateTime() {
    try {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const formatter = new Intl.DateTimeFormat('en-GB', options);
      timeEl.textContent = `${formatter.format(now)} IST`;
    } catch {
      timeEl.textContent = 'Bangalore, IN';
    }
  }

  updateTime();
  setInterval(updateTime, 1000);
}
