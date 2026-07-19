import Card from '../common/Card';
import Button from '../common/Button';
import { getResultMessage, formatTime } from '../../utils';

const ResultCard = ({
  score,
  totalQuestions,
  percentage,
  timeSpent,
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
      <div className="mb-6">
        <span className="text-6xl mb-4 block">
          {percentage >= 75 ? '🎉' : percentage >= 50 ? '👍' : '💪'}
        </span>
        <h2 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">
          نتيجة الاختبار
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400">{message}</p>
      </div>

      <div className="mb-8">
        <div className={`text-6xl font-bold ${getScoreColor()} mb-2`}>
          {percentage}%
        </div>
        <p className="text-secondary-500 dark:text-secondary-400">
          {score} من {totalQuestions} إجابة صحيحة
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
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
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
            {formatTime(timeSpent)}
          </div>
          <div className="text-sm text-secondary-500 dark:text-secondary-400">الوقت</div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button onClick={onReview} variant="primary" className="w-full">
          مراجعة الإجابات
        </Button>
        <Button onClick={onRetry} variant="outline" className="w-full">
          إعادة المحاولة
        </Button>
        <Button onClick={onHome} variant="ghost" className="w-full">
          العودة للرئيسية
        </Button>
      </div>
    </Card>
  );
};

export default ResultCard;
