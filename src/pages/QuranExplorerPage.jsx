import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, BookOpen } from 'lucide-react';
import { useQuranExplorer } from '../hooks/useQuranExplorer';
import Card from '../components/common/Card';
import EmptyState from '../components/common/EmptyState';
import QuranExplorerSkeleton from '../components/skeletons/QuranExplorerSkeleton';

const SurahCard = ({ surah }) => {
  return (
    <Link to={`/quran/${surah.id}`} className="block">
      <Card hover className="h-full">
        <div className="text-center">
          <h3 className="text-3xl font-bold font-amiri text-secondary-800 dark:text-secondary-200 mb-2 leading-relaxed">
            {surah.name}
          </h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
              surah.makkia
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            }`}
          >
            {surah.makkia ? 'مكية' : 'مدنية'}
          </span>
        </div>
      </Card>
    </Link>
  );
};

const QuranExplorerPage = () => {
  const { surahs, loading, error } = useQuranExplorer();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSurahs = useMemo(() => {
    if (!searchQuery) return surahs;
    const q = searchQuery.toLowerCase();
    return surahs.filter(
      (surah) => surah.name.includes(q) || surah.id.toString() === q,
    );
  }, [surahs, searchQuery]);

  if (loading) {
    return <QuranExplorerSkeleton />;
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
          <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
            <BookOpen className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">
          المصحف الشريف
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 max-w-lg mx-auto">
          استكشف سور القرآن الكريم — اختر السورة للقراءة
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن سورة..."
            aria-label="البحث عن سورة"
            className="w-full pr-12 pl-10 py-3 rounded-xl border-2 border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-800 dark:text-secondary-200 placeholder-secondary-400 dark:placeholder-secondary-500 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none transition-colors duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
            >
              <X className="w-4 h-4 text-secondary-400" />
            </button>
          )}
        </div>
      </div>

      {searchQuery && (
        <p className="text-sm text-secondary-500 dark:text-secondary-400 text-center">
          {filteredSurahs.length} نتيجة
        </p>
      )}

      {filteredSurahs.length === 0 ? (
        <EmptyState
          icon={<Search className="w-16 h-16" />}
          title="لا توجد نتائج"
          description="لم يتم العثور على سورة تطابق البحث"
          actionLabel="مسح البحث"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
          {filteredSurahs.map((surah) => (
            <SurahCard key={surah.id} surah={surah} />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuranExplorerPage;
