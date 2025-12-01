import { useState, useMemo } from "react";

export function useSearch(items, searchFields) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) {
      return items;
    }

    const lowerQuery = query.toLowerCase();
    return items.filter((item) => {
      const searchText = typeof searchFields === 'function' 
        ? searchFields(item) 
        : '';
      return searchText.toLowerCase().includes(lowerQuery);
    });
  }, [query, items, searchFields]);

  return { query, setQuery, filtered };
}