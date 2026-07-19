export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const seededShuffle = (array, seed) => {
  const shuffled = [...array];
  let s = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getDateSeed = () => {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
};

export const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

export const calculateScore = (answers, questions) => {
  let correct = 0;
  questions.forEach((question, index) => {
    if (answers[index] === question.correctAnswer) {
      correct++;
    }
  });
  return correct;
};

export const calculatePercentage = (score, total) => {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
};

export const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs} ثانية`;
  if (secs === 0) return `${mins} دقيقة`;
  return `${mins} دقيقة ${secs} ثانية`;
};

export const getResultMessage = (percentage) => {
  if (percentage >= 90) return 'ممتاز! أداء رائع';
  if (percentage >= 75) return 'جيد جداً! أحسنت';
  if (percentage >= 60) return 'جيد! واصل التعلم';
  if (percentage >= 40) return 'مقبول، حاول مرة أخرى';
  return 'تحتاج للمراجعة، لا تيأس';
};

export const getRandomQuestions = (questions, count) => {
  const shuffled = shuffleArray(questions);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const validateQuestion = (question) => {
  return (
    question &&
    typeof question.id === 'number' &&
    typeof question.question === 'string' &&
    Array.isArray(question.options) &&
    question.options.length >= 2 &&
    typeof question.correctAnswer === 'number' &&
    question.correctAnswer >= 0 &&
    question.correctAnswer < question.options.length &&
    typeof question.explanation === 'string' &&
    typeof question.difficulty === 'string' &&
    typeof question.category === 'string'
  );
};

export const getQuestionsByCategory = (questions, category) => {
  return questions.filter((q) => q.category === category);
};

export const getQuestionsByDifficulty = (questions, difficulty) => {
  return questions.filter((q) => q.difficulty === difficulty);
};
