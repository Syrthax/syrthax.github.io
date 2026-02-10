document.getElementById('year').textContent = new Date().getFullYear();
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Loading - hide loader immediately (no zoom animation)
(() => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  loader.style.display = 'none';
})();

// ============================================================
// Device Detection
// Runs once at boot — frozen, immutable reference
// ============================================================
const Device = (() => {
  const isMobile =
    window.innerWidth < 1024 ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0;
  const is3DCapable =
    document.documentElement.getAttribute('data-3d-capable') === 'true';
  return Object.freeze({ isMobile, isDesktop: !isMobile, is3DCapable });
})();

// ============================================================
// Toast Notification System
// iOS-style spring animation — top-center, scale + translate
// ============================================================
const Toast = (() => {
  const DISPLAY_DURATION_MS = 4000;  // how long the toast stays visible
  const ENTRY_MS            = 550;   // entry animation length
  const EXIT_MS             = 400;   // exit animation length

  let activeToast = null;

  /** Build the DOM element for a toast. */
  function createElement(message) {
    const el = document.createElement('div');
    el.className = 'toast-notification';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');

    const text = document.createElement('span');
    text.className = 'toast-text';
    text.textContent = message;
    el.appendChild(text);
    return el;
  }

  /** Animate a toast out and remove it from the DOM. */
  function dismiss(el) {
    if (!el || !el.parentNode) return Promise.resolve();
    return new Promise((resolve) => {
      el.classList.remove('toast-enter');
      el.classList.add('toast-exit');
      setTimeout(() => {
        el.remove();
        if (activeToast === el) activeToast = null;
        resolve();
      }, EXIT_MS);
    });
  }

  /**
   * Show a toast with the given message.
   * Returns a Promise that resolves after the toast is fully dismissed.
   * @param {string}  message
   * @param {number}  duration  — visible time in ms (default 4 000)
   */
  function show(message, duration = DISPLAY_DURATION_MS) {
    // Remove any existing toast instantly so only one is on-screen
    if (activeToast) {
      clearTimeout(activeToast._timer);
      activeToast.remove();
      activeToast = null;
    }

    return new Promise((resolve) => {
      const el = createElement(message);
      activeToast = el;
      document.body.appendChild(el);

      // Force a layout calc so the browser registers the initial transform
      // before the entry class is added on the next frame.
      el.getBoundingClientRect();

      // Trigger spring entry animation
      requestAnimationFrame(() => el.classList.add('toast-enter'));

      // Auto-dismiss after entry + visible duration
      el._timer = setTimeout(() => dismiss(el).then(resolve), ENTRY_MS + duration);
    });
  }

  /** Immediately tear down any active toast. */
  function dismissAll() {
    if (activeToast) {
      clearTimeout(activeToast._timer);
      dismiss(activeToast);
    }
  }

  return Object.freeze({ show, dismissAll });
})();

// ============================================================
// View State Manager
// Owns the is-3d class and localStorage preference
// ============================================================
const ViewState = (() => {
  const html = document.documentElement;

  const is3D = () => html.classList.contains('is-3d');

  /** Toggle between normal and 3D views (desktop only). */
  function toggle() {
    if (Device.isMobile || !Device.is3DCapable) return;

    const entering3D = !is3D();

    if (entering3D) {
      html.classList.add('is-3d');
      localStorage.setItem('prefer3D', 'true');
    } else {
      html.classList.remove('is-3d');
      html.classList.remove('scene-loaded');
      localStorage.setItem('prefer3D', 'false');
      document.body.style.overflow = '';
      document.body.style.height = '';
    }

    // Flag so the post-reload toast fires in the new view
    localStorage.setItem('viewJustSwitched', 'true');
    location.reload();
  }

  return Object.freeze({ is3D, toggle });
})();

// ============================================================
// Keyboard Controller — double-space to toggle views (desktop)
// Rejects held-down key repeats for a true double-press.
// ============================================================
(() => {
  if (Device.isMobile) return;

  let lastSpaceTime = 0;
  const DOUBLE_PRESS_WINDOW_MS = 400; // max gap between two presses

  document.addEventListener('keydown', (e) => {
    // Don't hijack form fields
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
    if (e.code !== 'Space') return;
    if (e.repeat) return; // ignore OS key-repeat

    e.preventDefault();

    const now = Date.now();
    if (now - lastSpaceTime <= DOUBLE_PRESS_WINDOW_MS) {
      lastSpaceTime = 0; // reset to prevent triple-fire
      ViewState.toggle();
    } else {
      lastSpaceTime = now;
    }
  });
})();

// ============================================================
// Dock — scroll-based auto-hide (2D / normal mode only)
// In 3D mode the dock is hidden entirely via CSS.
// ============================================================
(() => {
  const dock = document.querySelector('.dock');
  if (!dock) return;
  if (ViewState.is3D()) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    const delta = y - lastScrollY;

    if (delta > 5 && y > 100) {
      dock.classList.add('dock-hidden');
    } else if (delta < 0 || y < 100) {
      dock.classList.remove('dock-hidden');
    }

    lastScrollY = y;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
})();

