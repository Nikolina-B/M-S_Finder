import { db } from "@/app/lib/db";
import { watchlist } from "@/app/lib/db/schema"; 
import { auth } from "@/app/lib/auth/auth"; 
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Dohvati sesiju preko Better-Auth
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Ako korisnik nije prijavljen, vrati prazan niz (nije greška, samo nema liste)
    if (!session || !session.user) {
      return NextResponse.json([]);
    }

    //Dohvati samo movieId (imdbID) stupac iz baze za tog korisnika
    const userWatchlist = await db
      .select({
        movieId: watchlist.movieId,
      })
      .from(watchlist)
      .where(eq(watchlist.userId, session.user.id));

    // Pretvori niz objekata [{movieId: 'tt123'}, ...] u niz stringova ['tt123', ...]
    const idsOnly = userWatchlist.map((item) => item.movieId);

    return NextResponse.json(idsOnly);
  } catch (error) {
    console.error("API Watchlist IDs Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}