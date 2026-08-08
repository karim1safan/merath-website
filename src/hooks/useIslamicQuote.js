import { useState } from "react";
import quotes from "../data/quotes.json";

const useIslamicQuote = () => {
  const [quote] = useState(() => {
    const index = Math.floor(Math.random() * quotes.length);
    return quotes[index];
  });

  return { quote, loading: false, error: null };
};

export default useIslamicQuote;
