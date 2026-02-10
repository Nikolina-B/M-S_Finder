import { db } from "@/app/lib/db";
import { community_members, communities } from "@/app/lib/db/schema";
import { auth } from "@/app/lib/auth/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, and, sql } from "drizzle-orm";


/*ruta za izlaz iz community huba*/
export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { communityId } = await req.json();

  try {
    
    await db.delete(community_members)
      .where(
        and(
          eq(community_members.communityId, communityId),
          eq(community_members.userId, session.user.id)
        )
      );

    
    await db.update(communities)
      .set({ memberCount: sql`${communities.memberCount} - 1` })
      .where(eq(communities.id, communityId));

    console.log("Successfully exited the hub");
    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse("Error leaving community", { status: 500 });
  }
}