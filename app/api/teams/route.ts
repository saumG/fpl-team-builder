import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const teams = await sql`SELECT * FROM teams;`;
  return NextResponse.json(teams.rows);
}
