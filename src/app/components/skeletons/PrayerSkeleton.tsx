import { SkeletonBlock } from './SkeletonBlock';

export function PrayerPageSkeleton() {
  return (
    <div className="max-w-lg mx-auto space-y-6" dir="rtl">
      {/* Location header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonBlock width="w-32" height="h-4" />
          <SkeletonBlock width="w-24" height="h-3" />
        </div>
        <div className="flex gap-2">
          <SkeletonBlock width="w-8" height="h-8" rounded="rounded-xl" />
          <SkeletonBlock width="w-8" height="h-8" rounded="rounded-xl" />
        </div>
      </div>

      {/* Progress ring hero */}
      <div className="flex flex-col items-center py-8 rounded-3xl bg-secondary-100 dark:bg-secondary-800 space-y-4 animate-pulse">
        <div className="w-48 h-48 rounded-full bg-secondary-200 dark:bg-secondary-700" />
        <SkeletonBlock width="w-40" height="h-8" className="mx-auto" />
      </div>

      {/* Prayer rows */}
      <div className="space-y-2">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3 rounded-2xl bg-secondary-50 dark:bg-secondary-800/60">
            <div className="flex items-center gap-3">
              <SkeletonBlock width="w-7" height="h-7" rounded="rounded-full" />
              <SkeletonBlock width="w-16" height="h-5" />
            </div>
            <SkeletonBlock width="w-14" height="h-6" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PrayerWidgetSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary-100 dark:bg-secondary-800 animate-pulse">
      <div className="w-13 h-13 rounded-full bg-secondary-200 dark:bg-secondary-700 shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonBlock width="w-20" height="h-3" />
        <SkeletonBlock width="w-28" height="h-5" />
        <SkeletonBlock width="w-36" height="h-3" />
      </div>
    </div>
  );
}
