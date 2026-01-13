
// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import styles from "./Navbar.module.css";
// import QuickSearch from "./QuickSearch";

// type MenuName = "community" | "support" | "profile" | "signin" | null;
// type SubMenuName = "sortOptions" | null;

// export default function Navbar() {
//   const [openMenu, setOpenMenu] = useState<MenuName>(null);
//   const [openSubMenu, setOpenSubMenu] = useState<SubMenuName>(null);
//   const router = useRouter();

//   const toggleMenu = (menuName: MenuName) => {
//     setOpenMenu(openMenu === menuName ? null : menuName);
//     setOpenSubMenu(null);
//   };

//   // Funkcija za odjavu
//   const handleSignOut = (e: React.MouseEvent) => {
//     e.preventDefault();
//     const confirmLogout = window.confirm("Are you sure you want to sign out?");
//     if (confirmLogout) {
//       setOpenMenu(null);
//       router.push("/"); 
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const target = event.target as HTMLElement;
//       if (!target.closest(`.${styles.navbar}`)) {
//         setOpenMenu(null);
//         setOpenSubMenu(null);
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   return (
//     <nav className={styles.navbar}>
//       <div className={styles.left}>
//         <Link href="/" className={styles.logo}>M&S Finder</Link>
//       </div>

//       <ul className={styles.center}>
//         <li><Link href="/">Home</Link></li>
//         <li><Link href="/explore">Explore</Link></li>

//         <li className={styles.dropdown}>
//           <span onClick={() => toggleMenu("community")} className={openMenu === "community" ? styles.open : ""}>
//             Community
//           </span>
//           {openMenu === "community" && (
//             <div className={styles.dropdownMenu}>
//               <Link href="/community/reviews" onClick={() => setOpenMenu(null)}>Reviews & Comments</Link>
//             </div>
//           )}
//         </li>

//         {/* <li className={styles.dropdown}>
//           <span onClick={() => toggleMenu("support")} className={openMenu === "support" ? styles.open : ""}>
//             Support
//           </span>
//           {openMenu === "support" && (
//             <div className={styles.dropdownMenu}>
//               <Link href="/support/about" onClick={() => setOpenMenu(null)}>About Us</Link>
//               <Link href="/support/contact" onClick={() => setOpenMenu(null)}>Contact Us</Link>
//             </div>
//           )}
//         </li> */}
//         <li>
//   <Link href="/support" onClick={() => setOpenMenu(null)}>
//     Support
//   </Link>
// </li>

//         <li><QuickSearch /></li>
//       </ul>

//       <div className={styles.right}>
//         {/* PROFILE */}
//         <div className={styles.dropdown}>
//           <button onClick={() => toggleMenu("profile")}>Profile ▾</button>
//           {openMenu === "profile" && (
//             <div className={styles.dropdownMenu}>
//               <Link href="/profile/watchlist" onClick={() => setOpenMenu(null)}>Watchlist</Link>
//               <Link href="/profile/favorites" onClick={() => setOpenMenu(null)}>Favorites</Link>
//               <Link href="/profile/edit-profile" onClick={() => setOpenMenu(null)}>
//     Edit Profile
//   </Link>
//               {/* <Link href="/profile/edit" onClick={() => setOpenMenu(null)}>Edit Profile</Link> */}
//               {/* <button onClick={handleSignOut} className={styles.logoutBtn}>Logout</button> */}
//             </div>
//           )}
//         </div>

//         {/* SIGN IN / SIGN OUT */}
//         <div className={styles.dropdown}>
//           <button onClick={() => toggleMenu("signin")}>Sign In ▾</button>
//           {openMenu === "signin" && (
//             <div className={styles.dropdownMenu}>
//               <Link href="/signin" onClick={() => setOpenMenu(null)}>Sign In</Link>
//               {/* Ovdje je gumb za odjavu koji ne baca 404 */}
//               <button onClick={handleSignOut} className={styles.logoutBtn}>Sign Out</button>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Navbar.module.css";
import QuickSearch from "./QuickSearch";

// Ovdje ostavljamo samo "profile" i "signin" jer jedino oni imaju dropdown
type MenuName = "profile" | "signin" | null;

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<MenuName>(null);
  const router = useRouter();

  const toggleMenu = (menuName: MenuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    const confirmLogout = window.confirm("Are you sure you want to sign out?");
    if (confirmLogout) {
      setOpenMenu(null);
      router.push("/"); 
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.navbar}`)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link href="/" className={styles.logo}>M&S Finder</Link>
      </div>

      <ul className={styles.center}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/explore">Explore</Link></li>

        {/* COMMUNITY - Sad je običan link, nema više span-a i toggleMenu-a */}
        <li>
          <Link href="/community" onClick={() => setOpenMenu(null)}>
            Community
          </Link>
        </li>

        {/* SUPPORT - Sad je običan link */}
        <li>
          <Link href="/support" onClick={() => setOpenMenu(null)}>
            Support
          </Link>
        </li>

        <li><QuickSearch /></li>
      </ul>

      <div className={styles.right}>
        {/* PROFILE DROPDOWN */}
        <div className={styles.dropdown}>
          <button onClick={() => toggleMenu("profile")}>Profile ▾</button>
          {openMenu === "profile" && (
            <div className={styles.dropdownMenu}>
              <Link href="/profile/watchlist" onClick={() => setOpenMenu(null)}>Watchlist</Link>
              <Link href="/profile/favorites" onClick={() => setOpenMenu(null)}>Favorites</Link>
              <Link href="/profile/edit-profile" onClick={() => setOpenMenu(null)}>Edit Profile</Link>
            </div>
          )}
        </div>

        {/* SIGN IN / SIGN OUT DROPDOWN */}
        <div className={styles.dropdown}>
          <button onClick={() => toggleMenu("signin")}>Sign In ▾</button>
          {openMenu === "signin" && (
            <div className={styles.dropdownMenu}>
              <Link href="/signin" onClick={() => setOpenMenu(null)}>Sign In</Link>
              <button onClick={handleSignOut} className={styles.logoutBtn}>Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
