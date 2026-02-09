import { NextRequest, NextResponse } from "next/server";

let db: { [userId: string]: any[] } = {}; // privremeni “baza” u memoriji

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  return NextResponse.json(userId ? db[userId] || [] : []);
}

export async function POST(req: NextRequest) {
  const { userId, ...review } = await req.json();
  if (!db[userId]) db[userId] = [];
  db[userId].push(review);
  return NextResponse.json(review);
}
