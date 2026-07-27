import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Shuffle, AlertCircle } from 'lucide-react';
import { CATEGORIES, ROUTES } from '../constants';
import { fetchCategoryTopics } from '../services/quizApi';
import Card from '../components/common/Card';
import EmptyState from '../components/common/EmptyState';
import Skeleton from '../components/common/Skeleton';
import { FadeIn, StaggerChildren, StaggerItem } from '../components/ui/Motion';

const TopicsSkeleton = () => (
  <div className="space-y-6">
    <div className="flex justify-center">
      <Skeleton variant="rectangular" className="w-16 h-16 rounded-2xl" />
    </div>
    <Skeleton variant="text" className="w-48 h-8 mx-auto" />
    <Skeleton variant="text" className="w-72 h-4 mx-auto" />
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-secondary-800 rounded-2xl shadow-lg p-6">
          <div className="text-center">
            <Skeleton variant="rectangular" className="w-10 h-10 rounded-xl mx-auto mb-3" />
            <Skeleton variant="text" className="w-24 h-5 mx-auto" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TopicsPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryInfo = CATEGORIES.find((c) => c.id === category);

  useEffect(() => {
    if (!categoryInfo) return;

    let cancelled = false;

    async function loadTopics() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchCategoryTopics(categoryInfo.apiId);
        if (!cancelled) {
          setTopics(data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to fetch topics:', err);
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTopics();

    return () => {
      cancelled = true;
    };
  }, [category, categoryInfo]);

  if (!categoryInfo) {
    return (
      <EmptyState
        icon={<AlertCircle className="w-16 h-16" />}
        title="قسم غير موجود"
        description="القسم الذي تبحث عنه غير موجود"
        actionLabel="العودة للأقسام"
        onAction={() => navigate(ROUTES.CATEGORIES)}
      />
    );
  }

  if (loading) {
    return <TopicsSkeleton />;
  }

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="w-16 h-16 text-red-500" />}
        title="خطأ في تحميل الأقسام"
        description="حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى."
        actionLabel="العودة للأقسام"
        onAction={() => navigate(ROUTES.CATEGORIES)}
      />
    );
  }

  if (topics.length === 0) {
    return (
      <EmptyState
        icon={<AlertCircle className="w-16 h-16" />}
        title="لا توجد أقسام فرعية"
        description="لم يتم العثور على أقسام فرعية في هذا القسم"
        actionLabel="العودة للأقسام"
        onAction={() => navigate(ROUTES.CATEGORIES)}
      />
    );
  }

  const IconComponent = categoryInfo.icon;

  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Link
              to={ROUTES.CATEGORIES}
              className="inline-flex items-center gap-2 text-sm text-secondary-500 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-4"
            >
              <ArrowRight className="w-4 h-4" />
              العودة للأقسام
            </Link>
          </div>
          {IconComponent && (
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-2xl ${categoryInfo.color}`}>
                <IconComponent className="w-10 h-10" />
              </div>
            </div>
          )}
          <h1 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">
            {categoryInfo.name}
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            اختر القسم الفرعي لبدء الاختبار
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div>
          <Link to={`/quiz/${category}`}>
            <Card hover className="mb-6 border-2 border-dashed border-primary-300 dark:border-primary-700 bg-primary-50/50 dark:bg-primary-900/20">
              <div className="flex items-center justify-center gap-3 py-2">
                <div className="p-2 rounded-xl bg-primary-100 dark:bg-primary-900/40">
                  <Shuffle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-300">
                    اختبار عشوائي
                  </h3>
                  <p className="text-primary-500 dark:text-primary-400 text-xs">
                    أسئلة متنوعة من جميع الأقسام
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <StaggerChildren stagger={0.04} className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {topics.map((topic) => (
              <StaggerItem key={topic.slug}>
                <Link to={`/quiz/${category}?topic=${topic.slug}`}>
                  <Card hover className="h-full">
                    <div className="text-center py-2">
                      <h3 className="text-base font-semibold text-secondary-800 dark:text-secondary-200">
                        {topic.name}
                      </h3>
                    </div>
                  </Card>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </FadeIn>
    </div>
  );
};

export default TopicsPage;
