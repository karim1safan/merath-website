interface SkeletonBlockProps {
  width?: string;
  height?: string;
  rounded?: string;
  className?: string;
}

export function SkeletonBlock({
  width = 'w-full',
  height = 'h-4',
  rounded = 'rounded-full',
  className = '',
}: SkeletonBlockProps) {
  return (
    <div
      className={`bg-secondary-200 dark:bg-secondary-700 animate-pulse ${width} ${height} ${rounded} ${className}`}
    />
  );
}
