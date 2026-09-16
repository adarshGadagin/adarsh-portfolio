/* ==========================================================================
   THEME CONTROLLER
   Supports: Dark Mode, Light Mode, System Preference
   Persists choice in localStorage. Updates data-theme on <html>
   ========================================================================== */

const THEME_STORAGE_KEY = 'adarsh_portfolio_theme';

// Available themes: 'dark', 'light', 'system'
let currentThemePreference = localStorage.getItem(THEME_STORAGE_KEY) || 'system';

/**
 * Resolves whether the active visual theme should be dark or light
 */
function getEffectiveTheme(preference) {
  if (preference === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return preference;
}

/**
 * Updates DOM attributes, meta tags, and toggle button icon
 */
export function applyTheme(preference) {
  currentThemePreference = preference;
  const effectiveTheme = getEffectiveTheme(preference);

  // Apply data-theme to root html element
  document.documentElement.setAttribute('data-theme', effectiveTheme);

  // Update theme-color meta tag for browser address bars
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', effectiveTheme === 'dark' ? '#08090C' : '#F8FAFC');
  }

  // Update toggle button visual / ARIA state
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    const isDark = effectiveTheme === 'dark';
    toggleBtn.setAttribute('aria-label', `Current theme: ${preference} (${effectiveTheme}). Click to change.`);
    toggleBtn.setAttribute('title', `Theme: ${preference} (Click to toggle)`);
    
    // Icon render based on effective mode
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

/**
 * Cycles through themes: system -> dark -> light -> system
 */
export function cycleTheme() {
  let nextPreference;
  if (currentThemePreference === 'system') {
    // If system was dark, next user toggle is light, else dark
    const isSysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    nextPreference = isSysDark ? 'light' : 'dark';
  } else if (currentThemePreference === 'dark') {
    nextPreference = 'light';
  } else {
    nextPreference = 'dark';
  }

  localStorage.setItem(THEME_STORAGE_KEY, nextPreference);
  applyTheme(nextPreference);
}

/**
 * Initializes theme listener and watches system preference changes
 */
export function initTheme() {
  applyTheme(currentThemePreference);

  // Watch for OS system preference changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', () => {
    if (currentThemePreference === 'system') {
      applyTheme('system');
    }
  });

  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', cycleTheme);
  }
}
