import { motion } from 'motion/react';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const reduced = prefersReducedMotion;

export const FadeIn = ({
  children,
  delay = 0,
  duration = 0.3,
  y = 20,
  className = '',
  ...props
}) => (
  <motion.div
    initial={reduced ? false : { opacity: 0, y }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay, ease: 'easeOut' }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

export const FadeInLeft = ({
  children,
  delay = 0,
  duration = 0.3,
  x = 20,
  className = '',
  ...props
}) => (
  <motion.div
    initial={reduced ? false : { opacity: 0, x }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration, delay, ease: 'easeOut' }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

export const ScaleIn = ({
  children,
  delay = 0,
  duration = 0.3,
  className = '',
  ...props
}) => (
  <motion.div
    initial={reduced ? false : { opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration, delay, ease: 'easeOut' }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

export const StaggerChildren = ({
  children,
  stagger = 0.06,
  className = '',
  ...props
}) => (
  <motion.div
    initial={reduced ? false : 'hidden'}
    animate="visible"
    variants={{
      hidden: false,
      visible: { transition: { staggerChildren: stagger } },
    }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = '', ...props }) => (
  <motion.div
    variants={
      reduced
        ? {}
        : {
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0 },
          }
    }
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

export const PageTransition = ({ children, className = '' }) => (
  <motion.div
    initial={reduced ? false : { opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={reduced ? {} : { opacity: 0, y: -8 }}
    transition={{ duration: 0.25, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);
