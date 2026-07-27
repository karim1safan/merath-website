import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import Button from './Button';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  actionLabel,
  onAction,
}) => {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose?.();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl w-full max-w-sm p-6"
          >
            <button
              onClick={onClose}
              className="absolute top-4 left-4 p-1 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5 text-secondary-400" />
            </button>

            <div className="text-center">
              <h2 className="text-xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">
                {title}
              </h2>
              {children}
            </div>

            {actionLabel && onAction && (
              <div className="mt-6">
                <Button onClick={onAction} variant="primary" className="w-full">
                  {actionLabel}
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
