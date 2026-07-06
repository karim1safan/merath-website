import { useState, useEffect } from 'react';
import { fetchRandomVerse } from '../services/ummahApi';
import { getTodayString } from '../utils';

const CACHE_KEY = 'quiz-daily-verse';

const useDailyVerse = () => {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadVerse() {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.date === getTodayString()) {
            if (!cancelled) {
              setVerse(parsed.verse);
              setLoading(false);
            }
            return;
          }
        }

        const data = await fetchRandomVerse();
        if (!cancelled) {
          const verseData = {
            arabic: data.arabic,
            translation: data.translations?.sahih_international || '',
            surahName: data.verse_key?.split(':')[0] || '',
            ayahNumber: data.verse_key?.split(':')[1] || '',
            verseKey: data.verse_key || '',
            audio: data.audio?.ayah_audio || '',
          };
          setVerse(verseData);
          setLoading(false);

          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ date: getTodayString(), verse: verseData })
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    loadVerse();
    return () => {
      cancelled = true;
    };
  }, []);

  return { verse, loading, error };
};

export default useDailyVerse;
