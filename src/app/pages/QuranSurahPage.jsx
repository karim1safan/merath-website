import { useParams, useNavigate, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Play, Pause, ChevronDown, Loader2, Bookmark, BookmarkCheck, BookOpen } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuranSurah, useReciters, useTafasir } from '../hooks/useQuranExplorer';
import useBookmarks from '../hooks/useBookmarks';
import { ROUTES } from '../constants';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import Card from '../components/common/Card';
import TafsirPanel from '../components/quran/TafsirPanel';
import { VerseSkeletonList } from '../components/skeletons';

const QuranSurahPage = () => {
  const { surahNumber } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data, loading, error } = useQuranSurah(Number(surahNumber));
  const { reciters } = useReciters();
  const { tafasir } = useTafasir();
  const { toggleBookmark, isBookmarked } = useBookmarks();

  const defaultReciter = reciters.find((r) =>
    r.moshaf?.some((m) => m.surah_list?.split(',').includes(String(surahNumber)))
  );

  const [selectedReciter, setSelectedReciter]     = useState(() => defaultReciter || null);
  const [currentAudio, setCurrentAudio]           = useState(null);
  const [playingIndex, setPlayingIndex]           = useState(null);
  const [showReciterDropdown, setShowReciterDropdown] = useState(false);
  const [surahTafasir, setSurahTafasir]           = useState([]);
  const [loadingTafasir, setLoadingTafasir]       = useState(false);
  const [highlightedAyah, setHighlightedAyah]     = useState(null);
  const [savedFeedback, setSavedFeedback]         = useState(null);

  // Tafsir panel state
  const [tafsirAyah, setTafsirAyah] = useState(null); // null = closed, number = open

  const dropdownRef = useRef(null);
  const ayahRefs    = useRef({});

  /* ─── Scroll to ?ayah= on load ─────────────────────────── */
  useEffect(() => {
    const targetAyah = searchParams.get('ayah');
    if (!targetAyah || !data?.verses) return;
    const ayahNum = parseInt(targetAyah, 10);
    const tryScroll = (attempts = 0) => {
      const el = ayahRefs.current[ayahNum];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedAyah(ayahNum);
        setTimeout(() => setHighlightedAyah(null), 2500);
      } else if (attempts < 10) {
        setTimeout(() => tryScroll(attempts + 1), 150);
      }
    };
    tryScroll();
  }, [searchParams, data]);

  useEffect(() => {
    if (defaultReciter && !selectedReciter) setSelectedReciter(defaultReciter);
  }, [defaultReciter, selectedReciter]);

  useEffect(() => {
    const fetchTafasirAudio = async () => {
      if (tafasir.length === 0) return;
      setLoadingTafasir(true);
      const tafsirId = tafasir[0]?.id;
      if (!tafsirId) { setLoadingTafasir(false); return; }
      try {
        const res  = await fetch(`https://www.mp3quran.net/api/v3/tafsir?tafsir=${tafsirId}&language=ar`);
        const json = await res.json();
        setSurahTafasir(json.tafasir?.soar?.filter(s => s.sura_id === Number(surahNumber)) || []);
      } catch { setSurahTafasir([]); }
      finally  { setLoadingTafasir(false); }
    };
    fetchTafasirAudio();
  }, [tafasir, surahNumber]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowReciterDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getAudioUrl = (surahNum) => {
    if (!selectedReciter) return null;
    const moshaf = selectedReciter.moshaf?.[0];
    if (!moshaf) return null;
    return `${moshaf.server}${String(surahNum).padStart(3, '0')}.mp3`;
  };

  const handlePlayAudio = useCallback((audioUrl, index) => {
    if (currentAudio) currentAudio.pause();
    if (playingIndex === index) { setCurrentAudio(null); setPlayingIndex(null); return; }
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play().catch(() => {});
    audio.onended = () => { setCurrentAudio(null); setPlayingIndex(null); };
    setCurrentAudio(audio);
    setPlayingIndex(index);
  }, [currentAudio, playingIndex]);

  const handlePlaySurah = () => handlePlayAudio(getAudioUrl(surahNumber), 'surah');

  const handleToggleVerse = useCallback((surah, verse) => {
    const id = `verse:${surah.number}:${verse.ayah}`;
    toggleBookmark({
      id,
      type: 'verse',
      data: {
        surahNumber: surah.number,
        surahName: surah.name,
        surahNameArabic: surah.name_arabic,
        ayahNumber: verse.ayah,
        arabic: verse.arabic,
      },
    });
    setSavedFeedback(verse.ayah);
    setTimeout(() => setSavedFeedback(null), 1500);
  }, [toggleBookmark]);

  const handleOpenTafsir = useCallback((ayahNum) => {
    // If same ayah — keep panel open (switch edition if wanted)
    setTafsirAyah(ayahNum);
  }, []);

  if (loading) return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="h-5 w-32 bg-secondary-200 dark:bg-secondary-700 rounded-full animate-pulse" />
      <div className="rounded-2xl border-2 border-secondary-100 dark:border-secondary-800 bg-white dark:bg-secondary-800 p-8 space-y-4 text-center animate-pulse">
        <div className="h-8 w-48 bg-secondary-200 dark:bg-secondary-700 rounded-full mx-auto" />
        <div className="h-4 w-32 bg-secondary-200 dark:bg-secondary-700 rounded-full mx-auto" />
        <div className="h-10 w-64 bg-secondary-200 dark:bg-secondary-700 rounded-xl mx-auto mt-6" />
      </div>
      <VerseSkeletonList count={5} />
    </div>
  );
  if (error || !data) return (
    <EmptyState
      icon={<span className="text-6xl">📖</span>}
      title="خطأ في تحميل السورة"
      description="حدث خطأ أثناء الاتصال بالخادم"
      actionLabel="العودة للاستكشاف"
      onAction={() => navigate(ROUTES.QURAN_EXPLORER)}
    />
  );

  const { surah, verses } = data;
  const openAyahData = tafsirAyah != null
    ? verses?.find(v => v.ayah === tafsirAyah)
    : null;

  return (
    <>
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
                    <button key={reciter.id}
                      onClick={() => { setSelectedReciter(reciter); setShowReciterDropdown(false); }}
                      className={`w-full text-right px-4 py-2.5 text-sm hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors ${
                        selectedReciter?.id === reciter.id
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                          : 'text-secondary-800 dark:text-secondary-200'
                      }`}
                    >{reciter.name}</button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button onClick={handlePlaySurah} disabled={!selectedReciter}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {playingIndex === 'surah' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {playingIndex === 'surah' ? 'إيقاف' : 'استمع للسورة'}
            </button>
          </div>

          {loadingTafasir ? (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-secondary-400">
              <Loader2 className="w-4 h-4 animate-spin" />جاري تحميل التفسير...
            </div>
          ) : surahTafasir.length > 0 ? (
            <div className="mt-6 pt-4 border-t border-secondary-200 dark:border-secondary-700">
              <h3 className="text-sm font-semibold text-secondary-600 dark:text-secondary-400 mb-3">التفسير الميسر</h3>
              <div className="space-y-2">
                {surahTafasir.map((entry) => (
                  <button key={entry.id}
                    onClick={() => handlePlayAudio(entry.url, `tafsir-${entry.id}`)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
                  >
                    {playingIndex === `tafsir-${entry.id}`
                      ? <Pause className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                      : <Play  className="w-4 h-4 text-secondary-400 flex-shrink-0" />}
                    <span className="truncate">{entry.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </Card>

        {/* Verses */}
        <div className="space-y-4">
          {verses?.map((verse, index) => {
            const verseId    = `verse:${surah.number}:${verse.ayah}`;
            const bookmarked = isBookmarked(verseId);
            const isHighlighted = highlightedAyah === verse.ayah;
            const showSaved  = savedFeedback === verse.ayah;
            const tafsirOpen = tafsirAyah === verse.ayah;

            return (
              <motion.div
                key={verse.ayah}
                ref={el => { ayahRefs.current[verse.ayah] = el; }}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: Math.min(index * 0.04, 0.4), ease: [0.22, 1, 0.36, 1] }}
              >
                <div className={`rounded-2xl border-2 p-6 transition-all duration-700 ${
                  isHighlighted
                    ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 shadow-lg shadow-yellow-200/50 dark:shadow-yellow-900/30'
                    : tafsirOpen
                    ? 'border-primary-300 dark:border-primary-700 bg-primary-50/40 dark:bg-primary-900/10'
                    : 'border-secondary-200/70 dark:border-secondary-700/50 bg-white dark:bg-secondary-800 shadow-sm'
                }`}>
                  {/* Header row */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 px-2 py-1 rounded-full">
                      {surah.number}:{verse.ayah}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {/* Tafsir button */}
                      <button
                        onClick={() => handleOpenTafsir(verse.ayah)}
                        aria-label="تفسير الآية"
                        className={`p-1.5 rounded-lg transition-all duration-200 ${
                          tafsirOpen
                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                            : 'hover:bg-secondary-100 dark:hover:bg-secondary-700 text-secondary-400 hover:text-primary-500'
                        }`}
                      >
                        <BookOpen className="w-4 h-4" />
                      </button>
                      {/* Bookmark button */}
                      <button
                        onClick={() => handleToggleVerse(surah, verse)}
                        aria-label={bookmarked ? 'إزالة من المفضلة' : 'حفظ الآية'}
                        className={`relative p-1.5 rounded-lg transition-all duration-200 ${
                          bookmarked
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                            : 'hover:bg-secondary-100 dark:hover:bg-secondary-700 text-secondary-400 hover:text-yellow-500'
                        }`}
                      >
                        {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        {showSaved && (
                          <span className="absolute -top-7 right-0 text-[10px] font-semibold bg-primary-600 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                            {bookmarked ? 'تم الحفظ ✓' : 'تم الحذف'}
                          </span>
                        )}
                      </button>
                      {/* Play button */}
                      <button
                        onClick={() => handlePlayAudio(verse.audio?.ayah_audio, index)}
                        className="p-1.5 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
                      >
                        {playingIndex === index
                          ? <Pause className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                          : <Play  className="w-4 h-4 text-secondary-500" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-2xl leading-loose text-right text-secondary-800 dark:text-secondary-200 font-amiri">
                    {verse.arabic}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Tafsir Panel — rendered outside main flow to avoid layout shift */}
      <TafsirPanel
        isOpen={tafsirAyah != null}
        surahNumber={Number(surahNumber)}
        surahName={surah?.name_arabic}
        ayahNumber={tafsirAyah}
        ayahArabic={openAyahData?.arabic}
        totalAyahs={surah?.numberOfVerses}
        onClose={() => setTafsirAyah(null)}
      />
    </>
  );
};

export default QuranSurahPage;
