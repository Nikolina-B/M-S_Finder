
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import styles from "./Navbar.module.css";
import Image from "next/image";
import { HiMenu, HiX } from "react-icons/hi";
import { authClient } from "@/app/lib/auth/auth-client";
import { CgProfile } from "react-icons/cg";
import { PiSignOutBold } from "react-icons/pi";

type MenuName = "profile" | "signin" | null;

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuName>(null);
  const [userImage, setUserImage] = useState<string | null>(null); 
  const router = useRouter();
  const pathname = usePathname();

  const closeMenu = () => setIsMenuOpen(false);

  const toggleMenu = (menuName: MenuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

 
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

 const loadAvatar = useCallback(() => {
    
    if (session?.user?.image) {
      setUserImage(session.user.image);
      return;
    }

  
    const stored = localStorage.getItem("userProfile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.avatar) {
          setUserImage(parsed.avatar);
          return;
        }
      } catch (e) {
        console.error("Greška pri čitanju localStoraga:", e);
      }
    }
    
    setUserImage(null);
  }, [session?.user?.image]);

  useEffect(() => {
    loadAvatar();

    
    window.addEventListener("storage", loadAvatar);
    window.addEventListener("profileUpdated", loadAvatar);

    return () => {
      window.removeEventListener("storage", loadAvatar);
      window.removeEventListener("profileUpdated", loadAvatar);
    };
  }, [loadAvatar]);

  const handleActualSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.navbar}`)) {
        setIsMenuOpen(false);
        setOpenMenu(null);
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
            <Image 
              src="/logo1.png" 
              alt="M&S Finder Logo" 
              width={70} 
              height={70}
              className={styles.logoStyle} 
            />
          </Link>
        </div>

        <ul className={styles.center}>
          <li>
            <Link href="/" className={pathname === "/" ? styles.active : ""}>Home</Link>
          </li>
          <li>
            <Link href="/explore" className={pathname.startsWith("/explore")  ? styles.active : ""}>Explore</Link>
          </li>
          <li>
            <Link href="/community" className={pathname === "/community" ? styles.active : ""}>Community</Link>
          </li>
          <li>
            <Link href="/support" className={pathname === "/support" ? styles.active : ""}>Support</Link>
          </li>
        </ul>

        <div className={styles.right}>
          <div className={styles.authButtons}>
            {isPending ? (
              <div className={styles.avatarPlaceholder} />
            ) : session ? (
              <div className={styles.userProfileWrapper} onClick={() => toggleMenu("profile")}>
                <div className={styles.avatarCircle}>
                  {userImage ? (
                    <img 
                      key={userImage}
                      src={userImage} 
                      alt="Avatar" 
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                  ) : (
                    getInitials(session.user.name)
                  )}
                </div>
                
                {openMenu === "profile" && (
                  <div className={styles.dropdownMenu}>
                    <div className={styles.dropdownHeader}>
                      <p className={styles.userName}>{session.user.name}</p>
                    </div>
                    <hr />
                    <Link href="/profile" onClick={() => setOpenMenu(null)} className={styles.menuItem}>
                      <CgProfile className={styles.menuIcon} />
                      <span>My Profile</span>
                    </Link>
                    <button onClick={handleActualSignOut} className={`${styles.menuItem} ${styles.signOutLink}`}>
                      <PiSignOutBold className={styles.menuIcon} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/signin">
                <button className={`${styles.signInBtn} ${pathname === "/signin" ? styles.activePage : ""}`}>
                  Sign In
                </button>
              </Link>
            )}
          </div>
          
          <div className={styles.hamburger} onClick={() => setIsMenuOpen(true)}>
            <HiMenu />
          </div>
        </div>
      </nav>

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

