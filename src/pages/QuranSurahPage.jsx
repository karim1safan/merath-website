import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useQuranSurah, useReciters } from "../hooks/useQuranExplorer";
import { ROUTES, QURAN } from "../constants";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";
import Modal from "../components/common/Modal";
import { FadeIn } from "../components/ui/Motion";

const toArabicNumber = (num) => {
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(num)
    .split("")
    .map((d) => arabicDigits[Number(d)] ?? d)
    .join("");
};

const isArabicDiacriticOrTatweel = (ch) => {
  const code = ch.codePointAt(0);
  return (
    (code >= 0x064b && code <= 0x065f) ||
    code === 0x0670 ||
    (code >= 0x06d6 && code <= 0x06ed) ||
    code === 0x0640
  );
};

const BASMALLAH_BASE_LETTERS_COUNT = 19;

// ── Slim Header ────────────────────────────────────────────────────────────
const SurahHeader = ({ surah, surahNumber, onBack }) => (
  <div className="mb-8">
    <div className="mb-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors text-sm font-semibold"
        aria-label="العودة للمصحف"
      >
        <ArrowRight className="w-4 h-4" />
        <span>المصحف</span>
      </button>
    </div>
    <div className="text-center">
      <h1 className="font-amiri text-5xl md:text-6xl text-primary-900 dark:text-primary-100 font-bold mb-5 leading-tight">
        {surah.name_arabic}
      </h1>
      <div className="flex justify-center items-center gap-2 mb-6">
        <span className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-xs font-semibold">
          رقم {toArabicNumber(surahNumber)}
        </span>
        <span className="w-1 h-1 bg-secondary-300 dark:bg-secondary-600 rounded-full" />
        <span className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-xs font-semibold">
          {toArabicNumber(surah.numberOfVerses)} آية
        </span>
        <span className="w-1 h-1 bg-secondary-300 dark:bg-secondary-600 rounded-full" />
        <span className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-xs font-semibold">
          {surah.revelation === "makkah" ? "مكية" : "مدنية"}
        </span>
      </div>
      <div className="mushaf-ornament mushaf-ornament-light mx-auto" />
    </div>
  </div>
);

