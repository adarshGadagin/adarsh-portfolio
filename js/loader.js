/* ==========================================================================
   PAGE PRELOADER & INITIAL TRANSITION CONTROLLER
   Hacker terminal initialization with matrix backdrop and delayed curtain reveal
   ========================================================================== */

export function initLoader() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const preloader = document.getElementById('page-preloader');
  const bar = document.getElementById('preloader-bar');
  const percentText = document.getElementById('preloader-percent');
  const statusText = document.getElementById('preloader-status');
  const log1 = document.getElementById('preloader-log-1');
  const log2 = document.getElementById('preloader-log-2');
  const canvas = document.getElementById('preloader-matrix-canvas');

  // Matrix backdrop digital stream
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
    // 1. Curtain lift upwards
    if (preloader) {
      preloader.classList.add('preloader-done');
      setTimeout(() => {
        preloader.style.display = 'none';
        if (matrixAnimId) cancelAnimationFrame(matrixAnimId);
      }, 700);
    }

    // 2. Deliberate delay while curtain lifts before revealing page
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

  // Organic progress ticker (0 -> 100)
  let currentProgress = 0;
  const duration = 1400; // ms
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
      // Deliberate pause at 100% so user sees completion before curtain lifts
      setTimeout(completeLoader, 550);
    }
  }

  requestAnimationFrame(tick);
}
