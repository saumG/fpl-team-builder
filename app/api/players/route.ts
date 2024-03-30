import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const players = await sql`SELECT * FROM players;`;
  return NextResponse.json(players.rows);
}
