import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { STORAGE_KEYS } from '../constants';

const useQuranBookmarks = () => {
  const [quranBookmarks, setQuranBookmarks] = useLocalStorage(STORAGE_KEYS.QURAN_BOOKMARKS, []);

  const addQuranBookmark = useCallback(
    (verse) => {
      // verse expects structure: { id, arabic, surahName, surahNumber, ayahNumber, audioUrl }
      setQuranBookmarks((prev) => {
        if (prev.some((b) => b.id === verse.id)) return prev;
        return [...prev, verse];
      });
    },
    [setQuranBookmarks]
  );

  const removeQuranBookmark = useCallback(
    (verseId) => {
      setQuranBookmarks((prev) => prev.filter((b) => b.id !== verseId));
    },
    [setQuranBookmarks]
  );

  const toggleQuranBookmark = useCallback(
    (verse) => {
      setQuranBookmarks((prev) => {
        const exists = prev.some((b) => b.id === verse.id);
        if (exists) return prev.filter((b) => b.id !== verse.id);
        return [...prev, verse];
      });
    },
    [setQuranBookmarks]
  );

  const isQuranBookmarked = useCallback(
    (verseId) => quranBookmarks.some((b) => b.id === verseId),
    [quranBookmarks]
  );

  const clearQuranBookmarks = useCallback(() => {
    setQuranBookmarks([]);
  }, [setQuranBookmarks]);

  return {
    quranBookmarks,
    addQuranBookmark,
    removeQuranBookmark,
    toggleQuranBookmark,
    isQuranBookmarked,
    clearQuranBookmarks,
  };
};

export default useQuranBookmarks;
