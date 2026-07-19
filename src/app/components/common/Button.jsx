import { motion, useReducedMotion } from 'motion/react';
import { SPRING } from '../../lib/motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) => {
  const prefersReduced = useReducedMotion();

  const base =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-colors duration-150 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
    'disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:   'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus-visible:ring-primary-500',
    secondary: 'bg-secondary-100 text-secondary-800 hover:bg-secondary-200 focus-visible:ring-secondary-400 dark:bg-secondary-700 dark:text-secondary-200 dark:hover:bg-secondary-600',
    outline:   'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-500 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/30',
    ghost:     'text-secondary-600 hover:bg-secondary-100 focus-visible:ring-secondary-400 dark:text-secondary-400 dark:hover:bg-secondary-800',
    danger:    'bg-danger text-white hover:bg-red-600 focus-visible:ring-red-500',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const isInteractive = !disabled && !loading;

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      // Micro-interactions: disabled when reduced-motion or non-interactive
      whileHover={isInteractive && !prefersReduced ? { scale: 1.02 } : undefined}
      whileTap={isInteractive && !prefersReduced ? { scale: 0.96 } : undefined}
      transition={SPRING.snappy}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </motion.button>
  );
};

export default Button;
