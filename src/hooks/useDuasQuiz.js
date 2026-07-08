import { useState, useCallback, useEffect } from 'react';
import { fetchDhikrCategories, fetchDhikrByCategory } from '../services/dhikrApi';
import { shuffleArray } from '../utils';

const useDuasQuiz = (count = 10) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuestions = useCallback(async () => {
    try {
      const catData = await fetchDhikrCategories();
      const categories = catData.categories || [];

      const selectedCategories = shuffleArray(categories).slice(0, Math.min(count, categories.length));

      const duaPromises = selectedCategories.map((cat) =>
        fetchDhikrByCategory(cat.number).then((data) => ({
          category: cat,
          items: data.items || [],
        }))
      );

      const categoryDuas = await Promise.all(duaPromises);

      const allQuestions = [];
      let qIndex = 0;

      for (const { category, items } of categoryDuas) {
        if (items.length === 0) continue;

        const dua = items[Math.floor(Math.random() * items.length)];
        const questionType = Math.random();

        if (questionType < 0.4) {
          const wrongCategories = categories
            .filter((c) => c.number !== category.number)
            .map((c) => c.nameAr)
            .slice(0, 3);

          const options = shuffleArray([category.nameAr, ...wrongCategories]);

          allQuestions.push({
            id: `duas-q-${qIndex}-category`,
            question: `في أي مناسبة هذا الذكر:\n"${dua.arabic?.substring(0, 100)}..."`,
            options,
            correctAnswer: options.indexOf(category.nameAr),
            explanation: `${category.nameAr} - ${dua.source || ''}`,
            difficulty: 'easy',
            category: 'duas',
            topic: 'أنواع الأذكار',
          });
        } else if (questionType < 0.7) {
          const wrongDuas = items
            .filter((d) => d.id !== dua.id)
            .map((d) => d.arabic?.substring(0, 60) || '')
            .filter(Boolean)
            .slice(0, 3);

          while (wrongDuas.length < 3) {
            wrongDuas.push('...');
          }

          const options = shuffleArray([
            dua.arabic?.substring(0, 60) || '',
            ...wrongDuas,
          ]);

          allQuestions.push({
            id: `duas-q-${qIndex}-identify`,
            question: `ما هي أذكار ${category.nameAr}؟`,
            options,
            correctAnswer: options.indexOf(dua.arabic?.substring(0, 60) || ''),
            explanation: `${category.nameAr} - ${dua.source || ''}`,
            difficulty: 'medium',
            category: 'duas',
            topic: 'تحديد الذكر',
          });
        } else {
          const translation = dua.translation?.substring(0, 60) || '';
          const wrongTranslations = items
            .filter((d) => d.id !== dua.id)
            .map((d) => d.translation?.substring(0, 60) || '')
            .filter(Boolean)
            .slice(0, 3);

          while (wrongTranslations.length < 3) {
            wrongTranslations.push('Translation not available');
          }

          const options = shuffleArray([
            translation,
            ...wrongTranslations.map((t) => t.substring(0, 60)),
          ]);

          allQuestions.push({
            id: `duas-q-${qIndex}-translation`,
            question: `ما ترجمة هذا الذكر:\n"${dua.arabic?.substring(0, 80)}..."`,
            options,
            correctAnswer: options.indexOf(translation),
            explanation: `${category.nameAr} - ${dua.source || ''}`,
            difficulty: 'hard',
            category: 'duas',
            topic: 'ترجمة الذكر',
          });
        }

        qIndex++;
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

export default useDuasQuiz;
