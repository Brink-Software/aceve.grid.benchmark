// ============================================
// Wijmo Grid Organisatie Tabel met CRUD en Row Grouping
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

console.log("Wijmo App.ts module geladen!");
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
let collectionView: any = null;

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
  const chunkSize = 10000;

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
    const grid = document.getElementById("myGrid");
    if (grid) {
      grid.style.display = "block";
      grid.style.visibility = "visible";
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

  if (!grid || !collectionView) {
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

    const selectedRows = grid.selection.rows;
    if (selectedRows.length === 0) {
      alert(
        "Selecteer eerst een rij of groep om een nieuwe rij toe te voegen."
      );
      return;
    }

    const selectedIndex = selectedRows[0];
    const selectedItem = collectionView.items[selectedIndex];

    if (selectedItem) {
      selectedDept = selectedItem.department;
      selectedTeam = selectedItem.team;
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

    const insertIndex = selectedIndex + 1;

    rowData.splice(insertIndex, 0, newEmployee);
    collectionView.refresh();

    setTimeout(() => {
      grid.select(insertIndex, 1);
      grid.scrollIntoView(insertIndex, 0);

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
        });
      });
    }, 200);
  } catch (error: any) {
    console.error("Fout bij toevoegen van rij:", error);
    alert("Fout bij toevoegen van rij: " + error.message);
  }
}

export function deleteRow(id: number): void {
  console.log("deleteRow called");
  if (!grid || !collectionView) {
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

  const index = rowData.findIndex((row: any) => row.id === id);
  if (index === -1) {
    console.warn("Rij niet gevonden voor verwijdering:", id);
    return;
  }

  rowData.splice(index, 1);
  collectionView.refresh();

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
      });
    });
  }, 200);
}

