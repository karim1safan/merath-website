/**
 * Unified animation design tokens.
 * Every animated component must pull from here — no ad-hoc values.
 *
 * Rule: 200–500 ms for all UX motion.
 * Exception: CinematicThemeToggle (signature interaction, intentionally longer).
 */

/* ─── Durations (seconds) ──────────────────────────────────────── */
export const DUR = {
  micro:   0.15,   // icon swap, button press feedback
  fast:    0.22,   // page in/out, simple state changes
  normal:  0.32,   // card reveals, scroll animations
  slow:    0.45,   // modals, complex reveals (hard ceiling for UX motion)
} as const;

/* ─── Easing curves ────────────────────────────────────────────── */
export const EASE = {
  out:   [0.22, 1, 0.36, 1] as const,   // smooth deceleration (default)
  inOut: [0.4, 0, 0.2, 1] as const,     // symmetric — use for modals/overlays
} as const;

/* ─── Spring presets ───────────────────────────────────────────── */
export const SPRING = {
  snappy: { type: "spring" as const, stiffness: 380, damping: 26 },   // buttons
  gentle: { type: "spring" as const, stiffness: 220, damping: 28 },   // cards, reveals
} as const;

/* ─── Shared page-transition config ───────────────────────────── */
export const PAGE_TRANSITION = {
  variants: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit:    { opacity: 0, y: -8 },
  },
  transition: { duration: DUR.fast, ease: EASE.out },
} as const;

/* ─── Reduced-motion safe values ───────────────────────────────── */
export const REDUCED = {
  transition: { duration: 0 },
  variants: {
    initial: {},
    animate: {},
    exit:    {},
  },
} as const;
