import { useState, useEffect, useMemo } from 'react';
import personalities from '../data/personalities';

const markdownModules = import.meta.glob('../data/personalities/*.md', {
  query: '?raw',
  import: 'default',
});

export function usePersonalities() {
  return { personalities, loading: false };
}

export function usePersonality(id) {
  const personality = useMemo(
    () => personalities.find((p) => p.id === id) || null,
    [id]
  );

  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const loading = !personality ? false : !content && !error;

  useEffect(() => {
    if (!personality) return;

    let cancelled = false;
    const mdKey = `../data/personalities/${id}.md`;
    const loader = markdownModules[mdKey];

    if (!loader) return;

    loader()
      .then((md) => {
        if (!cancelled) setContent(md);
      })
      .catch(() => {
        if (!cancelled) setError('خطأ في تحميل المحتوى');
      });

    return () => {
      cancelled = true;
    };
  }, [id, personality]);

  return { personality, content, loading, error };
}
