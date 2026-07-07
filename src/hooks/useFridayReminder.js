import { useState, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { STORAGE_KEYS } from '../constants';

function isFriday() {
  return new Date().getDay() === 5;
}

function getTodayDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

const useFridayReminder = () => {
  const [dismissedDate, setDismissedDate] = useLocalStorage(STORAGE_KEYS.FRIDAY_REMINDER, null);

  const showBanner = isFriday() && dismissedDate !== getTodayDate();

  const dismiss = useCallback(() => {
    setDismissedDate(getTodayDate());
  }, [setDismissedDate]);

  return { showBanner, dismiss };
};

export default useFridayReminder;
