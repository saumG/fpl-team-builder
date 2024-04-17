"use client";
import React, { useEffect, useState } from "react";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/arya-orange/theme.css";

import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";

export default function PlayerSection() {
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
        <Column sortable field="first_name" header="First Name"></Column>
        <Column sortable field="second_name" header="Second Name"></Column>
        <Column sortable field="team_name" header="Team"></Column>
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
