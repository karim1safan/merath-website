import { useState, useCallback, useRef, useEffect } from 'react';
import { Check, RotateCcw } from 'lucide-react';

const toArabicNum = (num) => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num)
    .split('')
    .map((d) => arabicDigits[Number(d)] ?? d)
    .join('');
};

const DhikrCounter = ({ dhikr, onComplete, isCompleted: externalCompleted }) => {
  const [remaining, setRemaining] = useState(dhikr.repeatCount);
  const [isPressed, setIsPressed] = useState(false);
  const [showUndo, setShowUndo] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const completedRef = useRef(false);
  const undoTimerRef = useRef(null);

  const isCompleted = externalCompleted || remaining === 0;

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  const vibrate = useCallback((pattern) => {
    navigator.vibrate?.(pattern);
  }, []);

  const handleTap = useCallback(() => {
    if (isCompleted) return;

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);

    vibrate(10);

    setRemaining((prev) => {
      const next = prev - 1;

      if (next > 0) {
        setShowUndo(true);
        if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
        undoTimerRef.current = setTimeout(() => setShowUndo(false), 2000);
      }

      if (next <= 0 && !completedRef.current) {
        completedRef.current = true;
        setJustCompleted(true);
        vibrate([100, 50, 100]);
        setTimeout(() => {
          onComplete?.(dhikr.id);
        }, 1500);
      }

      return Math.max(0, next);
    });
  }, [isCompleted, onComplete, dhikr.id, vibrate]);

  const handleUndo = useCallback(
    (e) => {
      e.stopPropagation();
      if (remaining >= dhikr.repeatCount) return;
      setRemaining((prev) => Math.min(prev + 1, dhikr.repeatCount));
      setShowUndo(false);
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    },
    [remaining, dhikr.repeatCount]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTap();
    }
  };

  const progress =
    dhikr.repeatCount > 1
      ? ((dhikr.repeatCount - remaining) / dhikr.repeatCount) * 100
      : 0;

  return (
    <div
      onClick={handleTap}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={isCompleted ? -1 : 0}
      aria-label={
        isCompleted
          ? `${dhikr.arabic.slice(0, 30)}... — مكتمل`
          : `${dhikr.arabic.slice(0, 30)}... — متبقي ${remaining} من ${dhikr.repeatCount}`
      }
      className={`
        relative overflow-hidden rounded-2xl shadow-lg p-6 transition-all duration-300 ease-out select-none
        ${isCompleted
          ? 'bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800'
          : 'bg-white dark:bg-secondary-800 border-2 border-transparent cursor-pointer active:scale-[0.98]'
        }
        ${!isCompleted ? 'hover:shadow-xl' : ''}
        ${isPressed && !isCompleted ? 'scale-[0.98]' : ''}
        ${justCompleted ? 'scale-[1.02]' : ''}
      `}
    >
      {/* Progress bar */}
      {dhikr.repeatCount > 1 && !isCompleted && (
        <div className="absolute top-0 right-0 left-0 h-1 bg-secondary-100 dark:bg-secondary-700">
          <div
            className="h-full bg-primary-500 dark:bg-primary-400 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Arabic text */}
      <p className="text-xl leading-loose text-right text-secondary-800 dark:text-secondary-200 font-arabic mb-6">
        {dhikr.arabic}
      </p>

      {/* Centered counter */}
      {!isCompleted && dhikr.repeatCount > 1 && (
        <div className="flex flex-col items-center gap-2 mb-6">
          <div
            aria-live="polite"
            aria-atomic="true"
            className={`
              w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300
              ${remaining === 1
                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                : 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
              }
            `}
          >
            <span className="text-4xl font-bold">{toArabicNum(remaining)}</span>
          </div>
          {remaining === 1 && (
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              مرة أخيرة
            </span>
          )}
        </div>
      )}

      {/* Bottom section */}
      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-secondary-100 dark:border-secondary-700">
        {isCompleted ? (
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Check className="w-5 h-5" />
            <span className="text-sm font-bold">مكتمل</span>
          </div>
        ) : (
          <>
            {showUndo && (
              <button
                onClick={handleUndo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 text-xs font-medium hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors"
                aria-label="خطأ، عد التسبيحة"
              >
                <RotateCcw className="w-3 h-3" />
                خطأ
              </button>
            )}

            <span className="text-xs text-secondary-400 dark:text-secondary-500 mr-auto">
              اضغط للتسبيح
            </span>
          </>
        )}

        {!isCompleted && dhikr.source && (
          <span className="text-xs text-secondary-500 dark:text-secondary-400">
            {dhikr.source}
          </span>
        )}
      </div>
    </div>
  );
};

export default DhikrCounter;
