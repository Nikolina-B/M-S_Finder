
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";
import QuickSearch from "./QuickSearch";

type MenuName = "community" | "support" | "profile" | "signin" | null; // Uklonjeno "explore"
type SubMenuName = "sortOptions" | null;

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<MenuName>(null);
  const [openSubMenu, setOpenSubMenu] = useState<SubMenuName>(null);

  const toggleMenu = (menuName: MenuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
    setOpenSubMenu(null);
  };

  const toggleSubMenu = (subMenuName: SubMenuName) => {
    setOpenSubMenu(openSubMenu === subMenuName ? null : subMenuName);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.navbar}`)) {
        setOpenMenu(null);
        setOpenSubMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className={styles.navbar}>
      
      <div className={styles.left}>
        <Link href="/" className={styles.logo}>
          M&S Finder
        </Link>
      </div>

      
      <ul className={styles.center}>
        <li><Link href="/">Home</Link></li>

        {/* PROMJENA: "Explore" je sada samo direktan link na /explore */}
        <li>
          <Link href="/explore">
            Explore
          </Link>
        </li>
        {/*
        Ako želite da podopcije "By Genre", "By Year" itd.
        budu dostupne, morat ćete ih postaviti na drugu stavku
        izbornika (ili zadržati padajući izbornik na Explore stranici).
        */}

        <li className={styles.dropdown}>
          <span
            onClick={() => toggleMenu("community")}
            className={openMenu === "community" ? styles.open : ""}
          >
            Community
          </span>
          {openMenu === "community" && (
            <div className={styles.dropdownMenu}>
              <Link href="/community/reviews">Reviews & Comments</Link>
            </div>
          )}
        </li>

        <li className={styles.dropdown}>
          <span
            onClick={() => toggleMenu("support")}
            className={openMenu === "support" ? styles.open : ""}
          >
            Support
          </span>
          {openMenu === "support" && (
            <div className={styles.dropdownMenu}>
              <Link href="/support/about">About Us</Link>
              <Link href="/support/contact">Contact Us</Link>
            </div>
          )}
        </li>

        
        <li>
          <QuickSearch />
        </li>
      </ul>

      
      <div className={styles.right}>
        <div className={styles.dropdown}>
          <button onClick={() => toggleMenu("profile")}>Profile ▾</button>
          {openMenu === "profile" && (
            <div className={styles.dropdownMenu}>
              <Link href="/profile/watchlist">Watchlist</Link>
              <Link href="/profile/favorites">Favorites</Link>
              <Link href="/profile/edit">Edit Profile</Link>
              <Link href="/logout">Logout</Link>
            </div>
          )}
        </div>

        <div className={styles.dropdown}>
          <button onClick={() => toggleMenu("signin")}>Sign In ▾</button>
          {openMenu === "signin" && (
            <div className={styles.dropdownMenu}>
              <Link href="/signin">Sign In</Link>
              <Link href="/logout">Sign Out</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

// VAŽNA NAPOMENA:
// Vaša komponenta ExplorePage trebala bi biti u zasebnoj datoteci 
// (npr. u app/explore/page.tsx ili pages/explore.js)
// Ne smije se nalaziti u istoj datoteci kao Navbar.
// Ovdje je samo ostavljena radi podsjetnika.

/*
export default function ExplorePage() {
  return (
    <div>
      <h1>Explore Page</h1>
      <p></p>
    </div>
  );
}
*/