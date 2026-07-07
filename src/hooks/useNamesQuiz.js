import { useState, useCallback, useEffect } from 'react';
import { fetchAsmaUlHusna } from '../data/asmaUlHusna';
import { shuffleArray } from '../utils';

const useNamesQuiz = (count = 10) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuestions = useCallback(async () => {
    try {
      const data = await fetchAsmaUlHusna();
      const names = data.names || [];

      if (names.length < 4) {
        throw new Error('Not enough names data');
      }

      const selectedNames = shuffleArray(names).slice(0, count);

      const allQuestions = selectedNames.map((name, i) => {
        const questionType = Math.random();

        if (questionType < 0.4) {
          const wrongMeanings = names
            .filter((n) => n.number !== name.number)
            .map((n) => n.english)
            .slice(0, 3);

          const options = shuffleArray([name.english, ...wrongMeanings]);

          return {
            id: `names-q-${i}-meaning`,
            question: `ما معنى اسم الله: ${name.arabic}؟`,
            options,
            correctAnswer: options.indexOf(name.english),
            explanation: `${name.transliteration} - ${name.meaning}`,
            difficulty: 'easy',
            category: 'names',
            topic: 'معنى الاسم',
          };
        } else if (questionType < 0.7) {
          const wrongArabic = names
            .filter((n) => n.number !== name.number)
            .map((n) => n.arabic)
            .slice(0, 3);

          const options = shuffleArray([name.arabic, ...wrongArabic]);

          return {
            id: `names-q-${i}-identify`,
            question: `ما هو اسم الله الذي يعني "${name.english}"؟`,
            options,
            correctAnswer: options.indexOf(name.arabic),
            explanation: `${name.transliteration} - ${name.meaning}`,
            difficulty: 'medium',
            category: 'names',
            topic: 'تحديد الاسم',
          };
        } else {
          const wrongTransliterations = names
            .filter((n) => n.number !== name.number)
            .map((n) => n.transliteration)
            .slice(0, 3);

          const options = shuffleArray([name.transliteration, ...wrongTransliterations]);

          return {
            id: `names-q-${i}-translit`,
            question: `كيف يُكتب هذا الاسم بالحروف اللاتينية:\n${name.arabic}`,
            options,
            correctAnswer: options.indexOf(name.transliteration),
            explanation: `${name.english} - ${name.meaning}`,
            difficulty: 'hard',
            category: 'names',
            topic: 'الكتابة اللاتينية',
          };
        }
      });

      setQuestions(allQuestions);
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

export default useNamesQuiz;
