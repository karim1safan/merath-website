import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

const TODAY = () => new Date().toISOString().split('T')[0];
const PROGRESS_KEY = 'adhkar-progress-v2';   // { [catNum]: { ids, date } }
const HISTORY_KEY  = 'adhkar-history-v2';    // { [catNum]: string[] } last 30 dates
const DAILY_KEY    = 'adhkar-daily-completed';

function getStreak(dates = []) {
  if (!dates.length) return 0;
  const sorted = [...new Set(dates)].sort().reverse();
  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  for (const d of sorted) {
    const day = new Date(d);
    day.setHours(0, 0, 0, 0);
    const diff = Math.round((cursor - day) / 86400000);
    if (diff <= 1) { streak++; cursor = day; }
    else break;
  }
  return streak;
}

export default function useAdhkarProgress() {
  const [progressMap, setProgressMap] = useLocalStorage(PROGRESS_KEY, {});
  const [historyMap,  setHistoryMap]  = useLocalStorage(HISTORY_KEY,  {});
  const [dailyMap,    setDailyMap]    = useLocalStorage(DAILY_KEY,    {});

  /* ── In-session progress (date-aware) ─────────────────── */
  const getProgress = useCallback((catNum) => {
    const entry = progressMap[catNum];
    if (!entry || entry.date !== TODAY()) return new Set();
    return new Set(entry.ids);
  }, [progressMap]);

  const saveProgress = useCallback((catNum, ids) => {
    setProgressMap(prev => ({
      ...prev,
      [catNum]: { ids: Array.from(ids), date: TODAY() },
    }));
  }, [setProgressMap]);

  /* ── Mark full category complete ───────────────────────── */
  const markComplete = useCallback((catNum) => {
    const today = TODAY();
    setDailyMap(prev => ({ ...prev, [catNum]: today }));
    setHistoryMap(prev => {
      const existing = prev[catNum] || [];
      const updated  = [today, ...existing.filter(d => d !== today)].slice(0, 30);
      return { ...prev, [catNum]: updated };
    });
    // Clear in-progress since it's done
    setProgressMap(prev => {
      const next = { ...prev };
      delete next[catNum];
      return next;
    });
  }, [setDailyMap, setHistoryMap, setProgressMap]);

  /* ── Streak ────────────────────────────────────────────── */
  const getStreak_ = useCallback((catNum) => {
    return getStreak(historyMap[catNum]);
  }, [historyMap]);

  /* ── History (last 30 days) ────────────────────────────── */
  const getHistory = useCallback((catNum) => {
    return historyMap[catNum] || [];
  }, [historyMap]);

  /* ── Is completed today ────────────────────────────────── */
  const isCompletedToday = useCallback((catNum) => {
    return dailyMap[catNum] === TODAY();
  }, [dailyMap]);

  return {
    getProgress,
    saveProgress,
    markComplete,
    getStreak: getStreak_,
    getHistory,
    isCompletedToday,
  };
}
