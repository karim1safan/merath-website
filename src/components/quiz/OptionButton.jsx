import { Check, X } from 'lucide-react';

const OptionButton = ({
  option,
  index,
  isSelected,
  isCorrect,
  showResult,
  onClick,
  disabled = false,
}) => {
  const getOptionStyles = () => {
    if (showResult) {
      if (isCorrect) {
        return 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:border-green-500 dark:text-green-300';
      }
      if (isSelected && !isCorrect) {
        return 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:border-red-500 dark:text-red-300';
      }
      return 'bg-secondary-50 border-secondary-200 text-secondary-500 dark:bg-secondary-800 dark:border-secondary-700 dark:text-secondary-500';
    }

    if (isSelected) {
      return 'bg-primary-100 border-primary-500 text-primary-800 dark:bg-primary-900/30 dark:border-primary-500 dark:text-primary-300';
    }

    return 'bg-white border-secondary-200 text-secondary-700 hover:bg-secondary-50 hover:border-secondary-300 dark:bg-secondary-800 dark:border-secondary-700 dark:text-secondary-300 dark:hover:bg-secondary-700';
  };

  const getOptionIcon = () => {
    if (!showResult) return null;

    if (isCorrect) {
      return <Check className="w-5 h-5 text-green-600 dark:text-green-400" />;
    }

    if (isSelected && !isCorrect) {
      return <X className="w-5 h-5 text-red-600 dark:text-red-400" />;
    }

    return null;
  };

  const optionLabels = ['أ', 'ب', 'ج', 'د'];

  return (
    <button
      onClick={onClick}
      disabled={disabled || showResult}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ease-out text-right ${
        getOptionStyles()
      } ${disabled || showResult ? 'cursor-default' : 'cursor-pointer'}`}
    >
      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center text-sm font-semibold">
        {optionLabels[index]}
      </span>
      <span className="flex-1 text-base">{option}</span>
      {getOptionIcon()}
    </button>
  );
};

export default OptionButton;
