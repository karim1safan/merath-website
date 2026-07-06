import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Pause } from 'lucide-react';
import { useState } from 'react';
import { useQuranSurah } from '../hooks/useQuranExplorer';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import Card from '../components/common/Card';

const QuranSurahPage = () => {
  const { surahNumber } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useQuranSurah(Number(surahNumber));
  const [currentAudio, setCurrentAudio] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);

  const handlePlayAudio = (audioUrl, index) => {
    if (currentAudio) {
      currentAudio.pause();
    }
    if (playingIndex === index) {
      setCurrentAudio(null);
      setPlayingIndex(null);
      return;
    }
    const audio = new Audio(audioUrl);
    audio.play();
    audio.onended = () => {
      setCurrentAudio(null);
      setPlayingIndex(null);
    };
    setCurrentAudio(audio);
    setPlayingIndex(index);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <EmptyState
        icon={<span className="text-6xl">📖</span>}
        title="خطأ في تحميل السورة"
        description="حدث خطأ أثناء الاتصال بالخادم"
        actionLabel="العودة للاستكشاف"
        onAction={() => navigate('/quran')}
      />
    );
  }

  const { surah, verses, audio } = data;
  const reciter = audio?.[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/quran')}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
      >
        <ArrowRight className="w-4 h-4" />
        العودة للاستكشاف
      </button>

      <Card className="text-center">
        <h1 className="text-3xl font-bold text-secondary-800 dark:text-secondary-200 mb-1">
          سورة {surah.name_arabic}
        </h1>
        <p className="text-lg text-primary-600 dark:text-primary-400 mb-2">
          {surah.name_english} - {surah.name_translation}
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-secondary-500 dark:text-secondary-400">
          <span>{surah.verses_count} آية</span>
          <span>•</span>
          <span>{surah.revelation_place === 'makkah' ? 'مكية' : 'مدنية'}</span>
          <span>•</span>
          <span>النزول: {surah.revelation_order}</span>
        </div>

        {reciter && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => handlePlayAudio(reciter.surah_audio, -1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              {playingIndex === -1 ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              استمع - {reciter.reciter}
            </button>
          </div>
        )}
      </Card>

      <div className="space-y-4">
        {verses?.map((verse, index) => (
          <Card key={verse.ayah}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 px-2 py-1 rounded-full">
                {surah.number}:{verse.ayah}
              </span>
              <button
                onClick={() => handlePlayAudio(verse.audio?.ayah_audio, index)}
                className="p-1.5 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
              >
                {playingIndex === index ? (
                  <Pause className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                ) : (
                  <Play className="w-4 h-4 text-secondary-500" />
                )}
              </button>
            </div>

            <p className="text-2xl leading-loose text-right text-secondary-800 dark:text-secondary-200 mb-4 font-arabic">
              {verse.arabic}
            </p>

            <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-2 leading-relaxed">
              {verse.translations?.sahih_international}
            </p>

            <p className="text-xs text-secondary-400 dark:text-secondary-500 italic">
              {verse.transliteration}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuranSurahPage;
