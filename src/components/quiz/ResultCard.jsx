import { motion } from 'motion/react';
import Card from '../common/Card';
import Button from '../common/Button';
import { getResultMessage } from '../../utils';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ResultCard = ({
  score,
  totalQuestions,
  percentage,
  onRetry,
  onReview,
  onHome,
}) => {
  const message = getResultMessage(percentage);

  const getScoreColor = () => {
    if (percentage >= 75) return 'text-green-600 dark:text-green-400';
    if (percentage >= 50) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <Card className="max-w-md mx-auto text-center">
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="mb-6"
      >
        <motion.span
          className="text-6xl mb-4 block"
          animate={prefersReducedMotion ? {} : { scale: [0, 1.2, 1] }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {percentage >= 75 ? '🎉' : percentage >= 50 ? '👍' : '💪'}
        </motion.span>
        <h2 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">
          نتيجة الاختبار
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400">{message}</p>
      </motion.div>

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mb-8"
      >
        <div className={`text-6xl font-bold ${getScoreColor()} mb-2`}>
          {percentage}%
        </div>
        <p className="text-secondary-500 dark:text-secondary-400">
          {score} من {totalQuestions} إجابة صحيحة
        </p>
      </motion.div>

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="grid grid-cols-2 gap-4 mb-8"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{score}</div>
          <div className="text-sm text-secondary-500 dark:text-secondary-400">صحيحة</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {totalQuestions - score}
          </div>
          <div className="text-sm text-secondary-500 dark:text-secondary-400">خاطئة</div>
        </div>

      </motion.div>

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="flex flex-col gap-3"
      >
        <Button onClick={onReview} variant="primary" className="w-full">
          مراجعة الإجابات
        </Button>
        <Button onClick={onRetry} variant="outline" className="w-full">
          إعادة المحاولة
        </Button>
        <Button onClick={onHome} variant="ghost" className="w-full">
          العودة للرئيسية
        </Button>
      </motion.div>
    </Card>
  );
};

export default ResultCard;
