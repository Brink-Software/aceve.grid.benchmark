// ============================================
// AG Grid Speedup - Optimized Plain JavaScript Implementation
// ============================================

import { generateColumnDefinitions } from "./columns.js";
import {
  roles,
  generateEmployee,
  generateChunk,
} from "../../src/data.js";

console.log("AG Grid Speedup app.js module loaded!");

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

function updateLoadingProgress(count) {
  const progressEl = document.getElementById("loadingProgress");
  if (progressEl) {
    progressEl.textContent = count.toLocaleString("nl-NL");
  }
}

// Performance result display
function showPerformanceResult(operation, time, dataTest) {
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
// Global State
// ============================================

let rowData = [];
let nextId = 1;
let gridApi = null;
let dataGenerationStart = 0;

showSpinner();

// ============================================
// Data Generation
// ============================================

async function generateDataWithProgress() {
  dataGenerationStart = performance.now();
  const startMemory = performance.memory
    ? performance.memory.usedJSHeapSize
    : 0;

  console.log("=== PERFORMANCE: DATA GENERATION START ===");
  console.log("Start time:", dataGenerationStart);
  if (startMemory) {
    console.log("Start memory:", (startMemory / 1024 / 1024).toFixed(2), "MB");
  }

  const targetRows = 200000;
  const chunkSize = 10000;

  const nextIdState = {
    value: nextId,
    getValue() {
      return this.value;
    },
    setValue(value) {
      this.value = value;
    },
    increment() {
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

    console.log("Data generation successful:", rowData.length, "rows");
  } catch (error) {
    console.error("Error during data generation:", error);
    alert("Error during data generation: " + error.message);
    hideSpinner();
    return;
  }

  const dataGenerationEnd = performance.now();
  const dataGenerationTime = dataGenerationEnd - dataGenerationStart;
  const endMemory = performance.memory
    ? performance.memory.usedJSHeapSize
    : 0;

  console.log(`Generated ${rowData.length} employees`);
  console.log("=== PERFORMANCE: DATA GENERATION COMPLETE ===");
  console.log("DATA GENERATION TIME:", dataGenerationTime.toFixed(2), "ms");
  console.log(
    "Data generation speed:",
    (rowData.length / (dataGenerationTime / 1000)).toFixed(0),
    "rows/second"
  );

  if (startMemory && endMemory) {
    const memoryDiff = endMemory - startMemory;
    console.log("Memory used:", (memoryDiff / 1024 / 1024).toFixed(2), "MB");
  }

  showPerformanceResult(
    "Data Generation",
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
    console.log("=== PERFORMANCE: GRID INITIALIZATION ===");
    console.log("Grid init start time:", gridInitStart);

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

// ============================================
// CRUD Operations
// ============================================

export function addNewRow() {
  console.log("addNewRow called");

  if (!gridApi) {
    console.error("Grid not available");
    alert("Grid is not loaded yet. Please wait...");
    return;
  }

  const performanceStart = performance.now();
  const startMemory = performance.memory
    ? performance.memory.usedJSHeapSize
    : 0;

  console.log("=== PERFORMANCE: ADD ROW START ===");
  console.log("Start time:", performanceStart);
  if (startMemory) {
    console.log("Start memory:", (startMemory / 1024 / 1024).toFixed(2), "MB");
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
    const role =
      teamRoles[Math.floor(Math.random() * teamRoles.length)] || "Developer";

    const newEmployee = generateEmployee(nextId++, selectedDept, selectedTeam, role);

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
          const endMemory = performance.memory
            ? performance.memory.usedJSHeapSize
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

          console.log("Transaction result:", transaction);

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
  } catch (error) {
    console.error("Error adding row:", error);
    alert("Error adding row: " + error.message);
  }
}

export function deleteSelectedRows() {
  console.log("deleteSelectedRows called");

  if (!gridApi) {
    console.error("Grid not available");
    return;
  }

  const selectedRows = gridApi.getSelectedRows();
  if (selectedRows.length === 0) {
    console.warn("No rows selected for deletion");
    alert("Please select rows to delete");
    return;
  }

  const performanceStart = performance.now();
  const startMemory = performance.memory
    ? performance.memory.usedJSHeapSize
    : 0;

  console.log("=== PERFORMANCE: DELETE ROWS START ===");
  console.log("Number of rows:", selectedRows.length);
  console.log("Start time:", performanceStart);
  if (startMemory) {
    console.log("Start memory:", (startMemory / 1024 / 1024).toFixed(2), "MB");
  }

  // Remove from rowData array
  const idsToDelete = selectedRows.map((row) => row.id);
  rowData = rowData.filter((row) => !idsToDelete.includes(row.id));

  // Use transaction API for optimal performance
  const transaction = gridApi.applyTransaction({
    remove: selectedRows,
  });

  setTimeout(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const renderEnd = performance.now();
        const totalTime = renderEnd - performanceStart;
        const endMemory = performance.memory
          ? performance.memory.usedJSHeapSize
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

        console.log("Transaction result:", transaction);

        // Update statistics
        updateStatistics();
      });
    });
  }, 200);
}

