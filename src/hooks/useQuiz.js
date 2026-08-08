import { useState, useCallback, useMemo } from 'react';
import { shuffleArray, calculatePercentage } from '../utils';

const useQuiz = (questions) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const shuffledQuestions = useMemo(() => {
    if (questions.length === 0) return [];
    return shuffleArray(questions);
  }, [questions]);

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
  }, []);

  const restartQuiz = useCallback(() => {
    setCurrentIndex(0);
    setAnswers({});
    setScore(0);
    setCompleted(false);
  }, []);

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
    answeredCount,
    shuffledQuestions,
    selectAnswer,
    goToNext,
    goToPrevious,
    goToQuestion,
    finishQuiz,
    restartQuiz,
    getQuestionStatus,
  };
};

export default useQuiz;
