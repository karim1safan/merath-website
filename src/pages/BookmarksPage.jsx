import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Trash2, ExternalLink } from 'lucide-react';
import useBookmarks from '../hooks/useBookmarks';
import { ROUTES } from '../constants';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';

const BookmarksPage = () => {
  const navigate = useNavigate();
  const { bookmarks, removeBookmark, clearBookmarks } = useBookmarks();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (bookmarks.length === 0) {
    return (
      <EmptyState
        icon={<Bookmark className="w-16 h-16" />}
        title="لا توجد أسئلة محفوظة"
        description="يمكنك حفظ الأسئلة أثناء الاختبار أو المراجعة للرجوع إليها لاحقاً"
        actionLabel="ابدأ اختباراً"
        onAction={() => navigate(ROUTES.CATEGORIES)}
      />
    );
  }

  const currentQuestion = bookmarks[currentIndex];
  const optionLabels = ['أ', 'ب', 'ج', 'د'];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200">
          الأسئلة المحفوظة
        </h1>
        <div className="flex items-center gap-3">
          <Badge variant="primary" size="lg">
            {bookmarks.length} سؤال
          </Badge>
          <Button
            onClick={clearBookmarks}
            variant="ghost"
            size="sm"
            className="text-danger hover:bg-danger/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="primary" size="md">
            {currentQuestion.category}
          </Badge>
          <button
            onClick={() => removeBookmark(currentQuestion.id)}
            className="p-2 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-danger"
            aria-label="إزالة من المفضلة"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <h2 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200 mb-6 leading-relaxed">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 ${
                index === currentQuestion.correctAnswer
                  ? 'bg-green-100 dark:bg-green-900/30 border-green-500'
                  : 'bg-secondary-50 dark:bg-secondary-800 border-secondary-200 dark:border-secondary-700'
              }`}
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary-200 dark:bg-secondary-700 flex items-center justify-center text-sm font-semibold">
                {optionLabels[index]}
              </span>
              <span className="flex-1">{option}</span>
            </div>
          ))}
        </div>

        {currentQuestion.explanation && (
          <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
            <h4 className="text-sm font-semibold text-primary-700 dark:text-primary-400 mb-2">
              المصدر:
            </h4>
            <a
              href={currentQuestion.explanation}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              عرض التوضيح من المصدر
            </a>
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          variant="secondary"
          disabled={currentIndex === 0}
        >
          السابق
        </Button>

        <div className="flex items-center gap-1" role="group" aria-label="التنقل بين المحفوظات">
          {bookmarks.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`المحفوظ ${i + 1}`}
              aria-current={i === currentIndex ? 'true' : undefined}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                i === currentIndex
                  ? 'bg-primary-600 dark:bg-primary-400'
                  : 'bg-secondary-300 dark:bg-secondary-600'
              }`}
            />
          ))}
        </div>

        {currentIndex === bookmarks.length - 1 ? (
          <Button
            onClick={() => navigate(ROUTES.CATEGORIES)}
            variant="primary"
          >
            إنهاء
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentIndex((prev) => Math.min(bookmarks.length - 1, prev + 1))}
            variant="primary"
          >
            التالي
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;