// ── Lightweight Audio Bar ──────────────────────────────────────────────────
const AudioBar = ({
  selectedReciter,
  isPlaying,
  currentTime,
  duration,
  handlePlaySurah,
  handleSeek,
  handleSkipBack,
  handleSkipForward,
  formatTime,
  hasReciter,
  onOpenReciterModal,
}) => (
  <div className="quran-audio-bar mb-8">
    <div className="flex items-center gap-3 mb-3">
      <button
        onClick={onOpenReciterModal}
        className="flex items-center gap-1.5 text-secondary-500 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
      >
        <span className="truncate max-w-[140px] sm:max-w-[220px]">
          {selectedReciter?.name || "اختر قارئاً"}
        </span>
        <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-1.5">
        <button
          onClick={handleSkipBack}
          disabled={!hasReciter}
          className="w-9 h-9 rounded-full flex items-center justify-center text-secondary-400 dark:text-secondary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="رجوع 10 ثوانٍ"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={handlePlaySurah}
          disabled={!hasReciter}
          className="w-12 h-12 bg-primary-600 dark:bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-700 dark:hover:bg-primary-600 hover:scale-105 active:scale-95 transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label={isPlaying ? "إيقاف" : "تشغيل"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>

        <button
          onClick={handleSkipForward}
          disabled={!hasReciter}
          className="w-9 h-9 rounded-full flex items-center justify-center text-secondary-400 dark:text-secondary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="تقديم 10 ثوانٍ"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>
    </div>

    <div className="flex items-center gap-3">
      <span className="text-xs tabular-nums text-secondary-400 dark:text-secondary-500 w-8 text-left shrink-0">
        {formatTime(currentTime)}
      </span>
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={currentTime}
        onChange={handleSeek}
        className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer
                   bg-secondary-200 dark:bg-secondary-700
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-primary-500
                   [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5
                   [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:bg-primary-500
                   [&::-moz-range-thumb]:border-none
                   [&::-moz-range-thumb]:cursor-pointer"
        aria-label="البحث في الصوت"
      />
      <span className="text-xs tabular-nums text-secondary-400 dark:text-secondary-500 w-8 text-right shrink-0">
        {formatTime(duration)}
      </span>
    </div>
  </div>
);

// ── Main Page ──────────────────────────────────────────────────────────────
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
        m.surah_list?.split(",").includes(String(surahNumber))
      )
    ) {
      return yasser;
    }
    return reciters.find((r) =>
      r.moshaf?.some((m) =>
        m.surah_list?.split(",").includes(String(surahNumber))
      )
    );
  })();

  const [selectedReciter, setSelectedReciter] = useState(() =>
    defaultReciter ?? null
  );
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showReciterModal, setShowReciterModal] = useState(false);
  const [reciterSearch, setReciterSearch] = useState("");
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
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => { setCurrentTime(0); setDuration(0); };
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
    return `${moshaf.server}${String(surahNum).padStart(3, "0")}.mp3`;
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
    setCurrentTime(0);
    setDuration(0);
    audio.play().catch((err) => console.error("Error playing audio:", err));
    audio.onended = () => { setCurrentAudio(null); setIsPlaying(false); };
    audioRef.current = audio;
    setCurrentAudio(audio);
    setIsPlaying(true);
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

  const displayedVerses = useMemo(() => {
    if (!data?.verses) return [];
    if (num === 1 || num === 9) return data.verses;
    const [first, ...rest] = data.verses;

    const stripLeadingBasmallah = (text) => {
      let baseCharsSeen = 0;
      let cutIndex = -1;
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === " " || isArabicDiacriticOrTatweel(ch)) continue;
        baseCharsSeen++;
        if (baseCharsSeen === BASMALLAH_BASE_LETTERS_COUNT) {
          let j = i + 1;
          while (j < text.length && isArabicDiacriticOrTatweel(text[j])) j++;
          cutIndex = j;
          break;
        }
      }
      if (cutIndex === -1) return text;
      return text.slice(cutIndex).replace(/^\s+/, "");
    };

    return [{ ...first, arabic: stripLeadingBasmallah(first.arabic) }, ...rest];
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

  const { surah } = data;
  const showBasmallah = num !== 1 && num !== 9;
  const hasPrev = num > 1;
  const hasNext = num < QURAN.TOTAL_SURAHS;

  return (
    <div className="max-w-4xl mx-auto">
      <FadeIn delay={0}>
        <SurahHeader
          surah={surah}
          surahNumber={num}
          onBack={() => navigate(ROUTES.QURAN_EXPLORER)}
        />
      </FadeIn>

      <FadeIn delay={0.05}>
        <AudioBar
          selectedReciter={selectedReciter}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          handlePlaySurah={handlePlaySurah}
          handleSeek={handleSeek}
          handleSkipBack={handleSkipBack}
          handleSkipForward={handleSkipForward}
          formatTime={formatTime}
          hasReciter={!!selectedReciter}
          onOpenReciterModal={() => setShowReciterModal(true)}
        />
      </FadeIn>

      {/* Reciter Modal */}
      <Modal
        isOpen={showReciterModal}
        onClose={() => { setShowReciterModal(false); setReciterSearch(""); }}
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

      {/* Quran Reading Area */}
      <FadeIn delay={0.1}>
        <div className="quran-reading-area">
          {showBasmallah && (
            <div className="text-center mb-10 pb-10 border-b border-amber-200/50 dark:border-secondary-700/40">
              <div className="mushaf-ornament mushaf-ornament-light mx-auto mb-4" />
              <p className="mushaf-bismillah">
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </p>
              <div className="mushaf-ornament mushaf-ornament-light mx-auto mt-4" />
            </div>
          )}

          <div
            className="font-amiri text-[24px] md:text-[28px] leading-[3.2] text-secondary-800 dark:text-secondary-100 text-justify"
            style={{ direction: "rtl", textAlignLast: "center", wordSpacing: "0.12em" }}
          >
            {displayedVerses.map((verse) => (
              <span key={verse.ayah} className="inline">
                {verse.arabic}
                <span className="mushaf-verse-num">
                  <span className="mushaf-verse-num-star" />
                  {toArabicNumber(verse.ayah)}
                </span>{" "}
              </span>
            ))}
          </div>

          {/* Surah Navigation */}
          <div className="mt-16 pt-8 border-t border-secondary-200/60 dark:border-secondary-700/40 flex justify-between items-center">
            {hasPrev ? (
              <button
                onClick={() => navigate(`${ROUTES.QURAN_EXPLORER}/${num - 1}`)}
                className="flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group"
              >
                <ArrowRight className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                <span>السورة السابقة</span>
              </button>
            ) : (
              <div />
            )}
            {hasNext ? (
              <button
                onClick={() => navigate(`${ROUTES.QURAN_EXPLORER}/${num + 1}`)}
                className="flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group"
              >
                <span>السورة التالية</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default QuranSurahPage;
