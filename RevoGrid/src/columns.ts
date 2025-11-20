// ============================================
// Kolom Definities voor RevoGrid - 500 Kolommen
// ============================================

import { RevoGridColumn } from "./types.js";

export function generateColumnDefinitions(): RevoGridColumn[] {
  const columns: RevoGridColumn[] = [];

  // ID kolom
  columns.push({
    prop: "id",
    name: "ID",
    size: 80,
    sortable: true,
    readonly: true,
  });

  // Naam kolom
  columns.push({
    prop: "name",
    name: "Naam",
    size: 180,
    sortable: true,
    readonly: false,
  });

  // Email kolom
  columns.push({
    prop: "email",
    name: "Email",
    size: 200,
    sortable: true,
    readonly: false,
  });

  // Department kolom (voor grouping)
  columns.push({
    prop: "department",
    name: "Afdeling",
    size: 150,
    sortable: true,
    readonly: false,
  });

  // Team kolom (voor grouping)
  columns.push({
    prop: "team",
    name: "Team",
    size: 150,
    sortable: true,
    readonly: false,
  });

  // Rol kolom
  columns.push({
    prop: "role",
    name: "Rol",
    size: 180,
    sortable: true,
    readonly: false,
  });

  // Salaris kolom - simplified for performance with large datasets
  columns.push({
    prop: "salary",
    name: "Salaris (€)",
    size: 140,
    sortable: true,
    readonly: false,
  });

  // Jaren ervaring
  columns.push({
    prop: "yearsExperience",
    name: "Ervaring (jr)",
    size: 130,
    sortable: true,
    readonly: false,
  });

  // Projecten voltooid
  columns.push({
    prop: "projectsCompleted",
    name: "Projecten",
    size: 120,
    sortable: true,
    readonly: false,
  });

  // Performance score
  columns.push({
    prop: "performanceScore",
    name: "Performance",
    size: 130,
    sortable: true,
    readonly: false,
  });

  // Training uren
  columns.push({
    prop: "trainingHours",
    name: "Training (u)",
    size: 130,
    sortable: true,
    readonly: false,
  });

  // Start datum
  columns.push({
    prop: "startDate",
    name: "Start Datum",
    size: 140,
    sortable: true,
    readonly: false,
  });

  // Genereer 400 numerieke kolommen
  for (let i = 1; i <= 400; i++) {
    const propName = `num_${i}`;
    const headerName = `Nummer ${i}`;

    columns.push({
      prop: propName,
      name: headerName,
      size: 120,
      sortable: true,
      readonly: false,
    });
  }

  // Genereer 87 tekst kolommen
  for (let i = 1; i <= 87; i++) {
    const propName = `text_${i}`;
    const headerName = `Tekst ${i}`;

    columns.push({
      prop: propName,
      name: headerName,
      size: 150,
      sortable: true,
      readonly: false,
    });
  }

  console.log(`Generated ${columns.length} columns (target: 500)`);
  return columns;
}
