import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const players = await getPlayers();
  return NextResponse.json(players);
}

const getPlayers = async () => {
  const players = await sql`SELECT * FROM players;`;
  return players.rows;
};
