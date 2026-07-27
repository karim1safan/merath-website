import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Share2, Check, ExternalLink, BookOpen } from 'lucide-react';
import useTafsir from '../../hooks/useTafsir';
import { TAFSIR_EDITIONS, TAFSIR_LABELS } from '../../services/tafsirApi';

/* ─── Text-like Skeleton ────────────────────────────────────── */
const SKELETON_WIDTHS = [100, 82, 95, 68, 100, 75, 88, 55, 92, 70, 100, 60];

function TafsirSkeleton() {
  return (
    <div className="space-y-3 animate-pulse" dir="rtl">
      {SKELETON_WIDTHS.map((w, i) => (
        <div
          key={i}
          className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded-full"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  );
}

/* ─── Tab Bar ───────────────────────────────────────────────── */
function EditionTabs({ active, onChange }) {
  return (
    <div className="flex gap-1 p-1 bg-secondary-100 dark:bg-secondary-900 rounded-xl">
      {Object.entries(TAFSIR_LABELS).map(([key, label]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex-1 text-xs font-medium px-2 py-1.5 rounded-lg transition-all duration-200 ${
            active === key
              ? 'bg-white dark:bg-secondary-700 text-primary-700 dark:text-primary-300 shadow-sm'
              : 'text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/* ─── Content area with fade on ayah change ─────────────────── */
function TafsirContent({ surahNumber, ayahNumber, ayahArabic, edition }) {
  const { data, isLoading, error } = useTafsir(surahNumber, ayahNumber, edition);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${ayahNumber}-${edition}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex-1 overflow-y-auto min-h-0"
      >
        {/* Ayah preview */}
        <div className="mb-4 px-4 py-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
          <p className="text-lg leading-loose text-right text-secondary-800 dark:text-secondary-200 font-amiri">
            {ayahArabic}
          </p>
        </div>

        {/* Tafsir text */}
        {isLoading && <TafsirSkeleton />}
        {error && (
          <div className="text-sm text-red-500 dark:text-red-400 text-center py-8">
            تعذّر تحميل التفسير. تحقق من الاتصال بالإنترنت.
          </div>
        )}
        {data && (
          <p className="text-sm leading-loose text-secondary-700 dark:text-secondary-300 text-right" dir="rtl">
            {data}
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Main Panel ────────────────────────────────────────────── */
export default function TafsirPanel({
  isOpen,
  surahNumber,
  surahName,
  ayahNumber,
  ayahArabic,
  totalAyahs,
  onClose,
}) {
  const [edition, setEdition]   = useState('muyassar');
  const [copied, setCopied]     = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768);

  // Track desktop/mobile
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (!isDesktop && isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen, isDesktop]);

  // Prefetch next 2 ayahs on open
  const { prefetch } = useTafsir(surahNumber, ayahNumber, TAFSIR_EDITIONS[edition]);
  useEffect(() => {
    if (!isOpen || !surahNumber || !ayahNumber || !totalAyahs) return;
    const next = [];
    if (ayahNumber + 1 <= totalAyahs) next.push({ surah: surahNumber, ayah: ayahNumber + 1 });
    if (ayahNumber + 2 <= totalAyahs) next.push({ surah: surahNumber, ayah: ayahNumber + 2 });
    if (next.length) prefetch(next);
  }, [isOpen, surahNumber, ayahNumber, totalAyahs, prefetch]);

  // Copy ayah + tafsir (text from DOM — simplest approach)
  const handleCopy = useCallback(async () => {
    const tafsirEl = document.getElementById('tafsir-text-content');
    const tafsirText = tafsirEl?.textContent || '';
    const text = `${ayahArabic}\n\n📖 ${TAFSIR_LABELS[edition]}:\n${tafsirText}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* silent */ }
  }, [ayahArabic, edition]);

  // Share
  const handleShare = useCallback(async () => {
    const text = `${ayahArabic}\n\nسورة ${surahName} - الآية ${ayahNumber}`;
    if (navigator.share) {
      try { await navigator.share({ text }); return; } catch { /* fall through */ }
    }
    await navigator.clipboard.writeText(text).catch(() => {});
  }, [ayahArabic, surahName, ayahNumber]);

  // Open in new window (self-contained HTML blob)
  const handleOpenWindow = useCallback(() => {
    const tafsirEl = document.getElementById('tafsir-text-content');
    const tafsirText = tafsirEl?.textContent || '...';
    const html = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <title>سورة ${surahName} - آية ${ayahNumber}</title>
  <style>
    body{font-family:system-ui,sans-serif;padding:2rem;max-width:680px;margin:auto;background:#fafaf9;color:#1c1917;line-height:2}
    h2{color:#166534;margin-bottom:0.5rem}
    .meta{font-size:0.85rem;color:#78716c;margin-bottom:1.5rem}
    .ayah{font-size:1.6rem;border-right:4px solid #166534;padding:0.75rem 1rem;margin:1.5rem 0;background:#f0fdf4;border-radius:0 0.5rem 0.5rem 0}
    h3{color:#166534;font-size:1rem;margin-bottom:0.75rem}
    .tafsir{font-size:1rem;background:#fff;border:1px solid #e7e5e4;border-radius:0.5rem;padding:1.25rem;line-height:2.2}
  </style>
</head>
<body>
  <h2>سورة ${surahName}</h2>
  <div class="meta">الآية ${ayahNumber}</div>
  <div class="ayah">${ayahArabic}</div>
  <h3>📖 ${TAFSIR_LABELS[edition]}</h3>
  <div class="tafsir">${tafsirText}</div>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url  = URL.createObjectURL(blob);
    window.open(url, '_blank', 'width=760,height=640,scrollbars=yes');
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }, [surahName, ayahNumber, ayahArabic, edition]);

  /* ── Animation variants ── */
  const mobileVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 28, stiffness: 320 } },
    exit: { y: '100%', opacity: 0, transition: { duration: 0.22, ease: 'easeIn' } },
  };
  const desktopVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 28, stiffness: 320 } },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.22, ease: 'easeIn' } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="tafsir-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="tafsir-panel"
            variants={isDesktop ? desktopVariants : mobileVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={
              isDesktop
                ? 'fixed top-0 right-0 h-full w-full max-w-[440px] z-50 bg-white dark:bg-secondary-900 shadow-2xl flex flex-col'
                : 'fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-secondary-900 rounded-t-3xl shadow-2xl flex flex-col max-h-[80vh]'
            }
          >
            {/* Drag handle (mobile only) */}
            {!isDesktop && (
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-secondary-300 dark:bg-secondary-600 rounded-full" />
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-secondary-100 dark:border-secondary-800 shrink-0">
              <div>
                <p className="text-xs text-secondary-400 dark:text-secondary-500">سورة {surahName}</p>
                <h2 className="font-bold text-secondary-800 dark:text-secondary-100">
                  الآية {ayahNumber}
                </h2>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={handleCopy} aria-label="نسخ"
                  className="p-2 rounded-xl text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors">
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <button onClick={handleShare} aria-label="مشاركة"
                  className="p-2 rounded-xl text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
                {isDesktop && (
                  <button onClick={handleOpenWindow} aria-label="فتح في نافذة مستقلة"
                    className="p-2 rounded-xl text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
                <button onClick={onClose} aria-label="إغلاق"
                  className="p-2 rounded-xl text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors mr-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Edition Tabs */}
            <div className="px-5 pt-4 pb-3 shrink-0">
              <EditionTabs active={edition} onChange={setEdition} />
            </div>

            {/* Scrollable content */}
            <div id="tafsir-text-content" className="flex-1 overflow-y-auto px-5 pb-6 min-h-0">
              <TafsirContent
                surahNumber={surahNumber}
                ayahNumber={ayahNumber}
                ayahArabic={ayahArabic}
                edition={TAFSIR_EDITIONS[edition]}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
