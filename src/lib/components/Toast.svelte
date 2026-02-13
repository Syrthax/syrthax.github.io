<script lang="ts">
  import { onDestroy, tick } from 'svelte';
  import { toastMessage } from '$lib/stores/toast';

  const ENTRY_MS = 550;
  const EXIT_MS = 400;
  const DEFAULT_DURATION = 4500;

  let visible = false;
  let entering = false;
  let exiting = false;
  let message = '';
  let el: HTMLDivElement | undefined;

  let timer: ReturnType<typeof setTimeout>;
  let exitTimer: ReturnType<typeof setTimeout>;

  $: if ($toastMessage) {
    clearTimeout(timer);
    clearTimeout(exitTimer);

    message = $toastMessage.message;
    const duration = $toastMessage.duration ?? DEFAULT_DURATION;

    // Reset state
    exiting = false;
    entering = false;
    visible = true;

    // After DOM update, trigger entry animation
    tick().then(() => {
      if (el) el.getBoundingClientRect(); // force layout
      entering = true;
    });

    // Schedule auto-dismiss
    timer = setTimeout(() => {
      entering = false;
      exiting = true;

      exitTimer = setTimeout(() => {
        visible = false;
        exiting = false;
        toastMessage.set(null);
      }, EXIT_MS);
    }, ENTRY_MS + duration);
  }

  onDestroy(() => {
    clearTimeout(timer);
    clearTimeout(exitTimer);
  });
</script>

{#if visible}
  <div
    bind:this={el}
    class="toast-notification"
    class:toast-enter={entering}
    class:toast-exit={exiting}
    role="status"
    aria-live="polite"
  >
    <span class="toast-text">{message}</span>
  </div>
{/if}
