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

    fetch(`/api/players`, {
      signal: controller.signal,
    })
      .then((response) => response.json()) // Call response.json()
      .then((players) => {
        setPlayerData(players);
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="mx-36 mb-8">
      <div className="flex justify-center items-center mb-2 text-[#E2E8F0]">
        <div className="w-min ">
          <InputText
            className="border-4 border-[#193854] w-96 p-3 rounded-2xl"
            onInput={(e: any) =>
              setFilters({
                global: {
                  value: e.target.value,
                  matchMode: FilterMatchMode.CONTAINS,
                },
              })
            }
            placeholder="Search for a player here..."
          ></InputText>
        </div>
      </div>

      <div className="bg-[#193854] p-4 rounded-3xl">
        <DataTable
          value={playerData}
          sortMode="single"
          filters={filters}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 25, 50]}
          size="small"
          stripedRows
        >
          <Column sortable field="first_name" header="First Name"></Column>
          <Column sortable field="second_name" header="Second Name"></Column>
          <Column sortable field="team_name" header="Team"></Column>
          <Column
            sortable
            field="singular_name_short"
            header="Position"
          ></Column>
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
          <Column
            sortable
            field="expected_goals_conceded"
            header="xGA"
          ></Column>
          <Column sortable field="points_per_game" header="PPG"></Column>
        </DataTable>
      </div>
    </div>
  );
}
