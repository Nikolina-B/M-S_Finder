// "use client";

// import { useState, useEffect } from "react";
// import styles from "./TrendingMovies.module.css";

// const movies = [
//   { id: 1, title: "Anyone But You", rating: 4, image: "anyone-but-you.jpg", trailer: "https://www.youtube.com/watch?v=UcmsKd61rS0" },
//   { id: 2, title: "F1 The Movie", rating: 5, image: "f1.jpg", trailer: "https://www.youtube.com/watch?v=8yh9BPUBbbQ" },
//   { id: 3, title: "Kpop Demon Hunters", rating: 4, image: "kpop.png", trailer: "https://www.youtube.com/watch?v=3JTVQTk36R8" },
//   { id: 4, title: "Weapons", rating: 4, image: "weapons.jpg", trailer: "https://www.youtube.com/watch?v=OpThntO9ixc" },
//   { id: 5, title: "Avatar", rating: 5, image: "avatar33.jpg", trailer: "https://www.youtube.com/watch?v=CM79GTEm2ps" },
//   { id: 6, title: "Stranger Things 5", rating: 5, image: "st555.jpg", trailer: "https://www.youtube.com/watch?v=PssKpzB0Ah0" },
//   { id: 7, title: "Shrek", rating: 5, image: "shrek.jpg", trailer: "https://www.youtube.com/watch?v=HLQ1cK9Edhc&list=RDHLQ1cK9Edhc&start_radio=1" },
//     { id: 8, title: "Top Gun", rating: 5, image: "topGun.jpg", trailer: "https://www.youtube.com/watch?v=qSqVVswa420" },
// ];

// function StarRating({ movieId, initialRating }: { movieId: number; initialRating: number }) {
//   const [rating, setRating] = useState(initialRating);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//     const saved = localStorage.getItem(`rating-${movieId}`);
//     if (saved) setRating(Number(saved));
//   }, [movieId]);

//   const handleSetRating = (value: number) => {
//     setRating(value);
//     localStorage.setItem(`rating-${movieId}`, value.toString());
//   };

//   if (!mounted) return null;

//   return (
//     <div className={styles.stars}>
//       {[1, 2, 3, 4, 5].map((star) => (
//         <span
//           key={star}
//           onClick={() => handleSetRating(star)}
//           className={star <= rating ? styles.filled : styles.empty}
//         >
//           ★
//         </span>
//       ))}
//     </div>
//   );
// }

// export default function TrendingMovies() {
//   const itemsPerPage = 4;
//   const [page, setPage] = useState(0);

//   const startIndex = page * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const visibleMovies = movies.slice(startIndex, endIndex);

//   const handleNext = () => {
//     if (endIndex < movies.length) setPage(page + 1);
//   };

//   const handlePrev = () => {
//     if (startIndex > 0) setPage(page - 1);
//   };

//  return (
//   <section className={styles.section}>
//     <h2>Trending </h2>
//     <div className={styles.sliderWrapper}>
//       {/* Strelica lijevo */}
//       <button
//         onClick={handlePrev}
//         className={`${styles.scrollBtn} ${styles.left}`}
//         disabled={startIndex === 0}
//       >
//         {/* ← */}
//         &#10094;
//       </button>
    
//       {/* Slider */}
//       <div className={styles.slider}>
//         {visibleMovies.map((movie) => (
//           <div key={movie.id} className={styles.card}>
//             {/* Samo slika vodi na trailer */}
//             <a href={movie.trailer} target="_blank" rel="noopener noreferrer">
//               <img
//                 src={movie.image}
//                 alt={movie.title}
//                 className={styles.trailerImage}
//               />
//             </a>

//             {/* Naslov i zvjezdice ostaju interaktivni */}
//             <div className={styles.cardFooter}>
//               <span>{movie.title}</span>
//               <StarRating movieId={movie.id} initialRating={movie.rating} />
//             </div>
//     {/* Plus dugme u lijevom donjem kutu */}
//   <button className={styles.addBtn}>+</button>
//           </div>
      
//         ))}
//       </div>
     

//       {/* Strelica desno */}
//       <button
//         onClick={handleNext}
//         className={`${styles.scrollBtn} ${styles.right}`}
//         disabled={endIndex >= movies.length}
//       >
//         {/* → */}
//         &#10095;
//       </button>
   

//     </div>
//   </section>
// );
// }
"use client";

import { useState, useEffect } from "react";
import styles from "./TrendingMovies.module.css";

/* ------------------ PODACI ------------------ */

