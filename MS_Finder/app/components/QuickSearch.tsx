

"use client";

import { useState } from "react";
import styles from "./QuickSearch.module.css"; 
import { HiOutlineSearch } from "react-icons/hi";


interface QuickSearchProps {
  onSearch?: (query: string) => void; 
 
}

export default function QuickSearch({ onSearch}: QuickSearchProps) {
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
        className={styles.searchInput}
      />
      <HiOutlineSearch 
      className={styles.icon} 
      />
    </form>
  );
}