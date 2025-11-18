// ============================================
// RevoGrid Organisatie Tabel met CRUD en Row Grouping
// ============================================

import {
  departments,
  teams,
  roles,
  generateEmployee,
  generateChunk,
  NextIdState,
} from "../../src/data.js";
import { generateColumnDefinitions } from "./columns.js";

console.log("RevoGrid App.ts module geladen!");
console.log("Departments loaded:", departments?.length || 0);
console.log("Teams loaded:", Object.keys(teams || {}).length);
console.log("Roles loaded:", Object.keys(roles || {}).length);

// ============================================
// Loading Spinner Functions
// ============================================

function showSpinner() {
  const spinner = document.getElementById("loadingSpinner");
  const grid = document.getElementById("myGrid");
  if (spinner) {
    spinner.style.display = "flex";
  }
  if (grid) {
    grid.style.display = "none";
  }
}

function hideSpinner() {
  const spinner = document.getElementById("loadingSpinner");
  const grid = document.getElementById("myGrid");
  if (spinner) {
    spinner.style.display = "none";
  }
  if (grid) {
    grid.style.display = "block";
    grid.style.visibility = "visible";
    grid.style.opacity = "1";
  }
}

function updateLoadingProgress(count: number) {
  const progressEl = document.getElementById("loadingProgress");
  if (progressEl) {
    progressEl.textContent = count.toLocaleString("nl-NL");
  }
}

