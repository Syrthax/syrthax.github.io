"use client";

import { MotionValue, motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

// -------------------------------------------------------------------
// Unified entrance shell — fade in + slide up when entering viewport.
// Used by every illustration for consistent timing.
// -------------------------------------------------------------------
function IllustrationShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

type TaskChecklistItemProps = {
  label: string;
  index: number;
  scrollYProgress: MotionValue<number>;
};

function TaskChecklistItem({ label, index, scrollYProgress }: TaskChecklistItemProps) {
  const itemStart = 0.15 + index * 0.18;
  const itemEnd = itemStart + 0.2;
  const opacity = useTransform(scrollYProgress, [itemStart, itemEnd], [0.25, 1]);
  const y = useTransform(scrollYProgress, [itemStart, itemEnd], [16, 0]);
  const checked = useTransform(
    scrollYProgress,
    [0.56, 0.7, 0.82],
    index === 1 ? [0, 1, 1] : [0, 0, 0]
  );
  const fadeTask = useTransform(
    scrollYProgress,
    [0.56, 0.7, 0.82],
    index === 1 ? [1, 0.55, 0.55] : [1, 1, 1]
  );

  return (
    <motion.div
      style={{ opacity, y }}
      className="flex items-center gap-3 rounded-lg border border-blue-100 px-3 py-3 dark:border-blue-500/30"
    >
      <motion.div
        style={{ opacity: fadeTask }}
        className="relative h-5 w-5 rounded-full border border-blue-400 dark:border-blue-400"
      >
        <motion.svg
          viewBox="0 0 24 24"
          className="absolute inset-0 h-full w-full text-blue-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path d="M5 12l4 4 10-10" initial={{ pathLength: 0 }} style={{ pathLength: checked }} />
        </motion.svg>
      </motion.div>
      <motion.p style={{ opacity: fadeTask }} className="text-sm text-neutral-700 dark:text-neutral-200">
        {label}
      </motion.p>
    </motion.div>
  );
}

export function HeroPdfAbstract() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [14, -26]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-8, 10]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1.03]);
  const sharpen = useTransform(scrollYProgress, [0, 1], ["blur(5px)", "blur(0px)"]);

  return (
    <motion.div ref={ref} style={{ y }} className="relative h-[340px] w-full max-w-xl">
      {[
        { left: "22%", top: "24%", delay: 0.2 },
        { left: "72%", top: "26%", delay: 0.45 },
        { left: "18%", top: "70%", delay: 0.65 },
        { left: "80%", top: "72%", delay: 0.8 },
        { left: "56%", top: "14%", delay: 0.55 }
      ].map((seed, index) => (
        <motion.span
          key={index}
          className="absolute h-1.5 w-1.5 rounded-full bg-neutral-800/55 dark:bg-neutral-100/50"
          style={{ left: seed.left, top: seed.top }}
          animate={{ y: [0, -7, 0], opacity: [0.3, 0.75, 0.3] }}
          transition={{ duration: 2.8, delay: seed.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <motion.svg
        viewBox="0 0 420 320"
        className="absolute left-1/2 top-1/2 h-[300px] w-[320px] -translate-x-1/2 -translate-y-1/2"
        style={{ rotate, scale, filter: sharpen, transformOrigin: "50% 50%" }}
      >
        <defs>
          <linearGradient id="fruitSkin" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="60%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#a21caf" />
          </linearGradient>
          <linearGradient id="fruitHighlight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <ellipse cx="210" cy="162" rx="104" ry="122" fill="url(#fruitSkin)" />
        <ellipse cx="178" cy="118" rx="38" ry="46" fill="url(#fruitHighlight)" />

        {[
          "M158 88 C132 78, 122 58, 142 44 C156 50, 168 63, 168 78",
          "M126 128 C94 126, 78 104, 88 82 C112 88, 124 102, 132 118",
          "M122 198 C88 210, 72 242, 90 260 C112 250, 126 228, 130 206",
          "M176 244 C166 274, 178 296, 202 298 C208 276, 202 258, 190 242",
          "M236 246 C252 276, 282 286, 306 272 C296 248, 272 238, 248 236",
          "M290 198 C324 210, 344 244, 328 266 C302 252, 290 230, 286 206",
          "M286 126 C320 120, 338 94, 326 72 C300 82, 288 98, 282 116",
          "M248 82 C264 58, 290 44, 314 52 C304 76, 282 86, 260 90"
        ].map((leafPath, index) => (
          <path key={index} d={leafPath} fill="#22c55e" opacity="0.9" />
        ))}

        {[
          [180, 118],
          [210, 106],
          [236, 122],
          [168, 156],
          [198, 150],
          [230, 152],
          [252, 162],
          [170, 190],
          [200, 184],
          [232, 190],
          [252, 202],
          [192, 216],
          [224, 220]
        ].map(([x, yPos], index) => (
          <circle key={index} cx={x} cy={yPos} r="2.3" fill="#111827" opacity="0.7" />
        ))}
      </motion.svg>
    </motion.div>
  );
}

export function KioskIllustration() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const stackY = useTransform(scrollYProgress, [0, 1], [38, -96]);
  const zoom = useTransform(scrollYProgress, [0, 1], [0.96, 1.03]);
  const sharpen = useTransform(scrollYProgress, [0, 1], ["blur(4px)", "blur(0px)"]);

  return (
    <IllustrationShell className="relative flex h-80 w-full items-center justify-end overflow-hidden">
      <div ref={ref} className="relative h-80 w-full">
        <motion.div
          style={{ scale: zoom }}
          className="relative h-64 w-full max-w-md rounded-2xl border border-red-200 bg-white p-4 shadow-xl transition-colors duration-300 dark:border-red-500/40 dark:bg-black"
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/85" />
            <span className="h-2.5 w-2.5 rounded-full bg-red-300 dark:bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-red-200 dark:bg-red-500/50" />
            <div className="ml-2 h-2.5 w-28 rounded-full bg-red-100 dark:bg-red-900/40" />
          </div>

          <div className="relative h-[210px] overflow-hidden rounded-xl border border-red-100 bg-red-50/40 dark:border-red-500/30 dark:bg-red-950/25">
            {[0, 1, 2, 3, 4].map((page) => (
              <motion.div
                key={page}
                style={{ y: stackY, filter: sharpen, top: 24 + page * 48 }}
                className="absolute left-1/2 h-36 w-[86%] -translate-x-1/2 rounded-lg border border-red-200/80 bg-white p-3 shadow-sm dark:border-red-500/30 dark:bg-neutral-900"
                initial={{ opacity: 0.55 }}
                whileInView={{ opacity: 0.95 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: page * 0.05 }}
              >
                <div className="h-2.5 w-28 rounded bg-red-200/80 dark:bg-red-500/45" />
                <div className="mt-2 h-2.5 w-20 rounded bg-red-100 dark:bg-red-500/30" />
                <div className="mt-5 h-14 rounded bg-red-50 dark:bg-red-950/60" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0, 1], [0.2, 0.8]) }}
          className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_70%_20%,rgba(239,68,68,0.18),transparent_40%)]"
        />
      </div>
    </IllustrationShell>
  );
}

export function TaskSyncIllustration() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <IllustrationShell>
    <div ref={ref} className="relative h-80 w-full">
      <div className="absolute left-1/2 top-1/2 h-64 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-blue-200 bg-white p-4 shadow-xl transition-colors duration-300 dark:border-blue-500/35 dark:bg-black">
        <div className="mb-4 h-3 w-32 rounded-full bg-blue-100 dark:bg-blue-900/45" />
        <div className="space-y-3">
          {["Sync iDo roadmap", "Ship focused sprint", "Review completed tasks"].map((label, index) => (
            <TaskChecklistItem
              key={label}
              label={label}
              index={index}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>

      <motion.div
        style={{ opacity: useTransform(scrollYProgress, [0, 1], [0.2, 0.78]) }}
        className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_75%_20%,rgba(59,130,246,0.2),transparent_40%)]"
      />
    </div>
    </IllustrationShell>
  );
}