// ============================================
// Grid Initialization
// ============================================

function updateStatistics() {
  const totalRowsEl = document.getElementById("totalRows");
  if (totalRowsEl) {
    totalRowsEl.textContent = rowData.length.toLocaleString("nl-NL");
  }
}

function onSelectionChanged() {
  const selectedRows = gridApi.getSelectedRows();
  const selectedCountEl = document.getElementById("selectedCount");
  const deleteCountEl = document.getElementById("deleteCount");
  const deleteBtn = document.getElementById("deleteRowsBtn");
  const addRowBtn = document.getElementById("addRowBtn");

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
}

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

function initializeGrid(gridInitStartTime) {
  console.log("Initializing grid...");

  if (typeof window.agGrid === "undefined") {
    console.log("Waiting for AG Grid Community...");
    setTimeout(() => initializeGrid(gridInitStartTime), 100);
    return;
  }

  const agGridLib = window.agGrid;

  // Check if Enterprise loaded
  let enterpriseLoaded = false;
  if (agGridLib.EnterpriseModule) {
    enterpriseLoaded = true;
    console.log("AG Grid Enterprise loaded (EnterpriseModule found)");
  } else if (agGridLib.LicenseManager) {
    enterpriseLoaded = true;
    console.log("AG Grid Enterprise loaded (LicenseManager found)");
  } else if (typeof window.agGridEnterprise !== "undefined") {
    enterpriseLoaded = true;
    console.log("AG Grid Enterprise loaded (agGridEnterprise object found)");
  } else {
    console.warn("AG Grid Enterprise not loaded, waiting...");
    setTimeout(() => initializeGrid(gridInitStartTime), 200);
    return;
  }

  const initStart = gridInitStartTime || performance.now();

  const gridDiv = document.querySelector("#myGrid");

  if (!gridDiv) {
    console.error("Grid div not found!");
    return;
  }

  gridDiv.style.display = "block";
  gridDiv.style.visibility = "visible";
  gridDiv.style.opacity = "1";

  const columnDefs = generateColumnDefinitions();

  console.log("=== Initializing optimized grid ===");
  console.log("Employees:", rowData.length);
  console.log("Columns:", columnDefs.length);
  console.log("AG Grid version:", agGridLib.version || "unknown");

  try {
    const gridCreateStart = performance.now();

    const gridOptions = {
      columnDefs: columnDefs,
      rowData: rowData,
      defaultColDef: {
        resizable: true,
        sortable: true,
        filter: true,
        editable: true,
        minWidth: 80,
        maxWidth: 300,
      },
      // Performance optimizations
      animateRows: false,
      suppressColumnVirtualisation: false,
      suppressRowVirtualisation: false,
      rowBuffer: 10,
      debounceVerticalScrollbar: false,
      // Selection
      rowSelection: "multiple",
      suppressRowClickSelection: false,
      // Other
      enableCellTextSelection: true,
      ensureDomOrder: false,
      suppressRowHoverHighlight: false,
      onSelectionChanged: onSelectionChanged,
      getRowId: (params) => params.data.id.toString(),
    };

    gridApi = agGridLib.createGrid(gridDiv, gridOptions);
    const gridCreateEnd = performance.now();
    console.log("Grid created successfully");
    console.log(
      "Grid creation time:",
      (gridCreateEnd - gridCreateStart).toFixed(2),
      "ms"
    );

    setTimeout(() => {
      if (gridApi) {
        console.log("Grid API available");

        // Update statistics
        updateStatistics();

        const totalColumnsEl = document.getElementById("totalColumns");
        if (totalColumnsEl) {
          totalColumnsEl.textContent = columnDefs.length.toString();
        }

        console.log("########Waiting for grid to stabilize...#########");

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

              const endMemory = performance.memory
                ? performance.memory.usedJSHeapSize
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

      const addRowBtn = document.getElementById("addRowBtn");
      if (addRowBtn) {
        addRowBtn.disabled = false;
      }

      console.log("Event handlers setup complete");
    }, 100);
  } catch (error) {
    console.error("Error during grid initialization:", error);
  }
}

// Export functions for use in HTML
window.addNewRow = addNewRow;
window.deleteSelectedRows = deleteSelectedRows;

// Start data generation
generateDataWithProgress();
