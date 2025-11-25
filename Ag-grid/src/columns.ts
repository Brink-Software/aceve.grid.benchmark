// ============================================
// Kolom Definities - 40 Kolommen
// ============================================

import { CustomCellRendererParams } from "./types.js";

interface ColDef {
  field?: string;
  headerName?: string;
  width?: number;
  sortable?: boolean;
  filter?: boolean;
  editable?: boolean;
  pinned?: string;
  lockPosition?: boolean;
  rowGroup?: boolean;
  hide?: boolean;
  type?: string;
  aggFunc?: string;
  enableValue?: boolean;
  valueFormatter?: (params: any) => string;
  cellRenderer?: (params: any) => any;
  [key: string]: any;
}

export function generateColumnDefinitions(): ColDef[] {
  const columns: ColDef[] = [];

  // ID kolom
  columns.push({
    field: "id",
    headerName: "ID",
    width: 80,
    sortable: true,
    filter: true,
    pinned: "left",
  });

  // Naam kolom
  columns.push({
    field: "name",
    headerName: "Naam",
    width: 180,
    sortable: true,
    filter: true,
    editable: true,
    pinned: "left",
  });

  // Email kolom
  columns.push({
    field: "email",
    headerName: "Email",
    width: 200,
    sortable: true,
    filter: true,
    editable: true,
  });

  // Department kolom (voor grouping)
  columns.push({
    field: "department",
    headerName: "Afdeling",
    width: 150,
    sortable: true,
    filter: true,
    editable: true,
    hide: true,
  });

  // Team kolom (voor grouping)
  columns.push({
    field: "team",
    headerName: "Team",
    width: 150,
    sortable: true,
    filter: true,
    editable: true,
    hide: true,
  });

  // Rol kolom
  columns.push({
    field: "role",
    headerName: "Rol",
    width: 180,
    sortable: true,
    filter: true,
    editable: true,
  });

  // Salaris kolom
  columns.push({
    field: "salary",
    headerName: "Salaris (€)",
    width: 140,
    sortable: true,
    filter: true,
    editable: true,
    type: "numberColumn",
    aggFunc: "sum",
    enableValue: true,
    valueFormatter: (params: any) => {
      if (!params.value && params.value !== 0) return "";
      if (typeof params.value !== "number") return "";
      return "€ " + params.value.toLocaleString("nl-NL");
    },
    cellRenderer: function (params: CustomCellRendererParams) {
      if (params.node.group) {
        const value = params.value;
        if (
          value !== null &&
          value !== undefined &&
          typeof value === "number"
        ) {
          return "<strong>€ " + value.toLocaleString("nl-NL") + "</strong>";
        }
        return "";
      }
      if (params.node.rowPinned === "bottom") return "";
      if (params.value && typeof params.value === "number") {
        return "€ " + params.value.toLocaleString("nl-NL");
      }
      return "";
    },
  });

  // Jaren ervaring
  columns.push({
    field: "yearsExperience",
    headerName: "Ervaring (jr)",
    width: 130,
    sortable: true,
    filter: true,
    editable: true,
    type: "numberColumn",
    aggFunc: "avg",
    enableValue: true,
    valueFormatter: (params: any) => {
      if (!params.value && params.value !== 0) return "";
      if (typeof params.value !== "number") return "";
      return params.value.toFixed(1) + " jaar";
    },
    cellRenderer: function (params: CustomCellRendererParams) {
      if (params.node.group) {
        const value = params.value;
        if (
          value !== null &&
          value !== undefined &&
          typeof value === "number"
        ) {
          return "<strong>" + value.toFixed(1) + " jaar</strong>";
        }
        return "";
      }
      if (params.node.rowPinned === "bottom") return "";
      return params.value ? params.value + " jaar" : "";
    },
  });

  // Projecten voltooid
  columns.push({
    field: "projectsCompleted",
    headerName: "Projecten",
    width: 120,
    sortable: true,
    filter: true,
    editable: true,
    type: "numberColumn",
    aggFunc: "sum",
    enableValue: true,
    valueFormatter: (params: any) => {
      if (!params.value && params.value !== 0) return "";
      if (typeof params.value !== "number") return "";
      return params.value.toString();
    },
    cellRenderer: function (params: CustomCellRendererParams) {
      if (params.node.group) {
        const value = params.value;
        if (value !== null && value !== undefined) {
          return "<strong>" + value + "</strong>";
        }
        return "";
      }
      if (params.node.rowPinned === "bottom") return "";
      return params.value || "";
    },
  });

  // Performance score
  columns.push({
    field: "performanceScore",
    headerName: "Performance",
    width: 130,
    sortable: true,
    filter: true,
    editable: true,
    type: "numberColumn",
    aggFunc: "avg",
    enableValue: true,
    valueFormatter: (params: any) => {
      if (!params.value && params.value !== 0) return "";
      if (typeof params.value !== "number") return "";
      return params.value.toFixed(1);
    },
    cellRenderer: function (params: CustomCellRendererParams) {
      if (params.node.group) {
        const value = params.value;
        if (
          value !== null &&
          value !== undefined &&
          typeof value === "number"
        ) {
          const color =
            value >= 90
              ? "#4CAF50"
              : value >= 80
              ? "#8BC34A"
              : value >= 70
              ? "#FFC107"
              : "#F44336";
          return (
            '<strong style="color: ' +
            color +
            '">' +
            value.toFixed(1) +
            "</strong>"
          );
        }
        return "";
      }
      if (params.node.rowPinned === "bottom") return "";
      if (params.value && typeof params.value === "number") {
        const color =
          params.value >= 90
            ? "#4CAF50"
            : params.value >= 80
            ? "#8BC34A"
            : params.value >= 70
            ? "#FFC107"
            : "#F44336";
        return (
          '<span style="color: ' +
          color +
          '">' +
          params.value.toFixed(1) +
          "</span>"
        );
      }
      return "";
    },
  });

  // Training uren
  columns.push({
    field: "trainingHours",
    headerName: "Training (u)",
    width: 130,
    sortable: true,
    filter: true,
    editable: true,
    type: "numberColumn",
    aggFunc: "sum",
    enableValue: true,
    valueFormatter: (params: any) => {
      if (!params.value && params.value !== 0) return "";
      if (typeof params.value !== "number") return "";
      return params.value + " uur";
    },
    cellRenderer: function (params: CustomCellRendererParams) {
      if (params.node.group) {
        const value = params.value;
        if (
          value !== null &&
          value !== undefined &&
          typeof value === "number"
        ) {
          return "<strong>" + value + " uur</strong>";
        }
        return "";
      }
      if (params.node.rowPinned === "bottom") return "";
      if (params.value && typeof params.value === "number") {
        return params.value + " uur";
      }
      return "";
    },
  });

  // Start datum
  columns.push({
    field: "startDate",
    headerName: "Start Datum",
    width: 140,
    sortable: true,
    filter: true,
    editable: true,
    cellRenderer: function (params: CustomCellRendererParams) {
      if (params.node.rowPinned === "bottom") return "";
      if (params.node.group) return "";
      return params.value;
    },
  });

  // Genereer 25 numerieke kolommen
  for (let i = 1; i <= 25; i++) {
    const fieldName = `num_${i}`;
    const headerName = `Nummer ${i}`;

    columns.push({
      field: fieldName,
      headerName: headerName,
      width: 120,
      sortable: true,
      filter: true,
      editable: true,
      type: "numberColumn",
      aggFunc: "sum",
      enableValue: true,
      valueFormatter: (params: any) => {
        if (!params.value && params.value !== 0) return "";
        if (typeof params.value !== "number") return "";
        return params.value.toLocaleString("nl-NL", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
      cellRenderer: function (params: CustomCellRendererParams) {
        if (params.node.group) {
          const value = params.value;
          if (
            value !== null &&
            value !== undefined &&
            typeof value === "number"
          ) {
            return (
              "<strong>" +
              value.toLocaleString("nl-NL", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) +
              "</strong>"
            );
          }
          return "";
        }
        if (params.node.rowPinned === "bottom") return "";
        if (params.value && typeof params.value === "number") {
          return params.value.toLocaleString("nl-NL", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        }
        return "";
      },
    });
  }

  // Genereer 5 tekst kolommen
  for (let i = 1; i <= 5; i++) {
    const fieldName = `text_${i}`;
    const headerName = `Tekst ${i}`;

    columns.push({
      field: fieldName,
      headerName: headerName,
      width: 150,
      sortable: true,
      filter: true,
      editable: true,
      cellRenderer: function (params: CustomCellRendererParams) {
        if (params.node.rowPinned === "bottom") return "";
        if (params.node.group) return "";
        return params.value || "";
      },
    });
  }

  console.log(`Generated ${columns.length} columns (target: 40)`);
  return columns;
}
