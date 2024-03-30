import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

interface TrimmedPlayer {
  id: number;
  first_name: string;
  second_name: string;
  position: string;
}

interface Player {
  id: number;
  first_name: string;
  second_name: string;
  singular_name_short: string;
}

export async function GET(request: Request) {
  const players =
    await sql`SELECT id, first_name, second_name, singular_name_short FROM players`;

  const trimmedPlayers = createTrimmedPlayersList(players.rows);
  return NextResponse.json(trimmedPlayers);
}

function createTrimmedPlayersList(fullPlayersList: any) {
  return fullPlayersList.map(
    (player: Player): TrimmedPlayer => ({
      id: player.id,
      first_name: player.first_name,
      second_name: player.second_name,
      position: player.singular_name_short,
    })
  );
}
