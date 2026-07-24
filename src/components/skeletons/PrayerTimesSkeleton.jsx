import Skeleton from '../common/Skeleton';

const PrayerTimesSkeleton = () => (
  <section>
    <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-lg p-6 border border-secondary-200 dark:border-secondary-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" className="w-5 h-5" />
          <Skeleton variant="text" className="w-32 h-6" />
        </div>
        <Skeleton variant="rectangular" className="w-24 h-8 rounded-xl" />
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1 p-3 rounded-xl">
            <Skeleton variant="text" className="w-10 h-4" />
            <Skeleton variant="text" className="w-14 h-5" />
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center">
        <Skeleton variant="text" className="w-36 h-3" />
      </div>
    </div>
  </section>
);

export default PrayerTimesSkeleton;
