import { motion } from 'motion/react';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Card = ({
  children,
  className = '',
  hover = false,
  onClick,
  ...props
}) => {
  const baseStyles =
    'bg-white rounded-2xl shadow-lg p-6 transition-colors duration-200 ease-out dark:bg-secondary-800';

  const isClickable = !!onClick;

  const handleKeyDown = (e) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <motion.div
      className={`${baseStyles} ${hover ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      whileHover={
        prefersReducedMotion || !hover
          ? {}
          : { y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }
      }
      transition={{ duration: 0.2, ease: 'easeOut' }}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
