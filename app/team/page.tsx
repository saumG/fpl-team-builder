"use client"
import React, { useEffect, useState } from "react";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/arya-orange/theme.css";

import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";

export default function PlayerSection() {
  const propertyNamesMapping: any = {
    code: "Team Code",
    draw: "Draw",
    form: "Form",
    id: "ID",
    loss: "Loss",
    name: "Name",
    played: "Played",
    points: "Points",
    position: "Position",
    short_name: "Short Name",
    strength: "Strength",
    strength_overall_home: "Strength Overall Home",
    strength_overall_away: "Strength Overall Away",
    strength_attack_home: "Strength Attack Home",
    strength_attack_away: "Strength Attack Away",
    strength_defence_home: "Strength Defence Home",
    strength_defence_away: "Strength Defence Away",
  };

  const orderedProperties = [
    "name",
    "short_name",
    "strength",
    "strength_overall_home",
    "strength_overall_away",
    "strength_attack_home",
    "strength_attack_away",
    "strength_defence_home",
    "strength_defence_away",
  ];
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [teamData, setTeamData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch("http://localhost:3000/api/teams", {
      signal: controller.signal,
    })
      .then((response) => response.json()) // Call response.json()
      .then((teams) => {
        setTeamData(teams);
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
        value={teamData}
        sortMode="single"
        filters={filters}
        paginator
        rows={20}
      >
        <Column sortable field="name" header="Team"></Column>;
        <Column sortable field="short_name" header="Abbv"></Column>;
        <Column sortable field="strength" header="Strength"></Column>;
        <Column
          sortable
          field="strength_overall_home"
          header="Strength Overall Home"
        ></Column>
        <Column
          sortable
          field="strength_overall_away"
          header="Strength Overall Away"
        ></Column>
        <Column
          sortable
          field="strength_attack_home"
          header="Strength Attack Home"
        ></Column>
        <Column
          sortable
          field="strength_attack_away"
          header="Strength Attack Away"
        ></Column>
        <Column
          sortable
          field="strength_defence_home"
          header="Strength Defence Home"
        ></Column>
        <Column
          sortable
          field="strength_defence_away"
          header="Strength Defence Away"
        ></Column>
      </DataTable>
    </div>
  );
}

// <div className="p-5">
//       <div className="flex mb-4">
//         <input
//           type="text"
//           className="p-2 border rounded"
//           placeholder="Search teams..."
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>
//       <div className="overflow-x-auto">
//         <table className="table-auto">
//           <thead className="bg-gray-200">
//             <tr>
//               {orderedProperties.map((prop) => (
//                 <th key={prop} className="px-4 py-2">
//                   {propertyNamesMapping[prop]}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {teamData
//               .filter(
//                 (team: any) =>
//                   team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                   team.short_name
//                     .toLowerCase()
//                     .includes(searchTerm.toLowerCase())
//               )
//               .map((team: any) => (
//                 <tr key={team.id}>
//                   {orderedProperties.map((prop) => (
//                     <td key={prop} className="border px-4 py-2">
//                       {team[prop]}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
