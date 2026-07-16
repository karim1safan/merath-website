import { useState, useEffect } from 'react';
import {
  fetchRandomQuestions,
  fetchMultiplePages,
  fetchQuestionsByTopic,
  fetchCategories,
} from '../services/quizApi';
import { transformApiQuestions } from '../utils/transformQuestions';
import { shuffleArray } from '../utils';

const HISTORY_CATEGORIES = {
  sirah: 'sirah',
  kholfa: 'kholfa',
  amwi: 'amwi',
  osmany: 'osmany',
  mamalik: 'mamalik',
  abasi: 'abasi',
  moasir: 'moasir',
};

let categoryMapCache = null;

async function getCategoryMap() {
  if (categoryMapCache) return categoryMapCache;

  const categories = await fetchCategories();
  categoryMapCache = {};
  categories.forEach((cat) => {
    categoryMapCache[cat.englishName] = cat.id;
  });
  Object.keys(HISTORY_CATEGORIES).forEach((key) => {
    categoryMapCache[key] = 5;
  });
  return categoryMapCache;
}

function useQuizApi(category, count = 20, initialQuestions = null) {
  const [questions, setQuestions] = useState(initialQuestions || []);
  const [loading, setLoading] = useState(!initialQuestions);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialQuestions) return;

    let cancelled = false;

    async function loadQuestions() {
      setLoading(true);
      setError(null);

      try {
        let rawData;

        if (category) {
          const categoryMap = await getCategoryMap();
          const categoryId = categoryMap[category];

          if (categoryId && HISTORY_CATEGORIES[category]) {
            rawData = await fetchQuestionsByTopic(categoryId, HISTORY_CATEGORIES[category], count);
          } else if (categoryId) {
            rawData = await fetchMultiplePages(categoryId, 5, 50);
          } else {
            rawData = await fetchRandomQuestions(count);
          }
        } else {
          rawData = await fetchRandomQuestions(count);
        }

        if (!cancelled) {
          const transformed = transformApiQuestions(rawData);
          const shuffled = shuffleArray(transformed);
          setQuestions(shuffled.slice(0, count));
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
  }, [category, count, initialQuestions]);

  return { questions, loading, error };
}

export default useQuizApi;
