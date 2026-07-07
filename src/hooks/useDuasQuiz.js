import { useState, useCallback, useEffect } from 'react';
import { fetchDuaCategories, fetchDuaByCategory } from '../data/duas';
import { shuffleArray } from '../utils';

const useDuasQuiz = (count = 10) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuestions = useCallback(async () => {
    try {
      const catData = await fetchDuaCategories();
      const categories = catData.categories || [];

      const selectedCategories = shuffleArray(categories).slice(0, Math.min(count, categories.length));

      const duaPromises = selectedCategories.map((cat) =>
        fetchDuaByCategory(cat.id).then((data) => ({
          category: cat,
          duas: data.duas || [],
        }))
      );

      const categoryDuas = await Promise.all(duaPromises);

      const allQuestions = [];
      let qIndex = 0;

      for (const { category, duas } of categoryDuas) {
        if (duas.length === 0) continue;

        const dua = duas[Math.floor(Math.random() * duas.length)];
        const questionType = Math.random();

        if (questionType < 0.4) {
          const wrongCategories = categories
            .filter((c) => c.id !== category.id)
            .map((c) => c.name)
            .slice(0, 3);

          const options = shuffleArray([category.name, ...wrongCategories]);

          allQuestions.push({
            id: `duas-q-${qIndex}-category`,
            question: `في أي مناسبة هذه الدعاء:\n"${dua.arabic?.substring(0, 100)}..."`,
            options,
            correctAnswer: options.indexOf(category.name),
            explanation: `${dua.title} - المصدر: ${dua.source}`,
            difficulty: 'easy',
            category: 'duas',
            topic: '分类 الدعاء',
          });
        } else if (questionType < 0.7) {
          const wrongDuas = duas
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
            question: `ما هي أدعية ${category.name}؟`,
            options,
            correctAnswer: options.indexOf(dua.arabic?.substring(0, 60) || ''),
            explanation: `${dua.title} - المصدر: ${dua.source}`,
            difficulty: 'medium',
            category: 'duas',
            topic: 'تحديد الدعاء',
          });
        } else {
          const translation = dua.translation || '';
          const wrongTranslations = duas
            .filter((d) => d.id !== dua.id)
            .map((d) => d.translation?.substring(0, 60) || '')
            .filter(Boolean)
            .slice(0, 3);

          while (wrongTranslations.length < 3) {
            wrongTranslations.push('Translation not available');
          }

          const options = shuffleArray([
            translation.substring(0, 60),
            ...wrongTranslations.map((t) => t.substring(0, 60)),
          ]);

          allQuestions.push({
            id: `duas-q-${qIndex}-translation`,
            question: `ما ترجمة هذه الدعاء:\n"${dua.arabic?.substring(0, 80)}..."`,
            options,
            correctAnswer: options.indexOf(translation.substring(0, 60)),
            explanation: `${dua.title} - المصدر: ${dua.source}`,
            difficulty: 'hard',
            category: 'duas',
            topic: 'ترجمة الدعاء',
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
