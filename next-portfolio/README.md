# Sarthak Cinematic Portfolio (Next.js)

A cinematic, scroll-animated developer portfolio inspired by Apple product pages.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Lenis smooth scrolling

## Run locally

1. Install dependencies

```bash
npm install
```

2. Start development server

```bash
npm run dev
```

3. Open http://localhost:3000

## Build for production

```bash
npm run build
npm run start
```

## Project structure

- `app/` App Router pages and global styles
- `components/` UI sections, dock, and animated illustrations
- `lib/content.ts` Project and stack content model

## Notes

- Dock hides on fast scroll and reappears on stop.
- Theme mode persists in `localStorage`.
- Scroll-driven animations use lightweight Framer Motion transforms and SVG placeholders.