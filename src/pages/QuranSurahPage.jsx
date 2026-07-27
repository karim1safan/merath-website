import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  ChevronDown,
  RotateCcw,
  RotateCw,
  SkipBack,
  SkipForward,
  Volume2,
  Star,
  BookOpen,
  MapPin,
  ListOrdered,
  Type,
  Bookmark,
  Search,
  X,
} from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  useQuranSurah,
  useReciters,
} from "../hooks/useQuranExplorer";
import { ROUTES, QURAN } from "../constants";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";
import Modal from "../components/common/Modal";
import { FadeIn } from "../components/ui/Motion";

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const toArabicNumber = (num) => {
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(num)
    .split("")
    .map((d) => arabicDigits[Number(d)] ?? d)
    .join("");
};

const SurahHeaderCard = ({ surah, surahNumber }) => (
  <div className="bg-gradient-to-b from-primary-50/50 to-white dark:from-primary-900/10 dark:to-secondary-800 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] p-8 mb-10 relative overflow-hidden border border-secondary-100 dark:border-secondary-700/50">
    <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
      <svg
        className="fill-primary-600 dark:fill-primary-400"
        viewBox="0 0 100 100"
      >
        <path d="M50 0L61.2 38.8H100L68.6 61.2L79.8 100L50 76.4L20.2 100L31.4 61.2L0 38.8H38.8L50 0Z" />
      </svg>
    </div>
    <div className="absolute top-4 left-4 w-16 h-16 opacity-[0.03] pointer-events-none">
      <svg
        className="fill-primary-600 dark:fill-primary-400"
        viewBox="0 0 100 100"
      >
        <path d="M50 0L61.2 38.8H100L68.6 61.2L79.8 100L50 76.4L20.2 100L31.4 61.2L0 38.8H38.8L50 0Z" />
      </svg>
    </div>
    <div className="text-center relative">
      <Star className="w-6 h-6 text-primary-500 dark:text-primary-400 mx-auto mb-3 fill-primary-100 dark:fill-primary-900/30" />
      <h1 className="text-3xl md:text-[32px] leading-[42px] font-bold font-cairo text-primary-800 dark:text-primary-100 mb-3">
        {surah.name_arabic}
      </h1>
      <div className="w-16 h-[1px] mx-auto mb-4 bg-gradient-to-r from-transparent via-primary-300 dark:via-primary-600 to-transparent" />
      <div className="flex justify-center items-center gap-5 md:gap-7 text-secondary-500 dark:text-secondary-400 text-sm">
        <span className="flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" />
          <span>{toArabicNumber(surah.numberOfVerses)} آية</span>
        </span>
        <span className="w-1 h-1 bg-secondary-300 dark:bg-secondary-600 rounded-full" />
        <span className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4" />
          <span>{surah.revelation === "makkah" ? "مكية" : "مدنية"}</span>
        </span>
        <span className="w-1 h-1 bg-secondary-300 dark:bg-secondary-600 rounded-full" />
        <span className="flex items-center gap-1.5">
          <ListOrdered className="w-4 h-4" />
          <span>رقم {toArabicNumber(surahNumber)}</span>
        </span>
      </div>
    </div>
  </div>
);

