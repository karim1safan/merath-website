import { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { TAFSEER_OPTIONS } from '../../services/tafseerApi';
import Spinner from '../common/Spinner';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const TafseerPanel = ({
  ayahNumber,
  selectedTafseer,
  onSelectTafseer,
  tafseerInfo,
  onFetch,
}) => {
  const { data, loading, error } = tafseerInfo;

  useEffect(() => {
    if (!data && !loading && !error) {
      onFetch(ayahNumber, selectedTafseer);
    }
  }, [data, loading, error, ayahNumber, selectedTafseer, onFetch]);

  const handleSwitch = (id) => {
    onSelectTafseer(id);
    const info = tafseerInfo;
    if (!info.data && !info.loading) {
      onFetch(ayahNumber, id);
    }
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={prefersReducedMotion ? {} : { opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="overflow-hidden"
    >
      <div className="mt-3 mb-6 p-4 sm:p-5 rounded-2xl border border-primary-200/60 dark:border-primary-700/40 bg-primary-50/40 dark:bg-primary-900/15">
        {/* Scholar Toggle */}
        <div className="flex gap-2 mb-4 p-1 bg-secondary-100 dark:bg-secondary-700/50 rounded-xl w-fit">
          {TAFSEER_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSwitch(option.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                selectedTafseer === option.id
                  ? 'bg-primary-600 dark:bg-primary-500 text-white shadow-sm'
                  : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-600/50'
              }`}
            >
              {option.nameAr}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="min-h-[60px]">
          {loading && (
            <div className="flex items-center justify-center py-4">
              <Spinner size="sm" />
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-2 py-4 text-center">
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                فشل تحميل التفسير
              </p>
              <button
                onClick={() => onFetch(ayahNumber, selectedTafseer)}
                className="flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                إعادة المحاولة
              </button>
            </div>
          )}

          {data && !loading && (
            <p className="font-amiri text-lg sm:text-xl leading-[2] text-secondary-700 dark:text-secondary-200/90 text-justify whitespace-pre-wrap">
              {data.text}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TafseerPanel;
