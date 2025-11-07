
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";
import QuickSearch from "./QuickSearch";

type MenuName = "explore" | "community" | "support" | "profile" | "signin" | null;
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

        <li className={styles.dropdown}>
          <span
            onClick={() => toggleMenu("explore")}
            className={openMenu === "explore" ? styles.open : ""}
          >
            Explore
          </span>
          {openMenu === "explore" && (
            <div className={styles.dropdownMenu}>
              <Link href="/explore/genre">By Genre</Link>
              <Link href="/explore/year">By Year</Link>
              <Link href="/explore/awards">By Awards</Link>

              <div
                className={styles.hasSubmenu}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSubMenu("sortOptions");
                }}
              >
                <a href="#">Sort Options</a>
                {openSubMenu === "sortOptions" && (
                  <div className={styles.dropdownMenu}>
                    <Link href="/explore/sort/popular">Most Popular</Link>
                    <Link href="/explore/sort/newest">Newest</Link>
                    <Link href="/explore/sort/rated">Highest Rated</Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </li>

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

