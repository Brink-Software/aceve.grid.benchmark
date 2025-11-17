// ============================================
// Kolom Definities voor Tabulator Grid - 500 Kolommen
// ============================================

import { TabulatorColumn } from "./types.js";

export function generateColumnDefinitions(): TabulatorColumn[] {
  const columns: TabulatorColumn[] = [];

  // Actie kolom (voor delete)
  columns.push({
    title: "Actions",
    field: "actions",
    width: 100,
    sorter: false,
    filter: false,
    headerSort: false,
    headerFilter: false,
    frozen: true,
    formatter: (cell) => {
      const row = cell.getRow();
      if (!row.getData().id) return "";

      const button = document.createElement("button");
      button.innerHTML = "🗑️";
      button.className = "delete-row-btn";
      button.title = "Verwijder rij";
      button.setAttribute("data-test", `verwijder-rij-${row.getData().id}`);
      button.style.cssText = `
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
        padding: 4px 8px;
      `;
      button.onclick = (e) => {
        e.stopPropagation();
        if ((window as any).deleteRow && row.getData()) {
          (window as any).deleteRow(row.getData().id);
        }
      };
      return button;
    },
  });

  // ID kolom
  columns.push({
    title: "ID",
    field: "id",
    width: 80,
    sorter: "number",
    filter: "number",
    headerSort: true,
    headerFilter: true,
    frozen: true,
    formatter: (cell) => {
      const id = cell.getValue();
      const container = document.createElement("div");
      container.setAttribute("data-test", `selected-rij-${id}`);
      container.textContent = id;
      return container;
    },
  });

  // Naam kolom
  columns.push({
    title: "Naam",
    field: "name",
    width: 180,
    sorter: "string",
    filter: "string",
    headerSort: true,
    headerFilter: true,
    frozen: true,
    editor: "input",
  });

  // Email kolom
  columns.push({
    title: "Email",
    field: "email",
    width: 200,
    sorter: "string",
    filter: "string",
    headerSort: true,
    headerFilter: true,
    editor: "input",
  });

  // Department kolom (voor grouping)
  columns.push({
    title: "Afdeling",
    field: "department",
    width: 150,
    sorter: "string",
    filter: "string",
    headerSort: true,
    headerFilter: true,
    editor: "input",
  });

  // Team kolom (voor grouping)
  columns.push({
    title: "Team",
    field: "team",
    width: 150,
    sorter: "string",
    filter: "string",
    headerSort: true,
    headerFilter: true,
    editor: "input",
  });

  // Rol kolom
  columns.push({
    title: "Rol",
    field: "role",
    width: 180,
    sorter: "string",
    filter: "string",
    headerSort: true,
    headerFilter: true,
    editor: "input",
  });

  // Salaris kolom
  columns.push({
    title: "Salaris (€)",
    field: "salary",
    width: 140,
    sorter: "number",
    filter: "number",
    headerSort: true,
    headerFilter: true,
    editor: "number",
    formatter: "money",
    formatterParams: {
      symbol: "€",
      symbolAfter: false,
      precision: 2,
      thousand: ".",
      decimal: ",",
    },
  });

  // Jaren ervaring
  columns.push({
    title: "Ervaring (jr)",
    field: "yearsExperience",
    width: 130,
    sorter: "number",
    filter: "number",
    headerSort: true,
    headerFilter: true,
    editor: "number",
    formatter: "textarea",
  });

  // Projecten voltooid
  columns.push({
    title: "Projecten",
    field: "projectsCompleted",
    width: 120,
    sorter: "number",
    filter: "number",
    headerSort: true,
    headerFilter: true,
    editor: "number",
  });

  // Performance score
  columns.push({
    title: "Performance",
    field: "performanceScore",
    width: 130,
    sorter: "number",
    filter: "number",
    headerSort: true,
    headerFilter: true,
    editor: "number",
  });

  // Training uren
  columns.push({
    title: "Training (u)",
    field: "trainingHours",
    width: 130,
    sorter: "number",
    filter: "number",
    headerSort: true,
    headerFilter: true,
    editor: "number",
  });

  // Start datum
  columns.push({
    title: "Start Datum",
    field: "startDate",
    width: 140,
    sorter: "string",
    filter: "string",
    headerSort: true,
    headerFilter: true,
    editor: "input",
  });

  // Genereer 400 numerieke kolommen
  for (let i = 1; i <= 400; i++) {
    const fieldName = `num_${i}`;
    const headerName = `Nummer ${i}`;

    columns.push({
      title: headerName,
      field: fieldName,
      width: 120,
      sorter: "number",
      filter: "number",
      headerSort: true,
      headerFilter: true,
      editor: "number",
    });
  }

  // Genereer 90 tekst kolommen
  for (let i = 1; i <= 90; i++) {
    const fieldName = `text_${i}`;
    const headerName = `Tekst ${i}`;

    columns.push({
      title: headerName,
      field: fieldName,
      width: 150,
      sorter: "string",
      filter: "string",
      headerSort: true,
      headerFilter: true,
      editor: "input",
    });
  }

  console.log(`Generated ${columns.length} columns (target: 500)`);
  return columns;
}
