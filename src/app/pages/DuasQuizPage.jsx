import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { HandHeart } from 'lucide-react';
import { ROUTES } from '../constants';
import useDuasQuiz from '../hooks/useDuasQuiz';
import useQuiz from '../hooks/useQuiz';
import QuestionCard from '../components/quiz/QuestionCard';
import ProgressBar from '../components/quiz/ProgressBar';
import Timer from '../components/quiz/Timer';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import QuizSettings from '../components/quiz/QuizSettings';
import { getQuestionsByDifficulty } from '../utils';

const DuasQuizPage = () => {
  const navigate = useNavigate();
  const [timerDuration, setTimerDuration] = useState(0);
  const [showTimerSelect, setShowTimerSelect] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCount, setSelectedCount] = useState(10);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const hasNavigatedRef = useRef(false);

  const { questions, loading, error } = useDuasQuiz(50);

  const questionsByDifficulty = useMemo(() => (
    selectedDifficulty === 'all'
      ? questions
      : getQuestionsByDifficulty(questions, selectedDifficulty)
  ), [questions, selectedDifficulty]);

  const selectedQuestions = useMemo(() => {
    const limit = selectedCount === 'all' ? questionsByDifficulty.length : Number(selectedCount);
    return questionsByDifficulty.slice(0, limit);
  }, [questionsByDifficulty, selectedCount]);

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
        category: 'duas',
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
    if (selectedQuestions.length === 0) return;
    setQuizQuestions(selectedQuestions);
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
        icon={<HandHeart className="w-16 h-16 text-red-500" />}
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
        icon={<HandHeart className="w-16 h-16" />}
        title="لا توجد أسئلة"
        description="لم يتم العثور على أسئلة الأدعية"
        actionLabel="العودة"
        onAction={() => navigate(ROUTES.HOME)}
      />
    );
  }

  if (showTimerSelect) {
    return (
      <QuizSettings
        title="اختبار الأدعية والأذكار"
        description="اختبر معرفتك بالأدعية والأذكار"
        Icon={HandHeart}
        iconClassName="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
        totalQuestions={questions.length}
        availableQuestions={selectedQuestions.length}
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={setSelectedDifficulty}
        selectedCount={selectedCount}
        onCountChange={setSelectedCount}
        timerDuration={timerDuration}
        onTimerChange={setTimerDuration}
        onStart={handleStartQuiz}
      />
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

export default DuasQuizPage;
