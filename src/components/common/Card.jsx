const Card = ({
  children,
  className = '',
  hover = false,
  onClick,
  ...props
}) => {
  const baseStyles =
    'bg-white rounded-2xl shadow-lg p-6 transition-all duration-200 ease-out dark:bg-secondary-800';

  const hoverStyles = hover
    ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'
    : '';

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
