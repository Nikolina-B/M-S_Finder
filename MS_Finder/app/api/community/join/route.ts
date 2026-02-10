import { db } from "@/app/lib/db";
import { community_members, communities } from "@/app/lib/db/schema";
import { auth } from "@/app/lib/auth/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, sql,and } from "drizzle-orm";

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { communityId } = await req.json();

    // 1. PROVJERA: Da li je korisnik već član?
    const existing = await db
      .select()
      .from(community_members)
      .where(
        and(
          eq(community_members.communityId, communityId),
          eq(community_members.userId, session.user.id)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ message: "Already a member" }, { status: 400 });
    }

    //ubacujemo novog clana 
    await db.insert(community_members).values({
      userId: session.user.id,
      communityId: communityId,
    });

    // povecavamo memeber_count 
    await db
      .update(communities)
      .set({ 
        memberCount: sql`${communities.memberCount} + 1` 
      })
      .where(eq(communities.id, communityId));

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Greška pri pridruživanju:", error);
    return new NextResponse("Server Error", { status: 500 });
  }
}