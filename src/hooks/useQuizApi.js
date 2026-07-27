import { useState, useEffect } from 'react';
import {
  fetchRandomQuestions,
  fetchMultiplePages,
  fetchQuestionsByTopic,
} from '../services/quizApi';
import { CATEGORIES } from '../constants';
import { transformApiQuestions } from '../utils/transformQuestions';
import { shuffleArray } from '../utils';

function useQuizApi(category, count = 20, initialQuestions = null, topicSlug = null) {
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
          const categoryInfo = CATEGORIES.find((c) => c.id === category);
          const categoryId = categoryInfo?.apiId;

          if (topicSlug && categoryId) {
            rawData = await fetchQuestionsByTopic(categoryId, topicSlug, count);
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
  }, [category, count, initialQuestions, topicSlug]);

  return { questions, loading, error };
}

export default useQuizApi;
