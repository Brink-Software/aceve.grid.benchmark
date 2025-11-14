// ============================================
// Kolom Definities voor Wijmo Grid - 500 Kolommen
// ============================================

import { WijmoColumn } from "./types.js";

export function generateColumnDefinitions(): WijmoColumn[] {
  const columns: WijmoColumn[] = [];

  // Actie kolom (voor delete)
  columns.push({
    binding: "actions",
    header: "Actions",
    width: 100,
    isReadOnly: true,
    allowSorting: false,
    allowFiltering: false,
  });

  // ID kolom
  columns.push({
    binding: "id",
    header: "ID",
    width: 80,
    allowSorting: true,
    allowFiltering: true,
  });

  // Naam kolom
  columns.push({
    binding: "name",
    header: "Naam",
    width: 180,
    allowSorting: true,
    allowFiltering: true,
  });

  // Email kolom
  columns.push({
    binding: "email",
    header: "Email",
    width: 200,
    allowSorting: true,
    allowFiltering: true,
  });

  // Department kolom (voor grouping) - VISIBLE so grouping headers show
  columns.push({
    binding: "department",
    header: "Afdeling",
    width: 150,
    allowSorting: true,
    allowFiltering: true,
  });

  // Team kolom (voor grouping) - VISIBLE so grouping headers show
  columns.push({
    binding: "team",
    header: "Team",
    width: 150,
    allowSorting: true,
    allowFiltering: true,
  });

  // Rol kolom
  columns.push({
    binding: "role",
    header: "Rol",
    width: 180,
    allowSorting: true,
    allowFiltering: true,
  });

  // Salaris kolom
  columns.push({
    binding: "salary",
    header: "Salaris (€)",
    width: 140,
    allowSorting: true,
    allowFiltering: true,
    format: "c2",
    aggregate: "Sum",
  });

  // Jaren ervaring
  columns.push({
    binding: "yearsExperience",
    header: "Ervaring (jr)",
    width: 130,
    allowSorting: true,
    allowFiltering: true,
    format: "n1",
    aggregate: "Avg",
  });

  // Projecten voltooid
  columns.push({
    binding: "projectsCompleted",
    header: "Projecten",
    width: 120,
    allowSorting: true,
    allowFiltering: true,
    aggregate: "Sum",
  });

  // Performance score
  columns.push({
    binding: "performanceScore",
    header: "Performance",
    width: 130,
    allowSorting: true,
    allowFiltering: true,
    format: "n1",
    aggregate: "Avg",
  });

  // Training uren
  columns.push({
    binding: "trainingHours",
    header: "Training (u)",
    width: 130,
    allowSorting: true,
    allowFiltering: true,
    aggregate: "Sum",
  });

  // Start datum
  columns.push({
    binding: "startDate",
    header: "Start Datum",
    width: 140,
    allowSorting: true,
    allowFiltering: true,
  });

  // Genereer 400 numerieke kolommen
  for (let i = 1; i <= 400; i++) {
    const fieldName = `num_${i}`;
    const headerName = `Nummer ${i}`;

    columns.push({
      binding: fieldName,
      header: headerName,
      width: 120,
      allowSorting: true,
      allowFiltering: true,
      format: "n2",
      aggregate: "Sum",
    });
  }

  // Genereer 90 tekst kolommen
  for (let i = 1; i <= 90; i++) {
    const fieldName = `text_${i}`;
    const headerName = `Tekst ${i}`;

    columns.push({
      binding: fieldName,
      header: headerName,
      width: 150,
      allowSorting: true,
      allowFiltering: true,
    });
  }

  console.log(`Generated ${columns.length} columns (target: 500)`);
  return columns;
}
