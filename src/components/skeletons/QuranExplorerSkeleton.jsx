import Skeleton from '../common/Skeleton';

const QuranExplorerSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Skeleton variant="rectangular" className="w-16 h-16 rounded-2xl" />
        </div>
        <Skeleton variant="text" className="w-56 h-8 mx-auto mb-2" />
        <Skeleton variant="text" className="w-72 h-4 mx-auto" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Skeleton variant="rectangular" className="w-full max-w-md h-12 rounded-xl" />
        <Skeleton variant="rectangular" className="w-48 h-10 rounded-xl" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-secondary-800 rounded-2xl shadow-lg p-6 text-center">
            <Skeleton variant="text" className="w-8 h-3 mx-auto mb-1" />
            <Skeleton variant="text" className="w-24 h-5 mx-auto mb-2" />
            <Skeleton variant="rectangular" className="w-14 h-5 rounded-full mx-auto mb-2" />
            <Skeleton variant="text" className="w-20 h-3 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuranExplorerSkeleton;
