import { db } from "@/app/lib/db";
import { communities,community_messages } from "@/app/lib/db/schema";
import { user } from "@/app/lib/db/auth-schema"
import { auth } from "@/app/lib/auth/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, asc } from "drizzle-orm";


{/**Dohvacanje poruka preme useridu i communityidu */}
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const communityId = searchParams.get("communityId");

  if (!communityId) {
    return NextResponse.json({ error: "Missing communityId" }, { status: 400 });
  }

  try {
    const allMessages = await db
      .select({
        id: community_messages.id,
        content: community_messages.content,
        createdAt: community_messages.createdAt,
        userName: user.name,   
        userImage: user.image, 
      })
      .from(community_messages)
      .innerJoin(user, eq(community_messages.userId, user.id)) // Spajamo preko userId
      .where(eq(community_messages.communityId, communityId))
      .orderBy(asc(community_messages.createdAt));

    return NextResponse.json(allMessages);
  } catch (error) {
    console.error("Greška:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

{/**Post metoda za slanje poruka */}
export async function POST(req: Request) {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {

    const { content, communityId } = await req.json();

    if (!content || !communityId) {
      return NextResponse.json({ error: "Content and ID are required" }, { status: 400 });
    }
    const [newMessage] = await db
      .insert(community_messages)
      .values({
        content,
        communityId,
        userId: session.user.id, 
      })
      .returning();
    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("Greška pri slanju:", error);
    return new NextResponse("Error sending message", { status: 500 });
  }
}