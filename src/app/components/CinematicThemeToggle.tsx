/**
 * CinematicThemeToggle — intentional exception to the 200–500ms rule.
 * This is the product's signature interaction; longer duration is deliberate.
 * All other animations respect prefers-reduced-motion; this one skips entirely.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { DUR, EASE } from "../lib/motion";

// Fewer stars = better perf on low-end devices; still visually dense
const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: `${(3 + Math.random() * 88).toFixed(1)}%`,
  y: `${(3 + Math.random() * 60).toFixed(1)}%`,
  r: +(0.8 + Math.random() * 1.5).toFixed(1),
  delay: +(Math.random() * 0.75).toFixed(2),
  opacity: +(0.5 + Math.random() * 0.5).toFixed(2),
}));

type Phase = "idle" | "in" | "out";

interface Props { className?: string }

export default function CinematicThemeToggle({ className = "" }: Props) {
  const { theme, toggleTheme } = useTheme() as { theme: string; toggleTheme: () => void };
  const isDark = theme === "dark";
  const prefersReduced = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("idle");
  const [goingDark, setGoingDark] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const trigger = useCallback(() => {
    if (phase !== "idle") return;

    // Respect reduced-motion: skip overlay, toggle immediately
    if (prefersReduced) { toggleTheme(); return; }

    setGoingDark(!isDark);
    setPhase("in");
    const t1 = setTimeout(() => toggleTheme(), 780);
    const t2 = setTimeout(() => setPhase("out"), 1150);
    const t3 = setTimeout(() => setPhase("idle"), 1800);
    timers.current = [t1, t2, t3];
  }, [phase, isDark, toggleTheme, prefersReduced]);

  useEffect(() => () => clearAllTimers(), []);

  const showOverlay = phase === "in" || phase === "out";

  return (
    <>
      <button
        onClick={trigger}
        disabled={phase !== "idle"}
        aria-label={isDark ? "التبديل للوضع الفاتح" : "التبديل للوضع الداكن"}
        aria-pressed={isDark}
        className={`relative p-2 rounded-lg bg-secondary-100 dark:bg-secondary-800
          hover:bg-secondary-200 dark:hover:bg-secondary-700
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
          transition-colors duration-150 disabled:opacity-60 ${className}`}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div key="sun"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: DUR.micro, ease: EASE.out }}
            >
              <Sun className="w-4 h-4 text-yellow-400" aria-hidden="true" />
            </motion.div>
          ) : (
            <motion.div key="moon"
              initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{ duration: DUR.micro, ease: EASE.out }}
            >
              <Moon className="w-4 h-4 text-secondary-600" aria-hidden="true" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Cinematic overlay — skipped entirely when prefersReduced */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key="cinematic-overlay"
            aria-hidden="true"
            className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "in" ? 1 : 0 }}
            transition={{ duration: phase === "in" ? 0.45 : 0.65, ease: EASE.inOut }}
          >
            {/* Sky */}
            <div
              className="absolute inset-0"
              style={{
                background: goingDark
                  ? "linear-gradient(to bottom, #050d1e 0%, #0a1a3a 45%, #190828 100%)"
                  : "linear-gradient(to bottom, #fff8e7 0%, #fde68a 40%, #fb923c 80%, #f97316 100%)",
              }}
            />

            {/* Stars */}
            {goingDark && STARS.map((s) => (
              <motion.div
                key={s.id}
                className="absolute rounded-full bg-white"
                style={{ left: s.x, top: s.y, width: s.r * 2, height: s.r * 2 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, s.opacity, s.opacity * 0.75], scale: [0, 1.6, 1] }}
                transition={{ delay: s.delay, duration: 0.36 }}
              />
            ))}

            {/* Crescent */}
            {goingDark && (
              <motion.div
                className="absolute"
                style={{ right: "11%", top: "5%" }}
                initial={{ opacity: 0, y: 50, rotate: -20 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ delay: 0.3, duration: 1.0, ease: EASE.out }}
              >
                <CrescentSVG />
              </motion.div>
            )}

            {/* Sun */}
            {!goingDark && (
              <motion.div
                className="absolute left-1/2 -translate-x-1/2"
                style={{ top: "8%" }}
                initial={{ opacity: 0, y: 80, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.95, ease: EASE.out }}
              >
                <SunSVG />
              </motion.div>
            )}

            {/* Lantern */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2"
              style={{ bottom: "16%" }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: DUR.slow, ease: "easeOut" }}
            >
              <LanternSVG lit={goingDark} />
            </motion.div>

            {/* Label */}
            <motion.p
              className="absolute bottom-6 left-0 right-0 text-center text-2xl font-bold"
              style={{
                fontFamily: "Cairo, sans-serif",
                color: goingDark ? "#f5e6c8" : "#7c2d12",
                textShadow: goingDark
                  ? "0 0 20px rgba(255,210,100,0.4)"
                  : "0 2px 8px rgba(255,255,255,0.5)",
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62, duration: DUR.slow }}
            >
              {goingDark ? "ليلةٌ طيبة 🌙" : "صباح النور ☀️"}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── SVG helpers ────────────────────────────────────────────── */

