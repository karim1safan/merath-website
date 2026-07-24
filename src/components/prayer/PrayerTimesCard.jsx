import { Clock, MapPin } from 'lucide-react';
import Card from '../common/Card';

function PrayerTimesCard({ timings, nextPrayerIndex, currentCity, loading, prayerKeys }) {
  function formatToArabic12(timeStr) {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'م' : 'ص';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
  }

  return (
    <section>
      <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-bold text-secondary-800 dark:text-secondary-200">
            مواقيت الصلاة
          </h3>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {prayerKeys.map((prayer, index) => {
            const time = timings?.[prayer.key];
            const isNext = index === nextPrayerIndex;
            const isPast = nextPrayerIndex !== -1 && index < nextPrayerIndex;
            const isLastPast = nextPrayerIndex === -1;

            return (
              <div
                key={prayer.key}
                className={`flex flex-col items-center gap-1 p-2 sm:p-3 rounded-xl transition-all ${
                  isNext
                    ? 'bg-emerald-500 dark:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 scale-105'
                    : isPast || isLastPast
                    ? 'bg-secondary-100 dark:bg-secondary-700/50 text-secondary-400 dark:text-secondary-500'
                    : 'bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300'
                }`}
              >
                <span className={`text-xs font-medium ${isNext ? 'text-emerald-100' : ''}`}>
                  {prayer.name}
                </span>
                <span className="text-sm sm:text-base font-bold" dir="ltr">
                  {loading ? '--:--' : formatToArabic12(time)}
                </span>
                {isNext && (
                  <span className="text-[10px] font-semibold text-emerald-100 bg-emerald-400/30 px-2 py-0.5 rounded-full">
                    القادمة
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-secondary-500 dark:text-secondary-400">
          <MapPin className="w-3 h-3" />
          <span>{currentCity.name} — {currentCity.country}</span>
        </div>
      </Card>
    </section>
  );
}

export default PrayerTimesCard;
