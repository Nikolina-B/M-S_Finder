
// "use client";
// // export default function ProfilePage() {
// //   return (
// //     <main>
      
// //       <h1>My Profile</h1>
// //       <ul>
// //         <li>Watchlist</li>
// //         <li>Favorites</li>
// //         <li>Edit Profile</li>
// //         <li>Logout</li>
// //       </ul>
// //     </main>
// //   );
// // }
// import Link from "next/link";
// import styles from "./profile.module.css"
// import { useRouter } from "next/navigation";
// import { useRef } from "react";
// import { LuUserRound, LuBookmark } from "react-icons/lu";
// import { HiOutlineFilm } from "react-icons/hi";
// import { IoMdSettings } from "react-icons/io";
// import { FaChevronRight } from "react-icons/fa6";
// import { FaRegHeart } from "react-icons/fa";
// import { FiLogOut } from "react-icons/fi";
// import { authClient } from "@/app/lib/auth/auth-client";


// export default function ProfilePage() {

//   const { data: session, isPending } = authClient.useSession();
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const router = useRouter();

//   const handleLogOut= async () => {
//     await authClient.signOut({
//       fetchOptions: {
//         onSuccess: () => {
//           router.push("/");
//           router.refresh(); // Osvježava stanje da nestane krug
//         },
//       },
//     });
//   }
//   const handleAvatarClick = () => {
//   fileInputRef.current?.click();
// };
//   return (


//     <div className={styles.container}>
//         <main className={styles.main}>
//           <div className={styles.content}>

//               {/* profile header */}
//               <div className={styles.profileHeader}>
//               <div className={styles.avatarWrapper}>
//                 <div onClick={handleAvatarClick} role="button" className={styles.avatar}>
//                   {session?.user?.image ?? <LuUserRound size={48} className={styles.avatarIcon} />}
//                 </div>
//                 <div className={styles.avatarBadge}>
//                   <HiOutlineFilm className={styles.avatarBadgeIcon} />
//                 </div>
//               </div>
//               <div className={styles.profileInfo}>
//                 <h1 className={styles.profileName}>{session?.user?.name ?? "unkonwn user"}</h1>
//                 <p className={styles.profileEmail}>{session?.user?.email ?? "no email" }</p>
//                 <div className={styles.profileStats}>
//                   <div className={styles.stat}>
//                     <span className={styles.statValue}>24</span>
//                     <span className={styles.statLabel}>Watchlist</span>
//                   </div>
//                   <div className={styles.stat}>
//                     <span className={styles.statValue}>12</span>
//                     <span className={styles.statLabel}>Favorites</span>
//                   </div>
                  
//                 </div>
//               </div>
//             </div>

//             {/* Menu Card */}
//             <div className={styles.card}>
//               <h2 className={styles.cardTitle}>
//                 {/* <IoMdSettings className={styles.cardIcon} /> */}
//                 My Library
//               </h2>
//               <ul className={styles.menuList}>
//                 <li className={styles.menuItem}>
//                   <Link href="/profile/watchlist" className={styles.menuLink}>
//                     <div className={styles.menuIconWrapper}>
//                       <LuBookmark className={styles.menuIcon} />
//                     </div>
//                     <div className={styles.menuContent}>
//                       <p className={styles.menuTitle}>Watchlist</p>
//                       <p className={styles.menuDescription}>
//                         Movies and shows you want to watch
//                       </p>
//                     </div>
//                     <FaChevronRight className={styles.menuArrow} />
//                   </Link>
//                 </li>
//                 <li className={styles.menuItem}>
//                   <Link href="/profile/favorites" className={styles.menuLink}>
//                     <div className={styles.menuIconWrapper}>
//                       <FaRegHeart className={styles.menuIcon} />
//                     </div>
//                     <div className={styles.menuContent}>
//                       <p className={styles.menuTitle}>Favorites</p>
//                       <p className={styles.menuDescription}>
//                         Your favorite movies and shows
//                       </p>
//                     </div>
//                     <FaChevronRight className={styles.menuArrow} />
//                   </Link>
//                 </li>
//                 <li className={styles.menuItem}>
//                   <Link href="/profile/edit-profile" className={styles.menuLink}>
//                     <div className={styles.menuIconWrapper}>
//                       <LuUserRound className={styles.menuIcon} />
//                     </div>
//                     <div className={styles.menuContent}>
//                       <p className={styles.menuTitle}>Edit Profile</p>
//                       <p className={styles.menuDescription}>
//                         Update your personal information
//                       </p>
//                     </div>
//                     <FaChevronRight className={styles.menuArrow} />
//                   </Link>
//                 </li>
//               </ul>
//             </div>

//             {/* Logout Button */}
//             {/* <div className={styles.buttonccontent}>
//               <button  onClick={handleLogOut} className={styles.logoutBtn}>
//                 <FiLogOut className={styles.logoutIcon} />
//                 Log Out
//               </button>
//             </div> */}
              
//           </div>
//         </main>
//     </div>
//   );
// }

// //dodat funkciju koja azurira broj dodanih filmova ili serija u watchlistu ili favorites
"use client";

import Link from "next/link";
import styles from "./profile.module.css";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";

import { LuUserRound, LuBookmark } from "react-icons/lu";
import { HiOutlineFilm } from "react-icons/hi";
import { FaChevronRight } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

import { authClient } from "@/app/lib/auth/auth-client";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ avatar iz localStorage
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
  const [watchlistCount, setWatchlistCount] = useState(0);
const [favoritesCount, setFavoritesCount] = useState(0);


  // ✅ učitavanje avatara + slušanje promjena iz Edit Profile
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
useEffect(() => {
  const loadCounts = () => {
    const watchlist = JSON.parse(
      localStorage.getItem("watchlist") || "[]"
    );
    const favorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );

    setWatchlistCount(watchlist.length);
    setFavoritesCount(favorites.length);
  };

  loadCounts();

  window.addEventListener("watchlistUpdated", loadCounts);
  window.addEventListener("favoritesUpdated", loadCounts);

  return () => {
    window.removeEventListener("watchlistUpdated", loadCounts);
    window.removeEventListener("favoritesUpdated", loadCounts);
  };
}, []);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
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
                  <span className={styles.statValue}>{watchlistCount}</span>

                  <span className={styles.statLabel}>Watchlist</span>
                </div>
                <div className={styles.stat}>
                <span className={styles.statValue}>{favoritesCount}</span>

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
            </ul>
          </div>

          {/* LOGOUT (ako želiš) */}
          {/*
          <button onClick={handleLogOut} className={styles.logoutBtn}>
            <FiLogOut />
            Log Out
          </button>
          */}
        </div>
      </main>
    </div>
  );
}
