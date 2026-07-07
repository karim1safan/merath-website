import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, Flame, Trophy } from 'lucide-react';
import { ROUTES } from '../constants';
import { fetchRandomQuestions } from '../services/quizApi';
import { transformApiQuestions } from '../utils/transformQuestions';
import { seededShuffle, getDateSeed } from '../utils';
import useQuiz from '../hooks/useQuiz';
import useDailyStreak from '../hooks/useDailyStreak';
import QuestionCard from '../components/quiz/QuestionCard';
import ProgressBar from '../components/quiz/ProgressBar';
import Timer from '../components/quiz/Timer';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';

const DAILY_QUESTION_COUNT = 10;
const DAILY_TIMER = 600;

const DailyChallengePage = () => {
  const navigate = useNavigate();
  const [startQuiz, setStartQuiz] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasNavigatedRef = useRef(false);

  const { currentStreak, longestStreak, todayCompleted, markDailyCompleted } =
    useDailyStreak();

  useEffect(() => {
    let cancelled = false;

    async function loadDailyQuestions() {
      setLoading(true);
      setError(null);

      try {
        const rawData = await fetchRandomQuestions(50);
        if (!cancelled) {
          const transformed = transformApiQuestions(rawData);
          const seed = getDateSeed();
          const dailyQuestions = seededShuffle(transformed, seed).slice(
            0,
            DAILY_QUESTION_COUNT
          );
          setQuestions(dailyQuestions);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setQuestions([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDailyQuestions();
    return () => {
      cancelled = true;
    };
  }, []);

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
  } = useQuiz(questions, DAILY_TIMER);

  const navigateToResult = useCallback(() => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    markDailyCompleted();
    navigate(ROUTES.RESULT, {
      state: {
        score,
        totalQuestions,
        percentage,
        timeSpent: DAILY_TIMER - timeLeft,
        category: 'daily',
        answers,
        questions: shuffledQuestions,
        isDailyChallenge: true,
      },
      replace: true,
    });
  }, [
    navigate,
    score,
    totalQuestions,
    percentage,
    timeLeft,
    answers,
    shuffledQuestions,
    markDailyCompleted,
  ]);

  useEffect(() => {
    if (completed) {
      navigateToResult();
    }
  }, [completed, navigateToResult]);

  useEffect(() => {
    hasNavigatedRef.current = false;
  }, []);

  const handleStartQuiz = () => {
    setStartQuiz(true);
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
        icon={<CalendarCheck className="w-16 h-16 text-red-500" />}
        title="خطأ في تحميل التحدي"
        description="حدث خطأ أثناء تحميل أسئلة التحدي اليومي. يرجى المحاولة مرة أخرى."
        actionLabel="العودة للرئيسية"
        onAction={() => navigate(ROUTES.HOME)}
      />
    );
  }

  if (questions.length === 0) {
    return (
      <EmptyState
        icon={<CalendarCheck className="w-16 h-16" />}
        title="لا توجد أسئلة متاحة"
        description="لم يتم العثور على أسئلة للتحدي اليومي"
        actionLabel="العودة للرئيسية"
        onAction={() => navigate(ROUTES.HOME)}
      />
    );
  }

  if (!startQuiz) {
    return (
      <div className="max-w-md mx-auto space-y-6 py-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-2xl bg-primary-100 dark:bg-primary-900/30">
              <CalendarCheck className="w-12 h-12 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">
            التحدي اليومي
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            {DAILY_QUESTION_COUNT} أسئلة متنوعة من مختلف الأقسام
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="text-center">
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-secondary-800 dark:text-secondary-200">
              {currentStreak}
            </div>
            <div className="text-sm text-secondary-500 dark:text-secondary-400">
              السلسلة الحالية
            </div>
          </Card>
          <Card className="text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-secondary-800 dark:text-secondary-200">
              {longestStreak}
            </div>
            <div className="text-sm text-secondary-500 dark:text-secondary-400">
              أطول سلسلة
            </div>
          </Card>
        </div>

        {todayCompleted && (
          <Card className="text-center border-2 border-green-500">
            <p className="text-green-600 dark:text-green-400 font-semibold">
              أكملت التحدي اليوم! عد غداً للاستمرار
            </p>
          </Card>
        )}

        <Button onClick={handleStartQuiz} size="lg" className="w-full">
          ابدأ التحدي
        </Button>
      </div>
    );
  }

  const selectedAnswer = answers[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <CalendarCheck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
          التحدي اليومي
        </span>
      </div>

      <ProgressBar
        current={answeredCount + (selectedAnswer !== undefined ? 0 : 1)}
        total={totalQuestions}
      />

      <Timer timeLeft={timeLeft} totalTime={DAILY_TIMER} />

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

        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-[50%] scrollbar-hide">
          {Array.from({ length: totalQuestions }, (_, i) => (
            <button
              key={i}
              onClick={() => goToQuestion(i)}
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
          <Button onClick={finishQuiz} variant="primary" size="sm" className="text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2">
            إنهاء
          </Button>
        ) : (
          <Button onClick={goToNext} variant="primary" size="sm" className="text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2">
            التالي
          </Button>
        )}
      </div>
    </div>
  );
};

export default DailyChallengePage;
