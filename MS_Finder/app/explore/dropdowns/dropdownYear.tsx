"use client";

import { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import styles from "../explore.module.css";

interface DropdownYearProps {
  YEAR: string[];
  yearFilter: string;
  setYearFilter: (value: string) => void;
}

export default function DropdownYear({
  YEAR,
  yearFilter,
  setYearFilter: setYearFilter,
}: DropdownYearProps) {

  const [open, setOpen] = useState(false);

  return (
    <div className={styles.FilterContainer}>
      
      <div className={styles.dropdownWrapper}>
        
        <button
          className={styles.dropdownToggle}
          onClick={() => setOpen(!open)}
        >
          {yearFilter || "2026"}
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
          {YEAR.map((e) => (
            <button
              key={e}
              className={`${styles.dropdownItem} ${
                yearFilter === e ? styles.activeItem : ""
              }`}
              onClick={() => {
                setYearFilter(e);
                setOpen(false);
              }}
            >
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
