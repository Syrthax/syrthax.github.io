# KrispLabs (Next.js)

The KrispLabs studio site — same cinematic, scroll-animated style as the personal portfolio it was forked from. Showcases the labs' projects: Kiosk, Kiosk Scholar, iDo, NutriScan, and Soura.

## Stack

- Next.js (App Router, static export)
- TypeScript
- Tailwind CSS
- Framer Motion
- Lenis smooth scrolling

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build for production (static export)

```bash
npm run build
```

Output is written to `out/`.

## Project structure

- `app/` App Router pages and global styles
- `components/` UI sections, dock, and animated illustrations
- `lib/content.ts` Project and stack content model

## Notes

- Dock hides on fast scroll and reappears on stop.
- Theme mode persists in `localStorage`.
- Scroll-driven animations use lightweight Framer Motion transforms and SVG placeholders.
