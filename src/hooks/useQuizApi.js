import { useState, useEffect } from 'react';
import { fetchRandomQuestions, fetchQuestionsByCategory } from '../services/quizApi';
import { transformApiQuestions } from '../utils/transformQuestions';

const CATEGORY_API_MAP = {
  tafseer: 1,
  aqeedah: 2,
  sira: 3,
  hadith: 4,
  figh: 5,
  history: 6,
};

function useQuizApi(category, count = 20) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadQuestions() {
      setLoading(true);
      setError(null);

      try {
        let rawData;

        if (category && CATEGORY_API_MAP[category]) {
          const categoryId = CATEGORY_API_MAP[category];
          const result = await fetchQuestionsByCategory(categoryId, 1, count);
          rawData = result.questions || [];
        } else {
          rawData = await fetchRandomQuestions(count);
        }

        if (!cancelled) {
          const transformed = transformApiQuestions(rawData);
          setQuestions(transformed);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('API fetch error:', err);
          setError(err.message);
          setQuestions([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadQuestions();

    return () => {
      cancelled = true;
    };
  }, [category, count]);

  return { questions, loading, error };
}

export default useQuizApi;
