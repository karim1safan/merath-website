import { useMemo } from 'react';
import { ArrowRight, MessageSquare, Quote } from 'lucide-react';
import quotes from '../data/quotes.json';
import { ROUTES } from '../constants';
import { useNavigate } from 'react-router-dom';

const SalafQuotesPage = () => {
  const navigate = useNavigate();
  const salafQuotes = useMemo(() => quotes, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(ROUTES.ADHKAR)}
          className="p-2 rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
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
        {salafQuotes.map((quote, index) => (
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
    </div>
  );
};

export default SalafQuotesPage;
