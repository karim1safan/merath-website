import { useState } from 'react';
import { Link } from 'react-router';
import { BookOpen, ChevronDown, ChevronUp, Swords } from 'lucide-react';
import { useSeerah } from '../hooks/useSeerah';
import { ROUTES } from '../constants';
import Card from '../components/common/Card';

const SeerahPage = () => {
  const {
    timeline,
    categories,
    eras,
    stats,
    selectedEra,
    selectedCategory,
    setSelectedEra,
    setSelectedCategory,
  } = useSeerah();

  const [expandedId, setExpandedId] = useState(null);

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30">
            <BookOpen className="w-10 h-10 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200 mb-2">
          السيرة النبوية
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 max-w-lg mx-auto">
          رحلة النبي ﷺ من المولد إلى الوفاة — أحداث رئيسية مرتّبة زمنياً
        </p>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.total}
          </div>
          <div className="text-xs text-secondary-500 dark:text-secondary-400">حدث</div>
        </div>
        <div className="w-px bg-secondary-200 dark:bg-secondary-700" />
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {stats.makkah}
          </div>
          <div className="text-xs text-secondary-500 dark:text-secondary-400">مكي</div>
        </div>
        <div className="w-px bg-secondary-200 dark:bg-secondary-700" />
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.madinah}
          </div>
          <div className="text-xs text-secondary-500 dark:text-secondary-400">مدني</div>
        </div>
      </div>

      {/* Link to Battles */}
      <Link to={ROUTES.SEERAH_BATTLES}>
        <Card hover>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30">
              <Swords className="w-7 h-7 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200">
                غزوات النبي ﷺ
              </h3>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                جميع الغزوات والسرايا النبوية مع التفاصيل
              </p>
            </div>
            <div className="text-secondary-400">
              <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
            </div>
          </div>
        </Card>
      </Link>

      {/* Era Tabs */}
      <div className="flex gap-2 p-1 bg-secondary-100 dark:bg-secondary-800 rounded-xl">
        {eras.map((era) => (
          <button
            key={era.id}
            onClick={() => setSelectedEra(era.id)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedEra === era.id
                ? 'bg-white dark:bg-secondary-700 text-primary-600 dark:text-primary-400 shadow-md'
                : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200'
            }`}
          >
            {era.name}
          </button>
        ))}
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-700'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Timeline */}
      {timeline.length === 0 ? (
        <div className="text-center py-12 text-secondary-500 dark:text-secondary-400">
          لا توجد أحداث في هذا التصنيف
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute right-6 top-0 bottom-0 w-0.5 bg-purple-300 dark:bg-purple-700" />

          <div className="space-y-6">
            {timeline.map((event, index) => {
              const isExpanded = expandedId === event.id;
              const eraClasses = {
                makkah: {
                  dot: 'bg-amber-400',
                  badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
                  label: 'مكي',
                },
                madinah: {
                  dot: 'bg-green-400',
                  badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
                  label: 'مدني',
                },
                migrat: {
                  dot: 'bg-purple-400',
                  badge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
                  label: 'هجرة',
                },
              };
              const colors = eraClasses[event.era] || eraClasses.makkah;

              return (
                <div key={event.id} className="relative pr-16">
                  {/* Timeline number */}
                  <div
                    className={`absolute right-2 top-6 w-9 h-9 rounded-full border-4 border-white dark:border-secondary-900 ${colors.dot} z-10 flex items-center justify-center text-xs font-bold text-white shadow-md`}
                  >
                    {index + 1}
                  </div>

                  <Card
                    hover
                    onClick={() => toggleExpanded(event.id)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{event.icon}</span>
                          <h3 className="font-bold text-secondary-800 dark:text-secondary-200">
                            {event.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-secondary-500 dark:text-secondary-400 mb-2">
                          <span className={`px-2 py-0.5 rounded-full ${colors.badge}`}>
                            {colors.label}
                          </span>
                          <span>{event.date}</span>
                          <span className="text-secondary-300 dark:text-secondary-600">|</span>
                          <span>{event.dateGregorian}</span>
                        </div>
                        {isExpanded && (
                          <p className="text-secondary-600 dark:text-secondary-400 text-sm leading-relaxed mt-2">
                            {event.description}
                          </p>
                        )}
                      </div>
                      <button className="mt-1 text-secondary-400">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeerahPage;
