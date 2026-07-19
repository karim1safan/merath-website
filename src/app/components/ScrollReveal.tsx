import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { DUR, EASE } from "../lib/motion";

interface Props {
  children: ReactNode;
  delay?: number;     // seconds — keep small (≤ 0.2s)
  y?: number;         // initial Y offset in px
  className?: string;
}

export function ScrollReveal({ children, delay = 0, y = 18, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // once:true — never re-animates after first view (performance + UX)
  const inView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : y }}
      animate={
        inView || prefersReduced
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y }
      }
      transition={
        prefersReduced
          ? { duration: 0 }
          : { duration: DUR.normal, delay, ease: EASE.out }
      }
    >
      {children}
    </motion.div>
  );
}
