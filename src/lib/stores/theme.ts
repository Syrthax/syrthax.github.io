import { writable } from 'svelte/store';

export type Theme = 'light' | 'dark';

export const theme = writable<Theme>('dark');

/**
 * Initialize theme from localStorage or system preference.
 */
export function initTheme(): void {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const current = (saved || (prefersDark ? 'dark' : 'light')) as Theme;
  theme.set(current);
}

/**
 * Toggle between light and dark themes.
 * Persists choice to localStorage.
 */
export function toggleTheme(): void {
  theme.update((t) => {
    const next: Theme = t === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    return next;
  });
}
