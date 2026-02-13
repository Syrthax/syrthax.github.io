/**
 * 3D Hammer Narrative Experience
 * Stage-based scroll storytelling with the hammer as protagonist.
 * Camera targets specific hammer parts: full → face → grip.
 *
 * Dynamically imports Three.js — never loaded on mobile.
 */

import type { Group, PointLight, Material, Mesh } from 'three';

interface HammerPart {
  y: number;
  distance: number;
}

interface Stage {
  name: string;
  part: string;
  hammerRotX: number;
  hammerRotY: number;
}

export interface SceneCallbacks {
  onStageChange: (stageIndex: number) => void;
  onSceneReady: () => void;
}

export interface SceneControls {
  goToStage: (index: number) => void;
  dispose: () => void;
}

/**
 * Create and initialize the 3D hammer scene.
 * Three.js is dynamically imported here — call only on desktop.
 */
export async function createHammerScene(
  canvas: HTMLCanvasElement,
  callbacks: SceneCallbacks
): Promise<SceneControls> {
  // Dynamic imports — tree-shaken and code-split by Vite
  const THREE = await import('three');
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');

  // ── Config ──────────────────────────────────────────────────
  const hammerParts: Record<string, HammerPart> = {
    full: { y: 0, distance: 8 },
    face: { y: 1.5, distance: 4.5 },
    grip: { y: -1.6, distance: 3.5 }
  };

  const stages: Stage[] = [
    { name: 'intro', part: 'full', hammerRotX: -0.1, hammerRotY: 0.25 },
    { name: 'projects', part: 'face', hammerRotX: 0.35, hammerRotY: 0.4 },
    { name: 'skills', part: 'grip', hammerRotX: -0.05, hammerRotY: 0.15 }
  ];

  // ── State ───────────────────────────────────────────────────
  let currentStage = 0;
  let isTransitioning = false;
  let scrollAccumulator = 0;
  const scrollThreshold = 150;
  let time = 0;
  let disposed = false;
  let animationFrameId: number | null = null;

  let hammer: Group | null = null;
  let baseRotX = stages[0].hammerRotX;
  let baseRotY = stages[0].hammerRotY;

  const currentLookAt = new THREE.Vector3(0, 0, 0);

  const cursorRotation = {
    target: 0,
    current: 0,
    range: 0.15,
    damping: 0.08
  };

  const inspectionLight = {
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    damping: 0.06,
    light: null as PointLight | null
  };

  // ── Scene setup ─────────────────────────────────────────────
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d0b09);

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, hammerParts.full.distance);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;

  // ── Lighting ────────────────────────────────────────────────
  function setupLighting(): void {
    // Warm ambient
    scene.add(new THREE.AmbientLight(0xffeedd, 0.3));

    // Key light — workshop lamp feel
    const headLight = new THREE.DirectionalLight(0xffd4a3, 1.0);
    headLight.position.set(1, 5, 6);
    scene.add(headLight);

    // Secondary — upper-left
    const faceLight = new THREE.DirectionalLight(0xffe8cc, 0.6);
    faceLight.position.set(-3, 4, 4);
    scene.add(faceLight);

    // Rim — silhouette definition
    const rimLight = new THREE.DirectionalLight(0xccddee, 0.5);
    rimLight.position.set(0, 2, -5);
    scene.add(rimLight);

    // Side rim
    const sideRim = new THREE.DirectionalLight(0xffeedd, 0.3);
    sideRim.position.set(-6, 3, 0);
    scene.add(sideRim);

    // Fill from below-front
    const fillLight = new THREE.DirectionalLight(0xaa9988, 0.25);
    fillLight.position.set(0, -3, 4);
    scene.add(fillLight);

    // Cursor-following inspection light
    const inspectLight = new THREE.PointLight(0xffcc88, 25, 0, 2);
    inspectLight.position.set(0, 0, 3);
    scene.add(inspectLight);
    inspectionLight.light = inspectLight;
  }

  // ── Easing ──────────────────────────────────────────────────
  function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // ── Stage transitions ──────────────────────────────────────
  function transitionToStage(newStage: number): void {
    if (isTransitioning || newStage === currentStage || !hammer) return;

    isTransitioning = true;

    const toStage = stages[newStage];
    const toPart = hammerParts[toStage.part];
    const duration = 1400;
    const startTime = performance.now();

    const startZ = camera.position.z;
    const startLookAtY = currentLookAt.y;
    const startRotX = hammer.rotation.x;
    const startRotY = hammer.rotation.y;

    const targetZ = toPart.distance;
    const targetLookAtY = toPart.y;
    const targetRotX = toStage.hammerRotX;
    const targetRotY = toStage.hammerRotY;

    const animateTransition = (currentTime: number): void => {
      if (disposed) return;

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);

      camera.position.z = THREE.MathUtils.lerp(startZ, targetZ, eased);
      currentLookAt.y = THREE.MathUtils.lerp(startLookAtY, targetLookAtY, eased);
      camera.lookAt(currentLookAt);

      if (hammer) {
        hammer.rotation.x = THREE.MathUtils.lerp(startRotX, targetRotX, eased);
        hammer.rotation.y = THREE.MathUtils.lerp(startRotY, targetRotY, eased);
        baseRotX = hammer.rotation.x;
        baseRotY = hammer.rotation.y;
      }

      if (progress < 1) {
        requestAnimationFrame(animateTransition);
      } else {
        currentStage = newStage;
        isTransitioning = false;
        callbacks.onStageChange(newStage);
      }
    };

    requestAnimationFrame(animateTransition);
  }

  // ── Animation loop ──────────────────────────────────────────
  function animate(): void {
    if (disposed) return;

    time += 0.016;

    if (hammer) {
      // Smooth cursor rotation
      if (!isTransitioning) {
        cursorRotation.current +=
          (cursorRotation.target - cursorRotation.current) * cursorRotation.damping;
      } else {
        cursorRotation.current *= 0.95;
      }

      // Idle breathing
      const idleX = Math.sin(time * 0.5) * 0.015;
      const idleY = Math.cos(time * 0.3) * 0.008;

      hammer.rotation.x = baseRotX + idleX;
      hammer.rotation.y = baseRotY + idleY + cursorRotation.current;
    }

    // Inspection light follows cursor
    if (inspectionLight.light) {
      inspectionLight.currentX +=
        (inspectionLight.targetX - inspectionLight.currentX) * inspectionLight.damping;
      inspectionLight.currentY +=
        (inspectionLight.targetY - inspectionLight.currentY) * inspectionLight.damping;
      inspectionLight.light.position.set(
        inspectionLight.currentX,
        inspectionLight.currentY,
        3
      );
    }

    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(animate);
  }

  // ── Event handlers ──────────────────────────────────────────
  function onWheel(e: WheelEvent): void {
    e.preventDefault();
    if (isTransitioning) return;

    scrollAccumulator += e.deltaY;

    if (Math.abs(scrollAccumulator) > scrollThreshold) {
      const direction = scrollAccumulator > 0 ? 1 : -1;
      scrollAccumulator = 0;
      const newStage = Math.max(0, Math.min(stages.length - 1, currentStage + direction));
      if (newStage !== currentStage) transitionToStage(newStage);
    }
  }

  let touchStartY = 0;

  function onTouchStart(e: TouchEvent): void {
    touchStartY = e.touches[0].clientY;
  }

  function onTouchMove(e: TouchEvent): void {
    if (isTransitioning) return;
    const deltaY = touchStartY - e.touches[0].clientY;
    touchStartY = e.touches[0].clientY;
    scrollAccumulator += deltaY * 2;

    if (Math.abs(scrollAccumulator) > scrollThreshold) {
      const direction = scrollAccumulator > 0 ? 1 : -1;
      scrollAccumulator = 0;
      const newStage = Math.max(0, Math.min(stages.length - 1, currentStage + direction));
      if (newStage !== currentStage) transitionToStage(newStage);
    }
  }

  function onKeyDown(e: KeyboardEvent): void {
    if (isTransitioning) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      const s = Math.min(stages.length - 1, currentStage + 1);
      if (s !== currentStage) transitionToStage(s);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      const s = Math.max(0, currentStage - 1);
      if (s !== currentStage) transitionToStage(s);
    }
  }

  function onMouseMove(e: MouseEvent): void {
    if (!isTransitioning) {
      const centerX = window.innerWidth / 2;
      const normalizedX = (e.clientX - centerX) / centerX;
      cursorRotation.target = normalizedX * cursorRotation.range;
    }
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = -((e.clientY / window.innerHeight) * 2 - 1);
    inspectionLight.targetX = nx * 3.5;
    inspectionLight.targetY = ny * 3;
  }

  function onMouseLeave(): void {
    cursorRotation.target = 0;
    inspectionLight.targetX = 0;
    inspectionLight.targetY = 0;
  }

  function onResize(): void {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // ── Load model ──────────────────────────────────────────────
  function loadHammer(): void {
    const loader = new GLTFLoader();

    loader.load('/assets/hammer.glb', (gltf: { scene: Group }) => {
      if (disposed) return;

      hammer = gltf.scene;

      const box = new THREE.Box3().setFromObject(hammer);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 4 / maxDim;
      hammer.scale.setScalar(scale);
      hammer.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

      const stage = stages[0];
      const part = hammerParts[stage.part];

      hammer.rotation.x = stage.hammerRotX;
      hammer.rotation.y = stage.hammerRotY;

      camera.position.z = part.distance;
      currentLookAt.set(0, part.y, 0);
      camera.lookAt(currentLookAt);

      baseRotX = stage.hammerRotX;
      baseRotY = stage.hammerRotY;

      scene.add(hammer);

      callbacks.onSceneReady();
      callbacks.onStageChange(0);

      animate();
    });
  }

  // ── Initialize ──────────────────────────────────────────────
  setupLighting();

  // Lock body scroll in 3D mode
  document.body.style.overflow = 'hidden';
  document.body.style.height = '100vh';

  // Attach event listeners
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseleave', onMouseLeave);
  window.addEventListener('resize', onResize);

  loadHammer();

  // ── Public controls ─────────────────────────────────────────
  return {
    goToStage(index: number): void {
      if (index !== currentStage) transitionToStage(index);
    },

    dispose(): void {
      disposed = true;

      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);

      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);

      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.height = '';

      // Dispose Three.js resources
      renderer.dispose();
      scene.traverse((object: unknown) => {
        const mesh = object as Mesh;
        if (mesh.isMesh) {
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m: Material) => m.dispose());
          } else {
            (mesh.material as Material)?.dispose();
          }
        }
      });
    }
  };
}
