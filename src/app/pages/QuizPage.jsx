import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { AlertCircle, ListFilter, TimerReset } from 'lucide-react';
import { CATEGORIES, ROUTES } from '../constants';
import useQuiz from '../hooks/useQuiz';
import useQuizApi from '../hooks/useQuizApi';
import { getQuestionsByDifficulty } from '../utils';
import QuestionCard from '../components/quiz/QuestionCard';
import ProgressBar from '../components/quiz/ProgressBar';
import Timer from '../components/quiz/Timer';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';

const QuizPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchQuestions = location.state?.questions || null;
  const [timerDuration, setTimerDuration] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCount, setSelectedCount] = useState(10);
  const [showTimerSelect, setShowTimerSelect] = useState(true);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const hasNavigatedRef = useRef(false);

  const { questions, loading, error } = useQuizApi(category, 50, searchQuestions);

  const categoryInfo = searchQuestions
    ? { name: 'نتائج البحث', icon: null, color: 'bg-primary-100 dark:bg-primary-900/30' }
    : CATEGORIES.find((c) => c.id === category);

  const availableQuestions = useMemo(() => {
    const allQuestions = questions || [];
    return selectedDifficulty === 'all'
      ? allQuestions
      : getQuestionsByDifficulty(allQuestions, selectedDifficulty);
  }, [questions, selectedDifficulty]);

  const filteredQuestions = useMemo(() => {
    const countLimit = selectedCount === 'all' ? availableQuestions.length : Number(selectedCount);
    return availableQuestions.slice(0, countLimit);
  }, [availableQuestions, selectedCount]);

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
  } = useQuiz(quizQuestions, timerDuration);

  const navigateToResult = useCallback(() => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    navigate(ROUTES.RESULT, {
      state: {
        score,
        totalQuestions,
        percentage,
        timeSpent: timerDuration - timeLeft,
        category: searchQuestions ? 'search' : category,
        answers,
        questions: shuffledQuestions,
      },
      replace: true,
    });
  }, [navigate, score, totalQuestions, percentage, timerDuration, timeLeft, category, answers, shuffledQuestions, searchQuestions]);

  useEffect(() => {
    if (completed) {
      navigateToResult();
    }
  }, [completed, navigateToResult]);

  useEffect(() => {
    hasNavigatedRef.current = false;
  }, [category]);

  const handleStartQuiz = () => {
    if (filteredQuestions.length === 0) return;

    // The selected, filtered, and capped set is frozen for this quiz attempt.
    setQuizQuestions(filteredQuestions);
    setShowTimerSelect(false);
    startTimer();
  };

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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
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

  if (showTimerSelect) {
    const IconComponent = categoryInfo.icon;
    return (
      <div className="max-w-md mx-auto text-center py-12">
        {IconComponent && (
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-2xl ${categoryInfo.color}`}>
              <IconComponent className="w-12 h-12" />
            </div>
          </div>
        )}
        <h1 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">
          {categoryInfo.name}
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 mb-8">
          {filteredQuestions.length} سؤال متاح {questions.length > filteredQuestions.length && `(من إجمالي ${questions.length})`}
        </p>

        <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-lg p-6 mb-8 space-y-7 text-right">
          <fieldset>
            <legend className="flex items-center gap-2 text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-3">
              <ListFilter className="w-4 h-4 text-primary-600 dark:text-primary-400" aria-hidden="true" />
              مستوى الصعوبة
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-label="مستوى صعوبة الأسئلة">
              {[{ value: 'all', label: 'الكل' }, { value: 'easy', label: 'سهل' }, { value: 'medium', label: 'متوسط' }, { value: 'hard', label: 'صعب' }].map((difficulty) => {
                const isSelected = selectedDifficulty === difficulty.value;
                return (
                  <button type="button" key={difficulty.value} role="radio" aria-checked={isSelected} onClick={() => setSelectedDifficulty(difficulty.value)} className={`rounded-xl border-2 px-3 py-2.5 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${isSelected ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold shadow-sm' : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600 text-secondary-600 dark:text-secondary-300'}`}>
                    {difficulty.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-3">عدد الأسئلة</legend>
            <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="عدد أسئلة الاختبار">
              {[5, 10, 15, 20, 'all'].map((count) => {
                const isSelected = selectedCount === count;
                return (
                  <button type="button" key={count} role="radio" aria-checked={isSelected} onClick={() => setSelectedCount(count)} className={`rounded-xl border-2 px-2 py-2.5 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${isSelected ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold shadow-sm' : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600 text-secondary-600 dark:text-secondary-300'}`}>
                    {count === 'all' ? 'الكل' : count}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="flex items-center gap-2 text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-3">
              <TimerReset className="w-4 h-4 text-primary-600 dark:text-primary-400" aria-hidden="true" />
              مدة الاختبار
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-label="مدة الاختبار">
              {[{ value: 0, label: 'بدون مؤقت' }, { value: 300, label: '5 د' }, { value: 600, label: '10 د' }, { value: 1200, label: '20 د' }].map((timer) => {
                const isSelected = timerDuration === timer.value;
                return (
                  <button type="button" key={timer.value} role="radio" aria-checked={isSelected} onClick={() => setTimerDuration(timer.value)} className={`rounded-xl border-2 px-2 py-2.5 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${isSelected ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold shadow-sm' : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600 text-secondary-600 dark:text-secondary-300'}`}>
                    {timer.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="text-danger text-sm mb-4">
            لا توجد أسئلة متوفرة لهذا المستوى من الصعوبة. يرجى اختيار مستوى آخر.
          </div>
        ) : null}

        <Button 
          onClick={handleStartQuiz} 
          size="lg" 
          className="w-full"
          disabled={filteredQuestions.length === 0}
        >
          ابدأ الاختبار
        </Button>
      </div>
    );
  }

  const selectedAnswer = answers[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ProgressBar current={answeredCount + (selectedAnswer !== undefined ? 0 : 1)} total={totalQuestions} />

      {timerDuration > 0 && (
        <Timer timeLeft={timeLeft} totalTime={timerDuration} />
      )}

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
