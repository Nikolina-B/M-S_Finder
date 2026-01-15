

"use client";

import { useState,useRef,useEffect } from "react";
import styles from "./QuickSearch.module.css"; 
import { HiOutlineSearch } from "react-icons/hi";


interface QuickSearchProps {
  onSearch?: (query: string) => void; 
}

export default function QuickSearch({ onSearch }: QuickSearchProps) {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() === "") return;
    
   
    if (onSearch) {
     
      onSearch(query.trim());
    } else {
     
      window.location.href = `/search?query=${encodeURIComponent(query.trim())}`;
    }
  };

useEffect (()=>{
      if(isExpanded && inputRef.current){
            inputRef.current.focus();
      }
},[isExpanded]);

  return (
    <form 
      onSubmit={handleSearch} 
      className={`${styles.quickSearch} ${isExpanded ? styles.expanded : ""}`}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
  
      <input
        ref={inputRef}
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
       className={styles.searchInput}
        // Zatvaranje kad klikneš vani (ako je polje prazno)
        onBlur={() => {
          if (query.trim() === "") {
            setIsExpanded(false);
          }
      }}
      />
      <HiOutlineSearch 
      className={styles.icon} 
      />
{/*       <button type="submit">
        Search
      </button> */}
    </form>
  );
}