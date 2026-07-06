import { Inbox } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon,
  title = 'لا توجد بيانات',
  description = 'لم يتم العثور على أي بيانات حالياً',
  actionLabel,
  onAction,
  className = '',
}) => {
  const IconComponent = icon || <Inbox className="w-16 h-16" />;

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      <div className="text-secondary-400 dark:text-secondary-500 mb-4">
        {typeof IconComponent === 'string' ? (
          <span className="text-6xl">{IconComponent}</span>
        ) : (
          IconComponent
        )}
      </div>
      <h3 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200 mb-2">
        {title}
      </h3>
      <p className="text-secondary-500 dark:text-secondary-400 mb-6 max-w-md">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
