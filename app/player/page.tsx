"use client";
import React, { useEffect, useState } from "react";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/arya-orange/theme.css";

import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";

export default function PlayerSection() {
  const propertyNamesMapping: any = {
    chance_of_playing_next_round: "Next Round Play Chance",
    chance_of_playing_this_round: "This Round Play Chance",
    code: "Code",
    cost_change_event: "Cost Change Event",
    cost_change_event_fall: "Cost Change Event Fall",
    cost_change_start: "Cost Change Start",
    cost_change_start_fall: "Cost Change Start Fall",
    dreamteam_count: "Dreamteam Count",
    element_type: "Position",
    ep_next: "Expected Points Next",
    ep_this: "Expected Points This",
    event_points: "Event Points",
    first_name: "First Name",
    form: "Form",
    id: "ID",
    in_dreamteam: "In Dreamteam",
    news: "News",
    news_added: "News Added",
    now_cost: "Cost",
    photo: "Photo",
    points_per_game: "Points Per Game",
    second_name: "Second Name",
    selected_by_percent: "Selected By %",
    special: "Special",
    squad_number: "Squad Number",
    status: "Status",
    team: "Team",
    team_code: "Team Code",
    total_points: "Total Points",
    transfers_in: "Transfers In",
    transfers_in_event: "Transfers In Event",
    transfers_out: "Transfers Out",
    transfers_out_event: "Transfers Out Event",
    value_form: "Value Form",
    value_season: "Value Season",
    web_name: "Web Name",
    minutes: "Minutes",
    goals_scored: "Goals Scored",
    assists: "Assists",
    clean_sheets: "Clean Sheets",
    goals_conceded: "Goals Conceded",
    own_goals: "Own Goals",
    penalties_saved: "Penalties Saved",
    penalties_missed: "Penalties Missed",
    yellow_cards: "Yellow Cards",
    red_cards: "Red Cards",
    saves: "Saves",
    bonus: "Bonus",
    bps: "BPS",
    influence: "Influence",
    creativity: "Creativity",
    threat: "Threat",
    ict_index: "ICT Index",
    expected_goals: "xG",
    expected_assists: "xA",
    expected_goal_involvements: "xGI",
    expected_goals_conceded: "xGA",
    team_name: "Team Name",
    singular_name_short: "Position",
  };
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [playerData, setPlayerData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch("http://localhost:3000/api/players", {
      signal: controller.signal,
    })
      .then((response) => response.json()) // Call response.json()
      .then((players) => {
        setPlayerData(players);
      });

    return () => controller.abort();
  }, []);

  return (
    <div>
      <InputText
        onInput={(e: any) =>
          setFilters({
            global: {
              value: e.target.value,
              matchMode: FilterMatchMode.CONTAINS,
            },
          })
        }
      ></InputText>
      <DataTable
        value={playerData}
        sortMode="single"
        filters={filters}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 25, 50]}
      >
        <Column sortable field="first_name" header="First Name"></Column>;
        <Column sortable field="second_name" header="Second Name"></Column>;
        <Column sortable field="team_name" header="Team"></Column>;
        <Column sortable field="singular_name_short" header="Position"></Column>
        <Column sortable field="total_points" header="Total Points"></Column>
        <Column sortable field="now_cost" header="Cost"></Column>
        <Column
          sortable
          field="selected_by_percent"
          header="Selected By %"
        ></Column>
        <Column sortable field="ict_index" header="ICT Index"></Column>
        <Column sortable field="ep_this" header="xPoints"></Column>
        <Column sortable field="expected_goals" header="xG"></Column>
        <Column sortable field="expected_assists" header="xA"></Column>
        <Column
          sortable
          field="expected_goal_involvements"
          header="xGI"
        ></Column>
        <Column sortable field="expected_goals_conceded" header="xGA"></Column>
        <Column sortable field="points_per_game" header="PPG"></Column>
      </DataTable>
    </div>
  );
}

// <div className="p-5">
//   <div className="flex mb-4">
//     <input
//       type="text"
//       className="p-2 border rounded"
//       placeholder="Search players..."
//       onChange={(e) => setSearchTerm(e.target.value)}
//     />
//   </div>
//   <div className="overflow-x-auto">
//     <table className="table-auto w-full">
//       <thead className="bg-gray-200">
//         <tr>
//           {orderedProperties.map((prop: string) => (
//             <th key={prop} className="px-4 py-2">
//               {propertyNamesMapping[prop]}
//             </th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {playerData
//           .filter(
//             (player: any) =>
//               player.first_name
//                 .toLowerCase()
//                 .includes(searchTerm.toLowerCase()) ||
//               player.second_name
//                 .toLowerCase()
//                 .includes(searchTerm.toLowerCase())
//           )
//           .map((player: any) => (
//             <tr key={player.id}>
//               {orderedProperties.map((prop: string) => (
//                 <td key={prop} className="border px-4 py-2">
//                   {player[prop]}
//                 </td>
//               ))}
//             </tr>
//           ))}
//       </tbody>
//     </table>
//   </div>
// </div>