const movies = [
  {
    id: 1,
    title: "Anyone But You",
    rating: 4,
    image: "anyone-but-you.jpg",
    trailer: "https://www.youtube.com/watch?v=UcmsKd61rS0",
  },
  {
    id: 2,
    title: "F1 The Movie",
    rating: 5,
    image: "f1.jpg",
    trailer: "https://www.youtube.com/watch?v=8yh9BPUBbbQ",
  },
  {
    id: 3,
    title: "Kpop Demon Hunters",
    rating: 4,
    image: "kpop.png",
    trailer: "https://www.youtube.com/watch?v=3JTVQTk36R8",
  },
  {
    id: 4,
    title: "Weapons",
    rating: 4,
    image: "weapons.jpg",
    trailer: "https://www.youtube.com/watch?v=OpThntO9ixc",
  },
  {
    id: 5,
    title: "Avatar",
    rating: 5,
    image: "avatar33.jpg",
    trailer: "https://www.youtube.com/watch?v=CM79GTEm2ps",
  },
  {
    id: 6,
    title: "Stranger Things 5",
    rating: 5,
    image: "st555.jpg",
    trailer: "https://www.youtube.com/watch?v=PssKpzB0Ah0",
  },
  {
    id: 7,
    title: "Shrek",
    rating: 5,
    image: "shrek.jpg",
    trailer: "https://www.youtube.com/watch?v=HLQ1cK9Edhc",
  },
  {
    id: 8,
    title: "Top Gun",
    rating: 5,
    image: "topGun.jpg",
    trailer: "https://www.youtube.com/watch?v=qSqVVswa420",
  },
];

/* ------------------ STAR RATING ------------------ */

function StarRating({
  movieId,
  initialRating,
}: {
  movieId: number;
  initialRating: number;
}) {
  const [rating, setRating] = useState(initialRating);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(`rating-${movieId}`);
    if (saved) setRating(Number(saved));
  }, [movieId]);

  const handleSetRating = (value: number) => {
    setRating(value);
    localStorage.setItem(`rating-${movieId}`, value.toString());
  };

  if (!mounted) return null;

  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleSetRating(star)}
          className={star <= rating ? styles.filled : styles.empty}
        >
          ★
        </span>
      ))}
    </div>
  );
}

/* ------------------ MAIN COMPONENT ------------------ */

export default function TrendingMovies() {
  const itemsPerPage = 4;
  const [page, setPage] = useState(0);
  const [watchlistIds, setWatchlistIds] = useState<number[]>([]);

  /* --- učitaj watchlist --- */
  useEffect(() => {
    const stored = localStorage.getItem("watchlist");
    if (stored) {
      const list = JSON.parse(stored);
      setWatchlistIds(list.map((item: any) => item.id));
    }
  }, []);

  /* --- dodaj / makni iz watchlista --- */
  const toggleWatchlist = (movie: any) => {
    const stored = localStorage.getItem("watchlist");
    let list = stored ? JSON.parse(stored) : [];

    if (list.some((item: any) => item.id === movie.id)) {
      list = list.filter((item: any) => item.id !== movie.id);
    } else {
      list.push({
        id: movie.id,
        title: movie.title,
        image: movie.image,
        type: "movie",
      });
    }

    localStorage.setItem("watchlist", JSON.stringify(list));

    setWatchlistIds(list.map((item: any) => item.id));
  };

  /* --- pagination --- */
  const startIndex = page * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleMovies = movies.slice(startIndex, endIndex);

  const handleNext = () => {
    if (endIndex < movies.length) setPage(page + 1);
  };

  const handlePrev = () => {
    if (startIndex > 0) setPage(page - 1);
  };

  /* ------------------ JSX ------------------ */

  return (
    <section className={styles.section}>
      <h2>Trending</h2>

      <div className={styles.sliderWrapper}>
        {/* ← */}
        <button
          onClick={handlePrev}
          className={`${styles.scrollBtn} ${styles.left}`}
          disabled={startIndex === 0}
        >
          &#10094;
        </button>

        {/* SLIDER */}
        <div className={styles.slider}>
          {visibleMovies.map((movie) => (
            <div key={movie.id} className={styles.card}>
              {/* Trailer link */}
              <a href={movie.trailer} target="_blank" rel="noopener noreferrer">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className={styles.trailerImage}
                />
              </a>

              {/* Footer */}
              <div className={styles.cardFooter}>
                <span>{movie.title}</span>
                <StarRating
                  movieId={movie.id}
                  initialRating={movie.rating}
                />
              </div>

              {/* WATCHLIST BUTTON */}
              <button
                className={`${styles.addBtn} ${
                  watchlistIds.includes(movie.id) ? styles.added : ""
                }`}
                onClick={() => toggleWatchlist(movie)}
              >
                {watchlistIds.includes(movie.id) ? "✓" : "+"}
              </button>
            </div>
          ))}
        </div>

        {/* → */}
        <button
          onClick={handleNext}
          className={`${styles.scrollBtn} ${styles.right}`}
          disabled={endIndex >= movies.length}
        >
          &#10095;
        </button>
      </div>
    </section>
  );
}
