import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    // Ako nema cookie-a (korisnik nije prijavljen), a pokušava ući na zaštićene rute
    if (!sessionCookie) {
        // Preusmjeri ga na početnu ili na signin
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Ovdje upiši sve rute koje želiš zaključati
    // npr. ["/profile", "/movies", "/explore"]
    matcher: ["/profile"], 
};