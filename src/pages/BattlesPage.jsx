import { Link } from 'react-router-dom';
import { Swords, MapPin, Users, ChevronLeft } from 'lucide-react';
import { useBattles } from '../hooks/useSeerah';
import { ROUTES } from '../constants';
import Card from '../components/common/Card';

const BattlesPage = () => {
  const { battles, categories, stats, selectedCategory, setSelectedCategory } = useBattles();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-2xl bg-red-100 dark:bg-red-900/30">
            <Swords className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">
          غزوات النبي ﷺ
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 max-w-lg mx-auto">
          جميع الغزوات والسرايا النبوية مع تفاصيل كل معركة
        </p>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {stats.total}
          </div>
          <div className="text-xs text-secondary-500 dark:text-secondary-400">غزوة وسرية</div>
        </div>
        <div className="w-px bg-secondary-200 dark:bg-secondary-700" />
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stats.ghazwat}
          </div>
          <div className="text-xs text-secondary-500 dark:text-secondary-400">غزوة</div>
        </div>
        <div className="w-px bg-secondary-200 dark:bg-secondary-700" />
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.saraya}
          </div>
          <div className="text-xs text-secondary-500 dark:text-secondary-400">سرية</div>
        </div>
      </div>

      {/* Back to Seerah */}
      <Link
        to={ROUTES.SEERAH}
        className="inline-flex items-center gap-2 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm">العودة للسيرة النبوية</span>
      </Link>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-700'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Battles List */}
      {battles.length === 0 ? (
        <div className="text-center py-12 text-secondary-500 dark:text-secondary-400">
          لا توجد غزوات في هذا التصنيف
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {battles.map((battle, index) => (
            <Link key={battle.id} to={`/seerah/battles/${battle.id}`}>
              <Card hover className="h-full">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <h3 className="font-bold text-secondary-800 dark:text-secondary-200">
                        {battle.name}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-secondary-500 dark:text-secondary-400 mb-3">
                      <span className="flex items-center gap-1">
                        <span>📅</span>
                        <span>{battle.date}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{battle.location}</span>
                      </span>
                      {battle.participants && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{battle.participants} مشارك</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          battle.category === 'ghazwa'
                            ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        }`}
                      >
                        {battle.category === 'ghazwa' ? 'غزوة' : 'سرية'}
                      </span>
                      <span className="text-xs text-secondary-500 dark:text-secondary-400">
                        {battle.result}
                      </span>
                    </div>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-secondary-400 flex-shrink-0 mt-2" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BattlesPage;
