import { useState, useEffect } from 'react';
import { fetchQuranSurah } from '../services/quranTextApi';
import { fetchSuwar, fetchReciters, fetchTafasir } from '../services/quranAudioApi';

const SURAH_LIST = Array.from({ length: 114 }, (_, i) => i + 1);

const useQuranExplorer = () => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSuwar('ar');
        if (!cancelled) {
          setSurahs(data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to fetch suwar:', err);
          setError(err.message);
          setSurahs([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { surahs, loading, error };
};

const useReciters = () => {
  const [reciters, setReciters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchReciters('ar');
        if (!cancelled) {
          setReciters(data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to fetch reciters:', err);
          setError(err.message);
          setReciters([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { reciters, loading, error };
};

const useTafasir = () => {
  const [tafasir, setTafasir] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTafasir('ar');
        if (!cancelled) {
          setTafasir(data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to fetch tafasir:', err);
          setError(err.message);
          setTafasir([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { tafasir, loading, error };
};

const useQuranSurah = (surahNumber) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchQuranSurah(surahNumber);
        if (!cancelled) {
          setData(result);
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
  }, [surahNumber]);

  return { data, loading, error };
};

export { useQuranExplorer, useReciters, useTafasir, useQuranSurah, SURAH_LIST };
