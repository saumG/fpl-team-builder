import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const teams = await getTeam();
  return NextResponse.json(teams);
}

const getTeam = async () => {
  const teams = await sql`SELECT * FROM teams;`;
  return teams.rows;
};
