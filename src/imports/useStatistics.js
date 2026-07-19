import useLocalStorage from './useLocalStorage';
import { STORAGE_KEYS } from '../constants';

const INITIAL_STATISTICS = {
  completedQuizzes: 0,
  totalScore: 0,
  highScore: 0,
  lowScore: 100,
  totalQuestions: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  totalTime: 0,
};

const useStatistics = () => {
  const [statistics, setStatistics] = useLocalStorage(STORAGE_KEYS.STATISTICS, INITIAL_STATISTICS);

  const addQuizResult = (result) => {
    setStatistics((prev) => ({
      completedQuizzes: prev.completedQuizzes + 1,
      totalScore: prev.totalScore + result.percentage,
      highScore: Math.max(prev.highScore, result.percentage),
      lowScore: Math.min(prev.lowScore, result.percentage),
      totalQuestions: prev.totalQuestions + result.totalQuestions,
      correctAnswers: prev.correctAnswers + result.score,
      wrongAnswers: prev.wrongAnswers + (result.totalQuestions - result.score),
      totalTime: prev.totalTime + result.timeSpent,
    }));
  };

  const resetStatistics = () => {
    setStatistics(INITIAL_STATISTICS);
  };

  return {
    statistics,
    addQuizResult,
    resetStatistics,
  };
};

export default useStatistics;
