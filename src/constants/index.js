import { BookOpen, Shield, Moon, ScrollText, Scale, History, Star, Heart } from 'lucide-react';

export const ROUTES = {
  HOME: '/',
  CATEGORIES: '/categories',
  QUIZ: '/quiz/:category',
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
  QURAN_EXPLORER: '/quran',
  QURAN_SURAH: '/quran/:surahNumber',
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
    id: 'aqeedah',
    name: 'العقيدة',
    description: 'اختبارات حول العقيدة الإسلامية',
    icon: Shield,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    id: 'sira',
    name: 'السيرة النبوية',
    description: 'اختبارات حول حياة النبي ﷺ',
    icon: Moon,
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
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
    id: 'history',
    name: 'التاريخ',
    description: 'اختبارات حول التاريخ الإسلامي',
    icon: History,
    color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
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
};
