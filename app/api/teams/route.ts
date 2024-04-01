import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const teams = getTeam();
  return NextResponse.json(teams);
}

export const getTeam = async () => {
  const teams = await sql`SELECT * FROM teams;`;
  return teams.rows;
};
