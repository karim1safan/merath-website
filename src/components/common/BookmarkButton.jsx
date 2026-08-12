import { Bookmark } from 'lucide-react';
import useBookmarks from '../../hooks/useBookmarks';

const BookmarkButton = ({ question }) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(question?.id);

  return (
    <button
      onClick={() => toggleBookmark(question)}
      title={bookmarked ? 'إزالة من المحفوظات' : 'حفظ السؤال'}
      aria-label={bookmarked ? 'إزالة من المحفوظات' : 'حفظ السؤال'}
      className={`p-1.5 rounded-lg transition-colors duration-200 ${
        bookmarked
          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
          : 'text-secondary-400 dark:text-secondary-500 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20'
      }`}
    >
      <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
    </button>
  );
};

export default BookmarkButton;
