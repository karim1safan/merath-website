import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Loader2 } from 'lucide-react';
import { useQuranExplorer } from '../hooks/useQuranExplorer';
import Card from '../components/common/Card';
import EmptyState from '../components/common/EmptyState';

const QuranExplorerPage = () => {
  const { surahs, loading, error } = useQuranExplorer();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSurahs = surahs.filter((surah) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      surah.name.includes(q) ||
      surah.id.toString() === q
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={<BookOpen className="w-16 h-16 text-red-500" />}
        title="خطأ في تحميل السور"
        description="حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى."
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-2xl bg-green-100 dark:bg-green-900/30">
            <BookOpen className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">
          استكشف القرآن الكريم
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 max-w-lg mx-auto">
          تصفح السور والآيات مع الترجمة والتشغيل الصوتي
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن سورة..."
            aria-label="البحث عن سورة"
            className="w-full pr-12 pl-4 py-3 rounded-xl border-2 border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-800 dark:text-secondary-200 placeholder-secondary-400 focus:border-primary-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredSurahs.map((surah) => (
          <Link key={surah.id} to={`/quran/${surah.id}`}>
            <Card hover className="text-center">
              <div className="text-sm text-secondary-500 dark:text-secondary-400 mb-1">
                {surah.id}
              </div>
              <h3 className="text-lg font-bold text-secondary-800 dark:text-secondary-200 mb-2">
                {surah.name}
              </h3>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  surah.makkia
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  {surah.makkia ? 'مكية' : 'مدنية'}
                </span>
              </div>
              <div className="text-xs text-secondary-400 dark:text-secondary-500">
                صفحات {surah.start_page} - {surah.end_page}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuranExplorerPage;
