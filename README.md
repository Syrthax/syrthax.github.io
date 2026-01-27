# Omni — Portfolio Site

Liquid-glass portfolio with a 3D hammer narrative (Three.js) and a clean 2D fallback. Ships as static HTML/CSS/JS and runs on GitHub Pages.

## Highlights
- 3D hammer story with stage-based camera moves (intro → projects → skills)
- View toggle in the dock: full dock in 2D, minimal (toggle-only) dock in 3D
- Model loading progress bar; stage content waits until the GLB is fully loaded
- Smooth scroll/cursor interactions, idle motion, and responsive layout
- Light/dark theme toggle available in 2D mode

## Quick start (local)
1) Clone and install deps (none required). Just serve statically.
2) Run any static server from the project root, for example:
	- `python -m http.server 4173`
	- or `npx serve .`
3) Open `http://localhost:4173` (or the served URL). 3D loads automatically on capable devices; otherwise the 2D view stays active.

## Controls
- Scroll / touch swipe / arrow keys: advance the 3D stages
- Dock view toggle: switch 2D ↔ 3D
- Theme toggle: light/dark (2D only)

## Deployment
- Pushing to `main` on `github-io` (`https://github.com/Syrthax/syrthax.github.io`) updates the live site.
- Assets (including the hammer GLB) live in `assets/`.

## Notes
- Requires WebGL for 3D; gracefully falls back to 2D on unsupported devices.
- Stage content is gated until the 3D model finishes loading to avoid flashes.
