import { ColDef } from 'ag-grid-community';

// Simple, optimized column definitions - no complex renderers, no aggregations
export function generateColumnDefinitions(): ColDef[] {
  const columns: ColDef[] = [];

  // ID kolom - pinned left for easy reference
  columns.push({
    field: 'id',
    headerName: 'ID',
    width: 80,
    pinned: 'left',
    filter: 'agNumberColumnFilter',
    editable: false,
  });

  // Naam kolom - pinned left
  columns.push({
    field: 'name',
    headerName: 'Naam',
    width: 180,
    pinned: 'left',
    filter: 'agTextColumnFilter',
    editable: true,
  });

  // Email kolom
  columns.push({
    field: 'email',
    headerName: 'Email',
    width: 200,
    filter: 'agTextColumnFilter',
    editable: true,
  });

  // Department kolom - visible (no grouping)
  columns.push({
    field: 'department',
    headerName: 'Afdeling',
    width: 150,
    filter: 'agTextColumnFilter',
    editable: true,
  });

  // Team kolom - visible (no grouping)
  columns.push({
    field: 'team',
    headerName: 'Team',
    width: 150,
    filter: 'agTextColumnFilter',
    editable: true,
  });

  // Rol kolom
  columns.push({
    field: 'role',
    headerName: 'Rol',
    width: 180,
    filter: 'agTextColumnFilter',
    editable: true,
  });

  // Salaris kolom - simple valueFormatter only
  columns.push({
    field: 'salary',
    headerName: 'Salaris (€)',
    width: 140,
    filter: 'agNumberColumnFilter',
    editable: true,
    valueFormatter: (params) => {
      if (params.value == null) return '';
      return '€ ' + params.value.toLocaleString('nl-NL');
    },
  });

  // Jaren ervaring
  columns.push({
    field: 'yearsExperience',
    headerName: 'Ervaring (jr)',
    width: 130,
    filter: 'agNumberColumnFilter',
    editable: true,
    valueFormatter: (params) => {
      if (params.value == null) return '';
      return params.value + ' jr';
    },
  });

  // Projecten voltooid
  columns.push({
    field: 'projectsCompleted',
    headerName: 'Projecten',
    width: 120,
    filter: 'agNumberColumnFilter',
    editable: true,
  });

  // Performance score
  columns.push({
    field: 'performanceScore',
    headerName: 'Performance',
    width: 130,
    filter: 'agNumberColumnFilter',
    editable: true,
    valueFormatter: (params) => {
      if (params.value == null) return '';
      return params.value.toFixed(1);
    },
  });

  // Training uren
  columns.push({
    field: 'trainingHours',
    headerName: 'Training (u)',
    width: 130,
    filter: 'agNumberColumnFilter',
    editable: true,
    valueFormatter: (params) => {
      if (params.value == null) return '';
      return params.value + ' u';
    },
  });

  // Start datum
  columns.push({
    field: 'startDate',
    headerName: 'Start Datum',
    width: 140,
    filter: 'agDateColumnFilter',
    editable: true,
  });

  // Generate 400 numeric columns - simple, no formatters for performance
  for (let i = 1; i <= 400; i++) {
    columns.push({
      field: `num_${i}`,
      headerName: `Nummer ${i}`,
      width: 120,
      filter: 'agNumberColumnFilter',
      editable: true,
      // Simple formatter - no locale for better performance
      valueFormatter: (params) => {
        if (params.value == null) return '';
        return params.value.toFixed(2);
      },
    });
  }

  // Generate 90 text columns - minimal config
  for (let i = 1; i <= 90; i++) {
    columns.push({
      field: `text_${i}`,
      headerName: `Tekst ${i}`,
      width: 150,
      filter: 'agTextColumnFilter',
      editable: true,
    });
  }

  return columns;
}

