import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { ArrowRight, Search, X, BookOpen, Check } from 'lucide-react';
import { fetchDhikrCategories, fetchDhikrByCategory } from '../services/dhikrApi';
import useLocalStorage from '../hooks/useLocalStorage';
import Card from '../components/common/Card';
import DhikrCounter from '../components/dhikr/DhikrCounter';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';

const TODAY = new Date().toISOString().split('T')[0];

const AdhkarPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dhikrItems, setDhikrItems] = useState([]);
  const [dhikrLoading, setDhikrLoading] = useState(false);
  const [dhikrError, setDhikrError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');

  const [completedIds, setCompletedIds] = useState(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const modalShownRef = useRef(false);
  const dhikrListRef = useRef(null);

  const [completedMap, setCompletedMap] = useLocalStorage('adhkar-completed', {});
  const [dailyMap, setDailyMap] = useLocalStorage('adhkar-daily-completed', {});

  const loadCompletedIds = useCallback(
    (categoryNumber) => {
      const saved = completedMap[categoryNumber];
      if (Array.isArray(saved)) {
        setCompletedIds(new Set(saved));
      } else {
        setCompletedIds(new Set());
      }
    },
    [completedMap]
  );

  const saveCompletedIds = useCallback(
    (categoryNumber, ids) => {
      setCompletedMap((prev) => ({
        ...prev,
        [categoryNumber]: Array.from(ids),
      }));
    },
    [setCompletedMap]
  );

  const handleDhikrComplete = useCallback(
    (dhikrId) => {
      setCompletedIds((prev) => {
        const next = new Set(prev);
        next.add(dhikrId);

        if (selectedCategory) {
          saveCompletedIds(selectedCategory.number, next);

          if (next.size === dhikrItems.length && !modalShownRef.current) {
            modalShownRef.current = true;
            setDailyMap((prev) => ({
              ...prev,
              [selectedCategory.number]: TODAY,
            }));
            setTimeout(() => setShowCompletionModal(true), 1500);
          }
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
    },
    [selectedCategory, dhikrItems.length, saveCompletedIds, setDailyMap]
  );

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchDhikrCategories();
        setCategories(data.categories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    return categories.filter((cat) => cat.nameAr.includes(searchQuery));
  }, [categories, searchQuery]);

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setDhikrLoading(true);
    setDhikrError(null);
    modalShownRef.current = false;
    setShowCompletionModal(false);
    try {
      const data = await fetchDhikrByCategory(category.number);
      setDhikrItems(data.items);
      loadCompletedIds(category.number);
    } catch (err) {
      setDhikrError(err.message);
    } finally {
      setDhikrLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setDhikrItems([]);
    setDhikrError(null);
    setCompletedIds(new Set());
    setShowCompletionModal(false);
    modalShownRef.current = false;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={<BookOpen className="w-16 h-16 text-red-500" />}
        title="خطأ في تحميل الأذكار"
        description="حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى."
        actionLabel="العودة"
        onAction={() => window.location.reload()}
      />
    );
  }

  if (selectedCategory) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
            aria-label="العودة لقائمة الأذكار"
          >
            <ArrowRight className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200">
              {selectedCategory.nameAr}
            </h1>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              {selectedCategory.count} أذكار
            </p>
          </div>
        </div>

        {completedIds.size > 0 && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                  {completedIds.size} من {dhikrItems.length} مكتمل
                </span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {Math.round((completedIds.size / dhikrItems.length) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-emerald-200 dark:bg-emerald-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(completedIds.size / dhikrItems.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {dhikrLoading && (
          <div className="flex items-center justify-center min-h-[200px]">
            <Spinner size="lg" />
          </div>
        )}

        {dhikrError && (
          <EmptyState
            icon={<BookOpen className="w-16 h-16 text-red-500" />}
            title="خطأ في تحميل الأذكار"
            description="حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى."
            actionLabel="إعادة المحاولة"
            onAction={() => handleCategoryClick(selectedCategory)}
          />
        )}

        {!dhikrLoading && !dhikrError && dhikrItems.length === 0 && (
          <EmptyState
            icon={<BookOpen className="w-16 h-16" />}
            title="لا توجد أذكار"
            description="لم يتم العثور على أذكار في هذا التصنيف"
          />
        )}

        {!dhikrLoading && !dhikrError && dhikrItems.length > 0 && (
          <div className="space-y-4" ref={dhikrListRef}>
            {dhikrItems.map((item) => (
              <div key={item.id} data-dhikr-card data-completed={completedIds.has(item.id)}>
                <DhikrCounter
                  dhikr={item}
                  isCompleted={completedIds.has(item.id)}
                  onComplete={handleDhikrComplete}
                />
              </div>
            ))}
          </div>
        )}

        <Modal
          isOpen={showCompletionModal}
          onClose={() => setShowCompletionModal(false)}
          title="أحسنت!"
          actionLabel="العودة للقائمة"
          onAction={handleBack}
        >
          <p className="text-6xl mb-4">🎉</p>
          <p className="text-secondary-600 dark:text-secondary-400 mb-1">
            أنهيت جميع أذكار
          </p>
          <p className="text-lg font-bold text-secondary-800 dark:text-secondary-200">
            {selectedCategory.nameAr}
          </p>
          <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-2">
            مكتمل
          </p>
        </Modal>
      </div>
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
          الأذكار
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 max-w-lg mx-auto">
          أذكار المسلم اليومية من القرآن والسنة — اختر التصنيف لبدء المراجعة
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن تصنيف..."
            aria-label="البحث عن تصنيف أذكار"
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
          {filteredCategories.length} نتيجة
        </p>
      )}

      {filteredCategories.length === 0 ? (
        <EmptyState
          icon={<Search className="w-16 h-16" />}
          title="لا توجد نتائج"
          description="لم يتم العثور على تصنيفات تطابق البحث"
          actionLabel="مسح البحث"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCategories.map((category) => {
            const isDailyCompleted = dailyMap[category.number] === TODAY;
            return (
              <Card
                key={category.number}
                hover
                onClick={() => handleCategoryClick(category)}
              >
                <div className="text-center">
                  {isDailyCompleted && (
                    <div className="flex justify-center mb-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-medium">
                        <Check className="w-3 h-3" />
                        مكتمل اليوم
                      </span>
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-secondary-800 dark:text-secondary-200 mb-1 leading-relaxed">
                    {category.nameAr}
                  </h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                    {category.count} أذكار
                  </span>
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
