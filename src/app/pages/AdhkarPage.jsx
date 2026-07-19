import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { ArrowRight, Search, X, BookOpen, Check, Flame, Clock, Sun, Moon } from 'lucide-react';
import { fetchDhikrCategories, fetchDhikrByCategory } from '../services/dhikrApi';
import useAdhkarProgress from '../hooks/useAdhkarProgress';
import Card from '../components/common/Card';
import DhikrCounter from '../components/dhikr/DhikrCounter';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import { AdhkarFeaturedSkeleton, AdhkarGridSkeleton, DhikrCardSkeleton } from '../components/skeletons';

const TODAY = new Date().toISOString().split('T')[0];

/* ─── Time helpers ──────────────────────────────────────────── */
function getDayPeriod() {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return 'morning';
  if (h >= 15 && h < 20) return 'evening';
  return null;
}

function isMorningCat(cat)  { return cat.nameAr.includes('الصباح'); }
function isEveningCat(cat)  { return cat.nameAr.includes('المساء'); }
function isFeaturedCat(cat) { return isMorningCat(cat) || isEveningCat(cat); }

/* ─── Mini History dots (last 7 days) ───────────────────────── */
function HistoryDots({ history }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });
  return (
    <div className="flex gap-1 justify-center mt-2">
      {days.map(d => (
        <div key={d} className={`w-2 h-2 rounded-full transition-colors ${
          history.includes(d)
            ? 'bg-emerald-500 dark:bg-emerald-400'
            : 'bg-secondary-200 dark:bg-secondary-700'
        }`} title={d} />
      ))}
    </div>
  );
}

