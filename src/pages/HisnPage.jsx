import { useState, useMemo } from 'react';
import { ArrowRight, Search, X, BookOpen } from 'lucide-react';
import { getCategories, getDhikrByCategory } from '../services/dhikrApi';
import Card from '../components/common/Card';
import DhikrCard from '../components/dhikr/DhikrCard';
import EmptyState from '../components/common/EmptyState';
import { ROUTES } from '../constants';
import { useNavigate } from 'react-router-dom';

const categories = getCategories();

const HisnPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dhikrItems, setDhikrItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    return categories.filter((cat) => cat.name.includes(searchQuery));
  }, [searchQuery]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setDhikrItems(getDhikrByCategory(category.name));
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setDhikrItems([]);
  };

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
              {selectedCategory.name}
            </h1>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              {selectedCategory.count} أذكار
            </p>
          </div>
        </div>

        {dhikrItems.length > 0 && (
          <div className="space-y-4">
            {dhikrItems.map((item) => (
              <DhikrCard key={item.id} dhikr={item} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(ROUTES.ADHKAR)}
          className="p-2 rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
          aria-label="العودة"
        >
          <ArrowRight className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200">
              حصن المسلم
            </h1>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
            من كتاب حصن المسلم — اختر القسم للقراءة
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن قسم..."
            aria-label="البحث عن قسم أذكار"
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
          description="لم يتم العثور على أقسام تطابق البحث"
          actionLabel="مسح البحث"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCategories.map((category) => (
            <Card
              key={category.name}
              hover
              onClick={() => handleCategoryClick(category)}
            >
              <div className="text-center">
                <h3 className="text-lg font-bold text-secondary-800 dark:text-secondary-200 mb-1 leading-relaxed">
                  {category.name}
                </h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                  {category.count} أذكار
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HisnPage;
