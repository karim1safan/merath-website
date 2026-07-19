const ProgressBar = ({ current, total, className = '' }) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
          السؤال {current} من {total}
        </span>
        <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
          {percentage}%
        </span>
      </div>
      <div className="w-full h-3 bg-secondary-200 dark:bg-secondary-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-600 dark:bg-primary-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
