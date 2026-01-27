/**
 * 3D Hammer Narrative Experience
 * Stage-based scroll storytelling with the hammer as protagonist
 * Camera targets specific hammer parts: full → face → grip
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class HammerNarrative {
  constructor() {
    this.container = document.getElementById('scene-container');
    this.canvas = document.getElementById('scene');
    
    if (!this.container || !this.canvas) return;

    // Hammer part world-space targets
    // Y values: positive = toward head (top), negative = toward grip (bottom)
    this.hammerParts = {
      full: { y: 0, distance: 8 },        // See entire hammer
      face: { y: 1.5, distance: 4.5 },    // Focus on striking face - closer, higher
      grip: { y: -1.6, distance: 3.5 }    // Focus on handle grip (bottom)
    };

    // Narrative stages mapped to hammer parts
    this.stages = [
      { 
        name: 'intro',
        part: 'full',
        hammerRotX: -0.1,
        hammerRotY: 0.25,
        content: 'stage-intro'
      },
      { 
        name: 'projects',
        part: 'face',           // Camera focuses on hammer FACE (head)
        hammerRotX: 0.35,       // Tilt forward more to show face surface
        hammerRotY: 0.4,
        content: 'stage-projects'
      },
      { 
        name: 'skills',
        part: 'grip',           // Camera focuses on grip (handle)
        hammerRotX: -0.05,
        hammerRotY: 0.15,
        content: 'stage-skills'
      }
    ];

    this.currentStage = 0;
    this.isTransitioning = false;
    this.scrollAccumulator = 0;
    this.scrollThreshold = 150;
    this.time = 0;

    // Camera animation state
    this.currentLookAt = new THREE.Vector3(0, 0, 0);

    // Cursor-based rotation (desktop only)
    this.cursorRotation = {
      target: 0,      // Target Y rotation from cursor
      current: 0,     // Smoothed current value
      range: 0.15,    // Max rotation in radians (~8.5 degrees)
      damping: 0.08,  // Smoothing factor (lower = smoother)
      enabled: true   // Always enabled - touch check was unreliable
    };

    // Cursor-following inspection light (desktop only)
    this.inspectionLight = {
      enabled: true,  // Always enabled - let it work
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0,
      damping: 0.06,  // Slightly slower than rotation for realistic lag
      light: null
    };

    this.init();
  }

  init() {
    // Scene with slightly warmer dark background
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0d0b09);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 0, this.hammerParts.full.distance);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.4;

    this.setupLighting();
    this.loadHammer();
    this.setupScrollCapture();
    this.setupStageIndicators();
    this.setupCursorInteraction();
    this.setupResize();
  }

  setupLighting() {
    // Warm ambient - subtle base
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.3);
    this.scene.add(ambientLight);

    // KEY LIGHT for hammer HEAD - warm workshop lamp feel
    // Positioned above and slightly in front to illuminate the striking face
    const headLight = new THREE.DirectionalLight(0xffd4a3, 1.0);
    headLight.position.set(1, 5, 6);
    this.scene.add(headLight);

    // Secondary light hitting hammer face from upper-left
    const faceLight = new THREE.DirectionalLight(0xffe8cc, 0.6);
    faceLight.position.set(-3, 4, 4);
    this.scene.add(faceLight);

    // RIM LIGHT - silhouette definition from behind
    const rimLight = new THREE.DirectionalLight(0xccddee, 0.5);
    rimLight.position.set(0, 2, -5);
    this.scene.add(rimLight);

    // Side rim for head edges
    const sideRim = new THREE.DirectionalLight(0xffeedd, 0.3);
    sideRim.position.set(-6, 3, 0);
    this.scene.add(sideRim);

    // Fill light from below-front - reveals grip texture
    const fillLight = new THREE.DirectionalLight(0xaa9988, 0.25);
    fillLight.position.set(0, -3, 4);
    this.scene.add(fillLight);

    // CURSOR-FOLLOWING INSPECTION LIGHT
    // Warm point light that follows cursor to reveal hammer details
    if (this.inspectionLight.enabled) {
      // PointLight(color, intensity, distance, decay)
      // Using SpotLight for more visible, directional effect
      const inspectLight = new THREE.PointLight(0xffcc88, 25, 0, 2);
      inspectLight.position.set(0, 0, 3);  // Very close to hammer
      this.scene.add(inspectLight);
      this.inspectionLight.light = inspectLight;
      
      // DEBUG: Log that light was created
      console.log('Inspection light created:', inspectLight);
    }
  }

  loadHammer() {
    const loader = new GLTFLoader();
    
    // Get loading UI elements
    const modelLoader = document.getElementById('model-loader');
    const progressBar = document.getElementById('model-progress');
    const percentText = document.getElementById('model-percent');
    
    loader.load(
      './assets/hammer.glb',
      // onLoad callback
      (gltf) => {
        this.hammer = gltf.scene;
        
        // Center and scale
        const box = new THREE.Box3().setFromObject(this.hammer);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4 / maxDim;
        this.hammer.scale.setScalar(scale);
        
        // Center the hammer at origin
        this.hammer.position.set(
          -center.x * scale,
          -center.y * scale,
          -center.z * scale
        );
        
        // Store the hammer's bounding info
        this.hammerHeight = size.y * scale;
        
        // Apply initial stage pose
        const stage = this.stages[0];
        const part = this.hammerParts[stage.part];
        
        this.hammer.rotation.x = stage.hammerRotX;
        this.hammer.rotation.y = stage.hammerRotY;
        
        // Set initial camera position and lookAt
        this.camera.position.z = part.distance;
        this.currentLookAt.set(0, part.y, 0);
        this.camera.lookAt(this.currentLookAt);
        
        // Store base rotations for idle animation
        this.baseRotX = stage.hammerRotX;
        this.baseRotY = stage.hammerRotY;
        
        this.scene.add(this.hammer);
        
        // Hide loading UI
        if (modelLoader) {
          modelLoader.classList.add('loaded');
        }
        
        // Signal ready
        document.documentElement.classList.add('scene-loaded');
        this.showStageContent(0);
        
        this.animate();
      },
      // onProgress callback
      (xhr) => {
        if (xhr.lengthComputable) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          if (progressBar) progressBar.style.width = percent + '%';
          if (percentText) percentText.textContent = percent + '%';
        } else {
          // If total size unknown, show indeterminate progress
          if (progressBar) progressBar.style.width = '50%';
          if (percentText) percentText.textContent = 'Loading...';
        }
      },
      // onError callback
      (error) => {
        console.error('Error loading 3D model:', error);
        if (percentText) percentText.textContent = 'Error loading model';
        // Fallback to 2D mode
        document.documentElement.classList.remove('is-3d');
      }
    );
  }

  setupScrollCapture() {
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    
    this.wheelHandler = (e) => {
      e.preventDefault();
      if (this.isTransitioning) return;
      
      this.scrollAccumulator += e.deltaY;
      
      if (Math.abs(this.scrollAccumulator) > this.scrollThreshold) {
        const direction = this.scrollAccumulator > 0 ? 1 : -1;
        this.scrollAccumulator = 0;
        
        const newStage = Math.max(0, Math.min(this.stages.length - 1, this.currentStage + direction));
        
        if (newStage !== this.currentStage) {
          this.transitionToStage(newStage);
        }
      }
    };
    
    window.addEventListener('wheel', this.wheelHandler, { passive: false });

    // Touch support
    let touchStartY = 0;
    
    this.touchStartHandler = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    
    this.touchMoveHandler = (e) => {
      if (this.isTransitioning) return;
      
      const deltaY = touchStartY - e.touches[0].clientY;
      touchStartY = e.touches[0].clientY;
      
      this.scrollAccumulator += deltaY * 2;
      
      if (Math.abs(this.scrollAccumulator) > this.scrollThreshold) {
        const direction = this.scrollAccumulator > 0 ? 1 : -1;
        this.scrollAccumulator = 0;
        
        const newStage = Math.max(0, Math.min(this.stages.length - 1, this.currentStage + direction));
        
        if (newStage !== this.currentStage) {
          this.transitionToStage(newStage);
        }
      }
    };
    
    window.addEventListener('touchstart', this.touchStartHandler, { passive: true });
    window.addEventListener('touchmove', this.touchMoveHandler, { passive: true });
    
    // Keyboard navigation
    this.keyHandler = (e) => {
      if (this.isTransitioning) return;
      
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        const newStage = Math.min(this.stages.length - 1, this.currentStage + 1);
        if (newStage !== this.currentStage) this.transitionToStage(newStage);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        const newStage = Math.max(0, this.currentStage - 1);
        if (newStage !== this.currentStage) this.transitionToStage(newStage);
      }
    };
    
    window.addEventListener('keydown', this.keyHandler);
  }

  setupStageIndicators() {
    const indicators = document.querySelectorAll('.stage-indicator');
    indicators.forEach((indicator) => {
      indicator.addEventListener('click', () => {
        const stageIndex = parseInt(indicator.dataset.stage, 10);
        if (!isNaN(stageIndex) && stageIndex !== this.currentStage) {
          this.transitionToStage(stageIndex);
        }
      });
    });
  }

  setupCursorInteraction() {
    // Set up mouse tracking for both rotation and inspection light
    window.addEventListener('mousemove', (e) => {
      // Update rotation target (not during transitions)
      if (this.cursorRotation.enabled && !this.isTransitioning) {
        const centerX = window.innerWidth / 2;
        const normalizedX = (e.clientX - centerX) / centerX;
        this.cursorRotation.target = normalizedX * this.cursorRotation.range;
      }

      // Update inspection light target (always, even during transitions)
      if (this.inspectionLight.enabled) {
        const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
        const normalizedY = -((e.clientY / window.innerHeight) * 2 - 1);
        
        this.inspectionLight.targetX = normalizedX * 3.5;
        this.inspectionLight.targetY = normalizedY * 3;
      }
    });

    // Reset to center when mouse leaves window
    window.addEventListener('mouseleave', () => {
      this.cursorRotation.target = 0;
      if (this.inspectionLight.enabled) {
        this.inspectionLight.targetX = 0;
        this.inspectionLight.targetY = 0;
      }
    });
  }

  transitionToStage(newStage) {
    if (this.isTransitioning || newStage === this.currentStage) return;
    
    // Hide current content first
    this.hideStageContent(this.currentStage);
    
    this.isTransitioning = true;
    
    const toStage = this.stages[newStage];
    const toPart = this.hammerParts[toStage.part];
    
    const duration = 1400; // ms
    const startTime = performance.now();
    
    // Starting values
    const startZ = this.camera.position.z;
    const startLookAtY = this.currentLookAt.y;
    const startRotX = this.hammer.rotation.x;
    const startRotY = this.hammer.rotation.y;
    
    // Target values
    const targetZ = toPart.distance;
    const targetLookAtY = toPart.y;
    const targetRotX = toStage.hammerRotX;
    const targetRotY = toStage.hammerRotY;
    
    const animateTransition = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = this.easeInOutCubic(progress);
      
      // Animate camera distance
      this.camera.position.z = THREE.MathUtils.lerp(startZ, targetZ, eased);
      
      // Animate camera lookAt target (KEY FIX - camera looks at different Y)
      this.currentLookAt.y = THREE.MathUtils.lerp(startLookAtY, targetLookAtY, eased);
      this.camera.lookAt(this.currentLookAt);
      
      // Animate hammer rotation
      this.hammer.rotation.x = THREE.MathUtils.lerp(startRotX, targetRotX, eased);
      this.hammer.rotation.y = THREE.MathUtils.lerp(startRotY, targetRotY, eased);
      
      // Update base rotations for idle animation
      this.baseRotX = this.hammer.rotation.x;
      this.baseRotY = this.hammer.rotation.y;
      
      if (progress < 1) {
        requestAnimationFrame(animateTransition);
      } else {
        this.currentStage = newStage;
        this.isTransitioning = false;
        
        setTimeout(() => {
          this.showStageContent(newStage);
        }, 100);
      }
    };
    
    requestAnimationFrame(animateTransition);
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  showStageContent(stageIndex) {
    const stage = this.stages[stageIndex];
    const contentEl = document.getElementById(stage.content);
    if (contentEl) {
      contentEl.classList.add('visible');
    }
    
    document.querySelectorAll('.stage-indicator').forEach((el, i) => {
      el.classList.toggle('active', i === stageIndex);
    });
  }

  hideStageContent(stageIndex) {
    const stage = this.stages[stageIndex];
    const contentEl = document.getElementById(stage.content);
    if (contentEl) {
      contentEl.classList.remove('visible');
    }
  }

  setupResize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  animate() {
    this.time += 0.016;
    
    if (this.hammer) {
      // Smooth cursor rotation (lerp toward target)
      if (this.cursorRotation.enabled && !this.isTransitioning) {
        this.cursorRotation.current += 
          (this.cursorRotation.target - this.cursorRotation.current) * this.cursorRotation.damping;
      } else {
        // During transitions, ease back to center
        this.cursorRotation.current *= 0.95;
      }

      // Subtle idle breathing animation
      const idleX = Math.sin(this.time * 0.5) * 0.015;
      const idleY = Math.cos(this.time * 0.3) * 0.008;
      
      // Apply rotations: base + idle + cursor
      this.hammer.rotation.x = this.baseRotX + idleX;
      this.hammer.rotation.y = this.baseRotY + idleY + this.cursorRotation.current;
    }

    // Smooth inspection light movement
    if (this.inspectionLight.enabled && this.inspectionLight.light) {
      // Lerp current position toward target
      this.inspectionLight.currentX += 
        (this.inspectionLight.targetX - this.inspectionLight.currentX) * this.inspectionLight.damping;
      this.inspectionLight.currentY += 
        (this.inspectionLight.targetY - this.inspectionLight.currentY) * this.inspectionLight.damping;
      
      // Update light position
      this.inspectionLight.light.position.x = this.inspectionLight.currentX;
      this.inspectionLight.light.position.y = this.inspectionLight.currentY;
      this.inspectionLight.light.position.z = 3;
      
      // DEBUG: Log every 60 frames
      if (Math.floor(this.time * 60) % 60 === 0) {
        console.log('Light pos:', this.inspectionLight.light.position.x.toFixed(2), this.inspectionLight.light.position.y.toFixed(2));
      }
    }
    
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize when 3D mode is active
if (document.documentElement.classList.contains('is-3d')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new HammerNarrative());
  } else {
    new HammerNarrative();
  }
}
