import { BookOpen, Shield, ScrollText, Scale, Languages, Star, Heart, BookOpenText, Users, Crown, Landmark, Castle, Building, Clock } from 'lucide-react';

export const ROUTES = {
  HOME: '/',
  CATEGORIES: '/categories',
  QUIZ: '/quiz/:category',
  QUIZ_SEARCH: '/quiz/search',
  RESULT: '/result',
  REVIEW: '/review',
  STATISTICS: '/statistics',
  BOOKMARKS: '/bookmarks',
  DAILY: '/daily',
  PERSONALITIES: '/personalities',
  PERSONALITY: '/personalities/:id',
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
};

export const CATEGORIES = [
  {
    id: 'tafseer',
    name: 'التفسير',
    description: 'اختبارات حول تفسير القرآن الكريم',
    icon: BookOpen,
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    id: 'akida',
    name: 'العقيدة',
    description: 'اختبارات حول العقيدة الإسلامية',
    icon: Shield,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    id: 'hadith',
    name: 'الحديث',
    description: 'اختبارات حول الأحاديث النبوية',
    icon: ScrollText,
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  {
    id: 'figh',
    name: 'الفقه',
    description: 'اختبارات حول أحكام الفقه الإسلامي',
    icon: Scale,
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  {
    id: 'sirah',
    name: 'العهد النبوي',
    description: 'اختبارات حول السيرة النبوية والغزوات',
    icon: BookOpen,
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  },
  {
    id: 'kholfa',
    name: 'الخلفاء الراشدون',
    description: 'اختبارات حول عصر الخلفاء الراشدين',
    icon: Users,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    id: 'amwi',
    name: 'العهد الأموي',
    description: 'اختبارات حول العهد الأموي',
    icon: Crown,
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  {
    id: 'osmany',
    name: 'العهد العثماني',
    description: 'اختبارات حول العهد العثماني',
    icon: Landmark,
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  {
    id: 'mamalik',
    name: 'عهد المماليك',
    description: 'اختبارات حول عهد المماليك',
    icon: Castle,
    color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  },
  {
    id: 'abasi',
    name: 'العهد العباسي',
    description: 'اختبارات حول العهد العباسي',
    icon: Building,
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  },
  {
    id: 'moasir',
    name: 'التاريخ المعاصر',
    description: 'اختبارات حول التاريخ المعاصر',
    icon: Clock,
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
  },
  {
    id: 'arabia',
    name: 'اللغة العربية',
    description: 'اختبارات حول اللغة العربية وقواعدها',
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
};
