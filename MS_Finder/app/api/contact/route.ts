import { db } from "@/app/lib/db";
import { contact_messages} from "@/app/lib/db/schema"; 
import { auth } from "@/app/lib/auth/auth"; 
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to send a message." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, message } = body;

    // Provjeru da  se izbjegne baza ako su polja prazna
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    await db.insert(contact_messages).values({
      userId: session.user.id,
      name,
      email,
      message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API Error:", error); // Dobro je imati log u konzoli za debugiranje
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}