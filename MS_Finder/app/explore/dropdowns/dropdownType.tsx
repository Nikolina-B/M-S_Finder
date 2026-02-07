"use client";

import { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import styles from "../explore.module.css";

interface DropdownTypeProps {
  TYPE: string[];
typeFilter: string;
  setTypeFilter: (value: string) => void;
}

export default function DropdownType({
  TYPE,
  typeFilter,
  setTypeFilter: setTypeFilter,
}: DropdownTypeProps) {

  const [open, setOpen] = useState(false);

  return (
    <div className={styles.FilterContainer}>
      
      <div className={styles.dropdownWrapper}>
        
        <button
          className={styles.dropdownToggle}
          onClick={() => setOpen(!open)}
        >
          {typeFilter || "All"}
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
          {TYPE.map((g) => (
            <button
              key={g}
              className={`${styles.dropdownItem} ${
                typeFilter === g ? styles.activeItem : ""
              }`}
              onClick={() => {
                setTypeFilter(g);
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
