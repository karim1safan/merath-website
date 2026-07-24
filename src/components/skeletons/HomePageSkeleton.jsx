import Skeleton from '../common/Skeleton';

const HomePageSkeleton = () => {
  return (
    <div className="space-y-12">
      <section className="text-center py-12">
        <div className="flex justify-center mb-6">
          <Skeleton variant="rectangular" className="w-20 h-20 rounded-2xl" />
        </div>
        <Skeleton variant="text" className="w-48 h-10 mx-auto mb-4" />
        <Skeleton variant="text" className="w-80 h-5 mx-auto mb-4" />
        <Skeleton variant="rectangular" className="w-64 h-20 mx-auto rounded-2xl mb-8" />
        <div className="flex justify-center gap-4">
          <Skeleton variant="rectangular" className="w-32 h-12 rounded-xl" />
          <Skeleton variant="rectangular" className="w-32 h-12 rounded-xl" />
        </div>
      </section>

      <section>
        <Skeleton variant="rectangular" className="w-full h-24 rounded-2xl" />
      </section>

      <section>
        <Skeleton variant="rectangular" className="w-full h-40 rounded-2xl" />
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <Skeleton variant="text" className="w-40 h-8" />
          <Skeleton variant="text" className="w-16 h-4" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-secondary-800 rounded-2xl shadow-lg p-6">
              <div className="text-center">
                <Skeleton variant="rectangular" className="w-12 h-12 rounded-xl mx-auto mb-3" />
                <Skeleton variant="text" className="w-20 h-5 mx-auto mb-1" />
                <Skeleton variant="text" className="w-28 h-3 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <Skeleton variant="text" className="w-52 h-8" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-secondary-800 rounded-2xl shadow-lg p-6">
              <div className="text-center">
                <Skeleton variant="rectangular" className="w-12 h-12 rounded-xl mx-auto mb-3" />
                <Skeleton variant="text" className="w-24 h-5 mx-auto mb-1" />
                <Skeleton variant="text" className="w-32 h-3 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-8">
        <div className="text-center">
          <Skeleton variant="text" className="w-40 h-8 mx-auto mb-4" />
          <Skeleton variant="text" className="w-64 h-4 mx-auto mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton variant="rectangular" className="w-12 h-12 rounded-xl mx-auto mb-3" />
                <Skeleton variant="text" className="w-24 h-5 mx-auto mb-1" />
                <Skeleton variant="text" className="w-32 h-3 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePageSkeleton;
