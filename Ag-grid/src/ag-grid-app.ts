// ============================================
// AG Grid Organisatie Tabel met CRUD en Row Grouping
// ============================================

import { CustomGridOptions, RowNode } from "./types.js";
import {
  departments,
  teams,
  roles,
  generateEmployee,
  generateChunk,
  NextIdState,
} from "../../src/data.js";
import { generateColumnDefinitions } from "./columns.js";

console.log("App.ts module geladen!");
console.log("Departments loaded:", departments?.length || 0);
console.log("Teams loaded:", Object.keys(teams || {}).length);
console.log("Roles loaded:", Object.keys(roles || {}).length);

let memoryGeneration = 0;
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
  // Maak of update performance indicator
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

  // Voeg data-test attribuut toe aan de performance indicator met operation
  // Converteer operation naar een geldige selector (vervang spaties met streepjes)

  console.log(`performance-indicator-${dataTest}`);
  perfIndicator.setAttribute("data-test", `performance-indicator-${dataTest}`);

  // Verwijder na 3 seconden
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

// Toon spinner voordat data generatie start
showSpinner();

// Genereer data met progress updates
let rowData: any[] = [];
let nextId = 1;
const columnDefs = generateColumnDefinitions();

// Global grid API variable (set after grid creation)
let gridApi: any = null;

// Global variabele voor data generatie start tijd
let dataGenerationStart: number = 0;

