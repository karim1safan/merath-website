import { useState, useCallback, useEffect } from 'react';
import { fetchQuranSurah } from '../services/quranTextApi';
import { shuffleArray } from '../utils';

const SURAH_NUMBERS = [1, 2, 3, 18, 36, 55, 67, 73, 108, 112, 113, 114];

const useQuranQuiz = (count = 10) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuestions = useCallback(async () => {
    try {
      const selectedSurahs = shuffleArray(SURAH_NUMBERS).slice(0, Math.min(count, SURAH_NUMBERS.length));
      const surahDataPromises = selectedSurahs.map((num) => fetchQuranSurah(num));
      const surahResults = await Promise.all(surahDataPromises);

      const allQuestions = [];

      for (let i = 0; i < surahResults.length; i++) {
        const surahData = surahResults[i];
        const surah = surahData.surah;
        const verses = surahData.verses;

        if (!verses || verses.length === 0) continue;

        const randomVerse = verses[Math.floor(Math.random() * verses.length)];
        const questionType = Math.random();

        if (questionType < 0.5) {
          const wrongSurahs = surahResults
            .filter((_, idx) => idx !== i)
            .map((s) => s.surah);
          const wrongNames = wrongSurahs.map((s) => s.name_arabic);

          const options = shuffleArray([
            surah.name_arabic,
            ...wrongNames.slice(0, 3),
          ]);

          allQuestions.push({
            id: `quran-q-${i}-surah`,
            question: `ما اسم السورة التي فيها هذه الآية:\n"${randomVerse.arabic}"`,
            options,
            correctAnswer: options.indexOf(surah.name_arabic),
            explanation: `${surah.name_english} - الآية ${randomVerse.ayah}`,
            difficulty: 'medium',
            category: 'quran',
            topic: 'اسم السورة',
          });
        } else if (questionType < 0.75) {
          const words = randomVerse.arabic.split(' ');
          const halfIndex = Math.floor(words.length / 2);
          const firstHalf = words.slice(0, halfIndex).join(' ');
          const secondHalf = words.slice(halfIndex).join(' ');

          const wrongOptions = verses
            .filter((v) => v.ayah !== randomVerse.ayah)
            .slice(0, 3)
            .map((v) => {
              const w = v.arabic.split(' ');
              const h = Math.floor(w.length / 2);
              return w.slice(h).join(' ');
            });

          while (wrongOptions.length < 3) {
            wrongOptions.push('...');
          }

          const options = shuffleArray([secondHalf, ...wrongOptions.slice(0, 3)]);

          allQuestions.push({
            id: `quran-q-${i}-complete`,
            question: `أكمل الآية:\n"${firstHalf}..."`,
            options,
            correctAnswer: options.indexOf(secondHalf),
            explanation: `${surah.name_english} - الآية ${randomVerse.ayah}`,
            difficulty: 'hard',
            category: 'quran',
            topic: 'إتمام الآية',
          });
        } else {
          const translation = randomVerse.translations?.sahih_international || 'No translation available';
          const wrongTranslations = verses
            .filter((v) => v.ayah !== randomVerse.ayah)
            .slice(0, 3)
            .map((v) => v.translations?.sahih_international || 'No translation');

          while (wrongTranslations.length < 3) {
            wrongTranslations.push('Translation not available');
          }

          const options = shuffleArray([translation, ...wrongTranslations.slice(0, 3)]);

          allQuestions.push({
            id: `quran-q-${i}-meaning`,
            question: `ما معنى هذه الآية:\n"${randomVerse.arabic}"`,
            options,
            correctAnswer: options.indexOf(translation),
            explanation: `${surah.name_english} - الآية ${randomVerse.ayah}`,
            difficulty: 'easy',
            category: 'quran',
            topic: 'معنى الآية',
          });
        }
      }

      setQuestions(shuffleArray(allQuestions).slice(0, count));
    } catch (err) {
      setError(err.message);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [count]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchQuestions();
  }, [fetchQuestions]);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    await fetchQuestions();
  }, [fetchQuestions]);

  return { questions, loading, error, refetch };
};

export default useQuranQuiz;
