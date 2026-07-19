import { useState, useCallback, useEffect } from 'react';
import { shuffleArray } from '../utils';

const useGharibQuiz = (count = 10) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuestions = useCallback(async () => {
    try {
      const { default: data } = await import('../data/gharib-alquran.json');

      if (data.length < 4) {
        throw new Error('Not enough data');
      }

      const selected = shuffleArray(data).slice(0, count);

      const allQuestions = selected.map((entry, i) => {
        const questionType = Math.random();

        if (questionType < 0.5) {
          // Meaning question: what does word X mean?
          const wrongMeanings = data
            .filter((e) => e.id !== entry.id)
            .map((e) => e.meaning)
            .filter((m) => m !== entry.meaning)
            .slice(0, 3);

          if (wrongMeanings.length < 3) return null;

          const options = shuffleArray([entry.meaning, ...wrongMeanings]);

          return {
            id: `gharib-q-${i}-meaning`,
            question: `ما معنى كلمة "${entry.word}" في سورة ${entry.surah}؟`,
            options,
            correctAnswer: options.indexOf(entry.meaning),
            explanation: `${entry.word} — ${entry.meaning}`,
            difficulty: 'easy',
            category: 'gharib',
            topic: 'معنى الكلمة',
          };
        } else {
          // Identify question: which word means X?
          const wrongWords = data
            .filter((e) => e.id !== entry.id)
            .map((e) => e.word)
            .filter((w) => w !== entry.word)
            .slice(0, 3);

          if (wrongWords.length < 3) return null;

          const options = shuffleArray([entry.word, ...wrongWords]);

          return {
            id: `gharib-q-${i}-identify`,
            question: `أي الكلمات التالية تعني "${entry.meaning}" في سورة ${entry.surah}؟`,
            options,
            correctAnswer: options.indexOf(entry.word),
            explanation: `${entry.word} — ${entry.meaning}`,
            difficulty: 'medium',
            category: 'gharib',
            topic: 'تحديد الكلمة',
          };
        }
      });

      const filtered = allQuestions.filter(Boolean);
      setQuestions(filtered);
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

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchQuestions();
  }, [fetchQuestions]);

  return { questions, loading, error, refetch };
};

export default useGharibQuiz;
