import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Check, X, ClipboardList, ExternalLink } from 'lucide-react';
import { ROUTES } from '../constants';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import BookmarkButton from '../components/common/BookmarkButton';
import EmptyState from '../components/common/EmptyState';

const ReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { questions, answers } = location.state || {};

  if (!questions || !answers) {
    return (
      <EmptyState
        icon={<ClipboardList className="w-16 h-16" />}
        title="لا توجد إجابات للمراجعة"
        description="يجب إكمال اختبار أولاً لمراجعة الإجابات"
        actionLabel="ابدأ اختباراً"
        onAction={() => navigate(ROUTES.CATEGORIES)}
      />
    );
  }

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = answers[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const optionLabels = ['أ', 'ب', 'ج', 'د'];

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg sm:text-2xl font-bold text-secondary-800 dark:text-secondary-200">
          مراجعة الإجابات
        </h1>
        <Badge variant="primary" size="sm">
          {currentIndex + 1} / {questions.length}
        </Badge>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Badge
              variant={isCorrect ? 'success' : 'danger'}
              size="sm"
            >
              {isCorrect ? 'صحيح' : 'خاطئ'}
            </Badge>
          </div>
          <BookmarkButton question={currentQuestion} />
        </div>

        <h2 className="text-lg sm:text-xl font-semibold text-secondary-800 dark:text-secondary-200 mb-4 sm:mb-6 leading-relaxed">
          {currentQuestion.question}
        </h2>

        <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-6">
          {currentQuestion.options.map((option, index) => {
            const isSelected = index === selectedAnswer;
            const isCorrectOption = index === currentQuestion.correctAnswer;

            let bgColor = 'bg-secondary-50 dark:bg-secondary-800';
            if (isCorrectOption) {
              bgColor = 'bg-green-100 dark:bg-green-900/30 border-green-500';
            } else if (isSelected && !isCorrect) {
              bgColor = 'bg-red-100 dark:bg-red-900/30 border-red-500';
            }

            return (
              <div
                key={index}
                className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 ${bgColor}`}
              >
                <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary-200 dark:bg-secondary-700 flex items-center justify-center text-xs sm:text-sm font-semibold">
                  {optionLabels[index]}
                </span>
                <span className="flex-1 text-sm sm:text-base">{option}</span>
                {isCorrectOption && (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                )}
                {isSelected && !isCorrectOption && (
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {currentQuestion.explanation && (
          <div className="p-3 sm:p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
            <h4 className="text-xs sm:text-sm font-semibold text-primary-700 dark:text-primary-400 mb-2">
              المصدر:
            </h4>
            <a
              href={currentQuestion.explanation}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              عرض التوضيح من المصدر
            </a>
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <Button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          variant="secondary"
          size="sm"
          disabled={currentIndex === 0}
          className="text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2"
        >
          السابق
        </Button>

        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto max-w-[50%] scrollbar-hide" role="group" aria-label="التنقل بين الأسئلة">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`السؤال ${i + 1}`}
              aria-current={i === currentIndex ? 'true' : undefined}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0 transition-colors duration-200 ${
                i === currentIndex
                  ? 'bg-primary-600 dark:bg-primary-400'
                  : answers[i] === questions[i].correctAnswer
                  ? 'bg-green-500'
                  : 'bg-red-500'
              }`}
            />
          ))}
        </div>

        {currentIndex === questions.length - 1 ? (
          <Button
            onClick={() => navigate(ROUTES.CATEGORIES)}
            variant="primary"
            size="sm"
            className="text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2"
          >
            إنهاء
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            variant="primary"
            size="sm"
            className="text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2"
          >
            التالي
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