/* ─── Featured Card (morning / evening) ─────────────────────── */
function FeaturedCategoryCard({ category, isMorning, streak, history, completedToday, hasProgress, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full text-right rounded-2xl p-5 border-2 transition-all duration-200 hover:shadow-lg active:scale-[0.98] ${
        completedToday
          ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20'
          : isMorning
          ? 'border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20'
          : 'border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{isMorning ? '🌅' : '🌙'}</span>
            <h3 className="font-bold text-secondary-800 dark:text-secondary-100 text-lg">
              {category.nameAr}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-secondary-500 dark:text-secondary-400">
            <span>{category.count} أذكار</span>
            {streak > 0 && (
              <span className="inline-flex items-center gap-1 text-orange-600 dark:text-orange-400 font-semibold">
                <Flame className="w-3 h-3" />{streak} يوم متتالي
              </span>
            )}
            {hasProgress && !completedToday && (
              <span className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 font-semibold">
                <Clock className="w-3 h-3" />متابعة
              </span>
            )}
          </div>
          <HistoryDots history={history} />
        </div>
        {completedToday && (
          <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
            <Check className="w-5 h-5" />
          </div>
        )}
      </div>
    </button>
  );
}

/* ─── Daily Reminder Banner ──────────────────────────────────── */
function DailyBanner({ morningCat, eveningCat, isCompletedToday, onSelect }) {
  const period = getDayPeriod();
  if (!period) return null;

  const isMorning = period === 'morning';
  const cat = isMorning ? morningCat : eveningCat;
  if (!cat || isCompletedToday(cat.number)) return null;

  return (
    <button
      onClick={() => onSelect(cat)}
      className={`w-full text-right flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all hover:shadow-md active:scale-[0.99] ${
        isMorning
          ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
          : 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200'
      }`}
    >
      <span className="text-2xl shrink-0">{isMorning ? '🌅' : '🌙'}</span>
      <div className="flex-1">
        <p className="font-semibold text-sm">
          {isMorning ? 'لم تكمل أذكار الصباح اليوم بعد' : 'لم تكمل أذكار المساء اليوم بعد'}
        </p>
        <p className="text-xs opacity-70">اضغط للبدء الآن</p>
      </div>
      <ArrowRight className="w-4 h-4 shrink-0 rotate-180" />
    </button>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */
const AdhkarPage = () => {
  const [categories, setCategories]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dhikrItems, setDhikrItems]     = useState([]);
  const [dhikrLoading, setDhikrLoading] = useState(false);
  const [dhikrError, setDhikrError]     = useState(null);
  const [searchQuery, setSearchQuery]   = useState('');
  const [completedIds, setCompletedIds] = useState(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const modalShownRef = useRef(false);
  const dhikrListRef  = useRef(null);

  const {
    getProgress, saveProgress, markComplete,
    getStreak, getHistory, isCompletedToday,
  } = useAdhkarProgress();

  /* ── Load categories ─────────────────────────────────────── */
  useEffect(() => {
    fetchDhikrCategories()
      .then(d => setCategories(d.categories))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredCategories = useMemo(() => {
    const rest = categories.filter(c => !isFeaturedCat(c));
    if (!searchQuery) return rest;
    return rest.filter(c => c.nameAr.includes(searchQuery));
  }, [categories, searchQuery]);

  const morningCat = useMemo(() => categories.find(isMorningCat), [categories]);
  const eveningCat = useMemo(() => categories.find(isEveningCat), [categories]);
  const featuredCats = useMemo(() => categories.filter(isFeaturedCat), [categories]);

  /* ── Open category ───────────────────────────────────────── */
  const handleCategoryClick = useCallback(async (category) => {
    setSelectedCategory(category);
    setDhikrLoading(true);
    setDhikrError(null);
    modalShownRef.current = false;
    setShowCompletionModal(false);
    try {
      const data = await fetchDhikrByCategory(category.number);
      setDhikrItems(data.items);
      // Restore today's progress
      setCompletedIds(getProgress(category.number));
    } catch (e) {
      setDhikrError(e.message);
    } finally {
      setDhikrLoading(false);
    }
  }, [getProgress]);

  /* ── Dhikr complete ──────────────────────────────────────── */
  const handleDhikrComplete = useCallback((dhikrId) => {
    setCompletedIds(prev => {
      const next = new Set(prev);
      next.add(dhikrId);
      saveProgress(selectedCategory.number, next);

      if (next.size === dhikrItems.length && !modalShownRef.current) {
        modalShownRef.current = true;
        markComplete(selectedCategory.number);
        setTimeout(() => setShowCompletionModal(true), 1500);
      }

      return next;
    });

    setTimeout(() => {
      const items = dhikrListRef.current?.querySelectorAll('[data-dhikr-card]');
      if (!items) return;
      for (const el of items) {
        if (el.dataset.completed === 'false') {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          break;
        }
      }
    }, 100);
  }, [selectedCategory, dhikrItems.length, saveProgress, markComplete]);

  const handleBack = () => {
    setSelectedCategory(null);
    setDhikrItems([]);
    setDhikrError(null);
    setCompletedIds(new Set());
    setShowCompletionModal(false);
    modalShownRef.current = false;
  };

  /* ── Loading / Error ─────────────────────────────────────── */
  if (loading) return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-secondary-200 dark:bg-secondary-700 animate-pulse mx-auto" />
        <div className="h-8 w-24 bg-secondary-200 dark:bg-secondary-700 rounded-full animate-pulse mx-auto" />
        <div className="h-4 w-72 bg-secondary-200 dark:bg-secondary-700 rounded-full animate-pulse mx-auto" />
      </div>
      <AdhkarFeaturedSkeleton />
      <AdhkarGridSkeleton count={8} />
    </div>
  );
  if (error)   return (
    <EmptyState icon={<BookOpen className="w-16 h-16 text-red-500" />}
      title="خطأ في تحميل الأذكار" description="حدث خطأ أثناء الاتصال بالخادم."
      actionLabel="إعادة المحاولة" onAction={() => window.location.reload()} />
  );

  /* ══ Detail view ════════════════════════════════════════════ */
  if (selectedCategory) {
    const streak  = getStreak(selectedCategory.number);
    const history = getHistory(selectedCategory.number);
    const total   = dhikrItems.length;
    const done    = completedIds.size;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={handleBack}
            className="p-2 rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
            aria-label="العودة">
            <ArrowRight className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200">
              {selectedCategory.nameAr}
            </h1>
            <div className="flex items-center gap-3 text-sm text-secondary-500 dark:text-secondary-400">
              <span>{selectedCategory.count} أذكار</span>
              {streak > 0 && (
                <span className="inline-flex items-center gap-1 text-orange-600 dark:text-orange-400 font-semibold">
                  <Flame className="w-3.5 h-3.5" />{streak} يوم متتالي 🔥
                </span>
              )}
            </div>
          </div>
        </div>

        {/* History dots */}
        {history.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary-50 dark:bg-secondary-800/60 border border-secondary-100 dark:border-secondary-700">
            <span className="text-xs text-secondary-500 dark:text-secondary-400 shrink-0">آخر 7 أيام</span>
            <HistoryDots history={history} />
          </div>
        )}

        {/* Progress bar */}
        {done > 0 && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">{done} من {total} مكتمل</span>
                <span className="text-emerald-600 dark:text-emerald-400">{Math.round((done / total) * 100)}%</span>
              </div>
              <div className="h-2 bg-emerald-200 dark:bg-emerald-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${(done / total) * 100}%` }} />
              </div>
            </div>
          </div>
        )}

        {dhikrLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, i) => (
              <DhikrCardSkeleton key={i} />
            ))}
          </div>
        )}
        {dhikrError && (
          <EmptyState icon={<BookOpen className="w-16 h-16 text-red-500" />}
            title="خطأ" description="حدث خطأ أثناء الاتصال بالخادم."
            actionLabel="إعادة المحاولة" onAction={() => handleCategoryClick(selectedCategory)} />
        )}

        {!dhikrLoading && !dhikrError && (
          <div className="space-y-4" ref={dhikrListRef}>
            {dhikrItems.map(item => (
              <div key={item.id} data-dhikr-card data-completed={completedIds.has(item.id)}>
                <DhikrCounter dhikr={item} isCompleted={completedIds.has(item.id)} onComplete={handleDhikrComplete} />
              </div>
            ))}
          </div>
        )}

        <Modal isOpen={showCompletionModal} onClose={() => setShowCompletionModal(false)}
          title="أحسنت!" actionLabel="العودة للقائمة" onAction={handleBack}>
          <p className="text-6xl mb-4">🎉</p>
          <p className="text-secondary-600 dark:text-secondary-400 mb-1">أنهيت جميع أذكار</p>
          <p className="text-lg font-bold text-secondary-800 dark:text-secondary-200">{selectedCategory.nameAr}</p>
          {streak > 0 && (
            <p className="text-orange-600 dark:text-orange-400 font-bold mt-1 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4" />{streak} يوم متتالي
            </p>
          )}
          <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-2">جزاك الله خيرا</p>
        </Modal>
      </div>
    );
  }

  /* ══ List view ══════════════════════════════════════════════ */
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
            <BookOpen className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">الأذكار</h1>
        <p className="text-secondary-600 dark:text-secondary-400 max-w-lg mx-auto">
          أذكار المسلم اليومية من القرآن والسنة — اختر التصنيف لبدء المراجعة
        </p>
      </div>

      {/* Daily Reminder Banner */}
      {(morningCat || eveningCat) && (
        <DailyBanner
          morningCat={morningCat}
          eveningCat={eveningCat}
          isCompletedToday={isCompletedToday}
          onSelect={handleCategoryClick}
        />
      )}

      {/* Featured: Morning & Evening */}
      {featuredCats.length > 0 && (
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wide">
            <Sun className="w-4 h-4" />أذكار اليوم
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {featuredCats.map(cat => (
              <FeaturedCategoryCard
                key={cat.number}
                category={cat}
                isMorning={isMorningCat(cat)}
                streak={getStreak(cat.number)}
                history={getHistory(cat.number)}
                completedToday={isCompletedToday(cat.number)}
                hasProgress={getProgress(cat.number).size > 0}
                onClick={() => handleCategoryClick(cat)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="ابحث عن تصنيف..." dir="rtl"
            className="w-full pr-12 pl-10 py-3 rounded-xl border-2 border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-800 dark:text-secondary-200 placeholder-secondary-400 focus:border-primary-500 focus:outline-none transition-colors" />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-700">
              <X className="w-4 h-4 text-secondary-400" />
            </button>
          )}
        </div>
      </div>

      {/* All other categories */}
      {filteredCategories.length === 0 && searchQuery ? (
        <EmptyState icon={<Search className="w-16 h-16" />} title="لا توجد نتائج"
          description="لم يتم العثور على تصنيفات" actionLabel="مسح البحث" onAction={() => setSearchQuery('')} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCategories.map(cat => {
            const streak      = getStreak(cat.number);
            const completedT  = isCompletedToday(cat.number);
            const hasProgress = getProgress(cat.number).size > 0;
            return (
              <Card key={cat.number} hover onClick={() => handleCategoryClick(cat)}>
                <div className="text-center">
                  {completedT && (
                    <div className="flex justify-center mb-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-medium">
                        <Check className="w-3 h-3" />مكتمل اليوم
                      </span>
                    </div>
                  )}
                  {hasProgress && !completedT && (
                    <div className="flex justify-center mb-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-[10px] font-medium">
                        <Clock className="w-3 h-3" />متابعة
                      </span>
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-secondary-800 dark:text-secondary-200 mb-1 leading-relaxed">
                    {cat.nameAr}
                  </h3>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                      {cat.count} أذكار
                    </span>
                    {streak > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-semibold">
                        <Flame className="w-3 h-3" />{streak}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdhkarPage;
