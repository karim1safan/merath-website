import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-black/50 animate-[fadeIn_200ms_ease-out]"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-[scaleIn_200ms_ease-out]">
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
      </div>
    </div>
  );
};

export default Modal;
