

"use client";

import { useState } from "react";
import styles from "./QuickSearch.module.css"; 


interface QuickSearchProps {
  onSearch?: (query: string) => void; 
}

export default function QuickSearch({ onSearch }: QuickSearchProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() === "") return;
    
   
    if (onSearch) {
     
      onSearch(query.trim());
    } else {
     
      window.location.href = `/search?query=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <form onSubmit={handleSearch} className={styles.quickSearch}>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">
        Search
      </button>
    </form>
  );
}