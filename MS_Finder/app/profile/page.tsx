
"use client";

import Link from "next/link";
import styles from "./profile.module.css";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { authClient } from "@/app/lib/auth/auth-client";
import { LuUserRound, LuBookmark } from "react-icons/lu";
import { HiOutlineFilm } from "react-icons/hi";
import { FaChevronRight } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { RiUserCommunityLine } from "react-icons/ri";


export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
 
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  //avatar iz localStorage
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);


  const [watchlistCount, setWatchlistCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);


  useEffect(() => {
    setIsMounted(true);

    const fetchCounts = async () => {
      try {
        // Paralelno dohvaćamo ID-ove iz tvojih ruta
        const [resWatchlist, resFavorites] = await Promise.all([
          fetch("/api/watchlist/ids"),
          fetch("/api/favorites/ids"), 
        ]);

        if (resWatchlist.ok) {
          const ids = await resWatchlist.json();
          setWatchlistCount(Array.isArray(ids) ? ids.length : 0);
        }

        if (resFavorites.ok) {
          const ids = await resFavorites.json();
          setFavoritesCount(Array.isArray(ids) ? ids.length : 0);
        }
      } catch (error) {
        console.error("Greška pri dohvaćanju broja stavki:", error);
      }
    };

    if (session) {
      fetchCounts();
    }
  }, [session]);

  if (isPending) return <p>Loading...</p>;
  // učitavanje avatara + slušanje promjena iz Edit Profile
  useEffect(() => {
    const loadAvatar = () => {
      const stored = localStorage.getItem("userProfile");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setLocalAvatar(parsed.avatar || null);
        } catch (e) {
          console.error("Greška kod učitavanja avatara", e);
        }
      }
    };

    loadAvatar();
    window.addEventListener("profileUpdated", loadAvatar);

    return () => {
      window.removeEventListener("profileUpdated", loadAvatar);
    };
  }, []);
    

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };


  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.content}>

          {/* PROFILE HEADER */}
          <div className={styles.profileHeader}>
            <div className={styles.avatarWrapper}>
              <div
                onClick={handleAvatarClick}
                role="button"
                className={styles.avatar}
              >
                {localAvatar ? (
                  <img
                    src={localAvatar}
                    alt="avatar"
                    className={styles.avatarImage}
                  />
                ) : session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="avatar"
                    className={styles.avatarImage}
                  />
                ) : (
                  <LuUserRound size={48} className={styles.avatarIcon} />
                )}
              </div>

              <div className={styles.avatarBadge}>
                <HiOutlineFilm className={styles.avatarBadgeIcon} />
              </div>
            </div>

            <div className={styles.profileInfo}>
              <h1 className={styles.profileName}>
                {session?.user?.name ?? "unknown user"}
              </h1>
              <p className={styles.profileEmail}>
                {session?.user?.email ?? "no email"}
              </p>

              <div className={styles.profileStats}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{isMounted ? watchlistCount : 0}</span>

                  <span className={styles.statLabel}>Watchlist</span>
                </div>
                <div className={styles.stat}>
                <span className={styles.statValue}>{isMounted ? favoritesCount : 0}</span>

                  <span className={styles.statLabel}>Favorites</span>
                </div>
              </div>
            </div>
          </div>
    


          {/* MENU CARD */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>My Library</h2>

            <ul className={styles.menuList}>
              <li className={styles.menuItem}>
                <Link href="/profile/watchlist" className={styles.menuLink}>
                  <div className={styles.menuIconWrapper}>
                    <LuBookmark className={styles.menuIcon} />
                  </div>
                  <div className={styles.menuContent}>
                    <p className={styles.menuTitle}>Watchlist</p>
                    <p className={styles.menuDescription}>
                      Movies and shows you want to watch
                    </p>
                  </div>
                  <FaChevronRight className={styles.menuArrow} />
                </Link>
              </li>

              <li className={styles.menuItem}>
                <Link href="/profile/favorites" className={styles.menuLink}>
                  <div className={styles.menuIconWrapper}>
                    <FaRegHeart className={styles.menuIcon} />
                  </div>
                  <div className={styles.menuContent}>
                    <p className={styles.menuTitle}>Favorites</p>
                    <p className={styles.menuDescription}>
                      Your favorite movies and shows
                    </p>
                  </div>
                  <FaChevronRight className={styles.menuArrow} />
                </Link>
              </li>

              <li className={styles.menuItem}>
                <Link href="/profile/edit-profile" className={styles.menuLink}>
                  <div className={styles.menuIconWrapper}>
                    <LuUserRound className={styles.menuIcon} />
                  </div>
                  <div className={styles.menuContent}>
                    <p className={styles.menuTitle}>Edit Profile</p>
                    <p className={styles.menuDescription}>
                      Update your personal information
                    </p>
                  </div>
                  <FaChevronRight className={styles.menuArrow} />
                </Link>
              </li>
              <li className={styles.menuItem}>
                <Link href="/profile/myCommunites" className={styles.menuLink}>
                  <div className={styles.menuIconWrapper}>
                    < RiUserCommunityLine className={styles.menuIcon} />
                  </div>
                  <div className={styles.menuContent}>
                    <p className={styles.menuTitle}>Communites</p>
                    <p className={styles.menuDescription}>
                      Check your community hubs
                    </p>
                  </div>
                  <FaChevronRight className={styles.menuArrow} />
                </Link>
              </li>
            </ul>
          </div>

          
          
        </div>
      </main>
    </div>
  );
}

