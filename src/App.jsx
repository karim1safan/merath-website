import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import MainLayout from './layouts/MainLayout';
import Skeleton from './components/common/Skeleton';
import ErrorBoundary from './components/common/ErrorBoundary';

const HomePage = lazy(() => import('./pages/HomePage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const ResultPage = lazy(() => import('./pages/ResultPage'));
const ReviewPage = lazy(() => import('./pages/ReviewPage'));
const StatisticsPage = lazy(() => import('./pages/StatisticsPage'));
const BookmarksPage = lazy(() => import('./pages/BookmarksPage'));
const PersonalitiesPage = lazy(() => import('./pages/PersonalitiesPage'));
const PersonalityDetailPage = lazy(() => import('./pages/PersonalityDetailPage'));
const QuranQuizPage = lazy(() => import('./pages/QuranQuizPage'));
const HadithQuizPage = lazy(() => import('./pages/HadithQuizPage'));
const GharibQuizPage = lazy(() => import('./pages/GharibQuizPage'));
const QuranExplorerPage = lazy(() => import('./pages/QuranExplorerPage'));
const QuranSurahPage = lazy(() => import('./pages/QuranSurahPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const SeerahPage = lazy(() => import('./pages/SeerahPage'));
const BattlesPage = lazy(() => import('./pages/BattlesPage'));
const BattleDetailPage = lazy(() => import('./pages/BattleDetailPage'));
const AdhkarPage = lazy(() => import('./pages/AdhkarPage'));
const MorningEveningAdhkarPage = lazy(() => import('./pages/MorningEveningAdhkarPage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const LoadingFallback = () => (
  <div className="space-y-6 p-6">
    <div className="flex justify-center">
      <Skeleton variant="rectangular" className="w-16 h-16 rounded-2xl" />
    </div>
    <Skeleton variant="text" className="w-48 h-8 mx-auto" />
    <Skeleton variant="text" className="w-72 h-4 mx-auto" />
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-secondary-800 rounded-2xl shadow-lg p-6">
          <div className="text-center">
            <Skeleton variant="rectangular" className="w-12 h-12 rounded-xl mx-auto mb-3" />
            <Skeleton variant="text" className="w-20 h-5 mx-auto mb-1" />
            <Skeleton variant="text" className="w-28 h-3 mx-auto" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <MainLayout>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/quiz/sira" element={<Navigate to="/quiz/sirah" replace />} />
                <Route path="/quiz/:category" element={<QuizPage />} />
                <Route path="/quiz/search" element={<QuizPage />} />
                <Route path="/result" element={<ResultPage />} />
                <Route path="/review" element={<ReviewPage />} />
                <Route path="/statistics" element={<StatisticsPage />} />
                <Route path="/bookmarks" element={<BookmarksPage />} />
                <Route path="/personalities" element={<PersonalitiesPage />} />
                <Route path="/personalities/:id" element={<PersonalityDetailPage />} />
                <Route path="/quiz/quran" element={<QuranQuizPage />} />
                <Route path="/quiz/hadith" element={<HadithQuizPage />} />
                <Route path="/quiz/gharib" element={<GharibQuizPage />} />
                <Route path="/quran" element={<QuranExplorerPage />} />
                <Route path="/quran/:surahNumber" element={<QuranSurahPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/seerah" element={<SeerahPage />} />
                <Route path="/seerah/battles" element={<BattlesPage />} />
                <Route path="/seerah/battles/:id" element={<BattleDetailPage />} />
                <Route path="/adhikr" element={<AdhkarPage />} />
                <Route path="/adhikr/morning-evening" element={<MorningEveningAdhkarPage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </MainLayout>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
