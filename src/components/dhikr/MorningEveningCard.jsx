import { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, Volume2, VolumeX, BookOpen, Check } from 'lucide-react';

const MorningEveningCard = ({ dhikr, onComplete }) => {
  const [count, setCount] = useState(0);
  const [showHadith, setShowHadith] = useState(false);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const isComplete = count >= dhikr.count;
  const progress = Math.min(count / dhikr.count, 1);

  const handleTap = () => {
    if (isComplete) return;
    const next = count + 1;
    setCount(next);
    if (next >= dhikr.count) {
      onComplete?.(dhikr.order);
    }
  };

  const toggleAudio = (e) => {
    e.stopPropagation();
    if (!dhikr.audio) return;
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const onAudioEnded = () => setIsPlaying(false);

  return (
    <div
      onClick={handleTap}
      className={`rounded-2xl shadow-lg p-6 bg-white dark:bg-secondary-800 border-2 transition-all duration-300 active:scale-[0.98] ${
        isComplete ? 'cursor-default border-emerald-400 dark:border-emerald-500' : 'cursor-pointer border-secondary-100 dark:border-secondary-700 hover:shadow-xl'
      }`}
    >
      {dhikr.audio && (
        <audio ref={audioRef} src={dhikr.audio} onEnded={onAudioEnded} />
      )}

      <p className="text-2xl leading-[2.2] text-right text-secondary-800 dark:text-secondary-200 font-amiri mb-5">
        {dhikr.content}
      </p>

      <div className="flex items-center gap-3 mb-4">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            isComplete
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
              : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
          }`}
        >
          {isComplete ? (
            <span className="flex items-center gap-1">
              <Check className="w-3 h-3" />
              تم
            </span>
          ) : (
            dhikr.count_description
          )}
        </span>

        {dhikr.audio && (
          <button
            onClick={toggleAudio}
            className="p-2 rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
            aria-label={isPlaying ? 'إيقاف الصوت' : 'تشغيل الصوت'}
          >
            {isPlaying ? (
              <VolumeX className="w-5 h-5 text-primary-500" />
            ) : (
              <Volume2 className="w-5 h-5 text-secondary-400" />
            )}
          </button>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-secondary-500 dark:text-secondary-400">
            {count} / {dhikr.count}
          </span>
        </div>
        <div className="h-2 rounded-full bg-secondary-100 dark:bg-secondary-700 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ease-out ${
              isComplete ? 'bg-emerald-500' : 'bg-primary-500'
            }`}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {dhikr.fadl && (
        <div className="mb-4 border-t border-secondary-100 dark:border-secondary-700 pt-4">
          <p className="text-[15px] leading-relaxed text-secondary-500 dark:text-secondary-400 text-right font-amiri">
            {dhikr.fadl}
          </p>
        </div>
      )}

      {dhikr.hadith_text && (
        <div className="mb-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowHadith(!showHadith);
            }}
            className="flex items-center gap-2 w-full text-right py-2 px-3 rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-secondary-400 flex-shrink-0" />
            <span className="text-sm font-medium text-secondary-600 dark:text-secondary-300">
              الحديث النبوي
            </span>
            {showHadith ? (
              <ChevronUp className="w-4 h-4 text-secondary-400 mr-auto" />
            ) : (
              <ChevronDown className="w-4 h-4 text-secondary-400 mr-auto" />
            )}
          </button>
          {showHadith && (
            <p className="text-[15px] leading-relaxed text-secondary-600 dark:text-secondary-300 text-right px-3 pb-3 font-amiri">
              {dhikr.hadith_text}
            </p>
          )}
        </div>
      )}

      {dhikr.explanation_of_hadith_vocabulary && (
        <div className="mb-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowVocabulary(!showVocabulary);
            }}
            className="flex items-center gap-2 w-full text-right py-2 px-3 rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-secondary-400 flex-shrink-0" />
            <span className="text-sm font-medium text-secondary-600 dark:text-secondary-300">
              شرح المفردات
            </span>
            {showVocabulary ? (
              <ChevronUp className="w-4 h-4 text-secondary-400 mr-auto" />
            ) : (
              <ChevronDown className="w-4 h-4 text-secondary-400 mr-auto" />
            )}
          </button>
          {showVocabulary && (
            <p className="text-[15px] leading-relaxed text-secondary-600 dark:text-secondary-300 text-right px-3 pb-3 font-amiri">
              {dhikr.explanation_of_hadith_vocabulary}
            </p>
          )}
        </div>
      )}

      {dhikr.source && (
        <p className="text-xs text-secondary-400 dark:text-secondary-500 text-right mt-3 border-t border-secondary-100 dark:border-secondary-700 pt-3">
          {dhikr.source}
        </p>
      )}
    </div>
  );
};

export default MorningEveningCard;
