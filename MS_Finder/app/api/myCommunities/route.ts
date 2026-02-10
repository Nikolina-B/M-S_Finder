import { db } from "@/app/lib/db";
import { communities, community_members } from "@/app/lib/db/schema";
import { auth } from "@/app/lib/auth/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";


export const dynamic = "force-dynamic"; 
//dohvacamo pojedine community tj communitije za usera
export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const myCommunities = await db
    .select({
      id: communities.id,
      name: communities.name,
      slug: communities.slug,
      memberCount: communities.memberCount, 
    })
    .from(community_members)
    .innerJoin(communities, eq(community_members.communityId, communities.id))
    .where(eq(community_members.userId, session.user.id));

  return NextResponse.json(myCommunities);
}