import { useState, useEffect, useCallback } from 'react';
import { fetchTafsirAyah, TAFSIR_EDITIONS } from '../services/tafsirApi';

// Global cache — survives component unmounts/remounts for the session lifetime
const tafsirCache = new Map();

function cacheKey(surah, ayah, edition) {
  return `${surah}:${ayah}:${edition}`;
}

export default function useTafsir(surahNumber, ayahNumber, edition) {
  const [data, setData]           = useState(() => {
    const key = cacheKey(surahNumber, ayahNumber, edition);
    return tafsirCache.get(key) ?? null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState(null);

  useEffect(() => {
    if (!surahNumber || !ayahNumber || !edition) return;
    const key = cacheKey(surahNumber, ayahNumber, edition);

    if (tafsirCache.has(key)) {
      setData(tafsirCache.get(key));
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setData(null);

    fetchTafsirAyah(surahNumber, ayahNumber, edition)
      .then(text => {
        if (cancelled) return;
        tafsirCache.set(key, text);
        setData(text);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [surahNumber, ayahNumber, edition]);

  // Prefetch next N ayahs for all editions silently in background
  const prefetch = useCallback((nextAyahs) => {
    for (const { surah, ayah } of nextAyahs) {
      for (const ed of Object.values(TAFSIR_EDITIONS)) {
        const key = cacheKey(surah, ayah, ed);
        if (!tafsirCache.has(key)) {
          fetchTafsirAyah(surah, ayah, ed)
            .then(text => tafsirCache.set(key, text))
            .catch(() => {});
        }
      }
    }
  }, []);

  return { data, isLoading, error, prefetch };
}