// Genereer data in chunks voor betere UX
async function generateDataWithProgress() {
  // Performance meting start voor data generatie
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
  const chunkSize = 10000; // Genereer in chunks van 10000

  // Maak een nextId state object
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

    // Update nextId na generatie
    nextId = nextIdState.getValue();

    console.log("Data generatie succesvol:", rowData.length, "rijen");
  } catch (error: any) {
    console.error("Fout bij data generatie:", error);
    alert("Fout bij data generatie: " + error.message);
    hideSpinner();
    return;
  }

  // Data generatie compleet
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
     memoryGeneration = endMemory - startMemory;
    console.log(
      "Geheugen gebruikt: na Generatie",
      (memoryGeneration / 1024 / 1024).toFixed(2),
      "MB"
    );
  }

  // Wacht even zodat gebruiker de laatste progress update ziet
  setTimeout(() => {
    // Update grid options met gegenereerde data
    gridOptions.rowData = rowData;

    // Zorg ervoor dat grid zichtbaar is VOOR initialisatie
    const grid = document.getElementById("myGrid");
    if (grid) {
      grid.style.display = "block";
      grid.style.visibility = "visible";
    }

    hideSpinner();

    // Start grid initialisatie met timing
    const gridInitStart = performance.now();
    console.log("=== PERFORMANCE METING: GRID INITIALISATIE ===");
    console.log("Grid init start tijd:", gridInitStart);


    //

    // Start grid initialisatie
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

// Start data generatie
generateDataWithProgress();

// ============================================
// Statistics Update
// ============================================

function updateStatistics() {
  const allNodes: any[] = [];
  gridApi.forEachNode((node: RowNode) => {
    if (node.data && !node.group) {
      allNodes.push(node.data);
    }
  });

  const totalEmployeesEl = document.getElementById("totalEmployees");
  if (totalEmployeesEl) {
    totalEmployeesEl.textContent = allNodes.length.toString();
  }
}

// ============================================
// CRUD Operations
// ============================================

// Add new row
export function addNewRow(): void {
  console.log("addNewRow called");

  if (!gridApi) {
    console.error("Grid API niet beschikbaar");
    alert("Grid is nog niet geladen. Wacht even...");
    return;
  }

  // Performance meting start
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
    const selectedRows = gridApi.getSelectedRows();
    let selectedDept = "Engineering";
    let selectedTeam = "Frontend Team";

    // Use selected row's department/team if available
    if (selectedRows.length > 0 && selectedRows[0]) {
      selectedDept = selectedRows[0].department;
      selectedTeam = selectedRows[0].team;
    }

    const teamRoles = roles[selectedDept] || [];
    const role = teamRoles[Math.floor(Math.random() * teamRoles.length)];

    const newEmployee = generateEmployee(
      nextId++,
      selectedDept,
      selectedTeam,
      role
    );

    // Use transaction API for optimal performance
    const transaction = gridApi.applyTransaction({
      add: [newEmployee],
      addIndex: 0, // Add at top for visibility
    });

    // Add to rowData array
    rowData.unshift(newEmployee);

    setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const renderEnd = performance.now();
          const totalTime = renderEnd - performanceStart;
          const endMemory = (performance as any).memory
            ? (performance as any).memory.usedJSHeapSize
            : 0;

          console.log("=== PERFORMANCE: ADD ROW COMPLETE ===");
          console.log("TOTAL TIME:", totalTime.toFixed(2), "ms");

          if (startMemory && endMemory) {
            const memoryDiff = endMemory - startMemory;
            console.log(
              "Memory used:",
              (memoryDiff / 1024 / 1024).toFixed(2),
              "MB"
            );
          }

          showPerformanceResult(
            "Add Row",
            totalTime.toFixed(2) + " ms",
            "rij-toevoegen"
          );

          // Select the new row
          if (transaction && transaction.add && transaction.add.length > 0) {
            transaction.add[0].setSelected(true);
            gridApi.ensureNodeVisible(transaction.add[0], "top");
          }

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

// Delete selected rows (voor bulk verwijdering)
export function deleteSelectedRows(): void {
  console.log("deleteSelectedRows called");

  if (!gridApi) {
    console.error("Grid API niet beschikbaar");
    return;
  }

  const selectedRows = gridApi.getSelectedRows() || [];
  if (selectedRows.length === 0) {
    console.warn("Geen rijen geselecteerd voor verwijdering");
    return;
  }

  // Performance meting start
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

  // Verzamel IDs voor rowData update
  const idsToDelete = selectedRows.map((row: any) => row.id);

  // Transaction uitvoeren
  const transactionStart = performance.now();
  gridApi.applyTransaction({ remove: selectedRows });
  const transactionEnd = performance.now();
  const transactionTime = transactionEnd - transactionStart;
  console.log("Transaction tijd:", transactionTime.toFixed(2), "ms");

  // Update rowData array
  idsToDelete.forEach((id: number) => {
    const index = rowData.findIndex((row: any) => row.id === id);
    if (index !== -1) {
      rowData.splice(index, 1);
    }
  });

  setTimeout(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const renderEnd = performance.now();
        const totalTime = renderEnd - performanceStart;
        const endMemory = (performance as any).memory
          ? (performance as any).memory.usedJSHeapSize
          : 0;

        console.log("=== PERFORMANCE: DELETE ROWS COMPLETE ===");
        console.log("Number of rows:", selectedRows.length);
        console.log("TOTAL TIME:", totalTime.toFixed(2), "ms");

        if (startMemory && endMemory) {
          const memoryDiff = startMemory - endMemory;
          console.log(
            "Memory freed:",
            (Math.abs(memoryDiff) / 1024 / 1024).toFixed(2),
            "MB"
          );
        }

        showPerformanceResult(
          `Delete Rows (${selectedRows.length})`,
          totalTime.toFixed(2) + " ms",
          "rijen-verwijderen"
        );

        // Update statistics
        updateStatistics();
      });
    });
  }, 200);
}

// Update cell value (wordt automatisch aangeroepen door AG Grid bij cell editing)
function onCellValueChanged(params: any): void {
  console.log(
    "Cel waarde gewijzigd:",
    params.data.id,
    params.colDef.field,
    params.newValue
  );
}

// ============================================
// Grid Options
// ============================================

