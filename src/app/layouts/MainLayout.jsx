import { useEffect, useRef } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/ui/ScrollToTop';
import { useTheme } from '../hooks/useTheme';

// True when the primary input is touch (phone/tablet) — no hover capability
const IS_TOUCH_DEVICE =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: none) and (pointer: coarse)').matches;

const MainLayout = ({ children }) => {
  const overlayRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    // Mouse lantern light — desktop only, skip on touch + reduced-motion
    if (IS_TOUCH_DEVICE) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rafId;
    const intensity = isDark ? 0.12 : 0.07;

    const onMove = (e) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (overlayRef.current) {
          overlayRef.current.style.background =
            `radial-gradient(700px circle at ${e.clientX}px ${e.clientY}px, rgba(255,200,80,${intensity}), transparent 60%)`;
        }
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, [isDark]);

  return (
    <div className="min-h-screen flex flex-col bg-secondary-50 dark:bg-secondary-950 transition-colors duration-300">
      {/* Lantern light overlay — z-50 so it floats above all content */}
      {!IS_TOUCH_DEVICE && (
        <div
          ref={overlayRef}
          className="fixed inset-0 pointer-events-none z-50"
          aria-hidden="true"
        />
      )}

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:outline-none"
      >
        تخطى إلى المحتوى الرئيسي
      </a>

      <Navbar />

      <main
        id="main-content"
        className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {children}
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default MainLayout;
