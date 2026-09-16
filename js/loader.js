/* ==========================================================================
   PAGE LOADER & INITIAL TRANSITION CONTROLLER
   Provides a clean, non-blocking entrance transition on initial load
   ========================================================================== */

export function initLoader() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function markLoaded() {
    document.body.classList.add('page-loaded');

    // Subtle entrance trigger for hero
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
  }

  if (document.readyState === 'complete') {
    markLoaded();
  } else {
    window.addEventListener('load', markLoaded, { once: true });
    // Safety fallback timeout in case load event is delayed
    setTimeout(markLoaded, 1200);
  }
}
