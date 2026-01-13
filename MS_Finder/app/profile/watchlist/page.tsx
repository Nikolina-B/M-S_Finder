// "use client";

// import { useEffect, useState } from "react";
// import styles from "./Watchlist.module.css";

// type WatchItem = {
//   id: number;
//   title: string;
//   type: "movie" | "tv";
// };

// export default function WatchlistPage() {
//   const [watchlist, setWatchlist] = useState<WatchItem[]>([]);

//   useEffect(() => {
//     const stored = localStorage.getItem("watchlist");
//     if (stored) {
//       setWatchlist(JSON.parse(stored));
//     }
//   }, []);

//   return (
//     <main className={styles.container}>
//       <h1 className={styles.title}>My Watchlist</h1>

//       {watchlist.length === 0 ? (
//         <p className={styles.empty}>
//           You don't have anything in your watchlist yet.
//         </p>
//       ) : (
//         <div className={styles.list}>
//           {watchlist.map((item) => (
//             <div key={item.id} className={styles.card}>
//               <div className={styles.cardTitle}>{item.title}</div>
//               <div className={styles.cardType}>{item.type}</div>
//             </div>
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import styles from "./Watchlist.module.css";

type WatchItem = {
  id: number;
  title: string;
  type: "movie" | "tv";
//   image?: string; 
};

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("watchlist");
    if (stored) {
      setWatchlist(JSON.parse(stored));
    }
  }, []);

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>My Watchlist</h1>

      {watchlist.length === 0 ? (
        <p className={styles.empty}>
          You don't have anything in your watchlist yet.
        </p>
      ) : (
        <div className={styles.list}>
          {watchlist.map((item) => (
            <div key={item.id} className={styles.card}>
              {/* {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className={styles.poster}
                />
              )} */}
              <div className={styles.cardTitle}>{item.title}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