export function NetworkIllustration() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 30%"] });
  const pathLength = useTransform(scrollYProgress, [0, 0.7], [0, 1]);

  return (
    <div ref={ref} className="relative h-52 w-full">
      {[
        "16%",
        "42%",
        "70%",
        "85%"
      ].map((left, index) => (
        <motion.div
          key={left}
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-neutral-900 dark:bg-neutral-100"
          style={{ left }}
          initial={{ scale: 0.4, opacity: 0.2 }}
          whileInView={{ scale: 1, opacity: 0.8 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: index * 0.12 }}
        />
      ))}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 220" fill="none">
        <motion.path
          d="M128 110 L336 110 L560 110 L680 110"
          stroke="rgb(163 163 163)"
          strokeWidth="1.5"
          style={{ pathLength }}
        />
      </svg>
    </div>
  );
}

export function SouraIllustration() {
  const ref = useRef<HTMLDivElement>(null);
  // Use a wider scroll range so the animation plays fully in-view
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 30%"] });

  // File travels from left-4 (≈16px) toward the download box right edge.
  // The inner container is max-w-md (448px) – download box is right-3 + w-24 = 108px from right.
  // Target left edge of download box ≈ 448 - 12 - 96 = 340px → travel ≈ 340 - 16 = 324px.
  // We use 240 to stay conservative across smaller containers, with overflow-hidden clipping.
  const dragX = useTransform(scrollYProgress, [0, 0.5, 0.82, 1], [0, 100, 240, 240]);
  const dragY = useTransform(scrollYProgress, [0, 0.5, 0.82, 1], [0, 12, 36, 36]);
  const fileScale = useTransform(scrollYProgress, [0.75, 1], [1, 0.82]);
  const fileOpacity = useTransform(scrollYProgress, [0, 0.78, 1], [1, 1, 0.05]);
  const dropPulse = useTransform(scrollYProgress, [0.7, 0.88, 1], [1, 1.1, 1.02]);
  const glowOpacity = useTransform(scrollYProgress, [0.75, 1], [0, 0.92]);
  const startedOpacity = useTransform(scrollYProgress, [0.82, 1], [0, 1]);
  const startedY = useTransform(scrollYProgress, [0.82, 1], [8, 0]);

  return (
    <IllustrationShell>
      <div
        ref={ref}
        className="relative mt-4 h-40 w-full max-w-md rounded-xl border border-neutral-200 bg-white p-3 transition-colors duration-300 dark:border-neutral-800 dark:bg-black"
      >
        {/* Browser chrome dots */}
        <div className="mb-2 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-neutral-400 dark:bg-neutral-600" />
          <span className="h-2 w-2 rounded-full bg-neutral-400 dark:bg-neutral-600" />
          <span className="h-2 w-2 rounded-full bg-neutral-400 dark:bg-neutral-600" />
        </div>

        {/* Canvas area */}
        <div className="relative h-[108px] overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900">
          {/* Drop zone – right side */}
          <motion.div
            style={{ scale: dropPulse }}
            className="absolute bottom-3 right-3 flex h-12 w-24 origin-center items-center justify-center rounded-md border border-neutral-300 text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400"
          >
            Download
          </motion.div>

          {/* Drop zone glow overlay */}
          <motion.div
            style={{ opacity: glowOpacity }}
            className="pointer-events-none absolute bottom-1 right-1 h-16 w-28 rounded-lg bg-blue-400/25 blur-md"
          />

          {/* Draggable file – starts top-left, travels to drop zone */}
          <motion.div
            style={{ x: dragX, y: dragY, scale: fileScale, opacity: fileOpacity }}
            className="absolute left-4 top-3 flex h-9 w-[4.2rem] flex-col items-start justify-center rounded-md border border-blue-300 bg-blue-100 px-2 text-[9px] font-medium text-blue-700 shadow-sm dark:border-blue-500/40 dark:bg-blue-950/50 dark:text-blue-300"
          >
            image.png
          </motion.div>

          {/* Download started badge */}
          <motion.div
            style={{ opacity: startedOpacity, y: startedY }}
            className="absolute right-2 top-2 rounded-md border border-blue-300/70 bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700 dark:border-blue-500/45 dark:bg-blue-950/60 dark:text-blue-300"
          >
            Download Started
          </motion.div>
        </div>
      </div>
    </IllustrationShell>
  );
}

