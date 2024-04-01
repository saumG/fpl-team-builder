import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

interface PlayerObj {
  id: number;
  firstName: string;
  lastName: string;
  score: number;
  cost: number;
  GKP: number;
  DEF: number;
  MID: number;
  FWD: number;
  [key: string]: number | string; // This line allows for any additional string keys with number or string values
}

function matchPreselectedPlayers(fullPlayers: any, preselected: any): any {
  const fullPlayerDetails = preselected.map((player: any) =>
    fullPlayers.find((fullPlayer: any) => fullPlayer.id === player.id)
  );
  return fullPlayerDetails;
}

function normalizePlayerStats(players: any, weights: any): any {
  // Initialize min and max objects
  const mins: any = {};
  const maxes: any = {};

  // Find min and max for each weighted stat
  players.forEach((player: any) => {
    weights.forEach((weight: any) => {
      if (
        mins[weight.stat] === undefined ||
        player[weight.stat] < mins[weight.stat]
      ) {
        mins[weight.stat] = player[weight.stat];
      }
      if (
        maxes[weight.stat] === undefined ||
        player[weight.stat] > maxes[weight.stat]
      ) {
        maxes[weight.stat] = player[weight.stat];
      }
    });
  });

  // Normalize player stats
  const normalizedPlayers = players.map((player: any) => {
    const normalizedStats: any = {};
    weights.forEach((weight: any) => {
      // Avoid division by zero
      if (maxes[weight.stat] !== mins[weight.stat]) {
        normalizedStats[weight.stat] =
          (player[weight.stat] - mins[weight.stat]) /
          (maxes[weight.stat] - mins[weight.stat]);
      } else {
        normalizedStats[weight.stat] = 0; // Or some default value in case all players have the same stat value
      }
    });
    return { ...player, normalizedStats };
  });

  return normalizedPlayers;
}

function filterPreselected(scoredPlayers: any, preselected: any): any {
  return scoredPlayers.filter(
    (player: any) => !preselected.some((pre: any) => pre.id === player.id)
  );
}

function simplifyPlayers(
  unselectedPlayers: any,
  unselectedPlayerIds: any
): { [key: string]: PlayerObj } {
  return unselectedPlayers.reduce(
    (acc: { [key: string]: PlayerObj }, player: any) => {
      // Initialize the player object with common attributes
      let playerObj: PlayerObj = {
        id: player.id,
        firstName: player.first_name,
        lastName: player.second_name,
        score: player.score,
        cost: player.now_cost,
        GKP: player.singular_name_short === "GKP" ? 1 : 0,
        DEF: player.singular_name_short === "DEF" ? 1 : 0,
        MID: player.singular_name_short === "MID" ? 1 : 0,
        FWD: player.singular_name_short === "FWD" ? 1 : 0,
      };

      // Add a binary indicator for each player ID
      unselectedPlayerIds.forEach((otherPlayerId: any) => {
        playerObj[`pl_${otherPlayerId}`] = player.id === otherPlayerId ? 1 : 0;
      });

      // Add this player object to the accumulator
      acc[`player_${player.id}`] = playerObj;
      return acc;
    },
    {}
  );
}

function updatePositions(defaultPositions: any, preselectedPlayers: any): any {
  let positions = defaultPositions;

  preselectedPlayers.forEach((player: any) => {
    if (player) {
      const position = player.singular_name_short;
      if (positions[position]) {
        positions[position].count += 1;
      } else {
        console.warn(
          `Preselected player with ID: ${player.id} has undefined or invalid position: ${position}`
        );
      }
    }
  });

  return positions;
}

export async function POST(request: Request) {
  const requestBody = await request.json();
  console.log(`Request body is ${JSON.stringify(requestBody)}`);

  //extract params. request.body.weights and request.body.preselectedPlayers (trimmed)
  const weights = requestBody.weight || [];
  // Flatten preselectedPlayers from the structured object into a single array
  const preselectedPlayersTrimmed = Object.values(
    requestBody.preselectedPlayers || {}
  ).flat();

  const completeTeam = getBuiltTeam(weights, preselectedPlayersTrimmed);

  return NextResponse.json({ team: completeTeam });
}

