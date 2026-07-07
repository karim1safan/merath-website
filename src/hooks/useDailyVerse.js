import { useState, useEffect } from 'react';
import { fetchRandomVerse, fetchQuranSurah } from '../services/quranTextApi';
import { getTodayString } from '../utils';

const CACHE_KEY = 'quiz-daily-verse';

function isValidVerse(verse) {
  return verse && typeof verse.arabic === 'string' && verse.arabic.trim().length > 0;
}

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
          if (parsed.date === getTodayString() && isValidVerse(parsed.verse)) {
            if (!cancelled) {
              setVerse(parsed.verse);
              setLoading(false);
            }
            return;
          }
          // Clear corrupted or stale cache
          localStorage.removeItem(CACHE_KEY);
        }

        const data = await fetchRandomVerse();

        // Fetch the surah name in Arabic
        let surahName = '';
        const surahNumber = parseInt(data.verse_key?.split(':')[0]) || 0;
        if (surahNumber > 0) {
          try {
            const surahData = await fetchQuranSurah(surahNumber);
            surahName = surahData.surah.name_arabic || '';
          } catch {
            surahName = `${surahNumber}`;
          }
        }

        if (!cancelled) {
          const verseData = {
            arabic: data.arabic,
            translation: data.translations?.sahih_international || '',
            surahName,
            ayahNumber: data.verse_key?.split(':')[1] || '',
            verseKey: data.verse_key || '',
            audio: data.audio?.ayah_audio || '',
          };

          // Only cache if verse has valid content
          if (isValidVerse(verseData)) {
            setVerse(verseData);
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ date: getTodayString(), verse: verseData })
            );
          } else {
            setVerse(null);
          }
          setLoading(false);
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
