import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, AlertCircle, Play } from 'lucide-react';
import { searchQuestions } from '../services/quizApi';
import { transformApiQuestions } from '../utils/transformQuestions';
import { CATEGORIES } from '../constants';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';

const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const rawData = await searchQuestions(trimmed);
      const transformed = transformApiQuestions(rawData);
      setResults(transformed);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const getCategoryInfo = (categoryKey) => {
    return CATEGORIES.find((c) => c.id === categoryKey);
  };

  const startQuizWithResults = () => {
    if (results.length === 0) return;
    navigate('/quiz/random', { state: { questions: results } });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">
          البحث في الأسئلة
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          ابحث عن أسئلة بموضوع معين
        </p>
      </div>

      <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="اكتب كلمة للبحث... مثال: الصلاة، الزكاة، القرآن"
              className="w-full pr-12 pl-4 py-3 rounded-xl border-2 border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-800 dark:text-secondary-200 placeholder-secondary-400 focus:border-primary-500 focus:outline-none transition-colors duration-200"
            />
          </div>
          <Button type="submit" loading={loading} disabled={!query.trim()}>
            بحث
          </Button>
        </div>
      </form>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <EmptyState
          icon={<AlertCircle className="w-16 h-16 text-red-500" />}
          title="خطأ في البحث"
          description="حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى."
        />
      )}

      {!loading && !error && searched && results.length === 0 && (
        <EmptyState
          title="لا توجد نتائج"
          description={`لم يتم العثور على نتائج لكلمة "${query}". جرّب كلمات بحث مختلفة.`}
        />
      )}

      {!loading && !error && results.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-secondary-600 dark:text-secondary-400">
              تم العثور على <span className="font-bold text-primary-600 dark:text-primary-400">{results.length}</span> نتيجة
            </p>
            <Button onClick={startQuizWithResults} size="sm">
              <Play className="w-4 h-4 ml-2" />
              ابدأ اختبار بالنتائج
            </Button>
          </div>

          <div className="space-y-4">
            {results.map((question, index) => {
              const categoryInfo = getCategoryInfo(question.category);
              return (
                <Card key={question.id || index} className="!p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-lg font-medium text-secondary-800 dark:text-secondary-200 mb-2 leading-relaxed">
                        {question.question}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {categoryInfo && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                            {categoryInfo.name}
                          </span>
                        )}
                        {question.topic && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-600 dark:bg-secondary-700 dark:text-secondary-400">
                            {question.topic}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {!loading && !error && !searched && (
        <EmptyState
          icon={<Search className="w-16 h-16" />}
          title="ابدأ البحث"
          description="اكتب كلمة أو عبارة في مربع البحث للعثور على أسئلة متعلقة بها"
        />
      )}
    </div>
  );
};

export default SearchPage;
