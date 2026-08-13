import { useState, useMemo } from 'react';
import {
  ArrowRight,
  Search,
  X,
  Heart,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Layers,
  Book,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import duaaData from '../data/100-duaa.json';
import Card from '../components/common/Card';
import EmptyState from '../components/common/EmptyState';

/* ── helpers ─────────────────────────────────────────────── */

const getCategories = () => {
  const map = {};
  for (const entry of duaaData) {
    if (!map[entry.category]) map[entry.category] = 0;
    map[entry.category] += entry.duaa.length;
  }
  return Object.entries(map).map(([name, count]) => ({ name, count }));
};

const getDuaByCategory = (categoryName) =>
  duaaData
    .filter((e) => e.category === categoryName)
    .flatMap((e) =>
      e.duaa.map((d, i) => ({ id: `${e.id}-${i}`, entryId: e.id, ...d }))
    );

const allCategories = getCategories();

/* ── Source badge ─────────────────────────────────────────── */
const SourceBadge = ({ type }) => {
  const isQuran = type === 'quran';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        isQuran
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
      }`}
    >
      {isQuran ? <Book className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
      {isQuran ? 'قرآن' : 'حديث'}
    </span>
  );
};

/* ── Individual Duaa Card ─────────────────────────────────── */
const DuaaCard = ({ duaa, index }) => {
  const [showSource, setShowSource] = useState(false);
  const [showVocab, setShowVocab] = useState(false);

  const refs = duaa.source?.references ?? [];
  const vocab = duaa.vocabulary ?? [];
  const isQuran = duaa.source?.type === 'quran';

  return (
    <div
      className="rounded-2xl bg-white dark:bg-secondary-800 shadow-md border border-secondary-100 dark:border-secondary-700 overflow-hidden transition-shadow duration-200 hover:shadow-lg"
      dir="rtl"
    >
      {/* Number pill */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-0">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 flex items-center justify-center text-sm font-bold">
          {index + 1}
        </span>
        <SourceBadge type={duaa.source?.type} />
      </div>

      {/* Duaa text */}
      <p className="font-amiri text-2xl leading-[2.1] text-secondary-900 dark:text-secondary-100 px-5 py-4 text-right">
        {duaa.text}
      </p>

      {/* Quran reference inline */}
      {isQuran && refs.length > 0 && (
        <div className="px-5 pb-4 flex flex-wrap gap-2">
          {refs.map((ref, i) => (
            <span
              key={i}
              className="text-xs text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800"
            >
              سورة {ref.surah?.name} — الآية{' '}
              {ref.ayah?.from === ref.ayah?.to
                ? ref.ayah?.from
                : `${ref.ayah?.from}–${ref.ayah?.to}`}
            </span>
          ))}
        </div>
      )}

      {/* Expandable sections */}
      <div className="border-t border-secondary-100 dark:border-secondary-700/60">
        {/* Hadith sources toggle */}
        {!isQuran && refs.length > 0 && (
          <div>
            <button
              onClick={() => setShowSource((p) => !p)}
              className="flex items-center gap-2 w-full text-right py-3 px-5 hover:bg-secondary-50 dark:hover:bg-secondary-700/40 transition-colors"
              aria-expanded={showSource}
            >
              <BookOpen className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 flex-1">
                مصادر الحديث ({refs.length})
              </span>
              {showSource ? (
                <ChevronUp className="w-4 h-4 text-secondary-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-secondary-400" />
              )}
            </button>

            {showSource && (
              <div className="px-5 pb-4 space-y-3">
                {refs.map((ref, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40 p-3 space-y-1 text-sm"
                  >
                    {ref.rawi && (
                      <p className="text-secondary-600 dark:text-secondary-400">
                        <span className="font-semibold text-secondary-700 dark:text-secondary-300">الراوي: </span>
                        {ref.rawi}
                      </p>
                    )}
                    {ref.mohdith && (
                      <p className="text-secondary-600 dark:text-secondary-400">
                        <span className="font-semibold text-secondary-700 dark:text-secondary-300">المحدّث: </span>
                        {ref.mohdith}
                      </p>
                    )}
                    {ref.book && (
                      <p className="text-secondary-600 dark:text-secondary-400">
                        <span className="font-semibold text-secondary-700 dark:text-secondary-300">الكتاب: </span>
                        {ref.book}
                        {ref.numberOrPage ? ` (${ref.numberOrPage})` : ''}
                      </p>
                    )}
                    {ref.grade && (
                      <p className="text-emerald-700 dark:text-emerald-400 font-medium text-xs mt-1">
                        ✦ {ref.grade}
                      </p>
                    )}
                    {ref.takhrij && (
                      <p className="text-secondary-500 dark:text-secondary-400 text-xs leading-relaxed mt-1">
                        {ref.takhrij}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Vocabulary toggle */}
        {vocab.length > 0 && (
          <div className={!isQuran && refs.length > 0 ? 'border-t border-secondary-100 dark:border-secondary-700/60' : ''}>
            <button
              onClick={() => setShowVocab((p) => !p)}
              className="flex items-center gap-2 w-full text-right py-3 px-5 hover:bg-secondary-50 dark:hover:bg-secondary-700/40 transition-colors"
              aria-expanded={showVocab}
            >
              <Layers className="w-4 h-4 text-violet-500 flex-shrink-0" />
              <span className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 flex-1">
                شرح المفردات
              </span>
              {showVocab ? (
                <ChevronUp className="w-4 h-4 text-secondary-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-secondary-400" />
              )}
            </button>

            {showVocab && (
              <div className="px-5 pb-4 space-y-2">
                {vocab.map((v, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-900/40 p-3"
                  >
                    <p className="font-amiri text-lg font-bold text-secondary-800 dark:text-secondary-200 mb-1">
                      {v.text}
                    </p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">
                      {v.meaning}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Main Page ────────────────────────────────────────────── */
const DuaaPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [duaaItems, setDuaaItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return allCategories;
    return allCategories.filter((c) => c.name.includes(searchQuery));
  }, [searchQuery]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setDuaaItems(getDuaByCategory(category.name));
    setSearchQuery('');
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setDuaaItems([]);
    setSearchQuery('');
  };

  /* ── Category detail view ───────────────────────────────── */
  if (selectedCategory) {
    return (
      <div className="max-w-3xl mx-auto space-y-6" dir="rtl">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
          aria-label="العودة لقائمة الأدعية"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          العودة للأدعية
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/30">
            <Heart className="w-5 h-5 text-rose-500 dark:text-rose-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200 leading-snug">
              {selectedCategory.name}
            </h1>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              {selectedCategory.count} دعاء
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {duaaItems.map((duaa, i) => (
            <DuaaCard key={duaa.id} duaa={duaa} index={i} />
          ))}
        </div>
      </div>
    );
  }

  /* ── Category list view ─────────────────────────────────── */
  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        to={ROUTES.ADHKAR}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
      >
        <ArrowRight className="w-4 h-4" />
        العودة للأذكار
      </Link>

      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-900/30">
            <Heart className="w-10 h-10 text-rose-500 dark:text-rose-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">
          100 دعاء
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 max-w-lg mx-auto">
          مئة دعاء من القرآن الكريم والسنة النبوية — اختر الموضوع للقراءة
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800">
          <span className="text-sm font-semibold text-rose-600 dark:text-rose-300">
            {allCategories.length} موضوعاً
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن موضوع..."
            aria-label="البحث عن موضوع دعاء"
            className="w-full pr-12 pl-10 py-3 rounded-xl border-2 border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-800 dark:text-secondary-200 placeholder-secondary-400 dark:placeholder-secondary-500 focus:border-rose-400 dark:focus:border-rose-500 focus:outline-none transition-colors duration-200"
            dir="rtl"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="مسح البحث"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
            >
              <X className="w-4 h-4 text-secondary-400" />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-sm text-secondary-500 dark:text-secondary-400 text-center mt-2">
            {filteredCategories.length} نتيجة
          </p>
        )}
      </div>

      {/* Category grid */}
      {filteredCategories.length === 0 ? (
        <EmptyState
          icon={<Search className="w-16 h-16" />}
          title="لا توجد نتائج"
          description="لم يتم العثور على موضوع يطابق البحث"
          actionLabel="مسح البحث"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" dir="rtl">
          {filteredCategories.map((category) => (
            <Card
              key={category.name}
              hover
              onClick={() => handleCategoryClick(category)}
              className="text-right"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 rounded-xl bg-rose-100 dark:bg-rose-900/30 mt-0.5">
                  <Heart className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-secondary-800 dark:text-secondary-200 leading-snug mb-1">
                    {category.name}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 text-xs font-medium">
                    {category.count} دعاء
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DuaaPage;
