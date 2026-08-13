import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import MainLayout from "./layouts/MainLayout";
import Skeleton from "./components/common/Skeleton";
import ErrorBoundary from "./components/common/ErrorBoundary";
import PwaInstallBanner from "./components/common/PwaInstallBanner";
import { PageTransition } from "./components/ui/Motion";

const HomePage = lazy(() => import("./pages/HomePage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const TopicsPage = lazy(() => import("./pages/TopicsPage"));
const QuizPage = lazy(() => import("./pages/QuizPage"));
const ResultPage = lazy(() => import("./pages/ResultPage"));
const ReviewPage = lazy(() => import("./pages/ReviewPage"));

const PersonalitiesPage = lazy(() => import("./pages/PersonalitiesPage"));
const PersonalityDetailPage = lazy(
  () => import("./pages/PersonalityDetailPage"),
);
const QuranQuizPage = lazy(() => import("./pages/QuranQuizPage"));
const HadithQuizPage = lazy(() => import("./pages/HadithQuizPage"));
const GharibQuizPage = lazy(() => import("./pages/GharibQuizPage"));
const QuranExplorerPage = lazy(() => import("./pages/QuranExplorerPage"));
const QuranSurahPage = lazy(() => import("./pages/QuranSurahPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const SeerahPage = lazy(() => import("./pages/SeerahPage"));
const BattlesPage = lazy(() => import("./pages/BattlesPage"));
const BattleDetailPage = lazy(() => import("./pages/BattleDetailPage"));
const AdhkarPage = lazy(() => import("./pages/AdhkarPage"));
const HisnPage = lazy(() => import("./pages/HisnPage"));
const MorningAdhkarPage = lazy(() => import("./pages/MorningAdhkarPage"));
const EveningAdhkarPage = lazy(() => import("./pages/EveningAdhkarPage"));
const SalafQuotesPage = lazy(() => import("./pages/SalafQuotesPage"));
const GharibAlQuranPage = lazy(() => import("./pages/GharibAlQuranPage"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const DuaaPage = lazy(() => import("./pages/DuaaPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const LoadingFallback = () => (
  <div className="space-y-6 p-6">
    <div className="flex justify-center">
      <Skeleton variant="rectangular" className="w-16 h-16 rounded-2xl" />
    </div>
    <Skeleton variant="text" className="w-48 h-8 mx-auto" />
    <Skeleton variant="text" className="w-72 h-4 mx-auto" />
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-secondary-800 rounded-2xl shadow-lg p-6"
        >
          <div className="text-center">
            <Skeleton
              variant="rectangular"
              className="w-12 h-12 rounded-xl mx-auto mb-3"
            />
            <Skeleton variant="text" className="w-20 h-5 mx-auto mb-1" />
            <Skeleton variant="text" className="w-28 h-3 mx-auto" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route
            path="/quiz/sira"
            element={<Navigate to="/quiz/history" replace />}
          />
          <Route path="/quiz/:category/topics" element={<TopicsPage />} />
          <Route path="/quiz/:category" element={<QuizPage />} />
          <Route path="/quiz/search" element={<QuizPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/review" element={<ReviewPage />} />

          <Route path="/articles" element={<PersonalitiesPage />} />
          <Route path="/articles/:id" element={<PersonalityDetailPage />} />
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
          <Route path="/adhikr/hisn" element={<HisnPage />} />
          <Route path="/adhikr/morning" element={<MorningAdhkarPage />} />
          <Route path="/adhikr/evening" element={<EveningAdhkarPage />} />
          <Route path="/adhikr/quotes" element={<SalafQuotesPage />} />
          <Route path="/adhikr/gharib" element={<GharibAlQuranPage />} />
          <Route path="/adhikr/duaa" element={<DuaaPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <MainLayout>
            <Suspense fallback={<LoadingFallback />}>
              <AnimatedRoutes />
            </Suspense>
          </MainLayout>
          <PwaInstallBanner />
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
