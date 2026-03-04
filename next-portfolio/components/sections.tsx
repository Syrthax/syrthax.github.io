"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React from "react";
import { techBadgeGroups, timelineProjects } from "@/lib/content";
import { Reveal } from "./reveal";
import {
  ARCraftIllustration,
  EcommerceIllustration,
  HeroPdfAbstract,
  IDoTimelineIllustration,
  KioskIllustration,
  KioskTimelineIllustration,
  LoadingTipsIllustration,
  NetworkIllustration,
  NutriScanIllustration,
  SouraIllustration,
  TaskSyncIllustration
} from "./illustrations";
import { useRef } from "react";

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.35]);

  return (
    <section id="home" ref={ref} className="section-shell relative min-h-screen py-24">
      <motion.div style={{ y, opacity }} className="grid min-h-[80vh] items-center gap-12 lg:grid-cols-2">
        <div>
          <h1 className="headline">Hi, I&apos;m Sarthak Ghosh</h1>
          <p className="subtle mt-5 max-w-xl">A student and builder from Hyderabad, India.</p>
          <p className="subtle mt-4 max-w-xl">Creator of Kiosk PDF Reader and iDo.</p>
        </div>
        <div className="flex justify-center lg:justify-end">
          <HeroPdfAbstract />
        </div>
      </motion.div>
    </section>
  );
}

export function FeaturedFlagshipsSection() {
  return (
    <section className="section-shell space-y-24 py-28 md:py-36">
      <Reveal>
        <h2 className="headline">Featured Flagships</h2>
      </Reveal>

      <Reveal className="grid items-center gap-12 overflow-hidden rounded-3xl border border-neutral-300/60 p-8 md:grid-cols-[1fr_minmax(320px,420px)] md:p-12 dark:border-neutral-800">
        <div>
          <p className="eyebrow">Kiosk</p>
          <h3 className="mt-4 text-3xl font-semibold">Minimal PDF Reader</h3>
          <p className="subtle mt-4">
            Kiosk is a minimal, fast, open-source PDF reader designed to avoid bloat.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-muted">
            <li>Custom rendering pipeline</li>
            <li>GPU transform zoom</li>
            <li>TriFlow contextual dock</li>
            <li>Desktop and Android support</li>
          </ul>
        </div>
        <div className="flex w-full items-center justify-end">
          <KioskIllustration />
        </div>
      </Reveal>

      <Reveal className="grid gap-12 rounded-3xl border border-neutral-300/60 p-8 md:grid-cols-2 md:p-12 dark:border-neutral-800">
        <div>
          <p className="eyebrow">iDo</p>
          <h3 className="mt-4 text-3xl font-semibold">Ownership-First Productivity</h3>
          <p className="subtle mt-4">
            iDo is a lightweight productivity system that syncs tasks using Google Drive instead of
            centralized servers.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-muted">
            <li>User owns their data</li>
            <li>Cross-device sync</li>
            <li>Minimal productivity workflow</li>
          </ul>
        </div>
        <TaskSyncIllustration />
      </Reveal>
    </section>
  );
}

