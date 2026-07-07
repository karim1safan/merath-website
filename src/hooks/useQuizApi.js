import { useState, useEffect } from 'react';
import {
  fetchRandomQuestions,
  fetchQuestionsByCategory,
  fetchCategories,
} from '../services/quizApi';
import { transformApiQuestions } from '../utils/transformQuestions';

let categoryMapCache = null;

async function getCategoryMap() {
  if (categoryMapCache) return categoryMapCache;

  const categories = await fetchCategories();
  categoryMapCache = {};
  categories.forEach((cat) => {
    categoryMapCache[cat.englishName] = cat.id;
  });
  // sira uses API category 5 (التاريخ — topic "العهد النبوي")
  categoryMapCache.sira = 5;
  return categoryMapCache;
}

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

        if (category) {
          const categoryMap = await getCategoryMap();
          const categoryId = categoryMap[category];

          if (categoryId) {
            const result = await fetchQuestionsByCategory(categoryId, 1, count);
            rawData = result.questions || [];
          } else {
            rawData = await fetchRandomQuestions(count);
          }
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
