import { SkeletonBlock } from './SkeletonBlock';

const LINE_WIDTHS = [
  ['w-full', 'w-5/6', 'w-full', 'w-2/3'],
  ['w-11/12', 'w-full', 'w-3/4', 'w-5/6'],
  ['w-full', 'w-4/5', 'w-full', 'w-1/2'],
];

export function VerseSkeleton({ index = 0 }: { index?: number }) {
  const widths = LINE_WIDTHS[index % LINE_WIDTHS.length];
  return (
    <div className="rounded-2xl border-2 border-secondary-100 dark:border-secondary-800 bg-white dark:bg-secondary-800 p-6 space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <SkeletonBlock width="w-16" height="h-6" rounded="rounded-full" />
        <div className="flex gap-2">
          <SkeletonBlock width="w-7" height="h-7" rounded="rounded-lg" />
          <SkeletonBlock width="w-7" height="h-7" rounded="rounded-lg" />
        </div>
      </div>
      {/* Arabic text lines — right-aligned, varying widths */}
      <div className="space-y-3 pt-1">
        {widths.map((w, i) => (
          <SkeletonBlock key={i} width={w} height="h-5" className="mr-auto" />
        ))}
      </div>
    </div>
  );
}

export function VerseSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <VerseSkeleton key={i} index={i} />
      ))}
    </div>
  );
}
