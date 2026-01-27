document.getElementById('year').textContent = new Date().getFullYear();
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Loading Animation
(() => {
  const loader = document.getElementById('loader');
  if (!loader || reduceMotion) {
    if (loader) loader.style.display = 'none';
    return;
  }
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loaded');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 600);
    }, 1200);
  });
})();

// Dock auto-hide behavior - different for 2D and 3D modes
(() => {
  const dock = document.querySelector('.dock');
  const html = document.documentElement;
  if (!dock) return;
  
  // Check if we're in 3D mode
  const is3DMode = () => html.classList.contains('is-3d');
  
  // ========================================
  // 2D MODE: Scroll-based dock hide/show
  // ========================================
  if (!is3DMode()) {
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    const updateDock = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      
      // Hide dock when scrolling down fast (more than 5px)
      if (scrollDelta > 5 && currentScrollY > 100) {
        dock.classList.add('dock-hidden');
      } 
      // Show dock when scrolling up or near top
      else if (scrollDelta < 0 || currentScrollY < 100) {
        dock.classList.remove('dock-hidden');
      }
      
      lastScrollY = currentScrollY;
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateDock);
        ticking = true;
      }
    }, { passive: true });
    
    return; // Exit early for 2D mode
  }
  
  // ========================================
  // 3D MODE: Hover-based dock hide/show
  // ========================================
  let hoverTimeout = null;
  let isHovering = false;
  
  // Hide dock after 1.2 seconds on initial load (3D mode only)
  setTimeout(() => {
    if (is3DMode()) {
      dock.classList.add('dock-hidden');
    }
  }, 1200);
  
  // Detect mouse in bottom 15% of viewport
  const handleMouseMove = (e) => {
    if (!is3DMode()) return;
    
    const viewportHeight = window.innerHeight;
    const bottomThreshold = viewportHeight * 0.85; // Top of bottom 15%
    
    if (e.clientY >= bottomThreshold) {
      // Mouse is in bottom 15%
      if (!isHovering) {
        isHovering = true;
        // Start 1.5 second timer to show dock
        hoverTimeout = setTimeout(() => {
          dock.classList.remove('dock-hidden');
        }, 1500);
      }
    } else {
      // Mouse left bottom 15%
      if (isHovering) {
        isHovering = false;
        // Cancel timer if still waiting
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
          hoverTimeout = null;
        }
        // Hide dock again when mouse leaves bottom area
        dock.classList.add('dock-hidden');
      }
    }
  };
  
  // Keep dock visible while hovering directly on it
  dock.addEventListener('mouseenter', () => {
    if (!is3DMode()) return;
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }
    dock.classList.remove('dock-hidden');
  });
  
  dock.addEventListener('mouseleave', (e) => {
    if (!is3DMode()) return;
    const viewportHeight = window.innerHeight;
    const bottomThreshold = viewportHeight * 0.85;
    
    // Only hide if mouse is not still in bottom 15%
    if (e.clientY < bottomThreshold) {
      dock.classList.add('dock-hidden');
      isHovering = false;
    }
  });
  
  document.addEventListener('mousemove', handleMouseMove, { passive: true });
})();

// 3D View Toggle
(() => {
  const viewToggle = document.querySelector('.view-toggle');
  const html = document.documentElement;
  const is3DCapable = html.getAttribute('data-3d-capable') === 'true';
  
  // Show toggle to everyone (let users decide)
  if (viewToggle) {
    viewToggle.style.display = 'flex';
    
    // Toggle 3D view on button click
    viewToggle.addEventListener('click', () => {
      const is3DEnabled = html.classList.contains('is-3d');
      
      // Warn if enabling 3D without WebGL
      if (!is3DEnabled && !is3DCapable) {
        alert('3D view requires WebGL support. Your browser may not support this feature.');
        return;
      }
      
      if (is3DEnabled) {
        // Disable 3D
        html.classList.remove('is-3d');
        html.classList.remove('scene-loaded');
        localStorage.setItem('prefer3D', 'false');
        
        // Reset body styles that 3D mode may have changed
        document.body.style.overflow = '';
        document.body.style.height = '';
        
        // Reload page to clean up 3D scene
        setTimeout(() => location.reload(), 100);
      } else {
        // Enable 3D
        html.classList.add('is-3d');
        localStorage.setItem('prefer3D', 'true');
        
        // Reload page to load 3D scene
        setTimeout(() => location.reload(), 100);
      }
    });
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
