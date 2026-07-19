import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { BarChart3 } from 'lucide-react';
import { ROUTES } from '../constants';
import ResultCard from '../components/quiz/ResultCard';
import ShareCard from '../components/quiz/ShareCard';
import useStatistics from '../hooks/useStatistics';
import EmptyState from '../components/common/EmptyState';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addQuizResult } = useStatistics();
  const hasSavedRef = useRef(false);

  const result = location.state;

  useEffect(() => {
    if (result && !hasSavedRef.current) {
      hasSavedRef.current = true;
      addQuizResult({
        score: result.score,
        totalQuestions: result.totalQuestions,
        percentage: result.percentage,
        timeSpent: result.timeSpent,
        category: result.category,
      });
    }
  }, [result, addQuizResult]);

  if (!result) {
    return (
      <EmptyState
        icon={<BarChart3 className="w-16 h-16" />}
        title="لا توجد نتيجة"
        description="يجب إكمال اختبار أولاً لعرض النتيجة"
        actionLabel="ابدأ اختباراً"
        onAction={() => navigate(ROUTES.CATEGORIES)}
      />
    );
  }

  const handleRetry = () => {
    if (result.category === 'search') {
      navigate(ROUTES.SEARCH, { replace: true });
    } else {
      navigate(`/quiz/${result.category}`, { replace: true });
    }
  };

  const handleReview = () => {
    navigate(ROUTES.REVIEW, {
      state: {
        questions: result.questions,
        answers: result.answers,
        category: result.category,
      },
    });
  };

  const handleHome = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <div className="py-8 space-y-8">
      <ResultCard
        score={result.score}
        totalQuestions={result.totalQuestions}
        percentage={result.percentage}
        timeSpent={result.timeSpent}
        onRetry={handleRetry}
        onReview={handleReview}
        onHome={handleHome}
      />
      <div className="max-w-md mx-auto">
        <ShareCard
          score={result.score}
          totalQuestions={result.totalQuestions}
          percentage={result.percentage}
          timeSpent={result.timeSpent}
          category={result.category}
        />
      </div>
    </div>
  );
};

export default ResultPage;
