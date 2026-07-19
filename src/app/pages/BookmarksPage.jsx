import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  Bookmark, Trash2, Search, SlidersHorizontal, Download, Upload,
  FolderPlus, Folder, BookOpen, MessageSquare, Share2, Check,
  ChevronDown, X, Pin, PinOff, Square, CheckSquare, RotateCcw,
} from 'lucide-react';
import useBookmarks from '../hooks/useBookmarks';
import { ROUTES } from '../constants';

/* ─── Constants ─────────────────────────────────────────────── */
const TYPE_LABELS = {
  verse:  { ar: 'قرآن',  icon: '📖' },
  quiz:   { ar: 'كويز', icon: '❓' },
  hadith: { ar: 'حديث', icon: '📜' },
  dua:    { ar: 'دعاء', icon: '🤲' },
};
const SORT_OPTIONS = [
  { value: 'newest', label: 'الأحدث' },
  { value: 'oldest', label: 'الأقدم' },
  { value: 'surah',  label: 'حسب السورة' },
];
const DEFAULT_EMOJIS = ['📂','📚','🌙','⭐','🕌','💡','🤲','📖','✨','🗂️'];
const UNDO_DURATION  = 5000;

/* ─── Highlight helper ──────────────────────────────────────── */
function Highlight({ text, query }) {
  if (!query?.trim() || !text) return <span>{text}</span>;
  try {
    const esc   = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${esc})`, 'i'));
    return (
      <span>
        {parts.map((p, i) =>
          p.toLowerCase() === query.toLowerCase()
            ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-700/60 text-inherit rounded px-0.5 not-italic">{p}</mark>
            : <span key={i}>{p}</span>
        )}
      </span>
    );
  } catch { return <span>{text}</span>; }
}

/* ─── Note Editor ───────────────────────────────────────────── */
function NoteEditor({ initialNote, onSave, onClose }) {
  const [text, setText] = useState(initialNote || '');
  return (
    <div className="mt-3 pt-3 border-t border-secondary-100 dark:border-secondary-700/60">
      <textarea value={text} onChange={e => setText(e.target.value)} rows={2} autoFocus dir="rtl"
        placeholder="أضف ملاحظتك… (مثل: احفظها لصلاة الليل)"
        className="w-full text-sm rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 text-secondary-800 dark:text-secondary-200 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-secondary-400"
      />
      <div className="flex justify-end gap-2 mt-2">
        <button onClick={onClose} className="px-3 py-1.5 text-xs rounded-lg text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors">إلغاء</button>
        <button onClick={() => { onSave(text); onClose(); }} className="px-3 py-1.5 text-xs rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors">حفظ</button>
      </div>
    </div>
  );
}

/* ─── Collection Picker ─────────────────────────────────────── */
function CollectionPicker({ collections, currentId, onSelect, onClose }) {
  return (
    <div className="p-2 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 shadow-lg">
      <button onClick={() => { onSelect(null); onClose(); }}
        className={`w-full text-right text-sm px-3 py-2 rounded-lg transition-colors ${!currentId ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/30' : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700'}`}>
        بدون مجموعة
      </button>
      {collections.map(col => (
        <button key={col.id} onClick={() => { onSelect(col.id); onClose(); }}
          className={`w-full text-right text-sm px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${currentId === col.id ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/30' : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'}`}>
          <span>{col.emoji}</span><span className="flex-1">{col.name}</span>
          {currentId === col.id && <Check className="w-3.5 h-3.5" />}
        </button>
      ))}
    </div>
  );
}

/* ─── Stat Card ─────────────────────────────────────────────── */
function StatCard({ icon, label, value, color = 'primary' }) {
  const colors = {
    primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300',
    amber:   'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300',
    purple:  'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
    teal:    'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300',
  };
  return (
    <div className={`rounded-2xl p-4 flex flex-col gap-1 ${colors[color]}`}>
      <span className="text-xl">{icon}</span>
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-xs opacity-70">{label}</span>
    </div>
  );
}

/* ─── Verse Card ────────────────────────────────────────────── */
function VerseCard({ bm, collections, search, selectMode, selected, onToggleSelect,
                     onRemove, onNote, onMove, onShare, onPin, copied }) {
  const [showNote, setShowNote]       = useState(false);
  const [showCollPicker, setShowCollPicker] = useState(false);
  const col = collections.find(c => c.id === bm.collectionId);

  return (
    <div className={`relative bg-white dark:bg-secondary-800 rounded-2xl border-2 shadow-sm p-5 transition-all duration-200 ${
      selected ? 'border-primary-400 ring-2 ring-primary-300/40' :
      bm.pinned ? 'border-yellow-300 dark:border-yellow-700' :
      'border-secondary-200/70 dark:border-secondary-700/50'
    }`}>
      {/* Select overlay */}
      {selectMode && (
        <button onClick={() => onToggleSelect(bm.id)} aria-label="تحديد"
          className="absolute top-3 left-3 z-10 p-1 rounded-lg bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 shadow-sm">
          {selected ? <CheckSquare className="w-5 h-5 text-primary-600" /> : <Square className="w-5 h-5 text-secondary-400" />}
        </button>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {bm.pinned && <Pin className="w-3 h-3 text-yellow-500 shrink-0" />}
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 px-2 py-0.5 rounded-full">
              <Highlight text={bm.data?.surahNameArabic} query={search} /> • آية {bm.data.ayahNumber}
            </span>
          </div>
          {col && <span className="text-xs text-secondary-400 flex items-center gap-1"><span>{col.emoji}</span>{col.name}</span>}
        </div>
        {!selectMode && (
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => onPin(bm.id)} aria-label={bm.pinned ? 'إلغاء التثبيت' : 'تثبيت'}
              className={`p-1.5 rounded-lg transition-colors ${bm.pinned ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' : 'text-secondary-300 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'}`}>
              {bm.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
            </button>
            <button onClick={onRemove} aria-label="إزالة"
              className="p-1.5 rounded-lg text-secondary-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Arabic text */}
      <p className="text-xl leading-loose text-right text-secondary-800 dark:text-secondary-200 font-amiri mb-3">
        <Highlight text={bm.data?.arabic} query={search} />
      </p>

      {/* Note */}
      {bm.note && !showNote && (
        <p className="text-xs italic text-secondary-500 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-900/50 rounded-lg px-3 py-2 mb-3 text-right">
          {bm.note}
        </p>
      )}
      {showNote && <NoteEditor initialNote={bm.note} onSave={text => onNote(bm.id, text)} onClose={() => setShowNote(false)} />}

      {/* Actions */}
      {!selectMode && (
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-secondary-100 dark:border-secondary-700/60">
          <Link to={`/quran/${bm.data?.surahNumber}?ayah=${bm.data?.ayahNumber}`}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 hover:bg-primary-100 transition-colors">
            <BookOpen className="w-3 h-3" />اذهب للآية
          </Link>
          <button onClick={() => setShowNote(v => !v)}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-200 transition-colors">
            <MessageSquare className="w-3 h-3" />{bm.note ? 'تعديل الملاحظة' : 'ملاحظة'}
          </button>
          <div className="relative">
            <button onClick={() => setShowCollPicker(v => !v)}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-200 transition-colors">
              <Folder className="w-3 h-3" />مجموعة
            </button>
            {showCollPicker && (
              <div className="absolute bottom-full mb-1 right-0 z-20 min-w-[160px]">
                <CollectionPicker collections={collections} currentId={bm.collectionId}
                  onSelect={id => onMove(bm.id, id)} onClose={() => setShowCollPicker(false)} />
              </div>
            )}
          </div>
          <button onClick={() => onShare(bm)}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-200 transition-colors mr-auto">
            {copied === bm.id ? <Check className="w-3 h-3 text-green-500" /> : <Share2 className="w-3 h-3" />}
            {copied === bm.id ? 'تم النسخ' : 'مشاركة'}
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Quiz Card ─────────────────────────────────────────────── */
function QuizCard({ bm, collections, search, selectMode, selected, onToggleSelect,
                    onRemove, onNote, onMove, onPin }) {
  const [showNote, setShowNote]             = useState(false);
  const [showCollPicker, setShowCollPicker] = useState(false);
  const optionLabels = ['أ', 'ب', 'ج', 'د'];
  const col = collections.find(c => c.id === bm.collectionId);

  return (
    <div className={`relative bg-white dark:bg-secondary-800 rounded-2xl border-2 shadow-sm p-5 transition-all duration-200 ${
      selected ? 'border-primary-400 ring-2 ring-primary-300/40' :
      bm.pinned ? 'border-yellow-300 dark:border-yellow-700' :
      'border-secondary-200/70 dark:border-secondary-700/50'
    }`}>
      {selectMode && (
        <button onClick={() => onToggleSelect(bm.id)} aria-label="تحديد"
          className="absolute top-3 left-3 z-10 p-1 rounded-lg bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 shadow-sm">
          {selected ? <CheckSquare className="w-5 h-5 text-primary-600" /> : <Square className="w-5 h-5 text-secondary-400" />}
        </button>
      )}

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {bm.pinned && <Pin className="w-3 h-3 text-yellow-500 shrink-0" />}
            <span className="text-xs font-semibold bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 px-2 py-0.5 rounded-full">
              {bm.data?.category || 'كويز'}
            </span>
          </div>
          {col && <span className="text-xs text-secondary-400 flex items-center gap-1"><span>{col.emoji}</span>{col.name}</span>}
        </div>
        {!selectMode && (
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => onPin(bm.id)}
              className={`p-1.5 rounded-lg transition-colors ${bm.pinned ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' : 'text-secondary-300 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'}`}>
              {bm.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
            </button>
            <button onClick={onRemove}
              className="p-1.5 rounded-lg text-secondary-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <p className="text-base font-medium text-secondary-800 dark:text-secondary-200 mb-3 text-right leading-relaxed">
        <Highlight text={bm.data?.question} query={search} />
      </p>

      {bm.data?.options && (
        <div className="space-y-1.5 mb-3">
          {bm.data.options.map((opt, i) => (
            <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-xl border text-sm ${
              i === bm.data.correctAnswer
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400'
                : 'bg-secondary-50 dark:bg-secondary-900 border-secondary-200 dark:border-secondary-700 text-secondary-500 dark:text-secondary-500'
            }`}>
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-secondary-200 dark:bg-secondary-700 text-xs font-bold shrink-0">{optionLabels[i]}</span>
              <Highlight text={opt} query={search} />
            </div>
          ))}
        </div>
      )}

      {bm.note && !showNote && (
        <p className="text-xs italic text-secondary-500 bg-secondary-50 dark:bg-secondary-900/50 rounded-lg px-3 py-2 mb-3 text-right">{bm.note}</p>
      )}
      {showNote && <NoteEditor initialNote={bm.note} onSave={t => onNote(bm.id, t)} onClose={() => setShowNote(false)} />}

      {!selectMode && (
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-secondary-100 dark:border-secondary-700/60">
          <button onClick={() => setShowNote(v => !v)}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-200 transition-colors">
            <MessageSquare className="w-3 h-3" />{bm.note ? 'تعديل الملاحظة' : 'ملاحظة'}
          </button>
          <div className="relative">
            <button onClick={() => setShowCollPicker(v => !v)}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-200 transition-colors">
              <Folder className="w-3 h-3" />مجموعة
            </button>
            {showCollPicker && (
              <div className="absolute bottom-full mb-1 right-0 z-20 min-w-[160px]">
                <CollectionPicker collections={collections} currentId={bm.collectionId}
                  onSelect={id => onMove(bm.id, id)} onClose={() => setShowCollPicker(false)} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Undo Toast ────────────────────────────────────────────── */
function UndoToast({ count, onUndo, onDismiss, duration }) {
  const [remaining, setRemaining] = useState(duration / 1000);
  useEffect(() => {
    const t = setInterval(() => setRemaining(r => r - 1), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="fixed bottom-6 right-1/2 translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-secondary-900 dark:bg-secondary-100 text-white dark:text-secondary-900 shadow-2xl border border-secondary-700 dark:border-secondary-300 min-w-[260px]">
      <span className="text-sm flex-1">حُذف {count > 1 ? `${count} محفوظات` : 'محفوظ'}</span>
      <button onClick={onUndo}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-400 dark:text-primary-600 hover:underline">
        <RotateCcw className="w-3.5 h-3.5" />تراجع ({remaining}ث)
      </button>
      <button onClick={onDismiss} className="text-secondary-400 dark:text-secondary-500 hover:text-white dark:hover:text-secondary-900 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */
const BookmarksPage = () => {
  const navigate = useNavigate();
  const {
    bookmarks, collections,
    addBookmark, removeBookmark, updateNote, moveToCollection, togglePin,
    restoreBookmarks, bulkRemove, bulkMoveToCollection,
    addCollection, removeCollection,
    exportBookmarks, importBookmarks, shareBookmark, clearBookmarks,
  } = useBookmarks();

  const [activeTab, setActiveTab]               = useState('all');
  const [activeCollection, setActiveCollection] = useState(null);
  const [search, setSearch]                     = useState('');
  const [sort, setSort]                         = useState('newest');
  const [showSort, setShowSort]                 = useState(false);
  const [copied, setCopied]                     = useState(null);
  const [showNewCol, setShowNewCol]             = useState(false);
  const [newColName, setNewColName]             = useState('');
  const [newColEmoji, setNewColEmoji]           = useState('📂');
  const [importError, setImportError]           = useState('');
  const [importSuccess, setImportSuccess]       = useState(false);

  // Multi-select
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected]     = useState(new Set());

  // Undo
  const [undoState, setUndoState] = useState(null); // { items, timeoutId }
  const fileInputRef = useRef(null);

  /* ─── Stats ─────────────────────────────────────────────── */
  const stats = useMemo(() => ({
    total:       bookmarks.length,
    verses:      bookmarks.filter(b => b.type === 'verse').length,
    quizzes:     bookmarks.filter(b => b.type === 'quiz').length,
    collections: collections.length,
    pinned:      bookmarks.filter(b => b.pinned).length,
  }), [bookmarks, collections]);

  /* ─── Counts per type ───────────────────────────────────── */
  const counts = useMemo(() => {
    const base = activeCollection ? bookmarks.filter(b => b.collectionId === activeCollection) : bookmarks;
    return {
      all:    base.length,
      verse:  base.filter(b => b.type === 'verse').length,
      quiz:   base.filter(b => b.type === 'quiz').length,
      hadith: base.filter(b => b.type === 'hadith').length,
      dua:    base.filter(b => b.type === 'dua').length,
    };
  }, [bookmarks, activeCollection]);

  /* ─── Filtered list ─────────────────────────────────────── */
  const filtered = useMemo(() => {
    let items = (activeCollection ? bookmarks.filter(b => b.collectionId === activeCollection) : bookmarks).filter(b => b && b.data);
    if (activeTab !== 'all') items = items.filter(b => b.type === activeTab);
    if (search.trim()) {
      const q = search.trim();
      items = items.filter(b => {
        const note = b.note || '';
        if (b.type === 'verse') return b.data?.arabic?.includes(q) || b.data?.surahNameArabic?.includes(q) || note.includes(q);
        if (b.type === 'quiz')  return b.data?.question?.includes(q) || (b.data?.options || []).some(o => o.includes(q)) || note.includes(q);
        return note.includes(q);
      });
    }
    const arr = [...items];
    const pinFirst = (a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
    if (sort === 'newest') arr.sort((a, b) => pinFirst(a, b) || (b.createdAt || 0) - (a.createdAt || 0));
    else if (sort === 'oldest') arr.sort((a, b) => pinFirst(a, b) || (a.createdAt || 0) - (b.createdAt || 0));
    else if (sort === 'surah')  arr.sort((a, b) => pinFirst(a, b) || (
      a.type === 'verse' && b.type === 'verse'
        ? a.data.surahNumber - b.data.surahNumber || a.data.ayahNumber - b.data.ayahNumber
        : 0
    ));
    return arr;
  }, [bookmarks, activeTab, activeCollection, search, sort]);

  /* ─── Delete with Undo ──────────────────────────────────── */
  const handleRemove = useCallback((id) => {
    const bm = bookmarks.find(b => b.id === id);
    if (!bm) return;
    removeBookmark(id);
    if (undoState) clearTimeout(undoState.timeoutId);
    const timeoutId = setTimeout(() => setUndoState(null), UNDO_DURATION);
    setUndoState({ items: [bm], timeoutId });
  }, [bookmarks, removeBookmark, undoState]);

  const handleUndo = useCallback(() => {
    if (!undoState) return;
    clearTimeout(undoState.timeoutId);
    restoreBookmarks(undoState.items);
    setUndoState(null);
  }, [undoState, restoreBookmarks]);

  /* ─── Multi-select ──────────────────────────────────────── */
  const toggleSelect = useCallback((id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelected(new Set(filtered.map(b => b.id)));
  }, [filtered]);

  const clearSelect = useCallback(() => {
    setSelected(new Set());
    setSelectMode(false);
  }, []);

  const handleBulkDelete = useCallback(() => {
    const items = bookmarks.filter(b => selected.has(b.id));
    bulkRemove(selected);
    if (undoState) clearTimeout(undoState.timeoutId);
    const timeoutId = setTimeout(() => setUndoState(null), UNDO_DURATION);
    setUndoState({ items, timeoutId });
    clearSelect();
  }, [bookmarks, selected, bulkRemove, undoState, clearSelect]);

  const handleBulkMove = useCallback((colId) => {
    bulkMoveToCollection(selected, colId);
    clearSelect();
  }, [selected, bulkMoveToCollection, clearSelect]);

  /* ─── Share ─────────────────────────────────────────────── */
  const handleShare = useCallback(async (bm) => {
    const result = await shareBookmark(bm);
    if (result === 'copied') { setCopied(bm.id); setTimeout(() => setCopied(null), 2000); }
  }, [shareBookmark]);

  /* ─── Import ────────────────────────────────────────────── */
  const handleImport = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError('');
    try {
      await importBookmarks(file);
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 3000);
    } catch (err) { setImportError(err.message); }
    e.target.value = '';
  }, [importBookmarks]);

  /* ─── Collections ───────────────────────────────────────── */
  const handleAddCollection = () => {
    if (!newColName.trim()) return;
    addCollection(newColName.trim(), newColEmoji);
    setNewColName(''); setNewColEmoji('📂'); setShowNewCol(false);
  };

  const TABS = [
    { key: 'all', label: 'الكل', count: counts.all },
    ...Object.entries(TYPE_LABELS).filter(([k]) => counts[k] > 0).map(([k, v]) => ({ key: k, label: `${v.icon} ${v.ar}`, count: counts[k] })),
  ];

  /* ─── Empty State ───────────────────────────────────────── */
  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 gap-6">
        <div className="w-24 h-24 rounded-3xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-5xl shadow-inner">
          🔖
        </div>
        <div>
          <h2 className="text-2xl font-bold text-secondary-800 dark:text-secondary-100 mb-2">لا توجد محفوظات بعد</h2>
          <p className="text-secondary-500 dark:text-secondary-400 max-w-xs mx-auto leading-relaxed">
            احفظ آيات قرآنية أو أسئلة كويز وستظهر هنا. كل ما يهمك في مكان واحد.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => navigate(ROUTES.QURAN_EXPLORER)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary-600 text-white hover:bg-primary-700 transition-colors font-medium">
            📖 استكشف القرآن
          </button>
          <button onClick={() => navigate(ROUTES.CATEGORIES)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 transition-colors font-medium">
            ❓ ابدأ كويز
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6" dir="rtl">

      {/* ── Stats ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon="📚" label="إجمالي المحفوظات" value={stats.total} color="primary" />
        <StatCard icon="📖" label="آيات قرآنية"       value={stats.verses}  color="teal"   />
        <StatCard icon="❓" label="أسئلة كويز"        value={stats.quizzes} color="purple" />
        <StatCard icon="📂" label="المجموعات"         value={stats.collections} color="amber" />
      </div>

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-secondary-800 dark:text-secondary-100">المفضلة</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => { setSelectMode(v => !v); setSelected(new Set()); }}
            className={`inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border transition-colors ${
              selectMode
                ? 'bg-primary-600 border-primary-600 text-white'
                : 'border-secondary-300 dark:border-secondary-600 text-secondary-600 dark:text-secondary-400 hover:border-primary-400 bg-white dark:bg-secondary-800'
            }`}>
            <CheckSquare className="w-4 h-4" />تحديد
          </button>
          <button onClick={exportBookmarks}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors border border-secondary-200 dark:border-secondary-700">
            <Download className="w-4 h-4" />تصدير
          </button>
          <button onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors border border-secondary-200 dark:border-secondary-700">
            <Upload className="w-4 h-4" />استيراد
          </button>
          <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        </div>
      </div>

      {importSuccess && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm border border-emerald-200 dark:border-emerald-800">
          <Check className="w-4 h-4 shrink-0" />تم الاستيراد بنجاح — تم دمج المحفوظات بدون تكرار
        </div>
      )}
      {importError && (
        <div className="px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-800">{importError}</div>
      )}

      {/* ── Collections ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => setActiveCollection(null)}
          className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
            !activeCollection ? 'bg-primary-600 border-primary-600 text-white' : 'border-secondary-300 dark:border-secondary-600 text-secondary-600 dark:text-secondary-400 hover:border-primary-400'
          }`}>
          <Folder className="w-3.5 h-3.5" />الكل
        </button>
        {collections.map(col => (
          <button key={col.id} onClick={() => setActiveCollection(activeCollection === col.id ? null : col.id)}
            className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
              activeCollection === col.id ? 'bg-primary-600 border-primary-600 text-white' : 'border-secondary-300 dark:border-secondary-600 text-secondary-600 dark:text-secondary-400 hover:border-primary-400'
            }`}>
            <span>{col.emoji}</span>{col.name}
            <span onClick={e => { e.stopPropagation(); removeCollection(col.id); if (activeCollection === col.id) setActiveCollection(null); }}
              className="mr-1 hover:text-red-400 transition-colors cursor-pointer">
              <X className="w-2.5 h-2.5" />
            </span>
          </button>
        ))}
        <button onClick={() => setShowNewCol(v => !v)}
          className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-dashed border-secondary-300 dark:border-secondary-600 text-secondary-500 hover:border-primary-400 hover:text-primary-600 transition-colors">
          <FolderPlus className="w-3.5 h-3.5" />جديد
        </button>
      </div>

      {showNewCol && (
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-secondary-50 dark:bg-secondary-800/60 border border-secondary-200 dark:border-secondary-700">
          <div className="flex flex-wrap gap-1">
            {DEFAULT_EMOJIS.map(e => (
              <button key={e} onClick={() => setNewColEmoji(e)}
                className={`text-lg p-1 rounded-lg transition-colors ${newColEmoji === e ? 'bg-primary-100 dark:bg-primary-900/30' : 'hover:bg-secondary-200 dark:hover:bg-secondary-700'}`}>{e}
              </button>
            ))}
          </div>
          <input value={newColName} onChange={e => setNewColName(e.target.value)} placeholder="اسم المجموعة"
            onKeyDown={e => e.key === 'Enter' && handleAddCollection()}
            className="flex-1 min-w-[120px] text-sm rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" dir="rtl" autoFocus />
          <button onClick={handleAddCollection} className="px-4 py-2 text-sm rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors">إضافة</button>
          <button onClick={() => setShowNewCol(false)} className="p-2 rounded-xl text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* ── Type Tabs ────────────────────────────────────────── */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-1">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 text-sm px-4 py-1.5 rounded-full font-medium transition-colors ${
              activeTab === tab.key ? 'bg-primary-600 text-white' : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-700'
            }`}>
            {tab.label}
            {tab.key !== 'all' && <span className="mr-1 opacity-60 text-xs">({tab.count})</span>}
          </button>
        ))}
      </div>

      {/* ── Search + Sort ────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث في محفوظاتك…" dir="rtl"
            className="w-full text-sm pr-10 pl-10 py-2.5 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-800 dark:text-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-secondary-400" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="relative">
          <button onClick={() => setShowSort(v => !v)}
            className="inline-flex items-center gap-1.5 text-sm px-3 py-2.5 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:border-primary-400 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            {SORT_OPTIONS.find(s => s.value === sort)?.label}
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {showSort && (
            <div className="absolute left-0 top-full mt-1 w-36 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl shadow-lg z-20 overflow-hidden">
              {SORT_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => { setSort(opt.value); setShowSort(false); }}
                  className={`w-full text-right text-sm px-4 py-2.5 transition-colors ${sort === opt.value ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search result count */}
      {search && (
        <p className="text-sm text-secondary-500 dark:text-secondary-400">
          {filtered.length > 0 ? `${filtered.length} نتيجة لـ "${search}"` : `لا توجد نتائج لـ "${search}"`}
        </p>
      )}

      {/* ── Multi-select toolbar ─────────────────────────────── */}
      {selectMode && (
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
          <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
            {selected.size > 0 ? `${selected.size} محدد` : 'اختر محفوظات'}
          </span>
          <button onClick={selectAll} className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 text-secondary-600 dark:text-secondary-400 hover:border-primary-400 transition-colors">تحديد الكل</button>
          <button onClick={clearSelect} className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 text-secondary-600 dark:text-secondary-400 hover:border-secondary-400 transition-colors">إلغاء</button>
          {selected.size > 0 && (
            <>
              <button onClick={handleBulkDelete}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors mr-auto">
                <Trash2 className="w-3.5 h-3.5" />حذف ({selected.size})
              </button>
              {collections.length > 0 && (
                <div className="relative group">
                  <button className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 text-secondary-600 dark:text-secondary-400 hover:border-primary-400 transition-colors">
                    <Folder className="w-3.5 h-3.5" />نقل لمجموعة
                  </button>
                  <div className="absolute bottom-full mb-1 right-0 z-20 hidden group-hover:block min-w-[160px]">
                    <CollectionPicker collections={collections} currentId={null}
                      onSelect={id => handleBulkMove(id)} onClose={() => {}} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Empty filter state ───────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-secondary-500 dark:text-secondary-400 font-medium">لا توجد نتائج</p>
          {search && <p className="text-sm text-secondary-400 mt-1">جرب كلمة بحث مختلفة</p>}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(bm =>
            bm.type === 'verse'
              ? <VerseCard key={bm.id} bm={bm} collections={collections} search={search}
                  selectMode={selectMode} selected={selected.has(bm.id)} onToggleSelect={toggleSelect}
                  onRemove={() => handleRemove(bm.id)} onNote={updateNote} onMove={moveToCollection}
                  onShare={handleShare} onPin={togglePin} copied={copied} />
              : <QuizCard key={bm.id} bm={bm} collections={collections} search={search}
                  selectMode={selectMode} selected={selected.has(bm.id)} onToggleSelect={toggleSelect}
                  onRemove={() => handleRemove(bm.id)} onNote={updateNote} onMove={moveToCollection}
                  onPin={togglePin} />
          )}
        </div>
      )}

      {/* ── Footer ──────────────────────────────────────────── */}
      {bookmarks.length > 0 && (
        <div className="flex justify-center pt-4 border-t border-secondary-100 dark:border-secondary-800">
          <button onClick={() => { if (window.confirm('هل أنت متأكد من حذف كل المحفوظات؟')) clearBookmarks(); }}
            className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <Trash2 className="w-4 h-4" />حذف كل المحفوظات
          </button>
        </div>
      )}

      {/* ── Undo Toast ──────────────────────────────────────── */}
      {undoState && (
        <UndoToast
          count={undoState.items.length}
          onUndo={handleUndo}
          onDismiss={() => { clearTimeout(undoState.timeoutId); setUndoState(null); }}
          duration={UNDO_DURATION}
        />
      )}
    </div>
  );
};

export default BookmarksPage;