export function deleteSelectedRows(): void {
  console.log("deleteSelectedRows called");

  if (!grid || !collectionView) {
    console.error("Grid niet beschikbaar");
    return;
  }

  const selectedRows = grid.selection.rows;
  if (selectedRows.length === 0) {
    console.warn("Geen rijen geselecteerd voor verwijdering");
    return;
  }

  const performanceStart = performance.now();
  const startMemory = (performance as any).memory
    ? (performance as any).memory.usedJSHeapSize
    : 0;

  console.log("=== PERFORMANCE METING: MEERDERE RIJEN VERWIJDEREN ===");
  console.log("Aantal rijen:", selectedRows.length);
  console.log("Start tijd:", performanceStart);
  if (startMemory) {
    console.log(
      "Start geheugen:",
      (startMemory / 1024 / 1024).toFixed(2),
      "MB"
    );
  }

  const idsToDelete = selectedRows
    .map((rowIndex: number) => collectionView.items[rowIndex])
    .filter((item: any) => item && item.id)
    .map((item: any) => item.id);

  idsToDelete.forEach((id: number) => {
    const index = rowData.findIndex((row: any) => row.id === id);
    if (index !== -1) {
      rowData.splice(index, 1);
    }
  });

  collectionView.refresh();

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
        console.log("Aantal rijen:", selectedRows.length);
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
          `Rijen Verwijderen (${selectedRows.length})`,
          totalTime.toFixed(2) + " ms",
          "rijen-verwijderen"
        );
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

  if (collectionView && collectionView.groupDescriptions) {
    // Expand all groups by refreshing with all groups visible
    collectionView.refresh();
    // Wijmo automatically shows groups when groupDescriptions are set
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

  if (collectionView && collectionView.groupDescriptions) {
    const wijmo = (window as any).wijmo;
    // Clear grouping to collapse
    collectionView.groupDescriptions.clear();
    collectionView.refresh();
    // Re-add grouping to show collapsed state
    const GroupDescriptionClass = getGroupDescriptionClass(wijmo);
    const groupDesc = new GroupDescriptionClass((item: any) => item.department);
    collectionView.groupDescriptions.push(groupDesc);
    const teamGroupDesc = new GroupDescriptionClass((item: any) => item.team);
    collectionView.groupDescriptions.push(teamGroupDesc);
    collectionView.refresh();
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

function setupEventHandlers() {
  const expandAllBtn = document.getElementById("expandAllBtn");
  const collapseAllBtn = document.getElementById("collapseAllBtn");
  const deleteRowsBtn = document.getElementById("deleteRowsBtn");
  const addRowBtn = document.getElementById("addRowBtn");

  console.log("Setting up event handlers", expandAllBtn);

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
}

// ============================================
// Helper Functions
// ============================================

function getGroupDescriptionClass(wijmo: any): any {
  if (
    wijmo.grid?.GroupDescription &&
    typeof wijmo.grid.GroupDescription === "function"
  ) {
    return wijmo.grid.GroupDescription;
  } else if (
    (wijmo.grid as any)?.collections?.GroupDescription &&
    typeof (wijmo.grid as any).collections.GroupDescription === "function"
  ) {
    return (wijmo.grid as any).collections.GroupDescription;
  } else if (
    (wijmo as any)?.collections?.GroupDescription &&
    typeof (wijmo as any).collections.GroupDescription === "function"
  ) {
    return (wijmo as any).collections.GroupDescription;
  }
  console.error(
    "GroupDescription not found. Available wijmo.grid properties:",
    Object.keys(wijmo.grid || {})
  );
  throw new Error(
    "wijmo.grid.GroupDescription is not a constructor function. Check console for available properties."
  );
}

// ============================================
// Initialisatie
// ============================================

function initializeGrid(gridInitStartTime?: number) {
  console.log("Initializing Wijmo grid...");

  if (typeof (window as any).wijmo === "undefined") {
    console.log("Wachten op Wijmo...");
    setTimeout(() => initializeGrid(gridInitStartTime), 100);
    return;
  }

  const initStart = gridInitStartTime || performance.now();

  const gridDiv = document.querySelector("#myGrid") as HTMLElement;

  if (!gridDiv) {
    console.error("Grid div niet gevonden!");
    return;
  }

  gridDiv.style.display = "block";
  gridDiv.style.visibility = "visible";
  gridDiv.style.opacity = "1";

  console.log("=== Initializing Wijmo organization grid ===");
  console.log("Employees:", rowData.length);
  console.log("Columns:", columnDefs.length);

  try {
    const wijmo = (window as any).wijmo;
    const wijmoGrid = wijmo.grid;

    const gridCreateStart = performance.now();

    // Debug: log available wijmo properties
    console.log("Wijmo object:", wijmo);
    console.log("wijmo.CollectionView:", wijmo.CollectionView);
    console.log("wijmo.collections:", (wijmo as any).collections);

    // Create CollectionView
    // Wijmo CollectionView can be at different locations depending on version
    // Try multiple possible locations
    let CollectionViewClass: any = null;

    // Try wijmo.CollectionView first (most common)
    if (wijmo.CollectionView && typeof wijmo.CollectionView === "function") {
      CollectionViewClass = wijmo.CollectionView;
    }
    // Try wijmo.collections.CollectionView
    else if (
      (wijmo as any).collections?.CollectionView &&
      typeof (wijmo as any).collections.CollectionView === "function"
    ) {
      CollectionViewClass = (wijmo as any).collections.CollectionView;
    }
    // Try wijmo.core.CollectionView
    else if (
      (wijmo as any).core?.CollectionView &&
      typeof (wijmo as any).core.CollectionView === "function"
    ) {
      CollectionViewClass = (wijmo as any).core.CollectionView;
    }
    // Try as property that might be a class
    else if (
      wijmo.CollectionView &&
      typeof wijmo.CollectionView === "object" &&
      (wijmo.CollectionView as any).constructor
    ) {
      // If it's an object with a constructor, try using it
      CollectionViewClass = (wijmo.CollectionView as any).constructor;
    }

    if (!CollectionViewClass || typeof CollectionViewClass !== "function") {
      console.error("Available wijmo properties:", Object.keys(wijmo));
      console.error("wijmo.CollectionView type:", typeof wijmo.CollectionView);
      console.error("wijmo.CollectionView value:", wijmo.CollectionView);
      throw new Error(
        "wijmo.CollectionView is not a constructor function. Wijmo may not be loaded correctly. Check console for available properties."
      );
    }

    collectionView = new CollectionViewClass(rowData, {
      groupDescriptions: ["department", "team"],
    });
    collectionView.trackChanges = true;

    // Create FlexGrid FIRST
    grid = new wijmoGrid.FlexGrid(gridDiv);
    grid.itemsSource = collectionView;
    grid.autoGenerateColumns = false;
    grid.allowSorting = true;
    grid.allowFiltering = true;
    grid.allowResizing = true;
    grid.allowMerging = wijmo.grid.AllowMerging.None;
    grid.selectionMode = wijmoGrid.SelectionMode.MultiRange;
    grid.isReadOnly = false;
    grid.showGroups = true;
    grid.alternatingRowStep = 1; // Use alternatingRowStep instead of deprecated showAlternatingRows

    // Set columns
    grid.columns.clear();

    // Debug: log available aggregate options
    console.log("wijmo.grid:", wijmo.grid);
    console.log("wijmo.grid.Aggregate:", (wijmo.grid as any).Aggregate);

    columnDefs.forEach((colDef: any) => {
      const col = new wijmoGrid.Column();
      col.binding = colDef.binding;
      col.header = colDef.header;
      if (colDef.width) col.width = colDef.width;
      if (colDef.format) col.format = colDef.format;
      if (colDef.isReadOnly !== undefined) col.isReadOnly = colDef.isReadOnly;
      if (colDef.allowSorting !== undefined)
        col.allowSorting = colDef.allowSorting;
      if (colDef.allowFiltering !== undefined)
        col.allowFiltering = colDef.allowFiltering;
      // Skip aggregate for now - it's causing issues with the enum lookup
      // if (colDef.aggregate) {
      //   col.aggregate = colDef.aggregate;
      // }
      if (colDef.visible !== undefined) col.visible = colDef.visible;
      grid.columns.push(col);
    });

    collectionView.console.log(
      "Group descriptions:",
      collectionView.groupDescriptions.length
    );

    // Refresh collection view to apply grouping
    collectionView.refresh();

    // Add cell templates for actions column
    grid.formatItem.addHandler((s: any, e: any) => {
      if (e.panel.cellType === wijmo.grid.CellType.Cell) {
        const col = s.columns[e.col];
        if (col && col.binding === "actions") {
          const row = s.rows[e.row];
          if (row && row.dataItem) {
            const item = row.dataItem;
            if (item && item.id && !item._isTotalRow) {
              e.cell.innerHTML = `<button class="delete-row-btn" data-test="verwijder-rij-${item.id}" onclick="window.deleteRow(${item.id}); event.stopPropagation(); return false;">🗑️</button>`;
            } else {
              e.cell.innerHTML = "";
            }
          } else {
            e.cell.innerHTML = "";
          }
        }
      }
    });

    // Handle selection changed
    grid.selectionChanged.addHandler(() => {
      const selectedRows = grid.selection.rows;
      const selectedCountEl = document.getElementById("selectedCount");
      const deleteBtn = document.getElementById(
        "deleteRowsBtn"
      ) as HTMLButtonElement;
      const addRowBtn = document.getElementById(
        "addRowBtn"
      ) as HTMLButtonElement;

      const hasSelection = selectedRows.length > 0;

      if (selectedCountEl) {
        selectedCountEl.textContent = selectedRows.length.toString();
      }
      if (deleteBtn) {
        deleteBtn.disabled = selectedRows.length === 0;
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
    });

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

        // Update statistics
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
