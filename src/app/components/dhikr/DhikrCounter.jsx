import { useState, useCallback, useRef, useEffect } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import TasbihBeads from './TasbihBeads';

const toArabicNum = (num) => {
  const d = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).split('').map((c) => d[Number(c)] ?? c).join('');
};

const DhikrCounter = ({ dhikr, onComplete, isCompleted: externalCompleted }) => {
  // Normalise repeatCount: use actual value or fall back to 3 so beads always render
  const repeatCount = dhikr.repeatCount > 1 ? dhikr.repeatCount : 3;

  const [remaining, setRemaining] = useState(repeatCount);
  const [justCompleted, setJustCompleted] = useState(false);
  const completedRef = useRef(false);
  const undoTimerRef = useRef(null);

  const isCompleted = externalCompleted || remaining === 0;
  const tapsCount = repeatCount - remaining;

  // Always show tasbih beads when not completed
  const useTasbih = !isCompleted;

  useEffect(() => () => { if (undoTimerRef.current) clearTimeout(undoTimerRef.current); }, []);

  const vibrate = useCallback((pattern) => navigator.vibrate?.(pattern), []);

  const handleTap = useCallback(() => {
    if (isCompleted) return;
    vibrate(10);

    setRemaining((prev) => {
      const next = Math.max(0, prev - 1);

      if (next <= 0 && !completedRef.current) {
        completedRef.current = true;
        setJustCompleted(true);
        vibrate([100, 50, 100]);
        setTimeout(() => onComplete?.(dhikr.id), 1500);
      }

      return next;
    });
  }, [isCompleted, onComplete, dhikr.id, vibrate]);

  const handleUndo = useCallback((e) => {
    e.stopPropagation();
    if (remaining >= repeatCount) return;
    setRemaining((prev) => Math.min(prev + 1, repeatCount));
    clearTimeout(undoTimerRef.current);
  }, [remaining, repeatCount]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleTap(); }
  };

  return (
    <div
      onKeyDown={!isCompleted ? handleKeyDown : undefined}
      tabIndex={isCompleted ? -1 : 0}
      className={`
        relative overflow-hidden rounded-2xl border-2 p-6 transition-all duration-300 ease-out select-none
        ${isCompleted
          ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
          : 'bg-white dark:bg-secondary-800 border-transparent shadow-sm hover:shadow-md'
        }
        ${justCompleted ? 'scale-[1.01]' : ''}
      `}
    >
      {/* Arabic text */}
      <p className="text-xl leading-loose text-right text-secondary-800 dark:text-secondary-200 font-amiri mb-5">
        {dhikr.arabic}
      </p>

      {/* Tasbih beads — always shown when not completed */}
      {useTasbih && (
        <div className="flex justify-center mb-4">
          <TasbihBeads
            count={tapsCount}
            total={repeatCount}
            onTap={handleTap}
          />
        </div>
      )}

      {/* Completed state */}
      {isCompleted && (
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
            <Check className="w-8 h-8" />
          </div>
        </div>
      )}

      {/* Bottom row */}
      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-secondary-100 dark:border-secondary-700/60">
        {isCompleted ? (
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Check className="w-5 h-5" />
            <span className="text-sm font-bold">جزاك الله خيرا</span>
          </div>
        ) : (
          <>
            {tapsCount > 0 && (
              <button
                onClick={handleUndo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 text-xs font-medium hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors"
                aria-label="تراجع"
              >
                <RotateCcw className="w-3 h-3" />
                تراجع
              </button>
            )}
            {dhikr.source && (
              <span className="text-xs text-secondary-400 dark:text-secondary-500 mr-auto">
                {dhikr.source}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DhikrCounter;
