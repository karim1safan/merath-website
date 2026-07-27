import { motion } from 'motion/react';
import { formatDuration } from '../../utils';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Timer = ({ timeLeft, totalTime, className = '' }) => {
  const percentage = totalTime > 0 ? (timeLeft / totalTime) * 100 : 100;
  const isLow = timeLeft <= 60;

  const getTimerColor = () => {
    if (percentage <= 25) return 'text-red-500 dark:text-red-400';
    if (percentage <= 50) return 'text-amber-500 dark:text-amber-400';
    return 'text-primary-600 dark:text-primary-400';
  };

  const getBarColor = () => {
    if (percentage <= 25) return 'bg-red-500 dark:bg-red-400';
    if (percentage <= 50) return 'bg-amber-500 dark:bg-amber-400';
    return 'bg-primary-600 dark:bg-primary-400';
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <motion.div
        className={`text-2xl sm:text-3xl font-bold ${getTimerColor()}`}
        animate={
          isLow && !prefersReducedMotion
            ? { scale: [1, 1.05, 1] }
            : {}
        }
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
      >
        {formatDuration(timeLeft)}
      </motion.div>
      <div className="w-full h-2 bg-secondary-200 dark:bg-secondary-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${getBarColor()} rounded-full transition-all duration-1000 ease-linear`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Timer;