// -------------------------------------------------------------------
// Per-project timeline illustrations
// -------------------------------------------------------------------

function EcommerceOrderRow({
  row,
  index,
  scrollYProgress,
  color,
}: {
  row: string;
  index: number;
  scrollYProgress: MotionValue<number>;
  color: string;
}) {
  const opacity = useTransform(scrollYProgress, [0.1 + index * 0.18, 0.35 + index * 0.18], [0, 1]);
  const x = useTransform(scrollYProgress, [0.1 + index * 0.18, 0.35 + index * 0.18], [-14, 0]);
  return (
    <motion.div
      style={{ opacity, x }}
      className="flex items-center justify-between rounded-lg border border-neutral-200/70 bg-neutral-100 px-3 py-2 text-[11px] dark:border-neutral-700 dark:bg-neutral-900"
    >
      <span className="text-neutral-700 dark:text-neutral-300">{row}</span>
      <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
    </motion.div>
  );
}

export function EcommerceIllustration() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 30%"] });
  const orders = [
    { row: "Order #102 — placed", color: "bg-amber-400" },
    { row: "Order #101 — shipped", color: "bg-blue-400" },
    { row: "Order #100 — delivered", color: "bg-emerald-400" },
  ];
  return (
    <IllustrationShell className="mt-5 w-full max-w-xs">
      <div ref={ref} className="rounded-xl border border-neutral-200 bg-white p-3 transition-colors duration-300 dark:border-neutral-800 dark:bg-black">
        <div className="mb-3 h-2.5 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="space-y-2">
          {orders.map((order, i) => (
            <EcommerceOrderRow
              key={order.row}
              row={order.row}
              index={i}
              scrollYProgress={scrollYProgress}
              color={order.color}
            />
          ))}
        </div>
      </div>
    </IllustrationShell>
  );
}

