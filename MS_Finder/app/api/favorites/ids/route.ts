import { db } from "@/app/lib/db";
import { favorites} from "@/app/lib/db/schema"; 
import { auth } from "@/app/lib/auth/auth"; 
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Dohvacamo sesiju preko better autha
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // 2. Ako korisnik nije prijavljen, vrati prazan niz 
    if (!session || !session.user) {
      return NextResponse.json([]);
    }

    // 3. Dohvati samo movieId (imdbID) stupac iz baze za tog korisnika
    const userFavorites = await db
      .select({
        movieId: favorites.movieId,
      })
      .from(favorites)
      .where(eq(favorites.userId, session.user.id));

    
    const idsOnly = userFavorites.map((item) => item.movieId);

    return NextResponse.json(idsOnly);
  } catch (error) {
    console.error("API Favorites IDs Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}