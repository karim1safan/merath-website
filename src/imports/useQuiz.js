import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { shuffleArray, calculatePercentage } from '../utils';

const useQuiz = (questions, timerDuration = 0) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  const shuffledQuestions = useMemo(() => {
    if (questions.length === 0) return [];
    return shuffleArray(questions);
  }, [questions]);

  useEffect(() => {
    if (timerDuration > 0 && isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setCompleted(true);
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerDuration, isTimerRunning, timeLeft]);

  const currentQuestion = shuffledQuestions[currentIndex];
  const totalQuestions = shuffledQuestions.length;
  const answeredCount = Object.keys(answers).length;

  const selectAnswer = useCallback(
    (questionIndex, answerIndex) => {
      if (answers[questionIndex] !== undefined) return;

      setAnswers((prev) => ({
        ...prev,
        [questionIndex]: answerIndex,
      }));

      if (shuffledQuestions[questionIndex]?.correctAnswer === answerIndex) {
        setScore((prev) => prev + 1);
      }
    },
    [answers, shuffledQuestions]
  );

  const goToNext = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, totalQuestions]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const goToQuestion = useCallback((index) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentIndex(index);
    }
  }, [totalQuestions]);

  const finishQuiz = useCallback(() => {
    setCompleted(true);
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  const restartQuiz = useCallback(() => {
    setCurrentIndex(0);
    setAnswers({});
    setScore(0);
    setCompleted(false);
    setTimeLeft(timerDuration);
    setIsTimerRunning(timerDuration > 0);
  }, [timerDuration]);

  const startTimer = useCallback(() => {
    if (timerDuration > 0) {
      setIsTimerRunning(true);
      setTimeLeft(timerDuration);
    }
  }, [timerDuration]);

  const percentage = calculatePercentage(score, totalQuestions);

  const getQuestionStatus = useCallback(
    (index) => {
      if (answers[index] === undefined) return 'unanswered';
      if (answers[index] === shuffledQuestions[index]?.correctAnswer) return 'correct';
      return 'incorrect';
    },
    [answers, shuffledQuestions]
  );

  return {
    currentQuestion,
    currentIndex,
    totalQuestions,
    answers,
    score,
    percentage,
    completed,
    timeLeft,
    isTimerRunning,
    answeredCount,
    shuffledQuestions,
    selectAnswer,
    goToNext,
    goToPrevious,
    goToQuestion,
    finishQuiz,
    restartQuiz,
    startTimer,
    getQuestionStatus,
  };
};

export default useQuiz;
