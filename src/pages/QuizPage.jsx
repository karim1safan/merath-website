import { useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { CATEGORIES, ROUTES } from '../constants';
import useQuiz from '../hooks/useQuiz';
import useQuizApi from '../hooks/useQuizApi';
import QuestionCard from '../components/quiz/QuestionCard';
import ProgressBar from '../components/quiz/ProgressBar';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import QuizSkeleton from '../components/skeletons/QuizSkeleton';

const QuizPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const topicSlug = searchParams.get('topic');
  const searchQuestions = location.state?.questions || null;
  const hasNavigatedRef = useRef(false);

  const { questions, loading, error } = useQuizApi(category, 20, searchQuestions, topicSlug);

  const categoryInfo = searchQuestions
    ? { name: 'نتائج البحث', icon: null, color: 'bg-primary-100 dark:bg-primary-900/30' }
    : CATEGORIES.find((c) => c.id === category);

  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    answers,
    score,
    percentage,
    completed,
    answeredCount,
    shuffledQuestions,
    selectAnswer,
    goToNext,
    goToPrevious,
    goToQuestion,
    finishQuiz,
    getQuestionStatus,
  } = useQuiz(questions);

  const navigateToResult = useCallback(() => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    navigate(ROUTES.RESULT, {
      state: {
        score,
        totalQuestions,
        percentage,
        category: searchQuestions ? 'search' : category,
        answers,
        questions: shuffledQuestions,
      },
      replace: true,
    });
  }, [navigate, score, totalQuestions, percentage, category, answers, shuffledQuestions, searchQuestions]);

  useEffect(() => {
    if (completed) {
      navigateToResult();
    }
  }, [completed, navigateToResult]);

  useEffect(() => {
    hasNavigatedRef.current = false;
  }, [category]);

  if (!categoryInfo) {
    return (
      <EmptyState
        icon={<AlertCircle className="w-16 h-16" />}
        title="قسم غير موجود"
        description="القسم الذي تبحث عنه غير موجود"
        actionLabel="العودة للأقسام"
        onAction={() => navigate(ROUTES.CATEGORIES)}
      />
    );
  }

  if (loading) {
    return <QuizSkeleton />;
  }

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="w-16 h-16 text-red-500" />}
        title="خطأ في تحميل الأسئلة"
        description="حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى."
        actionLabel="العودة للأقسام"
        onAction={() => navigate(ROUTES.CATEGORIES)}
      />
    );
  }

  if (questions.length === 0) {
    return (
      <EmptyState
        icon={<AlertCircle className="w-16 h-16" />}
        title="لا توجد أسئلة"
        description="لم يتم العثور على أسئلة في هذا القسم بعد"
        actionLabel="العودة للأقسام"
        onAction={() => navigate(ROUTES.CATEGORIES)}
      />
    );
  }

  const selectedAnswer = answers[currentIndex];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <ProgressBar current={answeredCount + (selectedAnswer !== undefined ? 0 : 1)} total={totalQuestions} />

      <QuestionCard
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={totalQuestions}
        selectedAnswer={selectedAnswer}
        onAnswerSelect={(answer) => selectAnswer(currentIndex, answer)}
        showExplanation={selectedAnswer !== undefined}
      />

      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <Button
          onClick={goToPrevious}
          variant="secondary"
          size="sm"
          disabled={currentIndex === 0}
          className="text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2"
        >
          السابق
        </Button>

        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-[50%] scrollbar-hide" role="group" aria-label="التنقل بين الأسئلة">
          {Array.from({ length: totalQuestions }, (_, i) => (
            <button
              key={i}
              onClick={() => goToQuestion(i)}
              aria-label={`السؤال ${i + 1}`}
              aria-current={i === currentIndex ? 'true' : undefined}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0 transition-colors duration-200 ${
                i === currentIndex
                  ? 'bg-primary-600 dark:bg-primary-400'
                  : getQuestionStatus(i) === 'correct'
                  ? 'bg-green-500'
                  : getQuestionStatus(i) === 'incorrect'
                  ? 'bg-red-500'
                  : 'bg-secondary-300 dark:bg-secondary-600'
              }`}
            />
          ))}
        </div>

        {currentIndex === totalQuestions - 1 ? (
          <Button
            onClick={finishQuiz}
            variant="primary"
            size="sm"
            className="text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2"
          >
            إنهاء
          </Button>
        ) : (
          <Button
            onClick={goToNext}
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

export default QuizPage;
