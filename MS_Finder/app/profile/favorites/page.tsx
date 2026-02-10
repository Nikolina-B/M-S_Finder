import { db } from "@/app/lib/db";
import { favorites } from "@/app/lib/db/schema";
import { auth } from "@/app/lib/auth/auth";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import styles from "../watchlist/Watchlist.module.css";

import { HiOutlineArrowRight, HiOutlineArrowLeft } from "react-icons/hi";
import { FaTrash, FaStar } from "react-icons/fa";
import { toggleFavoritesAction } from "@/app/actions/favorites";
import { revalidatePath } from "next/cache";

const createSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

export default async function WishlistPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return <div className={styles.container}>Molimo prijavite se.</div>;

  const results = await db
    .select()
    .from(favorites)
    .where(eq(favorites.userId, session.user.id))
    .orderBy(desc(favorites.createdAt));

  return (
    <main className={styles.exploreContainer}>
      <div className={styles.topBar}>
        <Link href="/profile" className={styles.backLink}>
          <HiOutlineArrowLeft /> Back to Profile
        </Link>
      </div>

      <h1 className={styles.mainTitle}>My Wishlist</h1>

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
              
              <form action={async () => {
                "use server";
                await toggleFavoritesAction({
                    imdbID: movie.movieId,
                    Title: movie.title,
                    imdbRating: movie.imdbRating || "",
                    Year: movie.year || "",
                    Genre: movie.genre || "",
                    Poster: movie.poster || ""
                });
                // Ovo je ključno: revalidatePath prisiljava Next.js da osvježi podatke
                revalidatePath("/profile");
                revalidatePath("/profile/favorites");
              }}>
                <button type="submit" className={styles.trashBtn} aria-label="Remove from Wishlist">
                  <FaTrash />
                </button>
              </form>

              <div className={styles.gradientOverlay}></div>
              
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
        <p className={styles.errorMessage}>Your wishlist is empty.</p>
      )}
    </main>
  );
}