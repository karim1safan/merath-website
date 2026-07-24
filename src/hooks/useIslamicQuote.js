import { useState, useEffect } from "react";

const API_URL =
  "https://quotes.api.islamic.network/v1/quotes/random?language=ar";

const useIslamicQuote = () => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadQuote() {
      try {
        const res = await fetch(API_URL);
        const json = await res.json();

        if (json.code !== 200 || !json.data) {
          throw new Error("Failed to fetch quote");
        }

        const { data } = json;
        const arabic = data.translations?.ar?.text || "";
        const authorName = data.author?.name?.ar || "";
        const authorHonorific = data.author?.honorific?.ar || "";
        const author = authorHonorific
          ? `${authorName}، ${authorHonorific}`
          : authorName;

        if (!cancelled) {
          setQuote({ arabic, author });
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    loadQuote();
    return () => {
      cancelled = true;
    };
  }, []);

  return { quote, loading, error };
};

export default useIslamicQuote;
