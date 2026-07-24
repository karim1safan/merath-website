import Skeleton from '../common/Skeleton';

const QuizSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton variant="rectangular" className="w-full h-3 rounded-full" />

      <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton variant="rectangular" className="w-20 h-6 rounded-full" />
          <Skeleton variant="text" className="w-16 h-4" />
        </div>

        <Skeleton variant="text" className="w-full h-5 mb-2" />
        <Skeleton variant="text" className="w-4/5 h-5 mb-6" />

        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-xl border-2 border-secondary-200 dark:border-secondary-700"
            >
              <Skeleton variant="circular" className="w-8 h-8 shrink-0" />
              <Skeleton variant="text" className="w-full h-4" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Skeleton variant="rectangular" className="w-24 h-10 rounded-xl" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="circular" className="w-3 h-3" />
          ))}
        </div>
        <Skeleton variant="rectangular" className="w-24 h-10 rounded-xl" />
      </div>
    </div>
  );
};

export default QuizSkeleton;
