"use server"

import { db } from "@/app/lib/db";
import { watchlist } from "@/app/lib/db/schema"; // Putanja do definicije tablice
import { auth } from "@/app/lib/auth/auth"; // better-auth instanca
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Funkcija koja dodaje ili uklanja film iz korisnikove liste.
 * Podaci o filmu se spremaju direktno u bazu kako bi Watchlist stranica
 * radila neovisno o vanjskom API-ju.
 */
export async function toggleWatchlistAction(movie: {
  imdbID: string;
  Title: string;
  imdbRating: string;
  Year: string;
  Genre: string;
  Poster: string;
}) {
  // 1. Dohvati sesiju koristeći Better-Auth API
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 2. Provjera je li korisnik prijavljen
  if (!session || !session.user) {
    throw new Error("Morate biti prijavljeni kako biste uredili watchlistu.");
  }

  const userId = session.user.id;

  try {
    // 3. Provjeri postoji li film već u bazi za tog korisnika
    const existingEntry = await db
      .select()
      .from(watchlist)
      .where(
        and(
          eq(watchlist.userId, userId),
          eq(watchlist.movieId, movie.imdbID)
        )
      )
      .limit(1);

    if (existingEntry.length > 0) {
      // UKLONI - Ako film postoji, brišemo ga
      await db
        .delete(watchlist)
        .where(
          and(
            eq(watchlist.userId, userId),
            eq(watchlist.movieId, movie.imdbID)
          )
        );
      
      console.log(`Film ${movie.Title} uklonjen iz watchlist-e.`);
    } else {
      //  DODAJ - Ako film ne postoji, ubacujemo ga
      await db.insert(watchlist).values({
        id: crypto.randomUUID(), // Generiranje ID-a za redak u tablici
        userId: userId,
        movieId: movie.imdbID,
        imdbRating:movie.imdbRating,
        title: movie.Title,
        year: movie.Year,
        genre: movie.Genre,
        poster: movie.Poster,
      });
      
      console.log(`Film ${movie.Title} dodan u watchlist-u.`);
    }

    // 4. Revalidacija - govori Next.js-u da osvježi podatke na ovim rutama
    // To znači da će korisnik odmah vidjeti promjenu kad navigira na te stranice
    revalidatePath("/explore");
    revalidatePath("/watchlist");

    return { success: true };
  } catch (error) {
    console.error("Greška u watchlist akciji:", error);
    return { success: false, error: "Došlo je do pogreške pri spremanju." };
  }
}