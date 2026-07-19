import { createBrowserRouter } from 'react-router';
import { lazy } from 'react';
import { ThemeProvider } from './context/ThemeContext.jsx';
import MainLayout from './layouts/MainLayout';
import ErrorBoundary from './components/common/ErrorBoundary';
import { GlobalStyles } from './components/GlobalStyles';
import { AnimatedOutlet } from './components/AnimatedOutlet';

const HomePage = lazy(() => import('./pages/HomePage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const ResultPage = lazy(() => import('./pages/ResultPage'));
const ReviewPage = lazy(() => import('./pages/ReviewPage'));
const StatisticsPage = lazy(() => import('./pages/StatisticsPage'));
const BookmarksPage = lazy(() => import('./pages/BookmarksPage'));
const DailyChallengePage = lazy(() => import('./pages/DailyChallengePage'));
const PersonalitiesPage = lazy(() => import('./pages/PersonalitiesPage'));
const PersonalityDetailPage = lazy(() => import('./pages/PersonalityDetailPage'));
const QuranQuizPage = lazy(() => import('./pages/QuranQuizPage'));
const HadithQuizPage = lazy(() => import('./pages/HadithQuizPage'));
const NamesQuizPage = lazy(() => import('./pages/NamesQuizPage'));
const DuasQuizPage = lazy(() => import('./pages/DuasQuizPage'));
const GharibQuizPage = lazy(() => import('./pages/GharibQuizPage'));
const QuranExplorerPage = lazy(() => import('./pages/QuranExplorerPage'));
const QuranSurahPage = lazy(() => import('./pages/QuranSurahPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const SeerahPage = lazy(() => import('./pages/SeerahPage'));
const BattlesPage = lazy(() => import('./pages/BattlesPage'));
const BattleDetailPage = lazy(() => import('./pages/BattleDetailPage'));
const AdhkarPage = lazy(() => import('./pages/AdhkarPage'));
const PrayerTimesPage = lazy(() => import('./pages/PrayerTimesPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function Root() {
  return (
    <ErrorBoundary>
      <GlobalStyles />
      <ThemeProvider>
        <MainLayout>
          <AnimatedOutlet />
        </MainLayout>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export const routes = [
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: 'categories', Component: CategoriesPage },
      { path: 'quiz/search', Component: QuizPage },
      { path: 'quiz/quran', Component: QuranQuizPage },
      { path: 'quiz/hadith', Component: HadithQuizPage },
      { path: 'quiz/names', Component: NamesQuizPage },
      { path: 'quiz/duas', Component: DuasQuizPage },
      { path: 'quiz/gharib', Component: GharibQuizPage },
      { path: 'quiz/:category', Component: QuizPage },
      { path: 'result', Component: ResultPage },
      { path: 'review', Component: ReviewPage },
      { path: 'statistics', Component: StatisticsPage },
      { path: 'bookmarks', Component: BookmarksPage },
      { path: 'daily', Component: DailyChallengePage },
      { path: 'personalities', Component: PersonalitiesPage },
      { path: 'personalities/:id', Component: PersonalityDetailPage },
      { path: 'quran', Component: QuranExplorerPage },
      { path: 'quran/:surahNumber', Component: QuranSurahPage },
      { path: 'search', Component: SearchPage },
      { path: 'seerah', Component: SeerahPage },
      { path: 'seerah/battles', Component: BattlesPage },
      { path: 'seerah/battles/:id', Component: BattleDetailPage },
      { path: 'adhikr', Component: AdhkarPage },
      { path: 'prayer', Component: PrayerTimesPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
];

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: 'categories', Component: CategoriesPage },
      { path: 'quiz/search', Component: QuizPage },
      { path: 'quiz/quran', Component: QuranQuizPage },
      { path: 'quiz/hadith', Component: HadithQuizPage },
      { path: 'quiz/names', Component: NamesQuizPage },
      { path: 'quiz/duas', Component: DuasQuizPage },
      { path: 'quiz/gharib', Component: GharibQuizPage },
      { path: 'quiz/:category', Component: QuizPage },
      { path: 'result', Component: ResultPage },
      { path: 'review', Component: ReviewPage },
      { path: 'statistics', Component: StatisticsPage },
      { path: 'bookmarks', Component: BookmarksPage },
      { path: 'daily', Component: DailyChallengePage },
      { path: 'personalities', Component: PersonalitiesPage },
      { path: 'personalities/:id', Component: PersonalityDetailPage },
      { path: 'quran', Component: QuranExplorerPage },
      { path: 'quran/:surahNumber', Component: QuranSurahPage },
      { path: 'search', Component: SearchPage },
      { path: 'seerah', Component: SeerahPage },
      { path: 'seerah/battles', Component: BattlesPage },
      { path: 'seerah/battles/:id', Component: BattleDetailPage },
      { path: 'adhikr', Component: AdhkarPage },
      { path: 'prayer', Component: PrayerTimesPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
