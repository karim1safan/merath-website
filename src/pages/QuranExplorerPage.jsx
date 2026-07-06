import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search } from 'lucide-react';
import { useQuranExplorer } from '../hooks/useQuranExplorer';
import Card from '../components/common/Card';

const QuranExplorerPage = () => {
  const { surahs } = useQuranExplorer();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSurahs = surahs.filter((surah) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      surah.name.includes(q) ||
      surah.english.toLowerCase().includes(q) ||
      surah.meaning.toLowerCase().includes(q) ||
      surah.number.toString() === q
    );
  });

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
            className="w-full pr-12 pl-4 py-3 rounded-xl border-2 border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-800 dark:text-secondary-200 placeholder-secondary-400 focus:border-primary-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredSurahs.map((surah) => (
          <Link key={surah.number} to={`/quran/${surah.number}`}>
            <Card hover className="text-center">
              <div className="text-sm text-secondary-500 dark:text-secondary-400 mb-1">
                {surah.number}
              </div>
              <h3 className="text-lg font-bold text-secondary-800 dark:text-secondary-200 mb-1">
                {surah.name}
              </h3>
              <p className="text-xs text-primary-600 dark:text-primary-400 mb-1">
                {surah.english}
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">
                {surah.meaning}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2 text-xs text-secondary-400">
                <span>{surah.verses} آية</span>
                <span>•</span>
                <span>{surah.place}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuranExplorerPage;
