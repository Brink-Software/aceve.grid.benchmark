// ============================================
// Data Generator voor Canvas Grid - gebruikt shared data.ts
// ============================================

import { departments, teams, roles, generateEmployee } from "../../src/data.js";

export interface GridData {
  id: number;
  [key: string]: any;
}

export async function generateData(
  rowCount: number,
  columnCount: number,
  onProgress?: (count: number) => void
): Promise<GridData[]> {
  const data: GridData[] = [];

  console.log(`Genereren van ${rowCount} rijen met ${columnCount} kolommen...`);
  const startTime = performance.now();

  let nextId = 1;
  const targetRows = rowCount;
  const chunkSize = 5000; // Process in chunks of 5000 rows

  // Gebruik de shared data generatie logica
  while (data.length < targetRows) {
    const chunkStart = data.length;

    departments.forEach((dept) => {
      if (data.length >= targetRows || data.length >= chunkStart + chunkSize)
        return;

      const deptTeams = teams[dept.name] || [];

      deptTeams.forEach((team) => {
        if (data.length >= targetRows || data.length >= chunkStart + chunkSize)
          return;

        const teamRoles = roles[dept.name] || [];
        const employeesPerTeam = Math.floor(Math.random() * 50) + 20;

        for (
          let i = 0;
          i < employeesPerTeam &&
          data.length < targetRows &&
          data.length < chunkStart + chunkSize;
          i++
        ) {
          const role = teamRoles[Math.floor(Math.random() * teamRoles.length)];
          const employee = generateEmployee(nextId++, dept.name, team, role);
          data.push(employee);
        }
      });
    });

    // Progress update after each chunk
    if (onProgress) {
      onProgress(data.length);
    }
    console.log(`Gegenereerd: ${data.length} rijen`);

    // Yield to UI every chunk
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  // Final progress update
  if (onProgress) {
    onProgress(data.length);
  }

  const endTime = performance.now();
  console.log(
    `Data generatie voltooid in ${(endTime - startTime).toFixed(2)}ms`
  );
  console.log(`Gegenereerde kolommen: ${Object.keys(data[0] || {}).length}`);

  return data;
}

export function calculateColumnSum(
  data: GridData[],
  columnKey: string
): number {
  return data.reduce((sum, row) => {
    const value = row[columnKey];
    return sum + (typeof value === "number" ? value : 0);
  }, 0);
}
