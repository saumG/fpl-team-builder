"use client";
import React, { ReactEventHandler, useEffect, useState } from "react";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/arya-orange/theme.css";

import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";

export default function TeamSection() {
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [teamData, setTeamData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/teams`, {
      signal: controller.signal,
    })
      .then((response) => response.json()) // Call response.json()
      .then((teams) => {
        setTeamData(teams);
        console.log("Data fetched and set:", teams);
      });

    return () => controller.abort();
  }, []);

  const handleChange = (e: any) => {
    console.log("Input Changed", e.target.value);
    setFilters({
      global: {
        ...filters.global,
        value: e.target.value,
      },
    });
  };

  return (
    <div className="mx-36 max-h-screen">
      <InputText
        onInput={(e: any) => {
          handleChange(e);
        }}
      ></InputText>

      <DataTable
        value={teamData}
        sortMode="single"
        filters={filters}
        paginator
        rows={20}
      >
        <Column sortable field="name" header="Team"></Column>
        <Column sortable field="short_name" header="Abbv"></Column>
        <Column sortable field="strength" header="Strength"></Column>
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
