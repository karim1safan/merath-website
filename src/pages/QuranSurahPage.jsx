import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Pause, ChevronDown, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useQuranSurah, useReciters, useTafasir } from '../hooks/useQuranExplorer';
import { ROUTES } from '../constants';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import Card from '../components/common/Card';

const QuranSurahPage = () => {
  const { surahNumber } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useQuranSurah(Number(surahNumber));
  const { reciters } = useReciters();
  const { tafasir } = useTafasir();

  const defaultReciter = reciters.find((r) =>
    r.moshaf?.some((m) => m.surah_list?.split(',').includes(String(surahNumber)))
  );
  
  const [selectedReciter, setSelectedReciter] = useState(() => {
    if (defaultReciter) return defaultReciter;
    return null;
  });
  const [currentAudio, setCurrentAudio] = useState(null);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [showReciterDropdown, setShowReciterDropdown] = useState(false);
  const [surahTafasir, setSurahTafasir] = useState([]);
  const [loadingTafasir, setLoadingTafasir] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (defaultReciter && !selectedReciter) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedReciter(defaultReciter);
    }
  }, [defaultReciter, selectedReciter]);

  useEffect(() => {
    const fetchTafasir = async () => {
      if (tafasir.length === 0) return;
      
      setLoadingTafasir(true);
      const tafsirId = tafasir[0]?.id;
      if (!tafsirId) {
        setLoadingTafasir(false);
        return;
      }
      
      try {
        const res = await fetch(`https://www.mp3quran.net/api/v3/tafsir?tafsir=${tafsirId}&language=ar`);
        const json = await res.json();
        const entries = json.tafasir?.soar?.filter(
          (s) => s.sura_id === Number(surahNumber)
        ) || [];
        setSurahTafasir(entries);
      } catch {
        setSurahTafasir([]);
      } finally {
        setLoadingTafasir(false);
      }
    };
    
    fetchTafasir();
  }, [tafasir, surahNumber]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowReciterDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAudioUrl = (surahNum) => {
    if (!selectedReciter) return null;
    const moshaf = selectedReciters?.moshaf?.[0] || selectedReciter.moshaf?.[0];
    if (!moshaf) return null;
    const padded = String(surahNum).padStart(3, '0');
    return `${moshaf.server}${padded}.mp3`;
  };

  const handlePlayAudio = (audioUrl, index) => {
    if (currentAudio) {
      currentAudio.pause();
    }
    if (playingIndex === index) {
      setCurrentAudio(null);
      setPlayingIndex(null);
      return;
    }
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play().catch((error) => {
      console.error('Error playing audio:', error);
    });
    audio.onended = () => {
      setCurrentAudio(null);
      setPlayingIndex(null);
    };
    setCurrentAudio(audio);
    setPlayingIndex(index);
  };

  const handlePlaySurah = () => {
    const url = getAudioUrl(surahNumber);
    handlePlayAudio(url, 'surah');
  };

  const selectedReciters = selectedReciter?.moshaf?.[0];

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
        onAction={() => navigate(ROUTES.QURAN_EXPLORER)}
      />
    );
  }

  const { surah, verses } = data;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate(ROUTES.QURAN_EXPLORER)}
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
          {surah.name_english}
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-secondary-500 dark:text-secondary-400 mb-6">
          <span>{surah.numberOfVerses} آية</span>
          <span>•</span>
          <span>{surah.revelation === 'makkah' ? 'مكية' : 'مدنية'}</span>
        </div>

        {/* Reciter Selector */}
        <div className="mb-4" ref={dropdownRef}>
          <div className="relative inline-block w-full max-w-xs">
            <button
              onClick={() => setShowReciterDropdown(!showReciterDropdown)}
              className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border-2 border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-800 dark:text-secondary-200 text-sm"
            >
              <span className="truncate">{selectedReciter?.name || 'اختر قارئ'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showReciterDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showReciterDropdown && (
              <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white dark:bg-secondary-800 border-2 border-secondary-200 dark:border-secondary-700 rounded-xl shadow-lg">
                {reciters.map((reciter) => (
                  <button
                    key={reciter.id}
                    onClick={() => {
                      setSelectedReciter(reciter);
                      setShowReciterDropdown(false);
                    }}
                    className={`w-full text-right px-4 py-2.5 text-sm hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors ${
                      selectedReciter?.id === reciter.id
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                        : 'text-secondary-800 dark:text-secondary-200'
                    }`}
                  >
                    {reciter.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Play Full Surah Button */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handlePlaySurah}
            disabled={!selectedReciter}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {playingIndex === 'surah' ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {playingIndex === 'surah' ? 'إيقاف' : 'استمع للسورة'}
          </button>
        </div>

        {/* Tafsir Section */}
        {loadingTafasir ? (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-secondary-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            جاري تحميل التفسير...
          </div>
        ) : surahTafasir.length > 0 ? (
          <div className="mt-6 pt-4 border-t border-secondary-200 dark:border-secondary-700">
            <h3 className="text-sm font-semibold text-secondary-600 dark:text-secondary-400 mb-3">
              التفسير الميسر
            </h3>
            <div className="space-y-2">
              {surahTafasir.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => handlePlayAudio(entry.url, `tafsir-${entry.id}`)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
                >
                  {playingIndex === `tafsir-${entry.id}` ? (
                    <Pause className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                  ) : (
                    <Play className="w-4 h-4 text-secondary-400 flex-shrink-0" />
                  )}
                  <span className="truncate">{entry.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </Card>

      {/* Verses */}
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

            <p className="text-sm text-secondary-600 dark:text-secondary-400 leading-relaxed">
              {verse.translations?.sahih_international}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuranSurahPage;
