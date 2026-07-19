const Card = ({
  children,
  className = '',
  hover = false,
  onClick,
  ...props
}) => {
  const baseStyles =
    'bg-white dark:bg-secondary-800 rounded-2xl border border-secondary-200/70 dark:border-secondary-700/50 shadow-sm p-6 transition-all duration-200 ease-out';

  const hoverStyles = hover
    ? 'hover:shadow-md hover:border-secondary-300 dark:hover:border-secondary-600 hover:-translate-y-0.5 cursor-pointer'
    : '';

  const isClickable = !!onClick;

  const handleKeyDown = (e) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
