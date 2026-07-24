import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchPrayerTimes } from '../services/prayerTimesApi';
import useLocalStorage from './useLocalStorage';
import { STORAGE_KEYS, PRAYER_CITIES } from '../constants';

const LOCATION_KEY  = 'prayer-location-v1';
const CACHE_KEY     = 'prayer-times-cache-v1';
const API_BASE      = 'https://api.aladhan.com/v1';
const METHOD        = 4; // Umm Al-Qura

const DEFAULT_CITY = (PRAYER_CITIES && PRAYER_CITIES.find((c) => c.id === 'cairo')) || {
  id: 'cairo', name: 'القاهرة', country: 'مصر', lat: 30.0444, lng: 31.2357
};

export const PRAYER_KEYS = [
  { key: 'Fajr', name: 'الفجر' },
  { key: 'Sunrise', name: 'الشروق' },
  { key: 'Dhuhr', name: 'الظهر' },
  { key: 'Asr', name: 'العصر' },
  { key: 'Maghrib', name: 'المغرب' },
  { key: 'Isha', name: 'العشاء' },
];

export const PRAYER_NAMES = {
  Fajr:    { ar: 'الفجر',   icon: '🌄' },
  Sunrise: { ar: 'الشروق',  icon: '🌅' },
  Dhuhr:   { ar: 'الظهر',   icon: '☀️'  },
  Asr:     { ar: 'العصر',   icon: '🌤️'  },
  Maghrib: { ar: 'المغرب',  icon: '🌇'  },
  Isha:    { ar: 'العشاء',  icon: '🌙'  },
};

export const PRAYER_ORDER = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export function parseTime(timeStr) {
  if (!timeStr) return null;
  const clean = timeStr.split(' ')[0];
  const [h, m] = clean.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

export function parseTimeMinutes(timeStr) {
  if (!timeStr) return null;
  const clean = timeStr.split(' ')[0];
  const [hours, minutes] = clean.split(':').map(Number);
  return hours * 60 + minutes;
}

export function getCurrentMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export function getNextPrayerIndex(timings) {
  if (!timings) return -1;
  const current = getCurrentMinutes();
  for (let i = 0; i < PRAYER_KEYS.length; i++) {
    const prayerTime = parseTimeMinutes(timings[PRAYER_KEYS[i].key]);
    if (prayerTime !== null && current < prayerTime) {
      return i;
    }
  }
  return -1;
}

export function formatCountdown(ms) {
  if (ms <= 0) return '00:00:00';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
}

export default function usePrayerTimes() {
  const [storedCity, setStoredCity] = useLocalStorage(STORAGE_KEYS.PRAYER_CITY, DEFAULT_CITY);
  const currentCity = (PRAYER_CITIES && PRAYER_CITIES.find((c) => c.id === storedCity?.id)) || DEFAULT_CITY;

  const [location, setLocation]     = useLocalStorage(LOCATION_KEY, null);
  const [cache, setCache]           = useLocalStorage(CACHE_KEY, null);

  const [timings, setTimings]       = useState(null);
  const [meta, setMeta]             = useState(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState(null);
  const [locationState, setLocationState] = useState('granted');

  const [now, setNow]               = useState(new Date());
  const tickRef = useRef(null);

  useEffect(() => {
    tickRef.current = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tickRef.current);
  }, []);

  const fetchTimings = useCallback(async (loc) => {
    setIsLoading(true);
    setError(null);
    try {
      if (loc && loc.type === 'coords') {
        const res = await fetch(`${API_BASE}/timings/${Math.floor(Date.now()/1000)}?latitude=${loc.lat}&longitude=${loc.lon}&method=${METHOD}`);
        const json = await res.json();
        setTimings(json.data.timings);
        setMeta(json.data.meta);
      } else if (loc && loc.type === 'city') {
        const res = await fetch(`${API_BASE}/timingsByCity?city=${encodeURIComponent(loc.city)}&country=${encodeURIComponent(loc.country)}&method=${METHOD}`);
        const json = await res.json();
        setTimings(json.data.timings);
        setMeta(json.data.meta);
      } else {
        const data = await fetchPrayerTimes(currentCity.lat, currentCity.lng);
        setTimings(data.timings);
        setMeta(data.meta || { timezone: currentCity.name });
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentCity.lat, currentCity.lng, currentCity.name]);

  useEffect(() => {
    if (location) {
      setLocationState('granted');
      fetchTimings(location);
    } else {
      fetchTimings(null);
    }
  }, [currentCity.id, location, fetchTimings]);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationState('denied');
      return;
    }
    setLocationState('requesting');
    navigator.geolocation.getCurrentPosition(
      pos => {
        const loc = { type: 'coords', lat: pos.coords.latitude, lon: pos.coords.longitude };
        setLocation(loc);
        setLocationState('granted');
        fetchTimings(loc);
      },
      () => setLocationState('denied')
    );
  }, [setLocation, fetchTimings]);

  const setCity = useCallback((newCity, country = 'SA') => {
    if (typeof newCity === 'object') {
      setStoredCity(newCity);
    } else {
      const cityObj = (PRAYER_CITIES && PRAYER_CITIES.find(c => c.name.toLowerCase() === newCity.toLowerCase() || c.id === newCity.toLowerCase())) || { id: newCity, name: newCity, country, lat: 24.7136, lng: 46.6753 };
      setStoredCity(cityObj);
    }
    setLocation(null);
    setLocationState('granted');
  }, [setStoredCity, setLocation]);

  const changeLocation = useCallback(() => {
    setLocation(null);
    setTimings(null);
    setMeta(null);
    setLocationState('idle');
  }, [setLocation]);

  const { currentPrayer, nextPrayer, countdown, progressPct } = (() => {
    if (!timings) return { currentPrayer: null, nextPrayer: null, countdown: '--:--:--', progressPct: 0 };

    const prayers = PRAYER_ORDER.map(key => ({
      key,
      time: parseTime(timings[key]),
    }));

    let currentIdx = -1;
    for (let i = 0; i < prayers.length; i++) {
      if (prayers[i].time && now >= prayers[i].time) currentIdx = i;
    }

    const current = currentIdx >= 0 ? prayers[currentIdx] : null;
    const nextIdx  = currentIdx + 1 < prayers.length ? currentIdx + 1 : null;
    const next     = nextIdx !== null ? prayers[nextIdx] : null;

    const msUntilNext = next && next.time ? next.time - now : 0;
    const countdown   = formatCountdown(msUntilNext);

    let progressPct = 0;
    if (current && next && current.time && next.time) {
      const periodMs  = next.time - current.time;
      const elapsedMs = now - current.time;
      progressPct = Math.min(100, Math.max(0, (elapsedMs / periodMs) * 100));
    }

    return { currentPrayer: current, nextPrayer: next, countdown, progressPct };
  })();

  return {
    timings,
    meta,
    loading: isLoading,
    isLoading,
    error,
    location,
    locationState,
    requestLocation,
    setCity,
    changeLocation,
    currentPrayer,
    nextPrayer,
    countdown,
    progressPct,
    now,
    currentCity,
    prayerKeys: PRAYER_KEYS,
  };
}
