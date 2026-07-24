import { useState, useEffect, useCallback } from 'react';
import { fetchPrayerTimes } from '../services/prayerTimesApi';
import useLocalStorage from './useLocalStorage';
import { STORAGE_KEYS, PRAYER_CITIES } from '../constants';

const DEFAULT_CITY = PRAYER_CITIES.find((c) => c.id === 'cairo');

const PRAYER_KEYS = [
  { key: 'Fajr', name: 'الفجر' },
  { key: 'Sunrise', name: 'الشروق' },
  { key: 'Dhuhr', name: 'الظهر' },
  { key: 'Asr', name: 'العصر' },
  { key: 'Maghrib', name: 'المغرب' },
  { key: 'Isha', name: 'العشاء' },
];

function parseTime(timeStr) {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function getCurrentMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export function getNextPrayerIndex(timings) {
  const current = getCurrentMinutes();
  for (let i = 0; i < PRAYER_KEYS.length; i++) {
    const prayerTime = parseTime(timings[PRAYER_KEYS[i].key]);
    if (prayerTime !== null && current < prayerTime) {
      return i;
    }
  }
  return -1;
}

const usePrayerTimes = () => {
  const [storedCity, setStoredCity] = useLocalStorage(STORAGE_KEYS.PRAYER_CITY, DEFAULT_CITY);
  const [timings, setTimings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const city = PRAYER_CITIES.find((c) => c.id === storedCity?.id) || DEFAULT_CITY;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPrayerTimes(city.lat, city.lng);
        if (!cancelled) {
          setTimings(data.timings);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [city.id, city.lat, city.lng]);

  const setCity = useCallback(
    (newCity) => {
      setStoredCity(newCity);
    },
    [setStoredCity]
  );

  return {
    timings,
    loading,
    error,
    currentCity: city,
    setCity,
    prayerKeys: PRAYER_KEYS,
  };
};

export default usePrayerTimes;
