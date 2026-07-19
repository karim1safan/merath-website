import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { STORAGE_KEYS } from '../constants';
import { getTodayString } from '../utils';

const useDailyStreak = () => {
  const [streakData, setStreakData] = useLocalStorage(STORAGE_KEYS.DAILY_STREAK, {
    currentStreak: 0,
    longestStreak: 0,
    lastPlayedDate: null,
    todayCompleted: false,
  });

  const markDailyCompleted = useCallback(() => {
    const today = getTodayString();

    setStreakData((prev) => {
      if (prev.lastPlayedDate === today) {
        return { ...prev, todayCompleted: true };
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak;
      if (prev.lastPlayedDate === yesterdayStr) {
        newStreak = prev.currentStreak + 1;
      } else {
        newStreak = 1;
      }

      return {
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastPlayedDate: today,
        todayCompleted: true,
      };
    });
  }, [setStreakData]);

  const isTodayCompleted = useCallback(() => {
    return streakData.lastPlayedDate === getTodayString();
  }, [streakData.lastPlayedDate]);

  return {
    ...streakData,
    markDailyCompleted,
    isTodayCompleted,
  };
};

export default useDailyStreak;