export const getBuiltTeam = async (
  weights: any,
  preselectedPlayersTrimmed: any
) => {
  //get full player details
  const players = (await sql`SELECT * FROM players;`).rows;
  console.log(`Fetched ${players.length} players data`);

  console.log(
    `preselectedPlayersTrimmed type: ${typeof preselectedPlayersTrimmed}`,
    preselectedPlayersTrimmed
  );
  //find full details for preselected players (find trimmed player id in full player details object)
  const preselectedPlayersFull = matchPreselectedPlayers(
    players,
    preselectedPlayersTrimmed
  );
  console.log(
    `Found full details for ${preselectedPlayersFull.length} preselected players`
  );

  //normalize stats' values for all players
  const normalizedPlayers = normalizePlayerStats(players, weights);
  //calculate scores based on selected attributes/weights
  const scoredPlayers = normalizedPlayers.map((player: any) => {
    let score = 0;
    weights.forEach((weight: any) => {
      score += player.normalizedStats[weight.stat] * weight.weight;
    });
    return { ...player, score };
  });

  // Sort players by score in descending order
  scoredPlayers.sort((a: any, b: any) => b.score - a.score);

  //filter out preselected players from scoredPlayers list
  const unselectedPlayers = filterPreselected(
    scoredPlayers,
    preselectedPlayersTrimmed
  );
  // get ids of unselected players
  const unselectedPlayersIds = unselectedPlayers.map(
    (player: any) => player.id
  );
  console.log(
    `Filtered out preselected players, ${unselectedPlayersIds.length} players remaining`
  );

  //create simplified player objects
  //    id, first name, last name, score, cost, gkp, def, mid, fwd, and binary indicator for each player id
  const simplifiedPlayers = simplifyPlayers(
    unselectedPlayers,
    unselectedPlayersIds
  );
  console.log(
    `Created simplified players objects, total count: ${
      Object.keys(simplifiedPlayers).length
    }`
  );

  //define team composition
  //initial budget, team, team cost
  // remaining budget
  let positions = {
    GKP: { count: 0, max: 2 },
    DEF: { count: 0, max: 5 },
    MID: { count: 0, max: 5 },
    FWD: { count: 0, max: 3 },
  };
  const budget = 1000;
  const initialTeam = preselectedPlayersFull;
  const initialCost = initialTeam.reduce(
    (totalCost: number, player: any) => totalCost + player.now_cost,
    0
  );
  const remainingBudget = budget - initialCost;

  console.log(
    `initial team cost is ${initialCost}. remaining budget is ${remainingBudget}`
  );

  //update positions based on preselected players
  positions = updatePositions(positions, preselectedPlayersFull);

  //feed model
  const solver = require("javascript-lp-solver");

  let model: any = {
    optimize: "score",
    opType: "max",
    constraints: {
      cost: { max: remainingBudget },
      GKP: { equal: positions.GKP.max - positions.GKP.count },
      DEF: { equal: positions.DEF.max - positions.DEF.count },
      MID: { equal: positions.MID.max - positions.MID.count },
      FWD: { equal: positions.FWD.max - positions.FWD.count },
    },
    variables: simplifiedPlayers,
    ints: {},
  };

  Object.keys(simplifiedPlayers).forEach((playerId) => {
    const player = simplifiedPlayers[playerId];
    model.constraints[`pl_${player.id}`] = { max: 1 };
    model.ints[`player_${player.id}`] = 1; // This ensures that solution variables will be integer values
  });

  // Solve the problem
  const solution = solver.Solve(model);
  console.log("Solution:", solution);

  // Initialize a map to keep track of the number of players encountered for each position
  const positionCount: any = { GKP: 0, DEF: 0, MID: 0, FWD: 0 };

  // Add total_rank and position_rank to each player
  scoredPlayers.forEach((player: any, index: any) => {
    // The total rank is just the index + 1 (since the array is 0-indexed but ranks start at 1)
    player.total_rank = index + 1;

    // Increment the position count for this player's position and assign the position rank
    // player.singular_name_short is one of 'GKP', 'DEF', 'MID', 'FWD'
    const position = player.singular_name_short;
    positionCount[position]++;
    player.position_rank = positionCount[position];
  });

  // Extract IDs from the solution for selected players
  const selectedPlayerIds = Object.keys(solution)
    .filter((key) => key.startsWith("player_") && solution[key] === 1)
    .map((key) => key.split("_")[1]);

  // Convert all preselectedPlayerIds to strings
  const preselectedPlayerIdsStr = initialTeam.map((player: any) =>
    player.id.toString()
  );

  console.log(preselectedPlayerIdsStr);
  console.log(selectedPlayerIds);

  // Combine these IDs with the IDs from the initial team
  const completeTeamIds = new Set([
    ...preselectedPlayerIdsStr,
    ...selectedPlayerIds,
  ]);
  console.log(completeTeamIds);

  // Create the complete team details
  const completeTeam: any = {};
  completeTeamIds.forEach((id) => {
    // Find this player in the scoredPlayers array
    const player =
      scoredPlayers.find((p: any) => p.id.toString() === id) ||
      preselectedPlayersFull.find((p: any) => p.id.toString() === id);
    if (player) {
      completeTeam[player.id] = {
        first_name: player.first_name,
        second_name: player.second_name,
        id: player.id,
        score: player.score,
        total_rank: player.total_rank,
        position_rank: player.position_rank,
        cost: player.now_cost,
      };
    }
  });

  console.log(`Final team (Details):`, completeTeam);

  return completeTeam;
};
