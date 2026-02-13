<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { SceneControls } from '$lib/three/scene';

  let canvas: HTMLCanvasElement;
  let sceneControls: SceneControls | null = null;
  let sceneLoaded = false;
  let currentStage = 0;

  const stageCount = 3;

  onMount(async () => {
    try {
      const { createHammerScene } = await import('$lib/three/scene');
      sceneControls = await createHammerScene(canvas, {
        onStageChange(index: number) {
          currentStage = index;
        },
        onSceneReady() {
          sceneLoaded = true;
        }
      });
    } catch {
      // If Three.js fails to load, the component will stay in loading state
      console.error('Failed to initialize 3D scene');
    }
  });

  onDestroy(() => {
    sceneControls?.dispose();
    sceneControls = null;
  });

  function goToStage(index: number): void {
    sceneControls?.goToStage(index);
  }
</script>

<!-- Scene Canvas -->
<div class="scene-container" class:scene-loaded={sceneLoaded} aria-hidden="true">
  <canvas bind:this={canvas}></canvas>

  <!-- Loading indicator (while model loads) -->
  {#if !sceneLoaded}
    <div class="model-loader">
      <div class="model-loader-content">
        <div class="model-loader-text">Loading 3D Experience</div>
      </div>
    </div>
  {/if}
</div>

<!-- Stage Content Cards -->
<div class="stage-content" id="stage-intro" class:visible={currentStage === 0 && sceneLoaded}>
  <div class="stage-card builder-card">
    <h1>Hi, I'm Sarthak</h1>
    <p>I build useful, real-world apps.</p>
    <span class="scroll-hint">Scroll to explore &darr;</span>
  </div>
</div>

<div class="stage-content" id="stage-projects" class:visible={currentStage === 1 && sceneLoaded}>
  <div class="stage-card builder-card">
    <h2>Stuff I've Built</h2>
    <div class="project-list">
      <a href="https://syrthax.github.io/NutriScan/" class="project-link">
        <span class="project-name">NutriScan</span>
        <span class="project-desc">nutrition scanning powered by open food facts</span>
      </a>
      <a href="https://syrthax.github.io/soura/" class="project-link">
        <span class="project-name">Soura</span>
        <span class="project-desc">Chrome download extension</span>
      </a>
      <a href="https://syrthax.github.io/ido/" class="project-link">
        <span class="project-name">iDo</span>
        <span class="project-desc">Secure task manager</span>
      </a>
      <a href="https://syrthax.github.io/Kiosk/" class="project-link">
        <span class="project-name">Kiosk</span>
        <span class="project-desc">Open source PDF reader</span>
      </a>
      <a href="https://sarthakg.tech/Loading-tips/" class="project-link">
        <span class="project-name">Loading-tips</span>
        <span class="project-desc">Blog about my dev journey</span>
      </a>
    </div>
  </div>
</div>

<div class="stage-content" id="stage-skills" class:visible={currentStage === 2 && sceneLoaded}>
  <div class="stage-card builder-card">
    <h2><span class="icon-hammer" aria-hidden="true">🪓</span> Tools of the Trade</h2>
    <div class="craftsman-section">
      <h3 class="craftsman-label">Systems & Frameworks</h3>
      <ul class="craftsman-list">
        <li class="craftsman-tag">Chrome Extensions</li>
        <li class="craftsman-tag">Google OAuth</li>
        <li class="craftsman-tag">Google Drive API</li>
        <li class="craftsman-tag">GitHub API & PAT</li>
        <li class="craftsman-tag">Client-side Sync</li>
        <li class="craftsman-tag">Android (Kotlin)</li>
        <li class="craftsman-tag">Tauri</li>
        <li class="craftsman-tag">GitHub Pages</li>
      </ul>
    </div>
    <div class="contact-cta">
      <p>Let's build something thoughtful</p>
      <a href="https://contact.sarthakg.tech/" class="builder-btn">Get in touch &rarr;</a>
    </div>
  </div>
</div>

<!-- Stage Indicators -->
<div class="stage-indicators">
  {#each Array(stageCount) as _, i}
    <button
      class="stage-indicator"
      class:active={currentStage === i}
      on:click={() => goToStage(i)}
      aria-label={['Introduction', 'Projects', 'Skills'][i]}
    ></button>
  {/each}
</div>