const gridOptions: CustomGridOptions = {
  columnDefs: columnDefs,
  rowData: [], // Wordt later gevuld na data generatie
  columnTypes: {
    numberColumn: {
      filter: "agNumberColumnFilter",
      sortable: false,
      editable: false,
      resizable: false,
    },
  },
  defaultColDef: {
    resizable: true,
    sortable: true,
    filter: true,
    editable: true,
    minWidth: 80,
    maxWidth: 300,
  },
  // Virtualisatie instellingen
  suppressColumnVirtualisation: false, // Column virtualization AAN
  suppressRowVirtualisation: false, // Row virtualization AAN (standaard al aan)
  // Performance optimalisaties
  debounceVerticalScrollbar: false,
  suppressScrollOnNewData: false,
  rowBuffer: 10,
  animateRows: false,
  rowSelection: "multiple",
  suppressRowClickSelection: false,
  enableCellTextSelection: true,
  ensureDomOrder: false,
  suppressRowHoverHighlight: false,
  onSelectionChanged: function () {
    const selectedRows = gridApi?.getSelectedRows() || [];
    const selectedCountEl = document.getElementById("selectedCount");
    const deleteCountEl = document.getElementById("deleteCount");
    const deleteBtn = document.getElementById(
      "deleteRowsBtn"
    ) as HTMLButtonElement;
    const addRowBtn = document.getElementById("addRowBtn") as HTMLButtonElement;

    const hasSelection = selectedRows.length > 0;

    if (selectedCountEl) {
      selectedCountEl.textContent = selectedRows.length.toString();
    }
    if (deleteCountEl) {
      deleteCountEl.textContent = selectedRows.length.toString();
    }
    if (deleteBtn) {
      deleteBtn.disabled = !hasSelection;
    }
    if (addRowBtn) {
      addRowBtn.disabled = false; // Always enabled
    }
  },
  onCellValueChanged: onCellValueChanged,
  processRowPostCreate: function (params: any) {
    // Voeg data-test attribuut toe aan de rij voor test automation
    if (params.node.data && params.node.data.id && !params.node.group) {
      const rowElement = params.eRow;
      if (rowElement) {
        rowElement.setAttribute("data-test", `rij-${params.node.data.id}`);
      }
    }
  },
  getRowId: (params: any) => params.data.id.toString(),
};

// ============================================
// Event Handlers
// ============================================

