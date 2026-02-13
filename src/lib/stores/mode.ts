import { writable } from 'svelte/store';

export type ViewMode = 'normal' | '3d';

export const mode = writable<ViewMode>('normal');
export const isMobile = writable<boolean>(true); // safe default

/**
 * Detect device capabilities.
 * Uses viewport width + pointer capability — no user-agent sniffing.
 */
export function detectDevice(): boolean {
  const mobile =
    window.innerWidth < 1024 ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0;
  isMobile.set(mobile);
  return mobile;
}

/**
 * Initialize mode based on device capabilities and user preference.
 * Desktop → 3D by default (unless opted out).
 * Mobile  → always normal.
 */
export function initMode(): void {
  const mobile = detectDevice();

  if (!mobile && !!window.WebGLRenderingContext) {
    const userPrefers3D = localStorage.getItem('prefer3D');
    // Default to 3D on desktop unless user explicitly disabled it
    if (userPrefers3D !== 'false') {
      mode.set('3d');
    }
  }
}
