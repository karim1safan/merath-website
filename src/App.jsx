import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import Spinner from './components/common/Spinner';

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
const QuranExplorerPage = lazy(() => import('./pages/QuranExplorerPage'));
const QuranSurahPage = lazy(() => import('./pages/QuranSurahPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Spinner size="lg" />
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <Router>
        <MainLayout>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/quiz/:category" element={<QuizPage />} />
              <Route path="/result" element={<ResultPage />} />
              <Route path="/review" element={<ReviewPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/daily" element={<DailyChallengePage />} />
              <Route path="/personalities" element={<PersonalitiesPage />} />
              <Route path="/personalities/:id" element={<PersonalityDetailPage />} />
              <Route path="/quiz/quran" element={<QuranQuizPage />} />
              <Route path="/quiz/hadith" element={<HadithQuizPage />} />
              <Route path="/quiz/names" element={<NamesQuizPage />} />
              <Route path="/quiz/duas" element={<DuasQuizPage />} />
              <Route path="/quran" element={<QuranExplorerPage />} />
              <Route path="/quran/:surahNumber" element={<QuranSurahPage />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </Suspense>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
