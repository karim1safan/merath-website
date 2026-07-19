import { SkeletonBlock } from './SkeletonBlock';

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border-2 border-secondary-100 dark:border-secondary-800 bg-white dark:bg-secondary-800 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <SkeletonBlock width="w-24" height="h-5" />
        <SkeletonBlock width="w-16" height="h-5" />
      </div>
      <SkeletonBlock width="w-full" height="h-4" />
      <SkeletonBlock width="w-3/4"  height="h-4" />
      <SkeletonBlock width="w-20"   height="h-6" rounded="rounded-full" />
    </div>
  );
}

export function CardSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
