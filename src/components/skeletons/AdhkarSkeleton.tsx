import { SkeletonBlock } from './SkeletonBlock';

export function AdhkarFeaturedSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[0, 1].map(i => (
        <div key={i} className="rounded-2xl border-2 border-secondary-100 dark:border-secondary-800 bg-secondary-50 dark:bg-secondary-800/60 p-5 space-y-3 animate-pulse">
          <div className="flex items-center gap-2">
            <SkeletonBlock width="w-8" height="h-8" rounded="rounded-xl" />
            <SkeletonBlock width="w-32" height="h-5" />
          </div>
          <SkeletonBlock width="w-24" height="h-4" />
          <div className="flex gap-1">
            {Array.from({ length: 7 }, (_, j) => (
              <SkeletonBlock key={j} width="w-2" height="h-2" rounded="rounded-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdhkarGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-2xl border-2 border-secondary-100 dark:border-secondary-800 bg-white dark:bg-secondary-800 p-5 flex flex-col items-center gap-3 animate-pulse">
          <SkeletonBlock width="w-28" height="h-5" />
          <SkeletonBlock width="w-16" height="h-6" rounded="rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function DhikrCardSkeleton() {
  return (
    <div className="rounded-2xl border-2 border-secondary-100 dark:border-secondary-800 bg-white dark:bg-secondary-800 p-6 space-y-5 animate-pulse">
      {/* Arabic text */}
      <div className="space-y-3">
        <SkeletonBlock width="w-full"  height="h-5" />
        <SkeletonBlock width="w-11/12" height="h-5" />
        <SkeletonBlock width="w-4/5"   height="h-5" />
        <SkeletonBlock width="w-full"  height="h-5" />
        <SkeletonBlock width="w-2/3"   height="h-5" />
      </div>
      {/* Tasbih circle placeholder */}
      <div className="flex justify-center">
        <div className="w-48 h-48 rounded-full bg-secondary-100 dark:bg-secondary-700" />
      </div>
    </div>
  );
}
