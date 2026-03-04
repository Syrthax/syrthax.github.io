"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FolderOpenDot, Home, Mail, MoonStar, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

function scrollToId(id: string) {
  const node = document.getElementById(id);
  if (node) {
    node.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function FloatingDock() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const initial = (localStorage.getItem("theme") as ThemeMode | null) ?? "light";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    let lastTime = performance.now();
    let stopTimer: ReturnType<typeof setTimeout> | undefined;

    const onScroll = () => {
      const now = performance.now();
      const currentY = window.scrollY;
      const dy = Math.abs(currentY - lastY);
      const dt = Math.max(now - lastTime, 16);
      const velocity = (dy / dt) * 1000;

      if (velocity > 1450) {
        setVisible(false);
      }

      if (stopTimer) clearTimeout(stopTimer);
      stopTimer = setTimeout(() => setVisible(true), 140);

      lastY = currentY;
      lastTime = now;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (stopTimer) clearTimeout(stopTimer);
    };
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const dockItems = [
    { label: "Home", icon: Home, onClick: () => scrollToId("home") },
    { label: "Projects", icon: FolderOpenDot, onClick: () => scrollToId("projects") }
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center">
      <AnimatePresence>
        {visible && (
          <motion.nav
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="glass pointer-events-auto flex w-max items-center gap-1 rounded-full border border-neutral-300/60 px-2 py-2 shadow-dock dark:border-neutral-700/80"
          >
          {dockItems.map((item) => (
            <motion.button
              key={item.label}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
              onClick={item.onClick}
              className="group rounded-full px-3 py-2 text-sm text-muted transition-colors hover:bg-neutral-200/70 hover:text-text dark:hover:bg-neutral-800"
              aria-label={item.label}
            >
              <motion.span
                className="block"
                whileHover={{ y: -1.5 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <item.icon className="h-4 w-4" />
              </motion.span>
            </motion.button>
          ))}

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.97 }}
            onClick={toggleTheme}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-neutral-200/70 hover:text-text dark:hover:bg-neutral-800"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "light" ? (
                <motion.span
                  key="moon"
                  initial={{ opacity: 0, rotate: -40, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 40, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                >
                  <MoonStar className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="sun"
                  initial={{ opacity: 0, rotate: 40, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -40, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                >
                  <SunMedium className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => scrollToId("contact")}
            className="group rounded-full px-3 py-2 text-sm text-muted transition-colors hover:bg-neutral-200/70 hover:text-text dark:hover:bg-neutral-800"
            aria-label="Contact"
          >
            <motion.span
              className="block"
              whileHover={{ y: -1.5 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <Mail className="h-4 w-4" />
            </motion.span>
          </motion.button>
        </motion.nav>
      )}
      </AnimatePresence>
    </div>
  );
}