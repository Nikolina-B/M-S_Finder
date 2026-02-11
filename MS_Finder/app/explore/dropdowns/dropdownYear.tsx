"use client";

import { useState, useEffect, useRef } from "react";
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    
        <div className={styles.FilterContainer} ref={dropdownRef}>
          
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
            <div className={`${styles.customDropdown} ${styles.scrollableDropdown}`}>
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
