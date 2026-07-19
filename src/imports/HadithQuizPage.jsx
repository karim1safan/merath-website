import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollText } from 'lucide-react';
import { ROUTES } from '../constants';
import useHadithQuiz from '../hooks/useHadithQuiz';
import useQuiz from '../hooks/useQuiz';
import QuestionCard from '../components/quiz/QuestionCard';
import ProgressBar from '../components/quiz/ProgressBar';
import Timer from '../components/quiz/Timer';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';

const HadithQuizPage = () => {
  const navigate = useNavigate();
  const [timerDuration, setTimerDuration] = useState(0);
  const [showTimerSelect, setShowTimerSelect] = useState(true);
  const hasNavigatedRef = useRef(false);

  const { questions, loading, error } = useHadithQuiz(10);

  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    answers,
    score,
    percentage,
    completed,
    timeLeft,
    answeredCount,
    shuffledQuestions,
    selectAnswer,
    goToNext,
    goToPrevious,
    goToQuestion,
    finishQuiz,
    startTimer,
    getQuestionStatus,
  } = useQuiz(questions, timerDuration);

  const navigateToResult = useCallback(() => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    navigate(ROUTES.RESULT, {
      state: {
        score,
        totalQuestions,
        percentage,
        timeSpent: timerDuration - timeLeft,
        category: 'hadith',
        answers,
        questions: shuffledQuestions,
      },
      replace: true,
    });
  }, [navigate, score, totalQuestions, percentage, timerDuration, timeLeft, answers, shuffledQuestions]);

  useEffect(() => {
    if (completed) navigateToResult();
  }, [completed, navigateToResult]);

  useEffect(() => {
    hasNavigatedRef.current = false;
  }, []);

  const handleStartQuiz = () => {
    setShowTimerSelect(false);
    startTimer();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={<ScrollText className="w-16 h-16 text-red-500" />}
        title="خطأ في تحميل الأسئلة"
        description="حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى."
        actionLabel="العودة"
        onAction={() => navigate(ROUTES.HOME)}
      />
    );
  }

  if (questions.length === 0) {
    return (
      <EmptyState
        icon={<ScrollText className="w-16 h-16" />}
        title="لا توجد أسئلة"
        description="لم يتم العثور على أسئلة الأحاديث"
        actionLabel="العودة"
        onAction={() => navigate(ROUTES.HOME)}
      />
    );
  }

  if (showTimerSelect) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-2xl bg-amber-100 dark:bg-amber-900/30">
            <ScrollText className="w-12 h-12 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">
          اختبار الأحاديث النبوية
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 mb-2">
          {questions.length} أسئلة من الأحاديث النبوية الصحيحة
        </p>
        <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-8">
          تعرف على المصادر، الدرجات، والمعاني
        </p>

        <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-4">
            اختر مدة الاختبار
          </h3>
          <div className="space-y-3" role="radiogroup" aria-label="مدة الاختبار">
            {[0, 300, 600, 1200].map((duration) => (
              <button
                key={duration}
                onClick={() => setTimerDuration(duration)}
                role="radio"
                aria-checked={timerDuration === duration}
                className={`w-full p-3 rounded-xl border-2 transition-all duration-200 ${
                  timerDuration === duration
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                    : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600'
                }`}
              >
                {duration === 0
                  ? 'بدون مؤقت'
                  : `${duration / 60} ${duration >= 60 ? 'دقائق' : 'دقيقة'}`}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={handleStartQuiz} size="lg" className="w-full">
          ابدأ الاختبار
        </Button>
      </div>
    );
  }

  const selectedAnswer = answers[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ProgressBar current={answeredCount + (selectedAnswer !== undefined ? 0 : 1)} total={totalQuestions} />
      {timerDuration > 0 && <Timer timeLeft={timeLeft} totalTime={timerDuration} />}
      <QuestionCard
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={totalQuestions}
        selectedAnswer={selectedAnswer}
        onAnswerSelect={(answer) => selectAnswer(currentIndex, answer)}
        showExplanation={selectedAnswer !== undefined}
      />
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <Button onClick={goToPrevious} variant="secondary" size="sm" disabled={currentIndex === 0} className="text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2">
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
          <Button onClick={finishQuiz} variant="primary" size="sm" className="text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2">إنهاء</Button>
        ) : (
          <Button onClick={goToNext} variant="primary" size="sm" className="text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2">التالي</Button>
        )}
      </div>
    </div>
  );
};

export default HadithQuizPage;
