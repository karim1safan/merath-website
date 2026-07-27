import { BookOpen, Shield, ScrollText, Scale, Languages, Star, Heart, BookOpenText, Clock } from 'lucide-react';

export const ROUTES = {
  HOME: '/',
  CATEGORIES: '/categories',
  TOPICS: '/quiz/:category/topics',
  QUIZ: '/quiz/:category',
  QUIZ_SEARCH: '/quiz/search',
  RESULT: '/result',
  REVIEW: '/review',
  STATISTICS: '/statistics',
  BOOKMARKS: '/bookmarks',
  PERSONALITIES: '/articles',
  PERSONALITY: '/articles/:id',
  QURAN_QUIZ: '/quiz/quran',
  HADITH_QUIZ: '/quiz/hadith',
  NAMES_QUIZ: '/quiz/names',
  DUAS_QUIZ: '/quiz/duas',
  GHARIB_QUIZ: '/quiz/gharib',
  QURAN_EXPLORER: '/quran',
  QURAN_SURAH: '/quran/:surahNumber',
  SEARCH: '/search',
  SEERAH: '/seerah',
  SEERAH_BATTLES: '/seerah/battles',
  SEERAH_BATTLE_DETAIL: '/seerah/battles/:id',
  ADHKAR: '/adhikr',
  PRAYER: '/prayer',
  MORNING_EVENING_ADHKAR: '/adhikr/morning-evening',
  HISN_ALMUSLIM: '/adhikr/hisn',
  MORNING_ADHKAR: '/adhikr/morning',
  EVENING_ADHKAR: '/adhikr/evening',
  SALAF_QUOTES: '/adhikr/quotes',
  COURSES: '/courses',
};

export const CATEGORIES = [
  {
    id: 'tafseer',
    apiId: 1,
    name: 'التفسير',
    description: 'فهم القرآن الكريم ومعرفة مقصوده من أسمى المقاصد',
    icon: BookOpen,
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    id: 'akida',
    apiId: 2,
    name: 'العقيدة',
    description: 'الاعتِقادُ الصَّحِيحُ هو الأَساسُ الذي يُبنَى عليه العَملُ الصَّالِحُ',
    icon: Shield,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    id: 'hadith',
    apiId: 3,
    name: 'الحديث',
    description: 'تعلم الحديث النبوي ومعرفة أحكامه من الأمور المهمة لكل مسلم',
    icon: ScrollText,
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  {
    id: 'figh',
    apiId: 4,
    name: 'الفقه',
    description: 'من يرد الله به خيرا يفقه في الدين، احرص على الخير والتفقه في الدين',
    icon: Scale,
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  {
    id: 'history',
    apiId: 5,
    name: 'التاريخ',
    description: 'تاريخ أمتنا مليء بالعبر والعظات والنماذج المبهرة',
    icon: Clock,
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  },
  {
    id: 'arabia',
    apiId: 6,
    name: 'اللغة العربية',
    description: 'تعلُّم اللغة العربية ومعرفة قواعدها من أهم السُّبل التي تُعين على فهم كتاب الله',
    icon: Languages,
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  },
];

export const UMMMAH_CATEGORIES = [
  {
    id: 'quran',
    name: 'اختبار القرآن الكريم',
    description: 'اختبارات حول آيات القرآن الكريم وتأويلها',
    icon: BookOpen,
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  {
    id: 'hadith',
    name: 'اختبار الحديث النبوي',
    description: 'اختبارات حول الأحاديث النبوية الشريفة',
    icon: ScrollText,
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  {
    id: 'names',
    name: 'أسماء الله الحسنى',
    description: 'اختبار أسماء الله الحسنى ومعانيها',
    icon: Star,
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  },
  {
    id: 'duas',
    name: 'الأدعية والأذكار',
    description: 'اختبار الأدعية الواردة في القرآن والسنة',
    icon: Heart,
    color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  },
  {
    id: 'gharib',
    name: 'غريب القرآن',
    description: 'اختبار من كتاب السراج في بيان غريب القرآن',
    icon: BookOpenText,
    color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  },
];

export const QURAN = {
  TOTAL_SURAHS: 114,
};

export const DIFFICULTY_LEVELS = {
  easy: { label: 'سهل', color: 'text-success' },
  medium: { label: 'متوسط', color: 'text-warning' },
  hard: { label: 'صعب', color: 'text-danger' },
};

export const TIMER_OPTIONS = [
  { value: 0, label: 'بدون مؤقت' },
  { value: 300, label: '5 دقائق' },
  { value: 600, label: '10 دقائق' },
  { value: 1200, label: '20 دقيقة' },
];

export const STORAGE_KEYS = {
  THEME: 'quiz-theme',
  STATISTICS: 'quiz-statistics',
  COMPLETED_QUIZZES: 'quiz-completed',
  BOOKMARKS: 'quiz-bookmarks',
  DAILY_STREAK: 'quiz-daily-streak',
  FRIDAY_REMINDER: 'quiz-friday-reminder',
  PRAYER_CITY: 'quiz-prayer-city',
};

export const PRAYER_CITIES = [
  { id: 'cairo', name: 'القاهرة', country: 'مصر', lat: 30.0444, lng: 31.2357 },
];
