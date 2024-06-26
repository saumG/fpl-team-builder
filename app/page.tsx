"use client";
import Alert from "@mui/material/Alert";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface StatOption {
  name: string;
  selected: boolean;
}

interface MaxPosition {
  [key: string]: number;
}

type StatsOptionsType = {
  [key: string]: StatOption;
};

interface stat {
  id: number;
  stat: string;
  weight: number;
  percentage: number;
}

interface Player {
  [key: string]: any;
}

interface Team {
  [key: string]: Player[];
}

export default function BuilderSection() {
  const initialStatsOptions: StatsOptionsType = {
    points_per_game: { name: "Points Per Game", selected: false },
    total_points: { name: "Total Points", selected: false },
    expected_goals: { name: "xG", selected: false },
    expected_assists: { name: "xA", selected: false },
    expected_goal_involvements: { name: "xGI", selected: false },
    expected_goals_conceded: { name: "xGA", selected: false },
    expected_goals_per_90: { name: "xG per 90", selected: false },
    saves_per_90: { name: "Saves per 90", selected: false },
    expected_assists_per_90: { name: "xA per 90", selected: false },
    expected_goal_involvements_per_90: { name: "xGI per 90", selected: false },
    goals_conceded_per_90: { name: "Goals Conceded per 90", selected: false },
    clean_sheets_per_90: { name: "Clean Sheets per 90", selected: false },
    influence: { name: "Influence", selected: false },
    creativity: { name: "Creativity", selected: false },
    threat: { name: "Threat", selected: false },
    ict_index: { name: "ICT Index", selected: false },
    goals_scored: { name: "Goals Scored", selected: false },
    assists: { name: "Assists", selected: false },
    clean_sheets: { name: "Clean Sheets", selected: false },
    own_goals: { name: "Own Goals", selected: false },
    penalties_saved: { name: "Penalties Saved", selected: false },
    penalties_missed: { name: "Penalties Missed", selected: false },
    yellow_cards: { name: "Yellow Cards", selected: false },
    red_cards: { name: "Red Cards", selected: false },
    saves: { name: "Saves", selected: false },
    bonus: { name: "Bonus", selected: false },
    bps: { name: "BPS", selected: false },
    dreamteam_count: { name: "Dreamteam Count", selected: false },
    ep_next: { name: "Expected Points Next", selected: false },
    ep_this: { name: "Expected Points This", selected: false },
    transfers_in: { name: "Transfers In", selected: false },
    transfers_out: { name: "Transfers Out", selected: false },
    value_form: { name: "Value Form", selected: false },
    minutes: { name: "Minutes", selected: false },
  };

  const initialStat: stat[] = [
    {
      id: 1,
      stat: "goals_scored",
      weight: 1,
      percentage: 100,
    },
  ];

  const maxPosition: MaxPosition = { GKP: 2, DEF: 5, MID: 5, FWD: 3 };

  const [allPlayers, setAllPlayers] = useState([]); // Assuming you fetch this data
  const [statsOptions, setStatsOptions] =
    useState<StatsOptionsType>(initialStatsOptions);
  const [stats, setStats] = useState(initialStat);
  const [team, setTeam] = useState<Team>({
    GKP: [],
    DEF: [],
    MID: [],
    FWD: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntry, setWordEntry] = useState("");
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alert, setAlert] = useState(false);

  const addStat = () => {
    if (stats.length < 10) {
      setStats([
        ...stats,
        { id: stats.length + 1, stat: "", weight: 1, percentage: 0 },
      ]);
    } else {
      setAlertMessage(
        "You cannot add more than 10 stats for building your team."
      );
      setAlert(true);
    }
  };

  const removeStat = (id: number) => {
    const newStats = stats.filter((stat) => stat.id !== id);
    setStats(newStats);

    const removedStat = stats.find((stat) => stat.id === id);
    if (removedStat) {
      setStatsOptions({
        ...statsOptions,
        [removedStat.stat]: {
          ...statsOptions[removedStat.stat],
          selected: false,
        },
      });
    }
  };

  const updateStat = (id: number, value: number) => {
    const newStats: any = stats.map((stat) => {
      if (stat.id === id) {
        return { ...stat, stat: value, weight: 1 }; // Default weight to 1 when stat changes
      }
      return stat;
    });
    setStats(newStats);
  };

  const updateWeight = (id: number, value: number) => {
    const newStats = stats.map((stat) => {
      if (stat.id === id) {
        const newWeight = Number(value); // Ensure it's a number
        return newWeight !== stat.weight
          ? { ...stat, weight: newWeight }
          : stat;
      }
      return stat;
    });
    // Only update if there's an actual change
    if (JSON.stringify(newStats) !== JSON.stringify(stats)) {
      setStats(newStats);
    }
  };

  const calculatePercentages = (statsWithWeights: any) => {
    const totalWeight = statsWithWeights.reduce(
      (total: number, stat: any) => total + Number(stat.weight || 0),
      0
    );
    return statsWithWeights.map((stat: any) => ({
      ...stat,
      percentage: totalWeight
        ? ((Number(stat.weight || 0) / totalWeight) * 100).toFixed(2)
        : 0,
    }));
  };

  function isPlayerInTeam(player: any, team: any) {
    return team[player.position].some(
      (teamPlayer: any) => teamPlayer.id === player.id
    );
  }

  const addToTeam = (newPlayer: any) => {
    console.log(JSON.stringify(newPlayer));
    setTeam((prevTeam: any) => {
      if (isPlayerInTeam(newPlayer, prevTeam)) {
        return prevTeam; // Player is already in the team, return early
      }

      const playerPosition = newPlayer.position;
      if (prevTeam[playerPosition].length < maxPosition[playerPosition]) {
        const updatedTeam = {
          ...prevTeam,
          [playerPosition]: [...prevTeam[playerPosition], newPlayer],
        };
        return updatedTeam;
      } else {
        setAlertMessage(
          `You already have the maximum of ${maxPosition[playerPosition]} ${playerPosition}s. Please remove one before adding more.`
        );
        setAlert(true);
      }

      return prevTeam; // Return previous state if no changes
    });
  };

  const removeFromTeam = (player: any) => {
    setTeam((prevTeam: any) => {
      const playerPosition = player.position;
      console.log(
        `trying to remove ${player.first_name} ${player.position} from team`
      );
      const playerIndex = prevTeam[playerPosition].findIndex(
        (teamPlayer: any) => teamPlayer && teamPlayer.id === player.id
      );

      if (playerIndex !== -1) {
        // Use slice to avoid mutating the original array, then filter out the player
        const updatedPositionArray = prevTeam[playerPosition]
          .slice(0) // Creates a shallow copy of the array
          .filter((_: any, index: number) => index !== playerIndex); // Remove the player

        return {
          ...prevTeam,
          [playerPosition]: updatedPositionArray,
        };
      }

      return prevTeam; // Return the original state if no player was removed
    });
  };

  const calculateBestTeam = async () => {
    setIsLoading(true); // Start loading
    const controller = new AbortController();

    const requestBody = {
      weights: stats,
      preselectedPlayers: team,
    };

    try {
      const response = await fetch(`/api/builder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status})`);
      }

      const builtTeam = await response.json();

      setTeam(builtTeam.team);
    } catch (error) {
      console.error("Failed to calculate best team:", error);
    } finally {
      setIsLoading(false); // End loading
      controller.abort();
    }
  };

  const fetchPlayers = async () => {
    const controller = new AbortController();

    fetch(`/api/trimmedPlayers`, {
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((players) => {
        setAllPlayers(players);
        console.log(`type of players is ${typeof players}`);
      });

    return () => controller.abort();
  };

  useEffect(() => {
    // First, recalculate percentages for stats
    const newStatsWithPercentages = calculatePercentages(stats);
    if (JSON.stringify(newStatsWithPercentages) !== JSON.stringify(stats)) {
      setStats(newStatsWithPercentages);
    }

    // Then, update selection status in statsOptions
    const updatedOptions = { ...statsOptions };
    let changesMade = false;

    Object.keys(updatedOptions).forEach((key) => {
      const isSelected = newStatsWithPercentages.some(
        (stat: any) => stat.stat === key
      );
      if (updatedOptions[key].selected !== isSelected) {
        updatedOptions[key].selected = isSelected;
        changesMade = true;
      }
    });

    if (changesMade) {
      setStatsOptions(updatedOptions);
    }
  }, [stats]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const clearTeam = () => {
    setTeam({
      GKP: [],
      DEF: [],
      MID: [],
      FWD: [],
    });
  };

  const resetStats = () => {
    setStats(initialStat);
  };

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchWord = event.target.value.toLowerCase();
    setWordEntry(searchWord);
    const newFilter = allPlayers.filter((value: any) => {
      const fullName = (
        value.first_name +
        " " +
        value.second_name
      ).toLowerCase();
      return fullName.includes(searchWord);
    });

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntry("");
  };

  return (
    <div className="max-h-[100vh - 36px] ">
      <div className="flex justify-center">
        <div className="stat-section flex flex-col ">
          <div className="stat-table overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-[#37BDF8]">
              <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-white bg-[rgb(30,41,59)] my-2">
                Fantasy Premier League Team Builder
                <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                  Clicking
                  <span className="text-green-500">
                    {' "Calculate Best Team" '}
                  </span>
                  will use the stats and their weights from the table below to
                  generate the highest scoring FPL team within £100m.
                </p>
              </caption>
              <thead className="text-xs text-[#CBD5E1] uppercase">
                <tr className="">
                  <th scope="col" className="px-4 py-3 text-center">
                    Stat
                  </th>
                  <th scope="col" className="px-1 py-1 text-center">
                    Weight
                  </th>
                  <th scope="col" className="px-2 py-1 text-center ">
                    Percentage
                  </th>
                  <th scope="col" className="px-2 py-1 text-center">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.map((stat) => (
                  <tr key={stat.id} className="">
                    <td className="px-4 py-1">
                      <select
                        className="p-2 bg-[rgb(30,41,59)] border-none rounded "
                        value={stat.stat}
                        onChange={(e: any) =>
                          updateStat(stat.id, e.target.value)
                        }
                      >
                        {stat.stat ? (
                          <option value={stat.stat}>
                            {statsOptions[stat.stat]?.name}
                          </option>
                        ) : (
                          <option value="">Select a stat</option>
                        )}
                        {Object.entries(statsOptions).map(([key, option]) =>
                          !option.selected ? (
                            <option key={key} value={key}>
                              {option.name}
                            </option>
                          ) : null
                        )}
                      </select>
                    </td>
                    <td className="px-4 py-1 text-center">
                      <input
                        type="number"
                        min={0}
                        className="p-2 rounded w-20 flex justify-center items-center bg-[rgb(30,41,59)] border-none"
                        value={stat.weight}
                        onChange={(e: any) =>
                          updateWeight(stat.id, e.target.value)
                        }
                      />
                    </td>
                    <td className="px-4 py-1 text-center text-[#A5B4FC] ">
                      {stat.percentage}%
                    </td>
                    <td className="px-4 py-1">
                      <Image
                        className="h-5 cursor-pointer"
                        src="/close-button.svg"
                        alt=""
                        onClick={() => removeStat(stat.id)}
                        height={20}
                        width={20}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="add-stat-btn flex justify-start py-4 gap-4">
            <button
              onClick={addStat}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl"
            >
              Add Stat
            </button>
            <button
              onClick={resetStats}
              className="bg-red-400 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-2xl"
            >
              Reset Stats
            </button>
          </div>
        </div>
        <div className="built-team-section pl-8 pt-2 flex flex-col gap-2 justify-center items-center">
          <div className="search-bar flex justify-center ">
            <div className="search">
              <div className="search-inputs flex border-4 border-[#193854] justify-between rounded">
                <input
                  className="bg-[#121212] text-[#E2E8F0] p-2 h-6 w-96 border-none"
                  type="text"
                  placeholder="Search for a player to add to your team..."
                  onChange={handleFilter}
                  value={wordEntry}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => {
                    setTimeout(() => setIsInputFocused(false), 250); // delays state update
                  }}
                ></input>
                <div className="search-icon h-6 w-12 bg-[#193854] grid place-items-center focus:outline-none">
                  {filteredData.length == 0 ? (
                    <Image
                      className="h-5"
                      src="/search-52.svg"
                      alt=""
                      height={20}
                      width={20}
                    />
                  ) : (
                    <Image
                      className="h-5 cursor-pointer "
                      src="/icons8-close.svg"
                      alt=""
                      onClick={clearInput}
                      height={20}
                      width={20}
                    />
                  )}
                </div>
              </div>
              {isInputFocused && filteredData.length != 0 && (
                <div className="search-result mt-[5px] w-96 max-h-60  bg-[#1E293B] shadow-[rgba(0,0,0,0.35) 0px 5px 15px] overflow-hidden overflow-y-auto no-scrollbar absolute z-50 ">
                  {filteredData.slice(0, 15).map((player: any) => {
                    return (
                      <div
                        key={player.id}
                        className="flex justify-between w-96 text-[#CBD5E1] hover:bg-gray-200 hover:text-black px-2 py-2"
                      >
                        <div className="data-item player flex items-center ml-2">
                          {player.first_name + " " + player.second_name}
                        </div>
                        <Image
                          className="h-8 cursor-pointer mr-2"
                          src="/icons8-plus.svg"
                          alt=""
                          onClick={() => {
                            addToTeam(player);
                            clearInput();
                          }}
                          height={30}
                          width={30}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="football-pitch relative h-[500px] w-[420px]">
            <Image
              src="/Football_field.png"
              alt="Football Field did not load"
              objectFit="fill"
              layout="fill"
              priority
            />
            <div className="p-4 absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-between">
              {["FWD", "MID", "DEF", "GKP"].map((position: string) => (
                <div
                  key={position}
                  className="flex justify-around items-center h-full align-middle gap-3"
                >
                  {team[position].map((player: any, index: number) => (
                    <div
                      className="player-card relative border-1 flex flex-col w-[85px] h-[80px] align-middle justify-between text-center"
                      key={index}
                    >
                      <div className="absolute top-[-12px] right-[-8px] ">
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full text-[8px]"
                          onClick={() => removeFromTeam(player)}
                        >
                          X
                        </button>
                      </div>
                      <div className="flex flex-col items-center justify-center text-[10px] basis-5/6 bg-gradient-to-b from-[#18A2E9] to-[#6268F1] rounded-2xl text-white py-2">
                        <div>{player.first_name}</div>
                        <div> {player.second_name}</div>
                      </div>
                      <div className="text-[10px] basis-1/6 flex items-center justify-around bg-gradient-to-r from-[#E9499C] to-[#8E5BF5] rounded-2xl ">
                        <div>TR: {player.total_rank ?? "N/A"}</div>
                        <div>PR: {player.position_rank ?? "N/A"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="team-buttons mb-4 flex gap-4">
            <button
              onClick={calculateBestTeam}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-2xl w-64 flex justify-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.86 1.861 7.298 4.708 9.291l1.292-1.292z"
                    ></path>
                  </svg>
                  <span>Calculating...</span>
                </>
              ) : (
                "Calculate Best Team"
              )}
            </button>
            <button
              onClick={clearTeam}
              className="bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-2xl"
            >
              Clear Team
            </button>
          </div>
        </div>
      </div>
      {alert ? (
        <div className="fixed bottom-0 left-0 mb-4 ml-4 ">
          <Alert
            variant="filled"
            severity="error"
            onClose={() => {
              setAlertMessage("");
              setAlert(false);
            }}
          >
            {alertMessage}
          </Alert>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
