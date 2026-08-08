import { useState, useCallback, useRef } from 'react';
import { fetchTafseer, TAFSEER_OPTIONS } from '../services/tafseerApi';
import { STORAGE_KEYS } from '../constants';

function loadPreferredTafseer() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TAFSEER);
    if (stored && TAFSEER_OPTIONS.some((t) => t.id === stored)) {
      return stored;
    }
  } catch {
    // ignore
  }
  return TAFSEER_OPTIONS[0].id;
}

function savePreferredTafseer(tafseerId) {
  try {
    localStorage.setItem(STORAGE_KEYS.TAFSEER, tafseerId);
  } catch {
    // ignore
  }
}

export function useTafseer(surahNumber) {
  const [selectedTafseer, setSelectedTafseerState] = useState(loadPreferredTafseer);
  const [tafseerData, setTafseerData] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const cacheRef = useRef({});

  const setSelectedTafseer = useCallback((id) => {
    setSelectedTafseerState(id);
    savePreferredTafseer(id);
  }, []);

  const fetchAyahTafseer = useCallback(
    async (ayahNumber, tafseerId) => {
      const cacheKey = `${surahNumber}-${ayahNumber}-${tafseerId}`;

      if (cacheRef.current[cacheKey]) {
        setTafseerData((prev) => ({ ...prev, [cacheKey]: cacheRef.current[cacheKey] }));
        return cacheRef.current[cacheKey];
      }

      setLoading((prev) => ({ ...prev, [cacheKey]: true }));
      setErrors((prev) => ({ ...prev, [cacheKey]: null }));

      try {
        const result = await fetchTafseer(surahNumber, ayahNumber, tafseerId);
        cacheRef.current[cacheKey] = result;
        setTafseerData((prev) => ({ ...prev, [cacheKey]: result }));
        return result;
      } catch (err) {
        setErrors((prev) => ({ ...prev, [cacheKey]: err.message }));
        return null;
      } finally {
        setLoading((prev) => ({ ...prev, [cacheKey]: false }));
      }
    },
    [surahNumber]
  );

  const getTafseer = useCallback(
    (ayahNumber, tafseerId) => {
      const key = `${surahNumber}-${ayahNumber}-${tafseerId}`;
      return {
        data: tafseerData[key] || cacheRef.current[key] || null,
        loading: loading[key] || false,
        error: errors[key] || null,
      };
    },
    [surahNumber, tafseerData, loading, errors]
  );

  return {
    selectedTafseer,
    setSelectedTafseer,
    fetchAyahTafseer,
    getTafseer,
  };
}
