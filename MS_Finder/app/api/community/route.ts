import { db } from "@/app/lib/db"; 
import { communities } from "@/app/lib/db/schema"; 
import { community_members } from "@/app/lib/db/schema";
import { auth } from "@/app/lib/auth/auth"; 
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

{/*Get metoda za dohvacanje liste svih communitija */}
export async function GET() {
  try {
    const allCommunities = await db
      .select()
      .from(communities)
      .orderBy(desc(communities.createdAt)); //najnoviji community ide prvi

    return NextResponse.json(allCommunities);
  } catch (error) {
    console.error("Greška pri dohvaćanju communityja:", error);
    return new NextResponse("Greška pri dohvaćanju podataka", { status: 500 });
  }
}

{/*Post metoda za slanje communitija kada ga kreiramo
  stvaramo i slug za pojedini community i u bazu se ubaci novi community sa novim imenon,
  idijem , adminovimIdijem(osoba koja ga kreira) te  broj clanova */}
export async function POST(req: Request) {

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse("You need to be registered!", { status: 401 });
    }

    const { name } = await req.json();
    
    // Generiramo slug
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") 
      .replace(/[\s_-]+/g, "-") 
      .replace(/^-+|-+$/g, ""); 

   
    const newHub = await db.insert(communities).values({
      id: crypto.randomUUID(), 
      name: name,
      slug: slug,
      adminId: session.user.id, 
      memberCount: 1,
    }).returning();
    await db.insert(community_members).values({
      userId: session.user.id,
      communityId: newHub[0].id,
    });

    return NextResponse.json(newHub[0]);
  } catch (error: any) {
    console.error("Greška pri kreiranju communityja:", error);

    // Provjera ako ime ili slug već postoje
    if (error.code === "23505") {
      return new NextResponse("Community s tim imenom već postoji.", { status: 400 });
    }

    return new NextResponse("Greška pri kreiranju", { status: 500 });
  }
}