import { db } from "@/app/lib/db";
import { watchlist } from "@/app/lib/db/schema";
import { auth } from "@/app/lib/auth/auth";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import styles from "./Watchlist.module.css";
import { HiOutlineArrowRight } from "react-icons/hi";
import { FaTrash, FaStar } from "react-icons/fa";
import { toggleWatchlistAction } from "@/app/actions/watchlist";
import { revalidatePath } from "next/cache";
import { HiOutlineArrowLeft } from "react-icons/hi";


const createSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

export default async function WatchlistPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return <div className={styles.container}>Molimo prijavite se.</div>;

  const results = await db
    .select()
    .from(watchlist)
    .where(eq(watchlist.userId, session.user.id))
    .orderBy(desc(watchlist.createdAt));

  return (
    <main className={styles.exploreContainer}>


      <h1 className={styles.mainTitle}>My Watchlist</h1>
      

      <div className={styles.movieGrid}>
        {results.map((movie) => (
          <div key={movie.movieId} className={styles.card}>
            <div className={styles.imageContainer}>
              <Link href={`/explore/${movie.movieId}-${createSlug(movie.title)}`}>
                <img
                  src={movie.poster !== 'N/A' ? movie.poster! : 'https://via.placeholder.com/300x450?text=No+Poster'}
                  alt={movie.title}
                  className={styles.trailerImage}
                />
              </Link>
              
              {/* TRASH GUMB - Poziva istu akciju za micanje */}
              <form action={async () => {
                "use server";
                await toggleWatchlistAction({
                    imdbID: movie.movieId,
                    Title: movie.title,
                    imdbRating:movie.imdbRating || "",
                    Year: movie.year || "",
                    Genre: movie.genre || "",
                    Poster: movie.poster || ""
                });
                revalidatePath("/profile");
  revalidatePath("/profile/watchlist");
  // ✨ update localStorage i event
  // const stored = JSON.parse(localStorage.getItem("watchlist") || "[]");
  // const updated = stored.filter((id: string) => id !== movie.movieId);
  // localStorage.setItem("watchlist", JSON.stringify(updated));
  // window.dispatchEvent(new Event("watchlistUpdated"));


              }}>
                <button type="submit" className={styles.trashBtn} aria-label="Remove from Watchlist">
                  <FaTrash />
                </button>
              </form>

              <div className={styles.gradientOverlay}></div>
              
              {/* Prikaz rejtinga (ako ga spremaš u bazu, inače možeš izbaciti) */}
              <div className={styles.ratingBadge}>
                <span className={styles.starIcon}><FaStar/></span>
                <span className={styles.ratingValue}>{movie.imdbRating}</span>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <span className={styles.movieTitle}>{movie.title}</span>
              <span className={styles.year}>{movie.year}</span>
              <div className={styles.genreContainer}>
                {movie.genre?.split(',').map((g) => (
                  <span key={g} className={styles.genreTag}>{g.trim()}</span>
                ))}
              </div>
            </div>

            {/* Strelica za detalje - u Server komponenti koristimo Link umjesto router.push */}
            <Link 
              href={`/explore/${movie.movieId}-${createSlug(movie.title)}`}
              className={styles.arrowIcon}
            >
              <HiOutlineArrowRight />
            </Link>
          </div>
        ))}
      </div>
      
      {results.length === 0 && (
        <p className={styles.errorMessage}>Your watchlist is empty.</p>
      )}
    </main>
  );
}
