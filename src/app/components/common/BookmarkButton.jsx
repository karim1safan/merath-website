import { Bookmark } from 'lucide-react';
import useBookmarks from '../../hooks/useBookmarks';

const BookmarkButton = ({ question, className = '' }) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(question.id);

  return (
    <button
      onClick={() => toggleBookmark(question)}
      className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
        bookmarked
          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
          : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-500 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-600'
      } ${className}`}
      aria-label={bookmarked ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
    >
      <Bookmark
        className="w-5 h-5"
        fill={bookmarked ? 'currentColor' : 'none'}
      />
    </button>
  );
};

export default BookmarkButton;
