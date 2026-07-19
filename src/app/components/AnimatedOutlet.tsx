import { Component, Suspense, type ReactNode } from "react";
import { Outlet, useLocation } from "react-router";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Spinner from "./common/Spinner";
import { DUR, EASE, PAGE_TRANSITION, REDUCED } from "../lib/motion";

/* ─── Page-level error boundary (keeps Navbar/nav alive on crash) ── */
interface EBState { hasError: boolean }
class PageErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(e: Error) { console.error("[PageErrorBoundary]", e); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center px-4">
          <p className="text-secondary-600 dark:text-secondary-400">حدث خطأ أثناء تحميل الصفحة</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Spinner size="lg" />
    </div>
  );
}

export function AnimatedOutlet() {
  const location = useLocation();
  const prefersReduced = useReducedMotion();

  const variants  = prefersReduced ? REDUCED.variants  : PAGE_TRANSITION.variants;
  const transition = prefersReduced ? REDUCED.transition : PAGE_TRANSITION.transition;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
      >
        <PageErrorBoundary key={location.pathname}>
          <Suspense fallback={<LoadingFallback />}>
            <Outlet />
          </Suspense>
        </PageErrorBoundary>
      </motion.div>
    </AnimatePresence>
  );
}
