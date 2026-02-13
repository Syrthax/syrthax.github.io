<script lang="ts">
  import { mode } from '$lib/stores/mode';
  import NormalView from '$lib/components/NormalView.svelte';
  import ThreeDView from '$lib/components/ThreeDView.svelte';
</script>

{#if $mode === '3d'}
  <ThreeDView />
{:else}
  <NormalView />
{/if}