function setupEventHandlers() {
  const deleteRowsBtn = document.getElementById("deleteRowsBtn");
  const addRowBtn = document.getElementById("addRowBtn");

  console.log("Setting up event handlers");

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
// Initialisatie
// ============================================

function initializeGrid(gridInitStartTime?: number) {
  console.log("Initializing grid...");

  if (typeof (window as any).agGrid === "undefined") {
    console.log("Wachten op AG Grid Community...");
    setTimeout(() => initializeGrid(gridInitStartTime), 100);
    return;
  }

  // Check of Enterprise geladen is - probeer verschillende manieren
  const agGridLib = (window as any).agGrid;
  let enterpriseLoaded = false;

  // Check verschillende manieren waarop Enterprise geregistreerd kan zijn
  if (agGridLib.EnterpriseModule) {
    enterpriseLoaded = true;
    console.log("AG Grid Enterprise geladen (EnterpriseModule gevonden)");
  } else if (agGridLib.LicenseManager) {
    enterpriseLoaded = true;
    console.log("AG Grid Enterprise geladen (LicenseManager gevonden)");
  } else if (typeof (window as any).agGridEnterprise !== "undefined") {
    enterpriseLoaded = true;
    console.log(
      "AG Grid Enterprise geladen (agGridEnterprise object gevonden)"
    );
  } else {
    // Wacht even en probeer opnieuw - Enterprise script laadt mogelijk nog
    console.warn("AG Grid Enterprise nog niet geladen, wachten...");
    setTimeout(() => initializeGrid(gridInitStartTime), 200);
    return;
  }

  if (!enterpriseLoaded) {
    console.error(
      "AG Grid Enterprise niet geladen! Row grouping werkt mogelijk niet."
    );
    console.error(
      "Zorg ervoor dat ag-grid-enterprise script voor ag-grid-app.js geladen wordt"
    );
  }

  // Als gridInitStartTime niet meegegeven, start nieuwe meting
  const initStart = gridInitStartTime || performance.now();

  const gridDiv = document.querySelector("#myGrid") as HTMLElement;

  if (!gridDiv) {
    console.error("Grid div niet gevonden!");
    return;
  }

  // Zorg ervoor dat grid zichtbaar is voor initialisatie
  gridDiv.style.display = "block";
  gridDiv.style.visibility = "visible";
  gridDiv.style.opacity = "1";

  console.log("=== Initializing organization grid ===");
  console.log("Employees:", rowData.length);
  console.log("Columns:", columnDefs.length);
  console.log("AG Grid version:", agGridLib?.version || "unknown");

  try {
    const gridCreateStart = performance.now();
    gridApi = agGridLib.createGrid(gridDiv, gridOptions);
    const gridCreateEnd = performance.now();
    console.log("Grid created successfully");
    console.log(
      "Grid creation tijd:",
      (gridCreateEnd - gridCreateStart).toFixed(2),
      "ms"
    );

    setTimeout(() => {
      if (gridApi) {
        console.log("Grid API beschikbaar");
        console.log("RowData length:", rowData.length);

        // Update statistics
        updateStatistics();

        const totalColumnsEl = document.getElementById("totalColumns");
        if (totalColumnsEl) {
          totalColumnsEl.textContent = columnDefs.length.toString();
        }

        console.log("########Waiting for grid to stabilize...#########");

        // Wait for grid to stabilize
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const gridStableEnd = performance.now();
              const totalGridInitTime = gridStableEnd - initStart;

              console.log("=== PERFORMANCE: GRID INITIALIZATION COMPLETE ===");
              console.log(
                "Grid creation time:",
                (gridCreateEnd - gridCreateStart).toFixed(2),
                "ms"
              );
              console.log(
                "TOTAL GRID STABLE TIME:",
                totalGridInitTime.toFixed(2),
                "ms"
              );
              console.log("Rows loaded:", rowData.length);
              console.log("Columns:", columnDefs.length);

              const endMemory = (performance as any).memory
                ? (performance as any).memory.usedJSHeapSize
                : 0;

              const numemoty = endMemory;
              console.log(
                "Memory used after generation:",
                (numemoty / 1024 / 1024).toFixed(2),
                "MB"
              );

              showPerformanceResult(
                "Grid Stable",
                totalGridInitTime.toFixed(2) + " ms",
                "grid-stabiel"
              );

              const totalStartTime =
                dataGenerationStart > 0 ? dataGenerationStart : initStart;
              const totalTime = gridStableEnd - totalStartTime;
              console.log("=== TOTAL TIME: DATA GENERATION + GRID STABLE ===");
              console.log("TOTAL TIME:", totalTime.toFixed(2), "ms");
              console.log(
                "Total speed:",
                (rowData.length / (totalTime / 1000)).toFixed(0),
                "rows/second"
              );
            });
          });
        });
      }
    }, 500);

    setTimeout(() => {
      console.log("Setting up event handlers after 100ms");
      setupEventHandlers();

      const addRowBtn = document.getElementById("addRowBtn") as HTMLButtonElement;
      if (addRowBtn) {
        addRowBtn.disabled = false;
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
    gridOptions: CustomGridOptions;
    addNewRow: () => void;
    deleteRow: (id: number) => void;
    deleteSelectedRows: () => void;
  }
}

window.gridOptions = gridOptions;
window.addNewRow = addNewRow;
window.deleteSelectedRows = deleteSelectedRows;

// Grid initialisatie wordt aangeroepen na data generatie
// (zie generateDataWithProgress functie)
