
// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import styles from "./Navbar.module.css";
// import QuickSearch from "./QuickSearch";
// import Image from "next/image";
// import { HiMenu, HiX } from "react-icons/hi"; // Ikone za hamburger

// // Ovdje ostavljamo samo "profile" i "signin" jer jedino oni imaju dropdown
// type MenuName = "profile" | "signin" | null;

// export default function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [openMenu, setOpenMenu] = useState<MenuName>(null);
//   const router = useRouter();

//   // Zatvori menu kad se klikne na link
//   const closeMenu = () => setIsMenuOpen(false);

//   const toggleMenu = (menuName: MenuName) => {
//     setOpenMenu(openMenu === menuName ? null : menuName);
//   };

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
//         setIsMenuOpen(false);
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   return (
//     <>
//     <nav className={styles.navbar}>
//       <div className={styles.left}>
//         <Link href="/" className={styles.logo}>
//         <Image 
//       src="/logo1.png"         
//       alt="M&S Finder Logo" 
//       width={70}             
//       height={70}             
                    
//     />
//         </Link>
//       </div>

//       {/* CENTER MENU */}
//       <ul className={styles.center}>
//           <li><Link href="/">Home</Link></li>
//           <li><Link href="/explore">Explore</Link></li>
//           <li><Link href="/community">Community</Link></li>
//           <li><Link href="/support">Support</Link></li>
//         </ul>

//    {/* PROFILE DROPDOWN */}
//       {/* <div className={styles.right}>
     
//         <div className={styles.dropdown}>
//           <button onClick={() => toggleMenu("profile")}>Profile ▾</button>
//           {openMenu === "profile" && (
//             <div className={styles.dropdownMenu}>
//               <Link href="/profile/watchlist" onClick={() => setOpenMenu(null)}>Watchlist</Link>
//               <Link href="/profile/favorites" onClick={() => setOpenMenu(null)}>Favorites</Link>
//               <Link href="/profile/edit-profile" onClick={() => setOpenMenu(null)}>Edit Profile</Link>
//             </div>
//           )}
//         </div> */}
//         <div className={styles.right}>
     
//         <div className={styles.searchWrapper}>
//           <QuickSearch />
//         </div>

//         <div className={styles.authButtons}>
//           <Link href="/signin">
//             <button className={styles.signInBtn}>Sign In</button>
//           </Link>
//         </div>
//        <div
//             className={styles.hamburger}
//             onClick={() => setIsMenuOpen(true)}
//           >
//             <HiMenu />
//         </div>
//         {/* SIGN IN / SIGN OUT DROPDOWN */}
//         {/* <div className={styles.dropdown}>
//           <button onClick={() => toggleMenu("signin")}>Sign In ▾</button>
//           {openMenu === "signin" && (
//             <div className={styles.dropdownMenu}>
//               <Link href="/signin" onClick={() => setOpenMenu(null)}>Sign In</Link>
//               <button onClick={handleSignOut} className={styles.logoutBtn}>Sign Out</button>
//             </div>
//           )}
//         </div> */}
//       </div>
//     </nav>
//  {/* SIDEBAR */}
//       {isMenuOpen && (
//         <div className={styles.sidebar}>
//           <div className={styles.closeIcon} onClick={closeMenu}>
//             <HiX />
//           </div>

//           <Link href="/" onClick={closeMenu}>Home</Link>
//           <Link href="/explore" onClick={closeMenu}>Explore</Link>
//           <Link href="/community" onClick={closeMenu}>Community</Link>
//           <Link href="/support" onClick={closeMenu}>Support</Link>
//         </div>
//       )}
//     </>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // Dodaj usePathname
import styles from "./Navbar.module.css";
import QuickSearch from "./QuickSearch";
import Image from "next/image";
import { HiMenu, HiX } from "react-icons/hi";

type MenuName = "profile" | "signin" | null;

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuName>(null);
  const router = useRouter();
  const pathname = usePathname(); // Inicijalizuj pathname

  const closeMenu = () => setIsMenuOpen(false);

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
        setIsMenuOpen(false);
        setOpenMenu(null); // Zatvori i dropdownove
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            <Image src="/logo1.png" alt="M&S Finder Logo" width={70} height={70} />
          </Link>
        </div>

        {/* CENTER MENU - Sa aktivnim linkovima */}
        <ul className={styles.center}>
          <li>
            <Link href="/" className={pathname === "/" ? styles.active : ""}>Home</Link>
          </li>
          <li>
            <Link href="/explore" className={pathname === "/explore" ? styles.active : ""}>Explore</Link>
          </li>
          <li>
            <Link href="/community" className={pathname === "/community" ? styles.active : ""}>Community</Link>
          </li>
          <li>
            <Link href="/support" className={pathname === "/support" ? styles.active : ""}>Support</Link>
          </li>
        </ul>

        <div className={styles.right}>
          <div className={styles.searchWrapper}>
            <QuickSearch />
          </div>

          <div className={styles.authButtons}>
            <Link href="/signin">
              {/* Sign In dugme dobija aktivnu klasu ako si na toj stranici */}
              <button className={`${styles.signInBtn} ${pathname === "/signin" ? styles.activePage : ""}`}>
                Sign In
              </button>
            </Link>
          </div>
          
          <div className={styles.hamburger} onClick={() => setIsMenuOpen(true)}>
            <HiMenu />
          </div>
        </div>
      </nav>

      {/* SIDEBAR - Takođe dodat aktivni stil */}
      {isMenuOpen && (
        <div className={styles.sidebar}>
          <div className={styles.closeIcon} onClick={closeMenu}>
            <HiX />
          </div>
          <Link href="/" onClick={closeMenu} className={pathname === "/" ? styles.active : ""}>Home</Link>
          <Link href="/explore" onClick={closeMenu} className={pathname === "/explore" ? styles.active : ""}>Explore</Link>
          <Link href="/community" onClick={closeMenu} className={pathname === "/community" ? styles.active : ""}>Community</Link>
          <Link href="/support" onClick={closeMenu} className={pathname === "/support" ? styles.active : ""}>Support</Link>
        </div>
      )}
    </>
  );
}
