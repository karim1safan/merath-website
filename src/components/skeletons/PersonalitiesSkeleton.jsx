import Skeleton from '../common/Skeleton';

const PersonalitiesSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Skeleton variant="rectangular" className="w-16 h-16 rounded-2xl" />
        </div>
        <Skeleton variant="text" className="w-48 h-8 mx-auto mb-2" />
        <Skeleton variant="text" className="w-80 h-4 mx-auto" />
      </div>

      <div className="max-w-2xl mx-auto">
        <Skeleton variant="rectangular" className="w-full h-12 rounded-xl" />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" className="w-20 h-9 rounded-full" />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-secondary-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <Skeleton variant="text" className="w-10 h-10 shrink-0" />
              <div className="flex-1">
                <Skeleton variant="text" className="w-32 h-5 mb-1" />
                <Skeleton variant="text" className="w-24 h-3" />
              </div>
            </div>
            <Skeleton variant="text" className="w-full h-3 mb-1" />
            <Skeleton variant="text" className="w-full h-3 mb-1" />
            <Skeleton variant="text" className="w-3/4 h-3 mb-4" />
            <div className="flex items-center justify-between pt-4 border-t border-secondary-100 dark:border-secondary-700">
              <Skeleton variant="text" className="w-16 h-3" />
              <div className="flex gap-1.5">
                <Skeleton variant="rectangular" className="w-14 h-5 rounded-full" />
                <Skeleton variant="rectangular" className="w-14 h-5 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalitiesSkeleton;
