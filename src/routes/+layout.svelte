<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { mode, isMobile, initMode } from '$lib/stores/mode';
  import { theme, initTheme } from '$lib/stores/theme';
  import { showToast } from '$lib/stores/toast';
  import Dock from '$lib/components/Dock.svelte';
  import Toast from '$lib/components/Toast.svelte';
  import '../app.css';

  let lastSpaceTime = 0;
  const DOUBLE_PRESS_WINDOW_MS = 400;

  // ── Double-space toggle (desktop only) ──────────────────────
  function handleKeyDown(e: KeyboardEvent): void {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable) return;
    if (e.code !== 'Space' || e.repeat) return;

    e.preventDefault();

    const now = Date.now();
    if (now - lastSpaceTime <= DOUBLE_PRESS_WINDOW_MS) {
      lastSpaceTime = 0;

      let mobile = false;
      isMobile.subscribe((v) => (mobile = v))();
      if (mobile) return;

      mode.update((m) => {
        const next = m === 'normal' ? '3d' : 'normal';
        localStorage.setItem('prefer3D', next === '3d' ? 'true' : 'false');
        return next;
      });
      showToast('Double-click the space bar to switch views');
    } else {
      lastSpaceTime = now;
    }
  }

  // ── Smooth scroll for anchor links ──────────────────────────
  function handleAnchorClick(e: MouseEvent): void {
    const a = (e.target as HTMLElement).closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onMount(() => {
    initTheme();
    initMode();

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleAnchorClick);

    // Apply theme to DOM reactively
    const unsubTheme = theme.subscribe((t) => {
      document.documentElement.setAttribute('data-theme', t);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute('content', t === 'dark' ? '#0b0d12' : '#f5f7fb');
      }
    });

    // Initial toast (delayed for UX)
    let mobile = false;
    isMobile.subscribe((v) => (mobile = v))();

    setTimeout(() => {
      if (mobile) {
        if (!sessionStorage.getItem('toastShown')) {
          sessionStorage.setItem('toastShown', 'true');
          showToast('Visit this page on a PC for the 3D experience');
        }
      } else {
        if (!sessionStorage.getItem('toastShown')) {
          sessionStorage.setItem('toastShown', 'true');
          showToast('Double-click the space bar to switch views');
        }
      }
    }, 1200);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleAnchorClick);
      unsubTheme();
    };
  });
</script>

<!-- Background blobs (normal mode only) -->
{#if $mode === 'normal'}
  <div id="bg" aria-hidden="true">
    <span class="blob b1"></span>
    <span class="blob b2"></span>
    <span class="blob b3"></span>
    <span class="grain" aria-hidden="true"></span>
  </div>
{/if}

<slot />

<!-- Dock persists across mode switches -->
<Dock />
<Toast />