// Performance resultaat weergeven
function showPerformanceResult(
  operation: string,
  time: string,
  dataTest: string
) {
  let perfIndicator = document.getElementById("performanceIndicator");
  if (!perfIndicator) {
    perfIndicator = document.createElement("div");
    perfIndicator.id = "performanceIndicator";
    perfIndicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #0078d4;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 10000;
      font-family: 'Segoe UI', sans-serif;
      font-size: 14px;
      font-weight: 600;
      min-width: 200px;
    `;
    document.body.appendChild(perfIndicator);
  }

  perfIndicator.innerHTML = `
    <div style="font-size: 12px; opacity: 0.9; margin-bottom: 4px;">${operation}</div>
    <div style="font-size: 18px;" data-test="performance-tijd">${time}</div>
  `;

  perfIndicator.setAttribute("data-test", `performance-indicator-${dataTest}`);

  setTimeout(() => {
    if (perfIndicator && perfIndicator.parentNode) {
      perfIndicator.style.transition = "opacity 0.5s";
      perfIndicator.style.opacity = "0";
      setTimeout(() => {
        if (perfIndicator && perfIndicator.parentNode) {
          perfIndicator.parentNode.removeChild(perfIndicator);
        }
      }, 500);
    }
  }, 3000);
}

// ============================================
// Data Initialisatie
// ============================================

showSpinner();

let rowData: any[] = [];
let nextId = 1;
const columnDefs = generateColumnDefinitions();

// Global grid variable
let grid: any = null;

let dataGenerationStart: number = 0;

async function generateDataWithProgress() {
  dataGenerationStart = performance.now();
  const startMemory = (performance as any).memory
    ? (performance as any).memory.usedJSHeapSize
    : 0;

  console.log("=== PERFORMANCE METING: DATA GENERATIE ===");
  console.log("Method: JavaScript");
  console.log("Start tijd:", dataGenerationStart);
  if (startMemory) {
    console.log(
      "Start geheugen:",
      (startMemory / 1024 / 1024).toFixed(2),
      "MB"
    );
  }

  const targetRows = 200000;
  const chunkSize = 5000; // Smaller chunks for better UI responsiveness

  const nextIdState: NextIdState = {
    value: nextId,
    getValue(): number {
      return this.value;
    },
    setValue(value: number): void {
      this.value = value;
    },
    increment(): number {
      return this.value++;
    },
  };

  try {
    await generateChunk(
      rowData,
      targetRows,
      nextIdState,
      updateLoadingProgress,
      chunkSize
    );

    nextId = nextIdState.getValue();

    console.log("Data generatie succesvol:", rowData.length, "rijen");
  } catch (error: any) {
    console.error("Fout bij data generatie:", error);
    alert("Fout bij data generatie: " + error.message);
    hideSpinner();
    return;
  }

  const dataGenerationEnd = performance.now();
  const dataGenerationTime = dataGenerationEnd - dataGenerationStart;
  const endMemory = (performance as any).memory
    ? (performance as any).memory.usedJSHeapSize
    : 0;

  console.log(`Generated ${rowData.length} employees`);
  console.log("=== PERFORMANCE RESULTATEN: DATA GENERATIE ===");
  console.log("DATA GENERATIE TIJD:", dataGenerationTime.toFixed(2), "ms");
  console.log(
    "Data generatie snelheid:",
    (rowData.length / (dataGenerationTime / 1000)).toFixed(0),
    "rijen/seconde"
  );

  if (startMemory && endMemory) {
    const memoryDiff = endMemory - startMemory;
    console.log(
      "Geheugen gebruikt:",
      (memoryDiff / 1024 / 1024).toFixed(2),
      "MB"
    );
  }

  showPerformanceResult(
    "Data Generatie",
    dataGenerationTime.toFixed(2) + " ms",
    "data-generatie"
  );

  setTimeout(() => {
    const gridElement = document.getElementById("myGrid");
    if (gridElement) {
      gridElement.style.display = "block";
      gridElement.style.visibility = "visible";
    }

    hideSpinner();

    const gridInitStart = performance.now();
    console.log("=== PERFORMANCE METING: GRID INITIALISATIE ===");
    console.log("Grid init start tijd:", gridInitStart);

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
          initializeGrid(gridInitStart);
        }, 100);
      });
    } else {
      setTimeout(() => {
        initializeGrid(gridInitStart);
      }, 100);
    }
  }, 500);
}

generateDataWithProgress();

// ============================================
// CRUD Operations
// ============================================

export function addNewRow(): void {
  console.log("addNewRow called");

  if (!grid) {
    console.error("Grid niet beschikbaar");
    alert("Grid is nog niet geladen. Wacht even...");
    return;
  }

  const performanceStart = performance.now();
  const startMemory = (performance as any).memory
    ? (performance as any).memory.usedJSHeapSize
    : 0;

  console.log("=== PERFORMANCE METING: RIJ TOEVOEGEN ===");
  console.log("Start tijd:", performanceStart);
  if (startMemory) {
    console.log(
      "Start geheugen:",
      (startMemory / 1024 / 1024).toFixed(2),
      "MB"
    );
  }

  try {
    let selectedDept: string | null = null;
    let selectedTeam: string | null = null;

    // Get selected range
    const range = grid.getSelectedRange();
    if (range && range.y !== undefined) {
      const selectedRow = rowData[range.y];
      if (selectedRow) {
        selectedDept = selectedRow.department;
        selectedTeam = selectedRow.team;
      }
    }

    if (!selectedDept || !selectedTeam) {
      const dept = departments[Math.floor(Math.random() * departments.length)];
      const deptTeams = teams[dept.name] || [];
      selectedDept = dept.name;
      selectedTeam = deptTeams[Math.floor(Math.random() * deptTeams.length)];
    }

    const teamRoles = roles[selectedDept] || [];
    const role = teamRoles[Math.floor(Math.random() * teamRoles.length)];

    const newEmployee = generateEmployee(
      nextId++,
      selectedDept,
      selectedTeam,
      role
    );

    // Add row to data source
    rowData.push(newEmployee);

    // Update grid source
    grid.source = [...rowData];

    setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const renderEnd = performance.now();
          const totalTime = renderEnd - performanceStart;
          const endMemory = (performance as any).memory
            ? (performance as any).memory.usedJSHeapSize
            : 0;

          console.log("=== PERFORMANCE RESULTATEN: RIJ TOEVOEGEN ===");
          console.log("TOTALE TIJD:", totalTime.toFixed(2), "ms");

          if (startMemory && endMemory) {
            const memoryDiff = endMemory - startMemory;
            console.log(
              "Geheugen gebruik:",
              (memoryDiff / 1024 / 1024).toFixed(2),
              "MB"
            );
          }

          showPerformanceResult(
            "Rij Toevoegen",
            totalTime.toFixed(2) + " ms",
            "rij-toevoegen"
          );

          // Update statistics
          updateStatistics();
        });
      });
    }, 200);
  } catch (error: any) {
    console.error("Fout bij toevoegen van rij:", error);
    alert("Fout bij toevoegen van rij: " + error.message);
  }
}

export function deleteRow(id: number): void {
  console.log("deleteRow called with id:", id);
  if (!grid) {
    console.error("Grid niet beschikbaar");
    return;
  }

  const performanceStart = performance.now();
  const startMemory = (performance as any).memory
    ? (performance as any).memory.usedJSHeapSize
    : 0;

  console.log("=== PERFORMANCE METING: RIJ VERWIJDEREN ===");
  console.log("Start tijd:", performanceStart);
  if (startMemory) {
    console.log(
      "Start geheugen:",
      (startMemory / 1024 / 1024).toFixed(2),
      "MB"
    );
  }

  const rowIndex = rowData.findIndex((row: any) => row.id === id);
  if (rowIndex === -1) {
    console.warn("Rij niet gevonden voor verwijdering:", id);
    return;
  }

  rowData.splice(rowIndex, 1);
  grid.source = [...rowData];

  setTimeout(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const renderEnd = performance.now();
        const totalTime = renderEnd - performanceStart;
        const endMemory = (performance as any).memory
          ? (performance as any).memory.usedJSHeapSize
          : 0;

        console.log("=== PERFORMANCE RESULTATEN: RIJ VERWIJDEREN ===");
        console.log("TOTALE TIJD:", totalTime.toFixed(2), "ms");

        if (startMemory && endMemory) {
          const memoryDiff = startMemory - endMemory;
          console.log(
            "Geheugen vrijgekomen:",
            (Math.abs(memoryDiff) / 1024 / 1024).toFixed(2),
            "MB"
          );
        }

        showPerformanceResult(
          "Rij Verwijderen",
          totalTime.toFixed(2) + " ms",
          "rij-verwijderen"
        );

        // Update statistics
        updateStatistics();
      });
    });
  }, 200);
}

export function deleteSelectedRows(): void {
  console.log("deleteSelectedRows called");

  if (!grid) {
    console.error("Grid niet beschikbaar");
    return;
  }

  const range = grid.getSelectedRange();
  if (!range || range.y === undefined) {
    console.warn("Geen rijen geselecteerd voor verwijdering");
    return;
  }

  const performanceStart = performance.now();
  const startMemory = (performance as any).memory
    ? (performance as any).memory.usedJSHeapSize
    : 0;

  console.log("=== PERFORMANCE METING: MEERDERE RIJEN VERWIJDEREN ===");
  console.log("Start tijd:", performanceStart);
  if (startMemory) {
    console.log(
      "Start geheugen:",
      (startMemory / 1024 / 1024).toFixed(2),
      "MB"
    );
  }

  const selectedRow = rowData[range.y];
  if (selectedRow) {
    const index = rowData.findIndex((row: any) => row.id === selectedRow.id);
    if (index !== -1) {
      rowData.splice(index, 1);
    }
  }

  grid.source = [...rowData];

  setTimeout(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const renderEnd = performance.now();
        const totalTime = renderEnd - performanceStart;
        const endMemory = (performance as any).memory
          ? (performance as any).memory.usedJSHeapSize
          : 0;

        console.log(
          "=== PERFORMANCE RESULTATEN: MEERDERE RIJEN VERWIJDEREN ==="
        );
        console.log("TOTALE TIJD:", totalTime.toFixed(2), "ms");

        if (startMemory && endMemory) {
          const memoryDiff = startMemory - endMemory;
          console.log(
            "Geheugen vrijgekomen:",
            (Math.abs(memoryDiff) / 1024 / 1024).toFixed(2),
            "MB"
          );
        }

        showPerformanceResult(
          "Rijen Verwijderen",
          totalTime.toFixed(2) + " ms",
          "rijen-verwijderen"
        );

        // Update statistics
        updateStatistics();
        updateSelectedCount();
      });
    });
  }, 200);
}

// ============================================
// Expand/Collapse Functions
// ============================================

export function expandAllGroups(): void {
  console.log("expandAllGroups called");

  if (!grid) {
    console.error("Grid niet beschikbaar");
    return;
  }

  const performanceStart = performance.now();
  const startMemory = (performance as any).memory
    ? (performance as any).memory.usedJSHeapSize
    : 0;

  console.log("=== PERFORMANCE METING: ALLES UITKLAPPEN ===");
  console.log("Start tijd:", performanceStart);
  if (startMemory) {
    console.log(
      "Start geheugen:",
      (startMemory / 1024 / 1024).toFixed(2),
      "MB"
    );
  }

  try {
    // Get all group rows and expand them
    const groups = grid.querySelectorAll('.rgRow[data-rgRow="group"]');
    groups.forEach((group: any) => {
      if (group && !group.classList.contains("group-expanded")) {
        group.click();
      }
    });

    console.log(`Expanded ${groups.length} groups`);
  } catch (error) {
    console.error("Error expanding groups:", error);
  }

  setTimeout(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const renderEnd = performance.now();
        const totalTime = renderEnd - performanceStart;
        const endMemory = (performance as any).memory
          ? (performance as any).memory.usedJSHeapSize
          : 0;

        console.log("=== PERFORMANCE RESULTATEN: ALLES UITKLAPPEN ===");
        console.log("TOTALE TIJD:", totalTime.toFixed(2), "ms");

        if (startMemory && endMemory) {
          const memoryDiff = endMemory - startMemory;
          console.log(
            "Geheugen gebruik:",
            (memoryDiff / 1024 / 1024).toFixed(2),
            "MB"
          );
        }

        showPerformanceResult(
          "Alles Uitklappen",
          totalTime.toFixed(2) + " ms",
          "alles-uitklappen"
        );
      });
    });
  }, 200);
}

export function collapseAllGroups(): void {
  console.log("collapseAllGroups called");

  if (!grid) {
    console.error("Grid niet beschikbaar");
    return;
  }

  const performanceStart = performance.now();
  const startMemory = (performance as any).memory
    ? (performance as any).memory.usedJSHeapSize
    : 0;

  console.log("=== PERFORMANCE METING: ALLES INKLAPPEN ===");
  console.log("Start tijd:", performanceStart);
  if (startMemory) {
    console.log(
      "Start geheugen:",
      (startMemory / 1024 / 1024).toFixed(2),
      "MB"
    );
  }

  try {
    // Get all expanded group rows and collapse them
    const groups = grid.querySelectorAll(
      '.rgRow[data-rgRow="group"].group-expanded'
    );
    groups.forEach((group: any) => {
      if (group) {
        group.click();
      }
    });

    console.log(`Collapsed ${groups.length} groups`);
  } catch (error) {
    console.error("Error collapsing groups:", error);
  }

  setTimeout(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const renderEnd = performance.now();
        const totalTime = renderEnd - performanceStart;
        const endMemory = (performance as any).memory
          ? (performance as any).memory.usedJSHeapSize
          : 0;

        console.log("=== PERFORMANCE RESULTATEN: ALLES INKLAPPEN ===");
        console.log("TOTALE TIJD:", totalTime.toFixed(2), "ms");

        if (startMemory && endMemory) {
          const memoryDiff = startMemory - endMemory;
          console.log(
            "Geheugen vrijgekomen:",
            (Math.abs(memoryDiff) / 1024 / 1024).toFixed(2),
            "MB"
          );
        }

        showPerformanceResult(
          "Alles Inklappen",
          totalTime.toFixed(2) + " ms",
          "alles-inklappen"
        );
      });
    });
  }, 200);
}

// ============================================
// Event Handlers
// ============================================

function updateSelectedCount() {
  const selectedCountEl = document.getElementById("selectedCount");
  const deleteBtn = document.getElementById(
    "deleteRowsBtn"
  ) as HTMLButtonElement;
  const addRowBtn = document.getElementById("addRowBtn") as HTMLButtonElement;

  if (!grid) return;

  const range = grid.getSelectedRange();
  const hasSelection = range && range.y !== undefined;

  if (selectedCountEl) {
    selectedCountEl.textContent = hasSelection ? "1" : "0";
  }
  if (deleteBtn) {
    deleteBtn.disabled = !hasSelection;
  }
  if (addRowBtn) {
    addRowBtn.disabled = !hasSelection;
    if (!hasSelection) {
      addRowBtn.title =
        "Selecteer eerst een rij of groep om een nieuwe rij toe te voegen";
    } else {
      addRowBtn.title = "Voeg een nieuwe rij toe in dezelfde groep";
    }
  }
}

function updateStatistics() {
  const departmentsSet = new Set(rowData.map((e: any) => e.department));
  const teamsSet = new Set(rowData.map((e: any) => e.team));

  const totalEmployeesEl = document.getElementById("totalEmployees");
  const totalDepartmentsEl = document.getElementById("totalDepartments");
  const totalTeamsEl = document.getElementById("totalTeams");

  if (totalEmployeesEl) {
    totalEmployeesEl.textContent = rowData.length.toString();
  }
  if (totalDepartmentsEl) {
    totalDepartmentsEl.textContent = departmentsSet.size.toString();
  }
  if (totalTeamsEl) {
    totalTeamsEl.textContent = teamsSet.size.toString();
  }
}

function setupEventHandlers() {
  const expandAllBtn = document.getElementById("expandAllBtn");
  const collapseAllBtn = document.getElementById("collapseAllBtn");
  const deleteRowsBtn = document.getElementById("deleteRowsBtn");
  const addRowBtn = document.getElementById("addRowBtn");

  console.log("Setting up event handlers");

  if (expandAllBtn) {
    expandAllBtn.addEventListener("click", () => {
      expandAllGroups();
    });
  }

  if (collapseAllBtn) {
    collapseAllBtn.addEventListener("click", () => {
      collapseAllGroups();
    });
  }

  if (deleteRowsBtn) {
    deleteRowsBtn.addEventListener("click", () => {
      deleteSelectedRows();
    });
  }

  if (addRowBtn) {
    addRowBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("Add row button clicked");
      addNewRow();
    });
    console.log("Add row button event listener attached");
  } else {
    console.warn("Add row button not found!");
  }

  // Listen to grid selection changes
  if (grid) {
    grid.addEventListener("afterselection", () => {
      updateSelectedCount();
    });
  }
}

// ============================================
// Initialisatie
// ============================================

function initializeGrid(gridInitStartTime?: number) {
  console.log("Initializing RevoGrid...");

  const gridElement = document.querySelector("#myGrid") as any;

  if (!gridElement) {
    console.error("Grid element niet gevonden!");
    return;
  }

  const initStart = gridInitStartTime || performance.now();

  gridElement.style.display = "block";
  gridElement.style.visibility = "visible";
  gridElement.style.opacity = "1";

  console.log("=== Initializing RevoGrid organization grid ===");
  console.log("Employees:", rowData.length);
  console.log("Columns:", columnDefs.length);

  try {
    const gridCreateStart = performance.now();

    // Set grid properties with performance optimizations
    grid = gridElement;
    grid.source = rowData;
    grid.columns = columnDefs;
    grid.resize = true;
    grid.range = true;
    grid.readonly = false;
    grid.canFocus = true;
    grid.useClipboard = true;
    grid.rowSize = 32;
    grid.theme = "default";

    // Performance optimizations for large datasets
    grid.frameSize = 20; // Reduced for better memory with grouping
    grid.autoSizeColumn = false; // Disable auto-sizing for performance

    // Enable row grouping by department and team
    // grid.grouping = {
    //   props: ["department", "team"],
    //   expandedAll: false, // Start collapsed to save memory
    // };
    const gridCreateEnd = performance.now();
    console.log("Grid created successfully");
    console.log(
      "Grid creation tijd:",
      (gridCreateEnd - gridCreateStart).toFixed(2),
      "ms"
    );

    setTimeout(() => {
      if (grid) {
        console.log("Grid API beschikbaar");
        console.log("RowData length:", rowData.length);

        updateStatistics();

        console.log("########Waiting for grid to stabilize...#########");

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const gridStableEnd = performance.now();
              const totalGridInitTime = gridStableEnd - initStart;

              console.log("=== PERFORMANCE RESULTATEN: GRID INITIALISATIE ===");
              console.log(
                "Grid creation tijd:",
                (gridCreateEnd - gridCreateStart).toFixed(2),
                "ms"
              );
              console.log(
                "TOTALE GRID STABIEL TIJD:",
                totalGridInitTime.toFixed(2),
                "ms"
              );
              console.log("Rijen geladen:", rowData.length);
              console.log("Kolommen:", columnDefs.length);

              showPerformanceResult(
                "Grid Stabiel",
                totalGridInitTime.toFixed(2) + " ms",
                "grid-stabiel"
              );

              const totalStartTime =
                dataGenerationStart > 0 ? dataGenerationStart : initStart;
              const totalTime = gridStableEnd - totalStartTime;
              console.log("=== TOTALE TIJD: DATA GENERATIE + GRID STABIEL ===");
              console.log("TOTALE TIJD:", totalTime.toFixed(2), "ms");
              console.log(
                "Totaal snelheid:",
                (rowData.length / (totalTime / 1000)).toFixed(0),
                "rijen/seconde"
              );
            });
          });
        });
      }
    }, 500);

    setTimeout(() => {
      console.log("Setting up event handlers after 100ms");
      setupEventHandlers();

      const addRowBtn = document.getElementById(
        "addRowBtn"
      ) as HTMLButtonElement;
      if (addRowBtn) {
        addRowBtn.disabled = true;
        addRowBtn.title =
          "Selecteer eerst een rij of groep om een nieuwe rij toe te voegen";
      }

      console.log("Event handlers setup complete");
    }, 100);
  } catch (error: any) {
    console.error("Fout bij grid initialisatie:", error);
    setTimeout(() => {
      console.log("Setting up event handlers after grid init error");
      setupEventHandlers();
    }, 100);
  }
}

// Export functions voor gebruik in HTML
declare global {
  interface Window {
    addNewRow: () => void;
    deleteRow: (id: number) => void;
    deleteSelectedRows: () => void;
    expandAllGroups: () => void;
    collapseAllGroups: () => void;
  }
}

window.addNewRow = addNewRow;
window.deleteRow = deleteRow;
window.deleteSelectedRows = deleteSelectedRows;
window.expandAllGroups = expandAllGroups;
window.collapseAllGroups = collapseAllGroups;
