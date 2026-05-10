export interface LabProject {
  title: string;
  tagline: string;
  description: string;
  year: string;
  link: string;
  highlights: string[];
  deprecated?: boolean;
}

export const labProjects: LabProject[] = [
  {
    title: "Kiosk",
    tagline: "Minimal PDF Reader",
    description:
      "A fast, open-source PDF reader built to avoid bloat — a custom rendering pipeline, GPU transform zoom, and the TriFlow contextual dock. Ships on desktop and Android.",
    year: "Dec 2025",
    link: "https://krisplabs.me/Kiosk/",
    highlights: ["Custom rendering pipeline", "GPU transform zoom", "TriFlow contextual dock", "Desktop + Android"]
  },
  {
    title: "Kiosk Scholar",
    tagline: "Offline document intelligence",
    description:
      "A local LLM-powered tool that analyses PDFs, surfaces insights, and lets you chat with your documents — entirely offline. Tauri wrapping a FastAPI + Ollama backend.",
    year: "Mar 2026",
    link: "https://krisplabs.me/Kiosk-Scholar/",
    highlights: ["Runs fully offline", "Local LLM (Ollama)", "PyMuPDF text extraction", "Chat with your PDFs"]
  },
  {
    title: "iDo",
    tagline: "Ownership-first productivity",
    description:
      "A lightweight task system that syncs through your own Google Drive instead of centralized servers. You own your data, on every device.",
    year: "Dec 2025",
    link: "https://krisplabs.me/ido/",
    highlights: ["You own your data", "Cross-device sync via Google Drive", "OAuth 2.0 PKCE — no backend", "Desktop, Android, Web"]
  },
  {
    title: "NutriScan",
    tagline: "Nutrition at a glance",
    description:
      "A nutrition scanner powered by the Open Food Facts API — scan a product, get the breakdown.",
    year: "Nov 2025 – Jan 2026",
    link: "https://krisplabs.me/NutriScan/",
    highlights: ["Open Food Facts API", "Instant product breakdown", "Lightweight web app"],
    deprecated: true
  },
  {
    title: "Soura",
    tagline: "Drag-and-drop downloads",
    description:
      "A Chrome extension (Manifest V3) that makes downloading files effortless — drag items onto a drop zone and they're saved.",
    year: "Aug 2025",
    link: "https://krisplabs.me/soura/",
    highlights: ["Manifest V3 extension", "Drag-and-drop drop zone", "Zero-friction downloads"]
  }
];

export const focusAreas = [
  {
    title: "Local-first",
    body: "Software that keeps working without a server. Your data lives with you — in your Drive, on your disk, in your browser."
  },
  {
    title: "Minimal by default",
    body: "No bloat, no dark patterns. Each tool does one thing and does it fast."
  },
  {
    title: "Cross-platform",
    body: "One idea, every surface — desktop, Android, web, browser extensions. Build once, run where people are."
  }
];

export const techBadgeGroups = [
  {
    group: "Languages",
    items: [
      { name: "Python", icon: "Py" },
      { name: "Rust", icon: "Rs" },
      { name: "TypeScript", icon: "TS" },
      { name: "JavaScript", icon: "JS" },
      { name: "Kotlin", icon: "Kt" },
      { name: "C++", icon: "C+" }
    ]
  },
  {
    group: "Frameworks / Libraries",
    items: [
      { name: "Next.js", icon: "Nx" },
      { name: "React", icon: "Re" },
      { name: "Tauri", icon: "Ta" },
      { name: "FastAPI", icon: "Fa" },
      { name: "Node.js", icon: "Nd" }
    ]
  },
  {
    group: "Infra / Tools",
    items: [
      { name: "Ollama", icon: "Ol" },
      { name: "Cloudflare", icon: "Cf" },
      { name: "Google Cloud", icon: "Gc" },
      { name: "Docker", icon: "Dk" },
      { name: "Git", icon: "Gt" },
      { name: "Linux", icon: "Lx" }
    ]
  }
] as const;