function CrescentSVG() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <defs>
        <mask id="crescent-cut">
          <rect width="80" height="80" fill="white" />
          <circle cx="52" cy="30" r="30" fill="black" />
        </mask>
        <filter id="crescent-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx="36" cy="36" r="34" fill="#f5e6c8" mask="url(#crescent-cut)" opacity="0.18" filter="url(#crescent-glow)" />
      <circle cx="36" cy="36" r="28" fill="#f5dfa0" mask="url(#crescent-cut)" />
      <circle cx="36" cy="36" r="28" fill="none" stroke="#fdf0d0" strokeWidth="0.8" mask="url(#crescent-cut)" opacity="0.6" />
    </svg>
  );
}

function SunSVG() {
  return (
    <svg width="110" height="110" viewBox="0 0 110 110" aria-hidden="true">
      <defs>
        <radialGradient id="sun-radial" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffde0" />
          <stop offset="30%" stopColor="#ffd84a" />
          <stop offset="65%" stopColor="#ff9500" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff6b00" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="55" cy="55" r="52" fill="url(#sun-radial)" />
      <circle cx="55" cy="55" r="24" fill="#ffe566" />
      <circle cx="55" cy="55" r="16" fill="#fff9a0" />
    </svg>
  );
}

function LanternSVG({ lit }: { lit: boolean }) {
  return (
    <svg width="80" height="120" viewBox="0 0 80 120" fill="none" aria-hidden="true">
      {lit && (
        <>
          <ellipse cx="40" cy="75" rx="50" ry="35" fill="#ffc832" opacity="0.1" />
          <ellipse cx="40" cy="75" rx="30" ry="22" fill="#ffb800" opacity="0.16" />
        </>
      )}
      <line x1="40" y1="0" x2="40" y2="18" stroke="#c8a86b" strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="40,14 41.8,18 46,18 43,21 44.5,25 40,22.5 35.5,25 37,21 34,18 38.2,18" fill="#d4aa3b" />
      <path d="M26 22 Q40 16 54 22 L52 32 Q40 26 28 32 Z" fill="#a07830" />
      <path d="M28 32 Q16 54 18 76 Q26 92 40 95 Q54 92 62 76 Q64 54 52 32 Z" fill={lit ? "#ffd84a" : "#c8a86b"} opacity={lit ? 0.9 : 0.65} />
      <line x1="40" y1="32" x2="40" y2="95" stroke="#a07830" strokeWidth="1.3" opacity="0.45" />
      <line x1="28" y1="63" x2="52" y2="63" stroke="#a07830" strokeWidth="1.3" opacity="0.45" />
      <ellipse cx="40" cy="63" rx="14" ry="16" stroke="#a07830" strokeWidth="1.1" fill="none" opacity="0.38" />
      <path d="M28 32 Q16 54 18 76" stroke="#8a6520" strokeWidth="1" fill="none" opacity="0.4" />
      <path d="M52 32 Q64 54 62 76" stroke="#8a6520" strokeWidth="1" fill="none" opacity="0.4" />
      {lit && (
        <motion.path
          d="M40 74 Q36 64 38 54 Q40 60 42 54 Q44 64 40 74 Z"
          fill="#ff6b1a"
          animate={{ scaleY: [1, 1.18, 0.9, 1.12, 1], scaleX: [1, 0.84, 1.1, 0.88, 1] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
          style={{ transformOrigin: "40px 74px" }}
        />
      )}
      <path d="M28 95 Q40 100 52 95 L54 106 Q40 111 26 106 Z" fill="#a07830" />
    </svg>
  );
}
