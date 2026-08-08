import { useMemo, useState } from 'react';
import { ArrowRight, MessageSquare, Quote } from 'lucide-react';
import quotes from '../data/quotes.json';
import { ROUTES } from '../constants';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/common/Pagination';

const QUOTES_PER_PAGE = 10;

const SalafQuotesPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const salafQuotes = useMemo(() => quotes, []);

  const totalPages = Math.ceil(salafQuotes.length / QUOTES_PER_PAGE);
  const visibleQuotes = useMemo(() => {
    const start = (currentPage - 1) * QUOTES_PER_PAGE;
    return salafQuotes.slice(start, start + QUOTES_PER_PAGE);
  }, [salafQuotes, currentPage]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(ROUTES.ADHKAR)}
          className="p-2 rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          aria-label="العودة"
        >
          <ArrowRight className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-100 dark:bg-violet-900/30">
              <MessageSquare className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200">
              أقوال من السلف
            </h1>
          </div>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
            {salafQuotes.length} قول مأثور من سلف الأمة
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {visibleQuotes.map((quote, index) => (
          <div
            key={index}
            className="rounded-2xl shadow-lg p-6 bg-white dark:bg-secondary-800 border-2 border-secondary-100 dark:border-secondary-700 hover:shadow-xl transition-all duration-200"
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <Quote className="w-8 h-8 text-violet-200 dark:text-violet-800 fill-violet-100 dark:fill-violet-900/30" />
              </div>
              <div className="flex-1">
                <p className="text-2xl leading-[2] text-right text-secondary-800 dark:text-secondary-200 mb-4 font-amiri font-semibold">
                  {quote.arabic}
                </p>
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
                    {quote.author}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default SalafQuotesPage;
