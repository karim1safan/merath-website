const CATEGORY_MAP = {
  'التفسير': 'tafseer',
  'العقيدة': 'aqeedah',
  'السيرة النبوية': 'sira',
  'الحديث': 'hadith',
  'الفقه': 'figh',
  'التاريخ': 'history',
};

export function mapCategoryName(arabicName) {
  return CATEGORY_MAP[arabicName] || 'tafseer';
}

export function transformApiQuestion(apiQuestion) {
  const options = apiQuestion.answers.map((a) => a.answer);
  const correctIndex = apiQuestion.answers.findIndex((a) => a.t === 1);

  return {
    id: apiQuestion.id,
    question: apiQuestion.q,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: apiQuestion.link || '',
    difficulty: 'medium',
    category: mapCategoryName(apiQuestion.category),
    topic: apiQuestion.topic || '',
  };
}

export function transformApiQuestions(apiQuestions) {
  return apiQuestions.map(transformApiQuestion);
}
