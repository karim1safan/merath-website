import { useState, useMemo } from "react";
import quotes from "../data/quotes.json";

const useIslamicQuote = () => {
  const quote = useMemo(() => {
    const index = Math.floor(Math.random() * quotes.length);
    return quotes[index];
  }, []);

  return { quote, loading: false, error: null };
};

export default useIslamicQuote;
