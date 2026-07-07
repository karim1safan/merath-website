import { useState, useCallback, useEffect } from 'react';
import { fetchHadithFromCDN } from '../services/hadithApi';
import { shuffleArray } from '../utils';

const COLLECTIONS = [
  { id: 'ara-bukhari', name: 'صحيح البخاري', max: 7008 },
  { id: 'ara-muslim', name: 'صحيح مسلم', max: 7500 },
  { id: 'ara-abudawud', name: 'سنن أبي داود', max: 5274 },
  { id: 'ara-tirmidhi', name: 'جامع الترمذي', max: 3956 },
  { id: 'ara-nasai', name: 'سنن النسائي', max: 5761 },
  { id: 'ara-ibnmajah', name: 'سنن ابن ماجه', max: 4341 },
  { id: 'ara-malik', name: 'موطأ الإمام مالك', max: 1838 },
];

const ARABIC_GRADES = ['صحيح', 'حسن', 'ضعيف', 'موضوع'];

const useHadithQuiz = (count = 10) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuestions = useCallback(async () => {
    try {
      const fetchPromises = [];
      const usedEditions = [];

      for (let i = 0; i < count; i++) {
        const col = COLLECTIONS[Math.floor(Math.random() * COLLECTIONS.length)];
        usedEditions.push(col);
        const hadithNum = Math.floor(Math.random() * col.max) + 1;
        fetchPromises.push(
          fetchHadithFromCDN(col.id, hadithNum)
            .then((h) => (h ? { ...h, collectionName: col.name, collectionId: col.id } : null))
            .catch(() => null)
        );
      }

      const hadithResults = await Promise.all(fetchPromises);
      const validHadiths = hadithResults.filter(Boolean);

      const allQuestions = [];

      validHadiths.forEach((hadith, i) => {
        if (!hadith.text) return;

        const questionType = Math.random();

        if (questionType < 0.4) {
          const correctName = hadith.collectionName;
          const wrongNames = COLLECTIONS
            .filter((c) => c.id !== hadith.collectionId)
            .map((c) => c.name)
            .slice(0, 3);

          const options = shuffleArray([correctName, ...wrongNames]);

          allQuestions.push({
            id: `hadith-q-${i}-source`,
            question: `من أي كتاب هذا الحديث:\n"${hadith.text}"`,
            options,
            correctAnswer: options.indexOf(correctName),
            explanation: `الحديث رقم ${hadith.hadithnumber} من ${correctName}`,
            difficulty: 'easy',
            category: 'hadith',
            topic: 'مصدر الحديث',
          });
        } else if (questionType < 0.7) {
          const words = hadith.text.split(' ');
          const splitIndex = Math.max(Math.floor(words.length / 2), 5);
          const firstHalf = words.slice(0, splitIndex).join(' ');
          const secondHalf = words.slice(splitIndex).join(' ');

          const wrongTexts = validHadiths
            .filter((h) => h.collectionId !== hadith.collectionId || h.hadithnumber !== hadith.hadithnumber)
            .map((h) => {
              const w = h.text.split(' ');
              const s = Math.max(Math.floor(w.length / 2), 5);
              return w.slice(s).join(' ');
            })
            .filter((t) => t.length > 10)
            .slice(0, 3);

          while (wrongTexts.length < 3) {
            wrongTexts.push('...');
          }

          const options = shuffleArray([secondHalf, ...wrongTexts]);

          allQuestions.push({
            id: `hadith-q-${i}-complete`,
            question: `أكمل هذا الحديث:\n"${firstHalf}..."`,
            options,
            correctAnswer: options.indexOf(secondHalf),
            explanation: `الحديث من ${hadith.collectionName} رقم ${hadith.hadithnumber}`,
            difficulty: 'medium',
            category: 'hadith',
            topic: 'إتمام الحديث',
          });
        } else {
          const correctGrade = ARABIC_GRADES[Math.floor(Math.random() * 2)];
          const wrongGrades = ARABIC_GRADES
            .filter((g) => g !== correctGrade)
            .slice(0, 3);

          while (wrongGrades.length < 3) {
            wrongGrades.push('غير معروف');
          }

          const options = shuffleArray([correctGrade, ...wrongGrades]);

          allQuestions.push({
            id: `hadith-q-${i}-grade`,
            question: `ما درجة هذا الحديث:\n"${hadith.text}"`,
            options,
            correctAnswer: options.indexOf(correctGrade),
            explanation: `الحديث من ${hadith.collectionName} - الدرجة: ${correctGrade}`,
            difficulty: 'hard',
            category: 'hadith',
            topic: 'درجة الحديث',
          });
        }
      });

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

export default useHadithQuiz;