function NutriDataRow({
  label,
  val,
  color,
  index,
  scrollYProgress,
}: {
  label: string;
  val: string;
  color: string;
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const opacity = useTransform(scrollYProgress, [0.25 + index * 0.15, 0.45 + index * 0.15], [0, 1]);
  const x = useTransform(scrollYProgress, [0.25 + index * 0.15, 0.45 + index * 0.15], [12, 0]);
  return (
    <motion.div
      style={{ opacity, x }}
      className="flex items-center justify-between rounded-md border border-neutral-200 bg-neutral-100 px-2 py-1 text-[10px] dark:border-neutral-700 dark:bg-neutral-900"
    >
      <span className="text-neutral-600 dark:text-neutral-400">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
        <span className="font-medium text-neutral-800 dark:text-neutral-200">{val}</span>
      </div>
    </motion.div>
  );
}

export function NutriScanIllustration() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 30%"] });
  const scanY = useTransform(scrollYProgress, [0, 0.5, 1], [-20, 20, -20]);
  const nutrients = [
    { label: "Calories", val: "210 kcal", color: "bg-orange-400" },
    { label: "Protein", val: "8 g", color: "bg-blue-400" },
    { label: "Carbs", val: "32 g", color: "bg-amber-400" },
  ];
  return (
    <IllustrationShell className="mt-5 w-full max-w-xs">
      <div ref={ref} className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-3 transition-colors duration-300 dark:border-neutral-800 dark:bg-black">
        {/* Phone outline */}
        <div className="relative flex h-24 w-12 flex-none items-center justify-center rounded-xl border-2 border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900">
          {/* scan line */}
          <motion.div
            className="absolute h-0.5 w-10 rounded bg-emerald-500/80"
            style={{ y: scanY }}
          />
          <div className="absolute bottom-2 h-1 w-5 rounded bg-neutral-300 dark:bg-neutral-700" />
        </div>
        {/* Nutrition data */}
        <div className="flex-1 space-y-2 pt-0.5">
          {nutrients.map((n, i) => (
            <NutriDataRow key={n.label} label={n.label} val={n.val} color={n.color} index={i} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </IllustrationShell>
  );
}
// ─── Three new timeline illustrations ───────────────────────────────────────

export function KioskTimelineIllustration() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 30%"] });
  const pagesY = useTransform(scrollYProgress, [0, 1], [0, -52]);
  const blur = useTransform(scrollYProgress, [0, 1], ["blur(3px)", "blur(0px)"]);

  return (
    <IllustrationShell className="mt-5 w-full max-w-xs">
      <div
        ref={ref}
        className="overflow-hidden rounded-xl border border-neutral-200 bg-white transition-colors duration-300 dark:border-neutral-800 dark:bg-black"
      >
        {/* Laptop lid */}
        <div className="flex items-center gap-1.5 border-b border-neutral-200 px-3 py-2 dark:border-neutral-800">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <div className="ml-2 h-2 w-20 rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
        {/* PDF viewport */}
        <div className="relative h-28 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
          {[0, 1, 2].map((p) => (
            <motion.div
              key={p}
              style={{ y: pagesY, filter: blur, top: 10 + p * 40 }}
              className="absolute left-1/2 w-[78%] -translate-x-1/2 rounded-md border border-red-200/70 bg-white p-2 shadow-sm dark:border-red-500/25 dark:bg-neutral-950"
            >
              <div className="h-1.5 w-16 rounded bg-red-200/80 dark:bg-red-500/40" />
              <div className="mt-1.5 h-1.5 w-10 rounded bg-red-100 dark:bg-red-500/25" />
              <div className="mt-3 h-7 rounded bg-neutral-100 dark:bg-neutral-800/60" />
            </motion.div>
          ))}
        </div>
      </div>
    </IllustrationShell>
  );
}

function IDoChecklistRow({
  task,
  index,
  scrollYProgress,
}: {
  task: string;
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const itemOpacity = useTransform(
    scrollYProgress,
    [0.1 + index * 0.15, 0.28 + index * 0.15],
    [0.2, 1]
  );
  const itemY = useTransform(
    scrollYProgress,
    [0.1 + index * 0.15, 0.28 + index * 0.15],
    [10, 0]
  );
  const checkPath = useTransform(
    scrollYProgress,
    [0.48, 0.65],
    index === 1 ? [0, 1] : [0, 0]
  );
  const taskOpacity = useTransform(
    scrollYProgress,
    [0.55, 0.72],
    index === 1 ? [1, 0.45] : [1, 1]
  );
  return (
    <motion.div
      style={{ opacity: itemOpacity, y: itemY }}
      className="flex items-center gap-2.5 rounded-lg border border-blue-100/80 px-3 py-2 dark:border-blue-500/20"
    >
      <div className="relative h-4 w-4 flex-none rounded-full border border-blue-400 dark:border-blue-500">
        <svg
          viewBox="0 0 24 24"
          className="absolute inset-0 h-full w-full text-blue-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d="M5 12l4 4 10-10"
            initial={{ pathLength: 0 }}
            style={{ pathLength: checkPath }}
          />
        </svg>
      </div>
      <motion.span
        style={{ opacity: taskOpacity }}
        className="text-[11px] text-neutral-700 dark:text-neutral-300"
      >
        {task}
      </motion.span>
    </motion.div>
  );
}

export function IDoTimelineIllustration() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 30%"] });
  const tasks = ["Design system tokens", "Ship iDo v1.2", "Write changelog"];
  return (
    <IllustrationShell className="mt-5 w-full max-w-xs">
      <div
        ref={ref}
        className="rounded-xl border border-neutral-200 bg-white p-3 transition-colors duration-300 dark:border-neutral-800 dark:bg-black"
      >
        <div className="mb-3 h-2.5 w-20 rounded bg-blue-100 dark:bg-blue-900/40" />
        <div className="space-y-2.5">
          {tasks.map((task, i) => (
            <IDoChecklistRow key={task} task={task} index={i} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </IllustrationShell>
  );
}

function LoadingTipCard({
  w,
  sub,
  index,
  scrollYProgress,
}: {
  w: string;
  sub: string;
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const opacity = useTransform(scrollYProgress, [0.1 + index * 0.2, 0.35 + index * 0.2], [0, 1]);
  const y = useTransform(scrollYProgress, [0.1 + index * 0.2, 0.35 + index * 0.2], [12, 0]);
  return (
    <motion.div
      style={{ opacity, y }}
      className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2.5 dark:border-neutral-800 dark:bg-neutral-950"
    >
      <div className={`h-2 ${w} rounded bg-neutral-300 dark:bg-neutral-700`} />
      <div className={`mt-1.5 h-1.5 ${sub} rounded bg-neutral-200 dark:bg-neutral-800`} />
    </motion.div>
  );
}

export function LoadingTipsIllustration() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 30%"] });
  const cards = [
    { w: "w-44", sub: "w-28" },
    { w: "w-36", sub: "w-24" },
    { w: "w-40", sub: "w-20" },
  ];
  return (
    <IllustrationShell className="mt-5 w-full max-w-xs">
      <div ref={ref} className="overflow-hidden rounded-xl border border-neutral-200 bg-white transition-colors duration-300 dark:border-neutral-800 dark:bg-black">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-3 py-2 dark:border-neutral-900">
          <div className="h-2 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-2 w-8 rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
        {/* Article cards */}
        <div className="space-y-2 p-3">
          {cards.map((card, i) => (
            <LoadingTipCard key={i} w={card.w} sub={card.sub} index={i} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </IllustrationShell>
  );
}
export function ARCraftIllustration() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 30%"] });
  const cubeY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -7, 0]);
  const cubeRotate = useTransform(scrollYProgress, [0, 1], [0, 12]);

  return (
    <IllustrationShell className="mt-5 w-full max-w-xs">
      <div ref={ref} className="relative h-28 w-full rounded-xl border border-neutral-200 bg-white transition-colors duration-300 dark:border-neutral-800 dark:bg-black">
        {/* Ground plane */}
        <svg viewBox="0 0 300 112" className="absolute inset-0 h-full w-full" fill="none">
          <ellipse cx="150" cy="88" rx="80" ry="14" stroke="rgb(163 163 163)" strokeWidth="1" strokeDasharray="4 4" />
          {/* AR anchor cross */}
          <line x1="126" y1="88" x2="174" y2="88" stroke="rgb(163 163 163)" strokeWidth="1" />
          <line x1="150" y1="76" x2="150" y2="100" stroke="rgb(163 163 163)" strokeWidth="1" />
          {/* Corner brackets */}
          {([[38, 18], [238, 18], [38, 94], [238, 94]] as [number, number][]).map(([x, y], i) => {
            const dx = i % 2 === 0 ? 10 : -10;
            const dy = i < 2 ? 10 : -10;
            return (
              <g key={i}>
                <line x1={x} y1={y} x2={x + dx} y2={y} stroke="#6366f1" strokeWidth="1.5" />
                <line x1={x} y1={y} x2={x} y2={y + dy} stroke="#6366f1" strokeWidth="1.5" />
              </g>
            );
          })}
        </svg>
        {/* Floating AR cube */}
        <motion.svg
          viewBox="0 0 60 60"
          className="absolute left-1/2 top-6 h-14 w-14 -translate-x-1/2"
          style={{ y: cubeY, rotate: cubeRotate }}
        >
          {/* simple isometric box */}
          <polygon points="30,4 54,17 54,43 30,56 6,43 6,17" fill="#6366f1" fillOpacity="0.25" stroke="#6366f1" strokeWidth="1.5" />
          <line x1="30" y1="4" x2="30" y2="30" stroke="#6366f1" strokeWidth="1" />
          <line x1="6" y1="17" x2="30" y2="30" stroke="#6366f1" strokeWidth="1" />
          <line x1="54" y1="17" x2="30" y2="30" stroke="#6366f1" strokeWidth="1" />
        </motion.svg>
      </div>
    </IllustrationShell>
  );
}