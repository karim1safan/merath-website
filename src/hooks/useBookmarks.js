import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { STORAGE_KEYS } from '../constants';

const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useLocalStorage(STORAGE_KEYS.BOOKMARKS, []);

  const addBookmark = useCallback(
    (question) => {
      setBookmarks((prev) => {
        if (prev.some((q) => q.id === question.id)) return prev;
        return [...prev, question];
      });
    },
    [setBookmarks]
  );

  const removeBookmark = useCallback(
    (questionId) => {
      setBookmarks((prev) => prev.filter((q) => q.id !== questionId));
    },
    [setBookmarks]
  );

  const toggleBookmark = useCallback(
    (question) => {
      setBookmarks((prev) => {
        const exists = prev.some((q) => q.id === question.id);
        if (exists) return prev.filter((q) => q.id !== question.id);
        return [...prev, question];
      });
    },
    [setBookmarks]
  );

  const isBookmarked = useCallback(
    (questionId) => bookmarks.some((q) => q.id === questionId),
    [bookmarks]
  );

  const clearBookmarks = useCallback(() => {
    setBookmarks([]);
  }, [setBookmarks]);

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    clearBookmarks,
  };
};

export default useBookmarks;
