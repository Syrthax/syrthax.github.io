import { writable } from 'svelte/store';

export interface ToastMessage {
  message: string;
  duration?: number;
}

export const toastMessage = writable<ToastMessage | null>(null);

/**
 * Show a toast notification.
 * @param message - Text to display
 * @param duration - How long the toast stays visible (ms), default 4500
 */
export function showToast(message: string, duration = 4500): void {
  toastMessage.set({ message, duration });
}
