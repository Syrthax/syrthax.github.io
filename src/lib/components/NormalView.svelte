<script lang="ts">
  import { onMount } from 'svelte';

  const year = new Date().getFullYear();

  const fullIntro =
    "I'm Sarthak, a student developer who loves solving problems by making products. From AI-powered nutrition scanning to browser extensions, I build tools that help people in their everyday life.";
  let introText = '';
  let typingDone = false;

  // ── Svelte actions ──────────────────────────────────────────

  /** IntersectionObserver reveal animation */
  function reveal(node: HTMLElement) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      node.classList.add('revealed');
      return { destroy() {} };
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(node);
    return { destroy() { io.disconnect(); } };
  }

  /** Pointer-following tilt effect */
  function tilt(node: HTMLElement) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return { destroy() {} };

    const max = 10;

    function onMove(e: PointerEvent) {
      const r = node.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      node.style.transform = `perspective(600px) rotateX(${-y * max}deg) rotateY(${x * max}deg) translateZ(0)`;
    }

    function onLeave() {
      node.style.transform = '';
    }

    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerleave', onLeave);
    return {
      destroy() {
        node.removeEventListener('pointermove', onMove);
        node.removeEventListener('pointerleave', onLeave);
      }
    };
  }

  /** Elastic overscroll on the page container */
  function elasticOverscroll(page: HTMLElement) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return { destroy() {} };

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

    const clear = () => {
      page.style.removeProperty('--stretch-y');
      page.classList.remove('is-stretching');
    };

    const release = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(function anim() {
        stretch *= DECAY;
        if (stretch <= 0.001) {
          stretch = 0;
          clear();
          return;
        }
        apply();
        rafId = requestAnimationFrame(anim);
      });
    };

    function onWheel(e: WheelEvent) {
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
    }

    function onTouchStart(e: TouchEvent) {
      touching = true;
      startY = e.touches[0].clientY;
      cancelAnimationFrame(rafId);
    }

    function onTouchMove(e: TouchEvent) {
      if (!touching) return;
      const y = e.touches[0].clientY;
      const dy = startY - y;
      if ((dy < 0 && atTop()) || (dy > 0 && atBottom())) {
        e.preventDefault();
        page.style.setProperty('--stretch-origin', dy < 0 ? '0%' : '100%');
        stretch = Math.min(MAX, Math.abs(dy) * TOUCH_K);
        apply();
      }
    }

    function onTouchEnd() {
      touching = false;
      if (stretch > 0) release();
    }

    function onScroll() {
      if (stretch > 0 && !atTop() && !atBottom()) release();
    }

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    return {
      destroy() {
        cancelAnimationFrame(rafId);
        window.removeEventListener('wheel', onWheel);
        window.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
        window.removeEventListener('scroll', onScroll);
      }
    };
  }

  // ── Typing animation ───────────────────────────────────────
  onMount(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      introText = fullIntro;
      typingDone = true;
      return;
    }

    let i = 0;
    const speed = 28;

    function typeTick() {
      i++;
      introText = fullIntro.slice(0, i);
      if (i < fullIntro.length) {
        setTimeout(typeTick, speed);
      } else {
        typingDone = true;
      }
    }

    setTimeout(typeTick, 420);
  });
</script>

