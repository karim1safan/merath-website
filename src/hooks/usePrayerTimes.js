import { useState, useEffect, useCallback, useRef } from 'react';
import useLocalStorage from './useLocalStorage';

const LOCATION_KEY  = 'prayer-location-v1';
const CACHE_KEY     = 'prayer-times-cache-v1';
const API_BASE      = 'https://api.aladhan.com/v1';
const METHOD        = 4; // Umm Al-Qura

const PRAYER_NAMES = {
  Fajr:    { ar: 'الفجر',   icon: '🌄' },
  Sunrise: { ar: 'الشروق',  icon: '🌅' },
  Dhuhr:   { ar: 'الظهر',   icon: '☀️'  },
  Asr:     { ar: 'العصر',   icon: '🌤️'  },
  Maghrib: { ar: 'المغرب',  icon: '🌇'  },
  Isha:    { ar: 'العشاء',  icon: '🌙'  },
};

const PRAYER_ORDER = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function parseTime(timeStr) {
  // timeStr like "05:23" or "05:23 (AST)"
  const clean = timeStr.split(' ')[0];
  const [h, m] = clean.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function formatCountdown(ms) {
  if (ms <= 0) return '00:00:00';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
}

async function fetchByCoords(lat, lon) {
  const date = todayStr();
  const res = await fetch(
    `${API_BASE}/timings/${Math.floor(Date.now()/1000)}?latitude=${lat}&longitude=${lon}&method=${METHOD}`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json.data;
}

async function fetchByCity(city, country) {
  const res = await fetch(
    `${API_BASE}/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${METHOD}`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json.code !== 200) throw new Error('City not found');
  return json.data;
}

export { PRAYER_NAMES, PRAYER_ORDER, parseTime, formatCountdown };

export default function usePrayerTimes() {
  const [location, setLocation]     = useLocalStorage(LOCATION_KEY, null);
  const [cache, setCache]           = useLocalStorage(CACHE_KEY, null);

  const [timings, setTimings]       = useState(null);
  const [meta, setMeta]             = useState(null);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState(null);
  const [locationState, setLocationState] = useState('idle'); // idle | requesting | granted | denied | city

  // Countdown
  const [now, setNow]               = useState(new Date());
  const tickRef = useRef(null);

  // Tick every second
  useEffect(() => {
    tickRef.current = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tickRef.current);
  }, []);

  /* ── Fetch ───────────────────────────────────────────────── */
  const fetchTimings = useCallback(async (loc) => {
    // Check cache (same day + same location)
    if (cache && cache.date === todayStr() && cache.locKey === JSON.stringify(loc)) {
      setTimings(cache.timings);
      setMeta(cache.meta);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      let data;
      if (loc.type === 'coords') {
        data = await fetchByCoords(loc.lat, loc.lon);
      } else {
        data = await fetchByCity(loc.city, loc.country);
      }
      const newCache = {
        date: todayStr(),
        locKey: JSON.stringify(loc),
        timings: data.timings,
        meta: data.meta,
      };
      setCache(newCache);
      setTimings(data.timings);
      setMeta(data.meta);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [cache, setCache]);

  /* ── Request geolocation ────────────────────────────────── */
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

  /* ── Set city manually ──────────────────────────────────── */
  const setCity = useCallback((city, country = 'SA') => {
    const loc = { type: 'city', city, country };
    setLocation(loc);
    setLocationState('granted');
    fetchTimings(loc);
  }, [setLocation, fetchTimings]);

  /* ── Change location ────────────────────────────────────── */
  const changeLocation = useCallback(() => {
    setLocation(null);
    setTimings(null);
    setMeta(null);
    setLocationState('idle');
  }, [setLocation]);

  /* ── Auto-load on mount if location saved ───────────────── */
  useEffect(() => {
    if (location) {
      setLocationState('granted');
      fetchTimings(location);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once

  /* ── Derived: current & next prayer ────────────────────── */
  const { currentPrayer, nextPrayer, countdown, progressPct } = (() => {
    if (!timings) return { currentPrayer: null, nextPrayer: null, countdown: '--:--:--', progressPct: 0 };

    const prayers = PRAYER_ORDER.map(key => ({
      key,
      time: parseTime(timings[key]),
    }));

    // Find current (last prayer whose time has passed)
    let currentIdx = -1;
    for (let i = 0; i < prayers.length; i++) {
      if (now >= prayers[i].time) currentIdx = i;
    }

    const current = currentIdx >= 0 ? prayers[currentIdx] : null;
    const nextIdx  = currentIdx + 1 < prayers.length ? currentIdx + 1 : null;
    const next     = nextIdx !== null ? prayers[nextIdx] : null;

    const msUntilNext = next ? next.time - now : 0;
    const countdown   = formatCountdown(msUntilNext);

    // Progress ring: elapsed / total period
    let progressPct = 0;
    if (current && next) {
      const periodMs  = next.time - current.time;
      const elapsedMs = now - current.time;
      progressPct = Math.min(100, Math.max(0, (elapsedMs / periodMs) * 100));
    }

    return { currentPrayer: current, nextPrayer: next, countdown, progressPct };
  })();

  return {
    timings, meta,
    isLoading, error,
    location, locationState,
    requestLocation, setCity, changeLocation,
    currentPrayer, nextPrayer,
    countdown, progressPct,
    now,
  };
}
