import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

const BM_KEY   = 'meerath-bookmarks-v2';
const COL_KEY  = 'meerath-collections';
const LEGACY_KEY = 'quiz-bookmarks';

function migrateLegacy() {
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return [];
    const legacy = JSON.parse(raw);
    if (!Array.isArray(legacy) || legacy.length === 0) return [];
    return legacy.map((q, i) => ({
      id: q.id ? `quiz:${q.id}` : `quiz:legacy:${i}`,
      type: 'quiz',
      createdAt: Date.now() - i * 1000,
      note: '',
      collectionId: null,
      data: q,
    }));
  } catch {
    return [];
  }
}

function getInitialBookmarks() {
  try {
    const existing = localStorage.getItem(BM_KEY);
    if (existing) return JSON.parse(existing);
    const migrated = migrateLegacy();
    if (migrated.length > 0) {
      localStorage.setItem(BM_KEY, JSON.stringify(migrated));
    }
    return migrated;
  } catch {
    return [];
  }
}

const useBookmarks = () => {
  const [_rawBookmarks, setBookmarks] = useLocalStorage(BM_KEY, getInitialBookmarks());
  const bookmarks = Array.isArray(_rawBookmarks) ? _rawBookmarks : [];
  const [collections, setCollections] = useLocalStorage(COL_KEY, []);

  /* ─── Bookmark CRUD ─────────────────────────────────── */

  const addBookmark = useCallback((bookmark) => {
    setBookmarks(prev => {
      if (prev.some(b => b.id === bookmark.id)) return prev;
      return [{ note: '', collectionId: null, createdAt: Date.now(), ...bookmark }, ...prev];
    });
  }, [setBookmarks]);

  const removeBookmark = useCallback((id) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  }, [setBookmarks]);

  const toggleBookmark = useCallback((bookmark) => {
    setBookmarks(prev => {
      if (prev.some(b => b.id === bookmark.id)) {
        return prev.filter(b => b.id !== bookmark.id);
      }
      return [{ note: '', collectionId: null, createdAt: Date.now(), ...bookmark }, ...prev];
    });
  }, [setBookmarks]);

  const isBookmarked = useCallback((id) => {
    return bookmarks.some(b => b.id === id);
  }, [bookmarks]);

  const updateNote = useCallback((id, note) => {
    setBookmarks(prev => prev.map(b => b.id === id ? { ...b, note } : b));
  }, [setBookmarks]);

  const moveToCollection = useCallback((bookmarkId, collectionId) => {
    setBookmarks(prev => prev.map(b => b.id === bookmarkId ? { ...b, collectionId } : b));
  }, [setBookmarks]);

  const togglePin = useCallback((id) => {
    setBookmarks(prev => prev.map(b => b.id === id ? { ...b, pinned: !b.pinned } : b));
  }, [setBookmarks]);

  const restoreBookmarks = useCallback((items) => {
    setBookmarks(prev => {
      const merged = [...prev];
      for (const bm of items) {
        if (!merged.some(b => b.id === bm.id)) merged.unshift(bm);
      }
      return merged;
    });
  }, [setBookmarks]);

  const bulkRemove = useCallback((ids) => {
    setBookmarks(prev => prev.filter(b => !ids.has(b.id)));
  }, [setBookmarks]);

  const bulkMoveToCollection = useCallback((ids, collectionId) => {
    setBookmarks(prev => prev.map(b => ids.has(b.id) ? { ...b, collectionId } : b));
  }, [setBookmarks]);

  const clearBookmarks = useCallback(() => setBookmarks([]), [setBookmarks]);

  /* ─── Collections CRUD ──────────────────────────────── */

  const addCollection = useCallback((name, emoji = '📂') => {
    const col = { id: `col:${Date.now()}`, name, emoji, createdAt: Date.now() };
    setCollections(prev => [...prev, col]);
    return col.id;
  }, [setCollections]);

  const removeCollection = useCallback((id) => {
    setCollections(prev => prev.filter(c => c.id !== id));
    setBookmarks(prev => prev.map(b => b.collectionId === id ? { ...b, collectionId: null } : b));
  }, [setCollections, setBookmarks]);

  const updateCollection = useCallback((id, updates) => {
    setCollections(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, [setCollections]);

  /* ─── Export / Import ───────────────────────────────── */

  const exportBookmarks = useCallback(() => {
    const payload = { version: 2, exportedAt: Date.now(), bookmarks, collections };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `meerath-bookmarks-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [bookmarks, collections]);

  const importBookmarks = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.bookmarks) {
            setBookmarks(prev => {
              const merged = [...prev];
              for (const bm of data.bookmarks) {
                if (!merged.some(b => b.id === bm.id)) merged.push(bm);
              }
              return merged;
            });
          }
          if (data.collections) {
            setCollections(prev => {
              const merged = [...prev];
              for (const col of data.collections) {
                if (!merged.some(c => c.id === col.id)) merged.push(col);
              }
              return merged;
            });
          }
          resolve();
        } catch {
          reject(new Error('الملف غير صالح'));
        }
      };
      reader.onerror = () => reject(new Error('فشل قراءة الملف'));
      reader.readAsText(file);
    });
  }, [setBookmarks, setCollections]);

  /* ─── Share helpers ─────────────────────────────────── */

  const shareBookmark = useCallback(async (bookmark) => {
    let url  = window.location.origin;
    let text = '';
    if (bookmark.type === 'verse') {
      url  += `/quran/${bookmark.data.surahNumber}?ayah=${bookmark.data.ayahNumber}`;
      text  = bookmark.data.arabic;
    }
    if (navigator.share) {
      try { await navigator.share({ url, text }); return; } catch { /* fall through */ }
    }
    await navigator.clipboard.writeText(url);
    return 'copied';
  }, []);

  return {
    bookmarks,
    collections,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    updateNote,
    moveToCollection,
    togglePin,
    restoreBookmarks,
    bulkRemove,
    bulkMoveToCollection,
    clearBookmarks,
    addCollection,
    removeCollection,
    updateCollection,
    exportBookmarks,
    importBookmarks,
    shareBookmark,
  };
};

export default useBookmarks;
