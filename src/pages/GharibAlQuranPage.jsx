import { useState, useMemo } from 'react';
import { ArrowRight, BookOpenText, Search, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import gharibData from '../data/gharib-alquran.json';
import Card from '../components/common/Card';

const GharibAlQuranPage = () => {
  const [selectedSurahNumber, setSelectedSurahNumber] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Extract unique surahs
  const surahs = useMemo(() => {
    const unique = [];
    const seen = new Set();
    for (const item of gharibData) {
      if (!seen.has(item.surahNumber)) {
        seen.add(item.surahNumber);
        unique.push({
          number: item.surahNumber,
          name: item.surah,
        });
      }
    }
    return unique.sort((a, b) => a.number - b.number);
  }, []);

  // Filter surahs by search in the dropdown
  const filteredSurahs = useMemo(() => {
    if (!searchQuery) return surahs;
    return surahs.filter(s => s.name.includes(searchQuery));
  }, [surahs, searchQuery]);

  // Get words for the selected surah
  const surahWords = useMemo(() => {
    return gharibData.filter(item => item.surahNumber === selectedSurahNumber);
  }, [selectedSurahNumber]);

  // Group by verse
  const groupedWords = useMemo(() => {
    const groups = {};
    for (const word of surahWords) {
      if (!groups[word.verse]) groups[word.verse] = [];
      groups[word.verse].push(word);
    }
    return groups;
  }, [surahWords]);

  const selectedSurahName = surahs.find(s => s.number === selectedSurahNumber)?.name || '';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link
        to={ROUTES.ADHKAR}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
      >
        <ArrowRight className="w-4 h-4" />
        العودة للأذكار
      </Link>

      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-2xl bg-teal-100 dark:bg-teal-900/30">
            <BookOpenText className="w-10 h-10 text-teal-600 dark:text-teal-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">
          غريب القرآن
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          بيان معاني المفردات الغريبة في القرآن الكريم
        </p>
      </div>

      <div className="relative z-20">
        <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-lg border border-secondary-200 dark:border-secondary-700 p-4">
          <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
            اختر السورة:
          </label>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between bg-secondary-50 dark:bg-secondary-900 border-2 border-secondary-200 dark:border-secondary-700 px-4 py-3 rounded-xl text-secondary-800 dark:text-secondary-200 focus:outline-none focus:border-teal-500 transition-colors"
            >
              <span className="font-medium text-lg">{selectedSurahName}</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl shadow-xl overflow-hidden">
                <div className="p-3 border-b border-secondary-100 dark:border-secondary-700">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                    <input
                      type="text"
                      placeholder="ابحث عن سورة..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-4 pr-10 py-2 bg-secondary-50 dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-700 rounded-lg text-sm text-secondary-800 dark:text-secondary-200 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
                <ul className="max-h-64 overflow-y-auto overscroll-contain">
                  {filteredSurahs.map((surah) => (
                    <li key={surah.number}>
                      <button
                        onClick={() => {
                          setSelectedSurahNumber(surah.number);
                          setIsDropdownOpen(false);
                          setSearchQuery('');
                        }}
                        className={`w-full text-right px-4 py-3 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors ${
                          selectedSurahNumber === surah.number
                            ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-bold'
                            : 'text-secondary-700 dark:text-secondary-300'
                        }`}
                      >
                        {surah.name}
                      </button>
                    </li>
                  ))}
                  {filteredSurahs.length === 0 && (
                    <li className="px-4 py-3 text-center text-secondary-500 dark:text-secondary-400 text-sm">
                      لا توجد نتائج
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedWords).map(([verse, words]) => (
          <Card key={verse} className="overflow-hidden">
            <div className="bg-teal-50 dark:bg-teal-900/20 px-6 py-3 border-b border-teal-100 dark:border-teal-900/50">
              <h3 className="font-bold text-teal-800 dark:text-teal-200">
                الآية {verse}
              </h3>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                {words.map((item) => (
                  <li key={item.id} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 border-b border-secondary-100 dark:border-secondary-700/50 last:border-0 pb-4 last:pb-0">
                    <span className="font-amiri text-2xl font-bold text-secondary-900 dark:text-secondary-100 min-w-[120px]">
                      {item.word}
                    </span>
                    <span className="text-secondary-600 dark:text-secondary-400 text-lg leading-relaxed pt-1">
                      {item.meaning}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}

        {Object.keys(groupedWords).length === 0 && (
          <div className="text-center py-12 text-secondary-500 dark:text-secondary-400">
            لا توجد كلمات غريبة في هذه السورة
          </div>
        )}
      </div>
    </div>
  );
};

export default GharibAlQuranPage;
