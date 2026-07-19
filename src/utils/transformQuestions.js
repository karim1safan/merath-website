const CATEGORY_MAP = {
  'التفسير': 'tafseer',
  'العقيدة': 'akida',
  'الحديث': 'hadith',
  'الفقه': 'figh',
  'اللغة العربية': 'arabia',
};

const HISTORY_TOPIC_MAP = {
  'العهد النبوي': 'sirah',
  'الخلفاء الراشدون': 'kholfa',
  'العهد العباسي': 'abasi',
  'العهد الأموي': 'amwi',
  'العهد العثماني': 'osmany',
  'عهد المماليك': 'mamalik',
  'التاريخ المعاصر': 'moasir',
};

export function mapCategoryName(arabicName, topic) {
  if (arabicName === 'التاريخ' && topic && HISTORY_TOPIC_MAP[topic]) {
    return HISTORY_TOPIC_MAP[topic];
  }
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
    category: mapCategoryName(apiQuestion.category, apiQuestion.topic),
    topic: apiQuestion.topic || '',
  };
}

export function transformApiQuestions(apiQuestions) {
  return apiQuestions.map(transformApiQuestion);
}
