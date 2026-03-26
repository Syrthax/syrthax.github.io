export interface TimelineProject {
  title: string;
  description: string;
  year: string;
  link: string;
  deprecated?: boolean;
}

export const timelineProjects: TimelineProject[] = [
  {
    title: "Kiosk Scholar",
    description:
      "Local LLM-powered PDF tool that analyses documents, surfaces insights, and lets you chat with your PDFs — entirely offline.",
    year: "Mar 2026",
    link: "https://sarthakg.tech/Kiosk-Scholar"
  },
  {
    title: "E-commerce Stall Website",
    description: "Handled 50+ orders in a college stall using Cloudflare Workers.",
    year: "Feb 2026",
    link: "https://github.com/Syrthax/Abstract-Realms"
  },
  {
    title: "ARCraft",
    description: "Augmented reality experimentation project.",
    year: "Feb 2026",
    link: "https://github.com/Syrthax/arcraft"
  },
  {
    title: "Loading Tips",
    description:
      "A personal blog where I write about development, debugging, and lessons learned while building projects. Uses GitHub as the backend — articles are fetched via a GitHub PAT.",
    year: "Jan 2026",
    link: "https://sarthakg.tech/Loading-tips/"
  },
  {
    title: "NutriScan",
    description: "Nutrition scanner powered by the Open Food Facts API.",
    year: "Nov 2025 – Jan 2026",
    link: "https://sarthakg.tech/NutriScan/",
    deprecated: true
  },
  {
    title: "iDo",
    description: "Task system with Google Drive sync.",
    year: "Dec 2025",
    link: "https://sarthakg.tech/ido/"
  },
  {
    title: "Kiosk",
    description: "Minimal PDF reader with custom rendering architecture.",
    year: "Dec 2025",
    link: "https://sarthakg.tech/Kiosk/"
  },
  {
    title: "Soura",
    description:
      "Chrome extension that lets users download files easily by dragging and dropping items onto a drop zone.",
    year: "Aug 2025",
    link: "https://sarthakg.tech/soura/"
  }
];

export const techBadgeGroups = [
  {
    group: "Languages",
    items: [
      { name: "Python", icon: "Py" },
      { name: "C", icon: "C" },
      { name: "C++", icon: "C+" },
      { name: "Rust", icon: "Rs" },
      { name: "Java", icon: "Ja" },
      { name: "Kotlin", icon: "Kt" },
      { name: "JavaScript", icon: "JS" },
      { name: "TypeScript", icon: "TS" },
      { name: "HTML", icon: "H5" },
      { name: "CSS", icon: "CS" }
    ]
  },
  {
    group: "Frameworks / Libraries",
    items: [
      { name: "React", icon: "Re" },
      { name: "Flutter", icon: "Fl" },
      { name: "Next.js", icon: "Nx" },
      { name: "Node.js", icon: "Nd" }
    ]
  },
  {
    group: "Tools",
    items: [
      { name: "Git", icon: "Gt" },
      { name: "Docker", icon: "Dk" },
      { name: "Cloudflare", icon: "Cf" },
      { name: "Google Cloud", icon: "Gc" },
      { name: "Figma", icon: "Fg" },
      { name: "Linux", icon: "Lx" }
    ]
  }
] as const;