// ============================================================
// Initial Toast — device-aware, shown once per session
// Also re-shown on every view switch (via localStorage flag).
// ============================================================
(() => {
  const TOAST_VISIBLE_MS = 4500;
  const LOAD_DELAY_MS    = 1200; // let the user orient first

  // ---- Mobile path ----
  if (Device.isMobile) {
    if (sessionStorage.getItem('toastShown')) return;
    sessionStorage.setItem('toastShown', 'true');

    window.addEventListener('load', () => {
      setTimeout(
        () => Toast.show('Visit this page on a PC for the 3D experience', TOAST_VISIBLE_MS),
        LOAD_DELAY_MS
      );
    }, { once: true });
    return;
  }

  // ---- Desktop path ----
  const justSwitched = localStorage.getItem('viewJustSwitched');

  if (justSwitched) {
    // Always show after a view switch so the user knows how to switch back
    localStorage.removeItem('viewJustSwitched');
    window.addEventListener('load', () => {
      setTimeout(
        () => Toast.show('Double-click the space bar to switch views', TOAST_VISIBLE_MS),
        LOAD_DELAY_MS
      );
    }, { once: true });
  } else {
    // First visit this session
    if (sessionStorage.getItem('toastShown')) return;
    sessionStorage.setItem('toastShown', 'true');

    window.addEventListener('load', () => {
      setTimeout(
        () => Toast.show('Double-click the space bar to switch views', TOAST_VISIBLE_MS),
        LOAD_DELAY_MS
      );
    }, { once: true });
  }
})();

// Theme Toggle
(() => {
  const themeToggle = document.querySelector('.theme-toggle');
  const html = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  
  // Check for saved theme preference or default to system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  // Apply theme on load
  html.setAttribute('data-theme', currentTheme);
  if (meta) {
    meta.setAttribute('content', currentTheme === 'dark' ? '#0b0d12' : '#f5f7fb');
  }
  
  // Toggle theme on button click
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      if (meta) {
        meta.setAttribute('content', newTheme === 'dark' ? '#0b0d12' : '#f5f7fb');
      }
    });
  }
})();

(() => {
  const els = Array.from(document.querySelectorAll('[data-reveal]'));
  if (!els.length || reduceMotion) return;
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
})();
(() => {
  if (reduceMotion) return;
  const cards = document.querySelectorAll('[data-tilt]');
  const max = 10;
  cards.forEach(card => {
    function onMove(e){
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      const rx = (-y) * max;
      const ry = x * max;
      card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    }
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
})();
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href');
  if (!id || id === '#' || id === '#0') return;
  const target = document.querySelector(id);
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
(() => {
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduce) return;
  const page = document.getElementById('page');
  const rootScroll = document.scrollingElement || document.documentElement;
  let stretch = 0;
  const MAX = 0.045;
  const DECAY = 0.82;
  const WHEEL_K = 0.00085;
  const TOUCH_K = 0.0022;
  let rafId = 0;
  let touching = false;
  let startY = 0;
  const atTop = () => rootScroll.scrollTop <= 0;
  const atBottom = () => Math.ceil(rootScroll.scrollTop + window.innerHeight) >= rootScroll.scrollHeight;
  const apply = () => {
    page.style.setProperty('--stretch-y', String(1 + stretch));
    page.classList.add('is-stretching');
  };
  const clearStretch = () => {
    page.style.removeProperty('--stretch-y');
    page.classList.remove('is-stretching');
  };
  const release = () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(function animate(){
      stretch *= DECAY;
      if (stretch <= 0.001) {
        stretch = 0;
        clearStretch();
        return;
      }
      apply();
      rafId = requestAnimationFrame(animate);
    });
  };
  window.addEventListener('wheel', (e) => {
    const dy = e.deltaY;
    if ((dy < 0 && atTop()) || (dy > 0 && atBottom())) {
      e.preventDefault();
      page.style.setProperty('--stretch-origin', dy < 0 ? '0%' : '100%');
      stretch = Math.min(MAX, stretch + Math.abs(dy) * WHEEL_K);
      apply();
      cancelAnimationFrame(rafId);
    } else if (stretch > 0) {
      release();
    }
  }, { passive: false });
  window.addEventListener('touchstart', (e) => { touching = true; startY = e.touches[0].clientY; cancelAnimationFrame(rafId); }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (!touching) return;
    const y = e.touches[0].clientY;
    const dy = startY - y;
    if ((dy < 0 && atTop()) || (dy > 0 && atBottom())) {
      e.preventDefault();
      page.style.setProperty('--stretch-origin', dy < 0 ? '0%' : '100%');
      stretch = Math.min(MAX, Math.abs(dy) * TOUCH_K);
      apply();
    }
  }, { passive: false });
  window.addEventListener('touchend', () => { touching = false; if (stretch > 0) release(); }, { passive: true });
  window.addEventListener('scroll', () => { if (stretch > 0 && !atTop() && !atBottom()) release(); }, { passive: true });
})();
(function () {
  const intro = document.getElementById('intro');
  if (!intro) return;
  const full = intro.getAttribute('data-text') || intro.textContent.trim();
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduce) { intro.textContent = full; return; }
  let i = 0;
  const speed = 28;
  function tick() {
    i++;
    intro.textContent = full.slice(0, i);
    if (i < full.length) {
      setTimeout(tick, speed);
    } else {
      intro.classList.remove('typing');
    }
  }
  window.addEventListener('load', () => { setTimeout(tick, 420); }, { once: true });
})();
