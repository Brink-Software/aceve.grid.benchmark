// ============================================
// Simple, optimized column definitions - no complex renderers, no aggregations
// ============================================

export function generateColumnDefinitions() {
  const columns = [];

  // ID column - pinned left for easy reference
  columns.push({
    field: "id",
    headerName: "ID",
    width: 80,
    pinned: "left",
    filter: "agNumberColumnFilter",
    editable: false,
  });

  // Name column - pinned left
  columns.push({
    field: "name",
    headerName: "Naam",
    width: 180,
    pinned: "left",
    filter: "agTextColumnFilter",
    editable: true,
  });

  // Email column
  columns.push({
    field: "email",
    headerName: "Email",
    width: 200,
    filter: "agTextColumnFilter",
    editable: true,
  });

  // Department column - visible (no grouping)
  columns.push({
    field: "department",
    headerName: "Afdeling",
    width: 150,
    filter: "agTextColumnFilter",
    editable: true,
  });

  // Team column - visible (no grouping)
  columns.push({
    field: "team",
    headerName: "Team",
    width: 150,
    filter: "agTextColumnFilter",
    editable: true,
  });

  // Role column
  columns.push({
    field: "role",
    headerName: "Rol",
    width: 180,
    filter: "agTextColumnFilter",
    editable: true,
  });

  // Salary column - simple valueFormatter only
  columns.push({
    field: "salary",
    headerName: "Salaris (€)",
    width: 140,
    filter: "agNumberColumnFilter",
    editable: true,
    valueFormatter: (params) => {
      if (params.value == null) return "";
      return "€ " + params.value.toLocaleString("nl-NL");
    },
  });

  // Years experience
  columns.push({
    field: "yearsExperience",
    headerName: "Ervaring (jr)",
    width: 130,
    filter: "agNumberColumnFilter",
    editable: true,
    valueFormatter: (params) => {
      if (params.value == null) return "";
      return params.value + " jr";
    },
  });

  // Projects completed
  columns.push({
    field: "projectsCompleted",
    headerName: "Projecten",
    width: 120,
    filter: "agNumberColumnFilter",
    editable: true,
  });

  // Performance score
  columns.push({
    field: "performanceScore",
    headerName: "Performance",
    width: 130,
    filter: "agNumberColumnFilter",
    editable: true,
    valueFormatter: (params) => {
      if (params.value == null) return "";
      return params.value.toFixed(1);
    },
  });

  // Training hours
  columns.push({
    field: "trainingHours",
    headerName: "Training (u)",
    width: 130,
    filter: "agNumberColumnFilter",
    editable: true,
    valueFormatter: (params) => {
      if (params.value == null) return "";
      return params.value + " u";
    },
  });

  // Start date
  columns.push({
    field: "startDate",
    headerName: "Start Datum",
    width: 140,
    filter: "agDateColumnFilter",
    editable: true,
  });

  // Generate 25 numeric columns - simple, no formatters for performance
  for (let i = 1; i <= 25; i++) {
    columns.push({
      field: `num_${i}`,
      headerName: `Nummer ${i}`,
      width: 120,
      filter: "agNumberColumnFilter",
      editable: true,
      // Simple formatter - no locale for better performance
      valueFormatter: (params) => {
        if (params.value == null) return "";
        return params.value.toFixed(2);
      },
    });
  }

  // Generate 5 text columns - minimal config
  for (let i = 1; i <= 5; i++) {
    columns.push({
      field: `text_${i}`,
      headerName: `Tekst ${i}`,
      width: 150,
      filter: "agTextColumnFilter",
      editable: true,
    });
  }

  console.log(`Generated ${columns.length} columns (target: 100)`);
  return columns;
}
