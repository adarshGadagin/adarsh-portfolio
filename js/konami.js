/* ==========================================================================
   KONAMI CODE EASTER EGG (DEVELOPER HUD)
   Sequence: ↑ ↑ ↓ ↓ ← → ← → B A
   Reveals an authentic developer diagnostic terminal overlay
   ========================================================================== */

import { playUiSound } from './utils.js';

// Canonical sequence
const KONAMI_SEQUENCE = [
  'arrowup',
  'arrowup',
  'arrowdown',
  'arrowdown',
  'arrowleft',
  'arrowright',
  'arrowleft',
  'arrowright',
  'b',
  'a'
];

/**
 * Normalizes browser-specific key strings
 */
function normalizeKey(key) {
  const k = key.toLowerCase();
  if (k === 'up') return 'arrowup';
  if (k === 'down') return 'arrowdown';
  if (k === 'left') return 'arrowleft';
  if (k === 'right') return 'arrowright';
  return k;
}

let previouslyFocusedElement = null;

/**
 * Programmatically open Easter Egg modal
 */
export function openEasterEgg() {
  const modalOverlay = document.getElementById('konami-modal');
  const closeBtn = document.getElementById('konami-close-btn');

  if (!modalOverlay) return;

  previouslyFocusedElement = document.activeElement;
  modalOverlay.classList.add('active');
  modalOverlay.setAttribute('aria-hidden', 'false');

  // Play subtle high-tech sound
  playUiSound('konami');

  // Focus close button
  setTimeout(() => {
    closeBtn?.focus();
  }, 50);

  // Developer console output
  console.log(
    '%c[ENGINEERING HUD ACTIVATED] 🚀\n%cAdarsh Gadagin — 2nd Year CSE @ REVA University\nBuilding software with curiosity and precision.',
    'color: #38BDF8; font-family: monospace; font-size: 14px; font-weight: bold;',
    'color: #818CF8; font-family: monospace; font-size: 12px;'
  );
}

/**
 * Close Easter Egg modal
 */
export function closeEasterEgg() {
  const modalOverlay = document.getElementById('konami-modal');
  if (!modalOverlay) return;

  modalOverlay.classList.remove('active');
  modalOverlay.setAttribute('aria-hidden', 'true');

  if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
    previouslyFocusedElement.focus();
  }
}

export function initKonami() {
  let konamiIndex = 0;
  const modalOverlay = document.getElementById('konami-modal');
  const closeBtn = document.getElementById('konami-close-btn');

  // Keydown listener for Konami code sequence
  window.addEventListener('keydown', (e) => {
    // If typing inside an input, textarea or contenteditable, do not trigger
    const activeEl = document.activeElement;
    if (
      activeEl &&
      (activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        activeEl.isContentEditable)
    ) {
      return;
    }

    const key = normalizeKey(e.key);
    const expectedKey = KONAMI_SEQUENCE[konamiIndex];

    if (key === expectedKey) {
      konamiIndex++;
      if (konamiIndex === KONAMI_SEQUENCE.length) {
        openEasterEgg();
        konamiIndex = 0;
      }
    } else {
      // If sequence was broken, check if the key matches the start of the sequence
      if (key === KONAMI_SEQUENCE[0]) {
        konamiIndex = 1;
      } else {
        konamiIndex = 0;
      }
    }
  });

  // Close triggers
  closeBtn?.addEventListener('click', closeEasterEgg);

  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeEasterEgg();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay?.classList.contains('active')) {
      closeEasterEgg();
    }
  });
}