<div id="page" use:elasticOverscroll>
  <main id="home">
    <!-- ── Hero ────────────────────────────────────────── -->
    <section class="hero">
      <div class="hero__card glass" use:reveal use:tilt>
        <div class="badge glass subtle">
          <img src="/assets/main.svg" alt="Badge" width="18" height="18" />
          <span>Sarthak</span>
        </div>
        <h1 class="title">I build useful, real-world apps.</h1>
        <p class="sub">
          <span class="typing" class:typing-done={typingDone} aria-live="polite">{introText}</span>
        </p>
        <div class="cta">
          <a class="btn primary" href="#work">View Work</a>
          <a class="btn" href="https://contact.sarthakg.tech/">Get in touch</a>
        </div>
        <ul class="social">
          <li><a href="https://www.linkedin.com/" rel="noopener" target="_blank">LinkedIn</a></li>
          <li><a href="https://github.com/Syrthax" rel="noopener" target="_blank">GitHub</a></li>
          <li><a href="https://instagram.com/_sythrax" rel="noopener" target="_blank">Instagram</a></li>
        </ul>
      </div>
    </section>

    <!-- ── About ───────────────────────────────────────── -->
    <section id="about" class="section">
      <div class="grid">
        <article class="card glass" use:reveal use:tilt>
          <h3>Principles</h3>
          <p>
            &bull; Ship fast, improve continuously<br />
            &bull; Make things people can actually use<br />
            &bull; Keep code simple and maintainable<br />
            &bull; Learn by building, not overthinking
          </p>
        </article>
        <article class="card glass" use:reveal use:tilt>
          <h3>Focus</h3>
          <p>
            &bull; Building real products end-to-end<br />
            &bull; AI-powered tools<br />
            &bull; Mobile & web apps<br />
            &bull; Practical UX that anyone can use instantly
          </p>
        </article>
        <article class="card glass" use:reveal use:tilt>
          <h3>Stack</h3>
          <p>
            &bull; HTML, CSS, JavaScript<br />
            &bull; Python, Flask, REST APIs<br />
            &bull; Kotlin (Android), Swift (iOS)<br />
            &bull; C & C++ (systems + low-level fundamentals)<br />
            &bull; GitHub Pages, Tailwind, debugging anything<br />
            &bull; Basically: whatever helps me ship the product 🚀
          </p>
        </article>
      </div>
    </section>

    <!-- ── Now Playing ─────────────────────────────────── -->
    <section id="now-playing" class="section">
      <h2 class="section__title" use:reveal>Now Playing</h2>
      <div class="spotify-container" use:reveal>
        <a href="https://open.spotify.com/user/cxnjric2e0obnvm4dkupwj1ua" target="_blank" rel="noopener" class="spotify-card glass">
          <div class="spotify-icon">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          </div>
          <div class="spotify-info">
            <h3>Listen on Spotify</h3>
            <p>Check out what I'm listening to</p>
          </div>
          <div class="spotify-arrow">&rarr;</div>
        </a>
      </div>
    </section>

    <!-- ── Work ────────────────────────────────────────── -->
    <section id="work" class="section">
      <h2 class="section__title" use:reveal>Building</h2>
      <div class="work grid">
        <a class="work__item glass" href="https://syrthax.github.io/NutriScan/" aria-label="NutriScan" use:reveal use:tilt>
          <div class="work__meta">
            <h4>NutriScan</h4>
            <p>Scans barcodes of food items and provides nutritional values using OpenFoodAPI (beta v0.5)</p>
          </div>
        </a>
        <a class="work__item glass" href="https://syrthax.github.io/soura/" aria-label="Soura" use:reveal use:tilt>
          <div class="work__meta">
            <h4>Soura</h4>
            <p>Chrome extension for enhanced downloading assets (v1.0)</p>
          </div>
        </a>
        <a class="work__item glass" href="https://syrthax.github.io/ido/" aria-label="iDo" use:reveal use:tilt>
          <div class="work__meta">
            <h4>iDo</h4>
            <p>Task manager app using Google Drive API and OAuth to sync. Private, secured, and open source.</p>
          </div>
        </a>
        <a class="work__item glass" href="https://syrthax.github.io/Kiosk/" aria-label="Kiosk" use:reveal use:tilt>
          <div class="work__meta">
            <h4>Kiosk</h4>
            <p>Free and open source PDF reader</p>
          </div>
        </a>
        <a class="work__item glass" href="https://sarthakg.tech/Loading-tips/" aria-label="Loading-tips" use:reveal use:tilt>
          <div class="work__meta">
            <h4>Loading-tips</h4>
            <p>Blog about my experience developing stuff I made</p>
          </div>
        </a>
      </div>
    </section>

    <!-- ── Contact ─────────────────────────────────────── -->
    <section id="contact" class="section">
      <div class="contact__card glass" use:reveal use:tilt>
        <h2>Let's build something thoughtful.</h2>
        <p>Open to collaborations, or just a friendly hello.</p>
        <div class="cta">
          <a class="btn primary" href="mailto:sarthak.s.gh.osh.s@gmail.com">Email me</a>
          <a class="btn" href="#home">Back to top</a>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <p>&copy; {year} Sarthak. Built with ❤️ in India.</p>
  </footer>
</div>
