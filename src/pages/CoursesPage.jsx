import { useState, useMemo } from 'react';
import {
  PlayCircle,
  ExternalLink,
  Search,
  Video,
  BookOpen,
  Users,
  Sword,
  ScrollText,
  Star,
  User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PLAYLISTS, COURSE_CATEGORIES } from '../data/playlists';
import Badge from '../components/common/Badge';

// ─── Per-category visual theme ──────────────────────────────────────────────
const CATEGORY_THEMES = {
  'الخلافة الراشدة': {
    gradient: 'from-emerald-600 to-teal-700',
    light: 'bg-emerald-50 dark:bg-emerald-900/20',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    icon: Star,
  },
  'العقيدة': {
    gradient: 'from-blue-600 to-indigo-700',
    light: 'bg-blue-50 dark:bg-blue-900/20',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    icon: BookOpen,
  },
  'السيرة': {
    gradient: 'from-amber-500 to-orange-600',
    light: 'bg-amber-50 dark:bg-amber-900/20',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    icon: Sword,
  },
  'الحديث': {
    gradient: 'from-purple-600 to-violet-700',
    light: 'bg-purple-50 dark:bg-purple-900/20',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    icon: ScrollText,
  },
  'الصحابة': {
    gradient: 'from-rose-500 to-pink-700',
    light: 'bg-rose-50 dark:bg-rose-900/20',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
    icon: Users,
  },
  'تراجم': {
    gradient: 'from-cyan-600 to-sky-700',
    light: 'bg-cyan-50 dark:bg-cyan-900/20',
    badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300',
    icon: User,
  },
};

const DEFAULT_THEME = {
  gradient: 'from-primary-600 to-primary-700',
  light: 'bg-primary-50 dark:bg-primary-900/20',
  badge: 'bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-300',
  icon: PlayCircle,
};

const getTheme = (category) => CATEGORY_THEMES[category] ?? DEFAULT_THEME;

// ─── Stats derived from PLAYLISTS ───────────────────────────────────────────
const TOTAL_VIDEOS = PLAYLISTS.reduce((sum, p) => sum + (p.videoCount ?? 0), 0);

// ─── Playlist Card ───────────────────────────────────────────────────────────
const PlaylistCard = ({ playlist, index }) => {
  const theme = getTheme(playlist.category);
  const Icon = theme.icon;
  const hasLink = !!playlist.youtubeUrl;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="group bg-white dark:bg-secondary-800 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden border border-secondary-100 dark:border-secondary-700/50"
    >
      {/* Banner */}
      <div className={`relative h-36 bg-gradient-to-br ${theme.gradient} flex items-center justify-center overflow-hidden`}>
        {/* Decorative rings */}
        <div className="absolute -top-6 -right-6 w-32 h-32 border-2 border-white/15 rounded-full" />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 border-2 border-white/10 rounded-full" />
        <div className="absolute top-3 left-3 w-10 h-10 border border-white/10 rounded-full" />

        {/* Centered icon */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="bg-white/15 backdrop-blur-sm p-3 rounded-2xl ring-1 ring-white/20">
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Video count pill */}
        {playlist.videoCount && (
          <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
            <Video className="w-3 h-3" />
            <span>{playlist.videoCount} فيديو</span>
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-2.5 right-3">
          <span className="text-xs bg-black/25 backdrop-blur-sm text-white px-2.5 py-1 rounded-full font-medium">
            {playlist.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Channel */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <PlayCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
          <span className="text-xs font-medium text-secondary-500 dark:text-secondary-400 truncate">
            {playlist.channelName}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-base font-bold text-secondary-800 dark:text-secondary-100 leading-snug mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
          {playlist.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed line-clamp-3 flex-1">
          {playlist.description}
        </p>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-secondary-100 dark:border-secondary-700/60">
          {hasLink ? (
            <a
              href={playlist.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-sm font-semibold transition-colors duration-200"
            >
              <ExternalLink className="w-4 h-4" />
              مشاهدة على يوتيوب
            </a>
          ) : (
            <div className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 rounded-xl bg-secondary-100 dark:bg-secondary-700 text-secondary-400 dark:text-secondary-500 text-sm font-semibold cursor-not-allowed select-none">
              <Video className="w-4 h-4" />
              قريبًا
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
const CoursesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [query, setQuery] = useState('');

  const filteredPlaylists = useMemo(() => {
    let list = PLAYLISTS;

    if (selectedCategory !== 'الكل') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.channelName.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedCategory, query]);

  return (
    <div className="space-y-8">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="text-center space-y-3">
        <div className="flex justify-center mb-3">
          <div className="p-4 rounded-2xl bg-primary-100 dark:bg-primary-900/30 ring-4 ring-primary-100/50 dark:ring-primary-900/20">
            <PlayCircle className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-secondary-800 dark:text-secondary-100">
          دورات وقنوات إسلامية
        </h1>
        <p className="text-secondary-500 dark:text-secondary-400 max-w-xl mx-auto text-sm leading-relaxed">
          مجموعات مختارة من أفضل القنوات التعليمية الإسلامية على يوتيوب لتعزيز معلوماتك في العلوم الشرعية
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-6 pt-1">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{PLAYLISTS.length}</span>
            <span className="text-xs text-secondary-500 dark:text-secondary-400">قائمة تشغيل</span>
          </div>
          <div className="w-px bg-secondary-200 dark:bg-secondary-700" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{TOTAL_VIDEOS}+</span>
            <span className="text-xs text-secondary-500 dark:text-secondary-400">فيديو تعليمي</span>
          </div>
          <div className="w-px bg-secondary-200 dark:bg-secondary-700" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{COURSE_CATEGORIES.length - 1}</span>
            <span className="text-xs text-secondary-500 dark:text-secondary-400">تخصص</span>
          </div>
        </div>
      </div>

      {/* ── Search ───────────────────────────────────────────────────────── */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن دورة أو شيخ..."
          className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-800 text-secondary-800 dark:text-secondary-200 placeholder:text-secondary-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all duration-200"
          dir="rtl"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200 text-lg leading-none transition-colors"
            aria-label="مسح البحث"
          >
            ×
          </button>
        )}
      </div>

      {/* ── Category Filter ───────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {COURSE_CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-200 dark:shadow-primary-900/30'
                  : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-600'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* ── Results count ────────────────────────────────────────────────── */}
      {(query.trim() || selectedCategory !== 'الكل') && (
        <p className="text-center text-sm text-secondary-500 dark:text-secondary-400">
          {filteredPlaylists.length > 0
            ? `${filteredPlaylists.length} نتيجة`
            : 'لا توجد نتائج'}
        </p>
      )}

      {/* ── Grid ─────────────────────────────────────────────────────────── */}
      <AnimatePresence mode="popLayout">
        {filteredPlaylists.length > 0 ? (
          <motion.div
            key="grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPlaylists.map((playlist, index) => (
              <PlaylistCard key={playlist.id} playlist={playlist} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            <div className="p-5 rounded-2xl bg-secondary-100 dark:bg-secondary-800">
              <Search className="w-10 h-10 text-secondary-400" />
            </div>
            <p className="text-secondary-500 dark:text-secondary-400 font-medium">
              لا توجد دورات تطابق بحثك
            </p>
            <button
              onClick={() => { setQuery(''); setSelectedCategory('الكل'); }}
              className="text-primary-600 dark:text-primary-400 text-sm hover:underline"
            >
              إعادة ضبط الفلاتر
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoursesPage;