export function ProjectsTimelineSection() {
  const projectIllustrations: Record<string, React.ReactNode> = {
    "E-commerce Stall Website": <EcommerceIllustration />,
    "ARCraft": <ARCraftIllustration />,
    "Loading Tips": <LoadingTipsIllustration />,
    "NutriScan": <NutriScanIllustration />,
    "iDo": <IDoTimelineIllustration />,
    "Kiosk": <KioskTimelineIllustration />,
    "Soura": <SouraIllustration />
  };
  return (
    <section id="projects" className="section-shell py-28 md:py-36">
      <Reveal>
        <h2 className="headline">Things I&apos;ve Built</h2>
      </Reveal>

      <Reveal className="mt-12">
        <NetworkIllustration />
      </Reveal>

      <div className="mt-16 space-y-8">
        {timelineProjects.map((project, index) => (
          <motion.article
            key={project.title}
            initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.02 }}
            className="grid gap-4 rounded-2xl border border-neutral-300/60 p-6 transition-transform md:grid-cols-[120px_1fr] dark:border-neutral-800"
          >
            <p className="text-sm text-muted">{project.year}</p>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-semibold tracking-tight">{project.title}</h3>
                {project.deprecated && (
                  <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-400">
                    Deprecated
                  </span>
                )}
              </div>
              <p className="subtle mt-2">{project.description}</p>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                >
                  View Project
                  <span aria-hidden="true">→</span>
                </a>
              )}
              {projectIllustrations[project.title] ?? null}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export function TechStackSection() {
  const tones = [
    "from-amber-200 to-orange-300 border-amber-300/70 dark:from-amber-600/35 dark:to-orange-500/35 dark:border-amber-500/30",
    "from-sky-200 to-blue-300 border-sky-300/70 dark:from-sky-600/35 dark:to-blue-500/35 dark:border-sky-500/30",
    "from-purple-200 to-fuchsia-300 border-purple-300/70 dark:from-purple-600/35 dark:to-fuchsia-500/35 dark:border-purple-500/30",
    "from-emerald-200 to-green-300 border-emerald-300/70 dark:from-emerald-600/35 dark:to-green-500/35 dark:border-emerald-500/30",
    "from-rose-200 to-pink-300 border-rose-300/70 dark:from-rose-600/35 dark:to-pink-500/35 dark:border-rose-500/30",
    "from-cyan-200 to-indigo-300 border-cyan-300/70 dark:from-cyan-600/35 dark:to-indigo-500/35 dark:border-cyan-500/30"
  ];

  return (
    <section className="section-shell py-28 md:py-36">
      <Reveal>
        <h2 className="headline">Tools I&apos;ve used / explored / am learning</h2>
      </Reveal>

      <div className="mt-14 space-y-8">
        {techBadgeGroups.map((category, sectionIndex) => (
          <Reveal
            key={category.group}
            delay={sectionIndex * 0.05}
            className="rounded-2xl border border-neutral-300/60 p-6 dark:border-neutral-800"
          >
            <p className="eyebrow">{category.group}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {category.items.map((item, itemIndex) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.45, delay: itemIndex * 0.05 }}
                  whileHover={{ y: -3, scale: 1.03 }}
                  className="group flex items-center gap-3 rounded-xl border border-neutral-200/70 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-800 transition-transform dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-200"
                >
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-md border bg-gradient-to-br text-[10px] font-semibold tracking-wide text-neutral-800 dark:text-neutral-100 ${tones[itemIndex % tones.length]}`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.name}</span>
                </motion.div>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function PhilosophySection() {
  return (
    <section className="section-shell py-28 md:py-36">
      <Reveal>
        <p className="eyebrow">Philosophy</p>
        <p className="mt-6 max-w-4xl text-3xl font-medium leading-tight tracking-tight md:text-5xl">
          I build tools that are simple, fast, and useful in everyday life.
        </p>
      </Reveal>
    </section>
  );
}

export function ContactSection() {
  const links = [
    { label: "GitHub", href: "https://github.com/Syrthax" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/sarthak-g11/" },
    { label: "Email", href: "https://contact.sarthakg.tech" }
  ];

  return (
    <section id="contact" className="section-shell pb-40 pt-24 md:pt-28">
      <Reveal>
        <h2 className="headline max-w-2xl">Let&apos;s build something interesting.</h2>
      </Reveal>

      <div className="mt-10 flex flex-wrap gap-4">
        {links.map((link, index) => (
          <motion.a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            whileHover={{ y: -3 }}
            className="rounded-full border border-neutral-300/70 px-6 py-3 text-sm text-text transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
          >
            {link.label}
          </motion.a>
        ))}
      </div>
    </section>
  );
}