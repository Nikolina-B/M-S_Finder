"use client";

import { useState } from "react";
import styles from "./QuickSearch.module.css";

export default function QuickSearch() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    window.location.href = `/search?query=${encodeURIComponent(query)}`;
  };

  return (
    <form onSubmit={handleSearch} className={styles.quickSearch}>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}
