"use client";

import { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import styles from "../explore.module.css";

interface DropdownGenreProps {
  GENRES: string[];
  genreFilter: string;
  setGenreFilter: (value: string) => void;
}

export default function DropdownGenre({
  GENRES,
  genreFilter,
  setGenreFilter,
}: DropdownGenreProps) {

  const [open, setOpen] = useState(false);

  return (
    <div className={styles.FilterContainer}>
      
        <div className={styles.dropdownWrapper}>
          
          <button
            className={styles.dropdownToggle}
            onClick={() => setOpen(!open)}
          >
            {genreFilter || "Genre"}
          </button>

          <span
            className={styles.arrow}
            onClick={() => setOpen(!open)}
          >
            <RiArrowDropDownLine />
          </span>
        </div>
    

      {open && (
        <div className={styles.customDropdown}>
          {GENRES.map((g) => (
            <button
              key={g}
              className={`${styles.dropdownItem} ${
                genreFilter === g ? styles.activeItem : ""
              }`}
              onClick={() => {
                setGenreFilter(g);
                setOpen(false);
              }}
            >
              {g}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