const AudioPlayerCard = ({
  selectedReciter,
  showReciterDropdown,
  setShowReciterDropdown,
  setSelectedReciter,
  isPlaying,
  currentTime,
  duration,
  playbackRate,
  handlePlaySurah,
  handleSeek,
  handleSkipBack,
  handleSkipForward,
  adjustSpeed,
  formatTime,
  dropdownRef,
  hasReciter,
  onOpenReciterModal,
  reciterSearch,
  setReciterSearch,
  filteredReciters,
}) => (
  <div className="audio-player-card mb-12 flex flex-col md:flex-row items-center gap-6">
    <div className="flex items-center gap-3">
      <button
        onClick={handleSkipBack}
        disabled={!hasReciter}
        className="w-10 h-10 bg-primary-700/50 text-primary-200 rounded-full flex items-center justify-center hover:bg-primary-700 transition-all flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="رجوع 10 ثوانٍ"
      >
        <SkipBack className="w-4 h-4" />
      </button>

      <button
        onClick={handlePlaySurah}
        disabled={!hasReciter}
        className="w-14 h-14 bg-primary-500 dark:bg-primary-400 text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
        aria-label={isPlaying ? "إيقاف" : "تشغيل"}
      >
        {isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6 me-px" />
        )}
      </button>

      <button
        onClick={handleSkipForward}
        disabled={!hasReciter}
        className="w-10 h-10 bg-primary-700/50 text-primary-200 rounded-full flex items-center justify-center hover:bg-primary-700 transition-all flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="تقديم 10 ثوانٍ"
      >
        <SkipForward className="w-4 h-4" />
      </button>

      {/* Mobile: compact reciter button that opens modal */}
      <button
        onClick={onOpenReciterModal}
        className="sm:hidden flex items-center gap-1.5 bg-transparent text-white text-sm font-semibold cursor-pointer focus:outline-none"
      >
        <span className="truncate max-w-[140px]">
          {selectedReciter?.name || "اختر قارئ"}
        </span>
        <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
      </button>

      {/* Desktop: label + dropdown */}
      <div className="hidden sm:block">
        <div className="font-semibold text-sm text-primary-200 mb-1">
          بصوت القارئ:
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowReciterDropdown(!showReciterDropdown)}
            className="flex items-center gap-1 bg-transparent text-white text-lg font-bold cursor-pointer focus:outline-none"
          >
            <span className="truncate max-w-[160px]">
              {selectedReciter?.name || "اختر قارئ"}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showReciterDropdown ? "rotate-180" : ""}`}
            />
          </button>
          {showReciterDropdown && (
            <div className="absolute z-10 mt-1 w-64 max-h-60 overflow-y-auto bg-white dark:bg-secondary-800 border-2 border-primary-200 dark:border-primary-700 rounded-xl shadow-lg scrollbar-hide">
              <div className="sticky top-0 p-2 bg-white dark:bg-secondary-800 border-b border-secondary-100 dark:border-secondary-700">
                <div className="relative">
                  <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary-400" />
                  <input
                    type="text"
                    value={reciterSearch}
                    onChange={(e) => setReciterSearch(e.target.value)}
                    placeholder="ابحث عن قارئ..."
                    className="w-full pr-8 pl-7 py-1.5 text-xs rounded-lg border border-secondary-200 dark:border-secondary-600 bg-secondary-50 dark:bg-secondary-700 text-secondary-800 dark:text-secondary-200 placeholder-secondary-400 focus:outline-none focus:border-primary-400"
                  />
                  {reciterSearch && (
                    <button
                      onClick={() => setReciterSearch("")}
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-secondary-200 dark:hover:bg-secondary-600"
                    >
                      <X className="w-3 h-3 text-secondary-400" />
                    </button>
                  )}
                </div>
              </div>
              {filteredReciters.map((reciter) => (
                <button
                  key={reciter.id}
                  onClick={() => {
                    setSelectedReciter(reciter);
                    setShowReciterDropdown(false);
                    setReciterSearch("");
                  }}
                  className={`w-full text-right px-4 py-2.5 text-sm hover:bg-primary-50 dark:hover:bg-secondary-700 transition-colors ${
                    selectedReciter?.id === reciter.id
                      ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                      : "text-secondary-800 dark:text-secondary-200"
                  }`}
                >
                  {reciter.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="flex-grow w-full flex flex-col gap-2">
      <div className="flex justify-between text-xs opacity-80 text-primary-200 font-semibold">
        <span className="tabular-nums">{formatTime(currentTime)}</span>
        <span className="tabular-nums">{formatTime(duration)}</span>
      </div>
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={currentTime}
        onChange={handleSeek}
        className="w-full h-2 rounded-full appearance-none cursor-pointer
                   bg-primary-700
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-primary-300
                   [&::-webkit-slider-thumb]:shadow-sm
                   [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3
                   [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:bg-primary-300
                   [&::-moz-range-thumb]:border-none
                   [&::-moz-range-thumb]:shadow-sm
                   [&::-moz-range-thumb]:cursor-pointer"
        aria-label="البحث في الصوت"
      />
    </div>

    <div className="flex items-center gap-3">
      <button
        onClick={() => adjustSpeed(-1)}
        className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
        aria-label="تقليل السرعة"
      >
        <RotateCcw className="w-5 h-5 text-primary-200" />
      </button>
      <span className="text-xs font-semibold text-primary-200 w-10 text-center tabular-nums">
        {playbackRate}x
      </span>
      <button
        onClick={() => adjustSpeed(1)}
        className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
        aria-label="زيادة السرعة"
      >
        <RotateCw className="w-5 h-5 text-primary-200" />
      </button>
      <button
        className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
        aria-label="الصوت"
      >
        <Volume2 className="w-5 h-5 text-primary-200" />
      </button>
    </div>
  </div>
);

const QuranSurahPage = () => {
  const { surahNumber } = useParams();
  const navigate = useNavigate();
  const num = Number(surahNumber);
  const { data, loading, error } = useQuranSurah(num);
  const { reciters } = useReciters();

  const defaultReciter = (() => {
    const yasser = reciters.find((r) => r.name === "ياسر الدوسري");
    if (
      yasser?.moshaf?.some((m) =>
        m.surah_list?.split(",").includes(String(surahNumber)),
      )
    ) {
      return yasser;
    }
    return reciters.find((r) =>
      r.moshaf?.some((m) =>
        m.surah_list?.split(",").includes(String(surahNumber)),
      ),
    );
  })();

  const [selectedReciter, setSelectedReciter] = useState(() => {
    if (defaultReciter) return defaultReciter;
    return null;
  });
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showReciterDropdown, setShowReciterDropdown] = useState(false);
  const [showReciterModal, setShowReciterModal] = useState(false);
  const [fontSize, setFontSize] = useState("normal");
  const [reciterSearch, setReciterSearch] = useState("");
  const dropdownRef = useRef(null);
  const audioRef = useRef(null);

  const filteredReciters = useMemo(() => {
    if (!reciterSearch) return reciters;
    const q = reciterSearch.toLowerCase();
    return reciters.filter((r) => r.name.includes(q));
  }, [reciters, reciterSearch]);

  useEffect(() => {
    if (defaultReciter && !selectedReciter) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedReciter(defaultReciter);
    }
  }, [defaultReciter, selectedReciter]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowReciterDropdown(false);
        setReciterSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      setCurrentTime(0);
      setDuration(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentAudio]);

  const getAudioUrl = (surahNum) => {
    if (!selectedReciter) return null;
    const moshaf = selectedReciter.moshaf?.[0];
    if (!moshaf) return null;
    const padded = String(surahNum).padStart(3, "0");
    return `${moshaf.server}${padded}.mp3`;
  };

  const handlePlaySurah = () => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setIsPlaying(false);
      return;
    }

    const url = getAudioUrl(surahNumber);
    if (!url) return;

    const audio = new Audio(url);
    audio.playbackRate = playbackRate;
    setCurrentTime(0);
    setDuration(0);
    audio.play().catch((err) => {
      console.error("Error playing audio:", err);
    });
    audio.onended = () => {
      setCurrentAudio(null);
      setIsPlaying(false);
    };
    audioRef.current = audio;
    setCurrentAudio(audio);
    setIsPlaying(true);
  };

  const adjustSpeed = (delta) => {
    setPlaybackRate((prev) => {
      const idx = SPEED_OPTIONS.indexOf(prev);
      const next = idx + delta;
      if (next < 0) return SPEED_OPTIONS[0];
      if (next >= SPEED_OPTIONS.length)
        return SPEED_OPTIONS[SPEED_OPTIONS.length - 1];
      return SPEED_OPTIONS[next];
    });
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = Number(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleSkipBack = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  };

  const handleSkipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
  };

  const toggleFontSize = () => {
    setFontSize((prev) => (prev === "normal" ? "large" : "normal"));
  };

  const displayedVerses = useMemo(() => {
    if (!data?.verses) return [];
    if (num === 1 || num === 9) return data.verses;
    const [first, ...rest] = data.verses;
    const stripped = first.arabic.replace(
      /^بِسْمِ\s+ٱ?للَّ?هِ?\s+ٱ?لرَّ?حْ?مَ?ـ?ّ?نِ?\s+ٱ?لرَّ?حِ?ي?مِ?\s*/u,
      ''
    );
    return [{ ...first, arabic: stripped }, ...rest];
  }, [data, num]);

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
  const showBasmallah = num !== 1 && num !== 9;
  const hasPrev = num > 1;
  const hasNext = num < QURAN.TOTAL_SURAHS;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Button */}
      <FadeIn delay={0}>
        <div className="flex justify-start mb-6">
          <button
            onClick={() => navigate(ROUTES.QURAN_EXPLORER)}
            className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors font-semibold text-sm bg-white dark:bg-secondary-800/60 px-4 py-2 rounded-xl shadow-sm hover:bg-secondary-100 dark:hover:bg-secondary-700/60 border border-secondary-100 dark:border-secondary-700/50"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للمصحف</span>
          </button>
        </div>
      </FadeIn>

      {/* Surah Header Card */}
      <FadeIn delay={0.05}>
        <SurahHeaderCard surah={surah} surahNumber={num} />
      </FadeIn>

      {/* Audio Player */}
      <FadeIn delay={0.1}>
        <AudioPlayerCard
        selectedReciter={selectedReciter}
        showReciterDropdown={showReciterDropdown}
        setShowReciterDropdown={setShowReciterDropdown}
        setSelectedReciter={setSelectedReciter}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        playbackRate={playbackRate}
        handlePlaySurah={handlePlaySurah}
        handleSeek={handleSeek}
        handleSkipBack={handleSkipBack}
        handleSkipForward={handleSkipForward}
        adjustSpeed={adjustSpeed}
        formatTime={formatTime}
        dropdownRef={dropdownRef}
        hasReciter={!!selectedReciter}
        onOpenReciterModal={() => setShowReciterModal(true)}
        reciterSearch={reciterSearch}
        setReciterSearch={setReciterSearch}
        filteredReciters={filteredReciters}
      />
      </FadeIn>

      {/* Mobile Reciter Selection Modal */}
      <Modal
        isOpen={showReciterModal}
        onClose={() => {
          setShowReciterModal(false);
          setReciterSearch("");
        }}
        title="اختر القارئ"
      >
        <div className="relative mt-4 mb-3">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="text"
            value={reciterSearch}
            onChange={(e) => setReciterSearch(e.target.value)}
            placeholder="ابحث عن قارئ..."
            className="w-full pr-10 pl-9 py-2.5 text-sm rounded-xl border-2 border-secondary-200 dark:border-secondary-600 bg-secondary-50 dark:bg-secondary-700 text-secondary-800 dark:text-secondary-200 placeholder-secondary-400 focus:outline-none focus:border-primary-400"
          />
          {reciterSearch && (
            <button
              onClick={() => setReciterSearch("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-secondary-200 dark:hover:bg-secondary-600"
            >
              <X className="w-4 h-4 text-secondary-400" />
            </button>
          )}
        </div>
        <div className="max-h-[50vh] overflow-y-auto text-start scrollbar-hide">
          {filteredReciters.map((reciter) => (
            <button
              key={reciter.id}
              onClick={() => {
                setSelectedReciter(reciter);
                setShowReciterModal(false);
                setReciterSearch("");
              }}
              className={`w-full text-right px-4 py-3 text-sm rounded-lg transition-colors ${
                selectedReciter?.id === reciter.id
                  ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold"
                  : "text-secondary-800 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-700"
              }`}
            >
              {reciter.name}
            </button>
          ))}
        </div>
      </Modal>

      {/* Quran Text Content */}
      <FadeIn delay={0.15}>
      <article className="bg-white dark:bg-secondary-800/80 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] p-6 sm:p-8 md:p-12 lg:p-16 leading-loose text-center border border-secondary-100 dark:border-secondary-700/50">
        {showBasmallah && (
          <div className="mb-16">
            <div className="mushaf-ornament mushaf-ornament-light" />
            <p className="font-amiri text-[36px] md:text-[44px] leading-[2] font-bold text-amber-700/80 dark:text-amber-200/80 tracking-wide text-center">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </p>
            <div className="mushaf-ornament mushaf-ornament-light" />
          </div>
        )}

        <div
          className={`font-amiri leading-[2.4] text-secondary-700 dark:text-secondary-200/90 text-justify ${fontSize === "large" ? "text-[36px] md:text-[42px]" : "text-[28px] md:text-[34px]"}`}
          style={{ direction: "rtl", textAlignLast: "center", wordSpacing: "0.1em" }}
        >
          {displayedVerses.map((verse) => (
              <span key={verse.ayah} className="inline">
                {verse.arabic}
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border-[1.5px] border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 font-amiri font-bold text-base mx-1.5 align-middle relative flex-shrink-0 transition-transform duration-200 hover:scale-110">
                  <span className="mushaf-verse-num-star" />
                  {toArabicNumber(verse.ayah)}
                </span>{" "}
              </span>
            ))}
        </div>

        {/* Page Navigation */}
        <div className="mt-24 pt-12 border-t border-secondary-200 dark:border-secondary-700 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
          {hasPrev ? (
            <button
              onClick={() => navigate(`${ROUTES.QURAN_EXPLORER}/${num - 1}`)}
              className="w-full sm:w-auto flex items-center justify-center gap-3 py-4 px-8 md:px-10 border-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 rounded-2xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 font-bold hover:scale-[1.02] active:scale-[0.98]"
            >
              <ArrowRight className="w-5 h-5" />
              <span>السورة السابقة</span>
            </button>
          ) : (
            <div />
          )}
          {hasNext ? (
            <button
              onClick={() => navigate(`${ROUTES.QURAN_EXPLORER}/${num + 1}`)}
              className="w-full sm:w-auto flex items-center justify-center gap-3 py-4 px-8 md:px-10 bg-primary-600 dark:bg-primary-500 text-white rounded-2xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-all duration-200 font-bold hover:scale-[1.02] active:scale-[0.98] shadow-md"
            >
              <span>السورة التالية</span>
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </article>
      </FadeIn>

      {/* FABs */}
      <div className="fixed bottom-24 left-8 flex flex-col gap-4 z-40">
        <button
          onClick={toggleFontSize}
          className="w-14 h-14 bg-white dark:bg-secondary-800 shadow-xl rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-all duration-200 border border-secondary-200 dark:border-secondary-700 hover:scale-105"
          aria-label="تغيير حجم الخط"
        >
          <Type className="w-5 h-5" />
        </button>
        <button
          className="w-14 h-14 bg-white dark:bg-secondary-800 shadow-xl rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-all duration-200 border border-secondary-200 dark:border-secondary-700 hover:scale-105"
          aria-label="إضافة إلى المفضلة"
        >
          <Bookmark className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default QuranSurahPage;
