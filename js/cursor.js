/* ==========================================================================
   CUSTOM CURSOR CONTROLLER
   Subtle desktop follower with responsive hover expansion
   Strictly disabled on touch screens and prefers-reduced-motion
   ========================================================================== */

export function initCursor() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isTouch || prefersReducedMotion) {
    return;
  }

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

  // Smooth lerp follower loop for outer ring
  function render() {
    cursorX += (mouseX - cursorX) * 0.22;
    cursorY += (mouseY - cursorY) * 0.22;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

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
