import { useState, useEffect } from 'react';
import { fetchQuranSurah } from '../services/ummahApi';

const SURAH_LIST = Array.from({ length: 114 }, (_, i) => i + 1);

const SURAH_NAMES = [
  { number: 1, name: 'الفاتحة', english: 'Al-Fatiha', meaning: 'The Opener', verses: 7, place: 'مكية' },
  { number: 2, name: 'البقرة', english: 'Al-Baqarah', meaning: 'The Cow', verses: 286, place: 'مدنية' },
  { number: 3, name: 'آل عمران', english: 'Aal-Imran', meaning: 'Family of Imran', verses: 200, place: 'مدنية' },
  { number: 4, name: 'النساء', english: 'An-Nisa', meaning: 'The Women', verses: 176, place: 'مدنية' },
  { number: 5, name: 'المائدة', english: 'Al-Ma\'idah', meaning: 'The Table Spread', verses: 120, place: 'مدنية' },
  { number: 6, name: 'الأنعام', english: 'Al-An\'am', meaning: 'The Cattle', verses: 165, place: 'مكية' },
  { number: 7, name: 'الأعراف', english: 'Al-A\'raf', meaning: 'The Heights', verses: 206, place: 'مكية' },
  { number: 8, name: 'الأنفال', english: 'Al-Anfal', meaning: 'The Spoils of War', verses: 75, place: 'مدنية' },
  { number: 9, name: 'التوبة', english: 'At-Tawbah', meaning: 'The Repentance', verses: 129, place: 'مدنية' },
  { number: 10, name: 'يونس', english: 'Yunus', meaning: 'Jonah', verses: 109, place: 'مكية' },
];

const useQuranExplorer = () => {
  return { surahs: SURAH_NAMES, loading: false };
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

export { useQuranExplorer, useQuranSurah, SURAH_LIST, SURAH_NAMES };
