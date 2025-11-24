// ============================================
// AG Grid Organisatie Tabel met CRUD en Row Grouping
// ============================================

import { TotalsRow, CustomGridOptions, RowNode } from "./types.js";
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
// Totals Berekenen
// ============================================

function calculateTotals(): TotalsRow {
  const totals: TotalsRow = {
    _rowCount: 0,
    _isTotalRow: true,
  };

  if (!gridApi) return totals;

  let rowCount = 0;
  gridApi.forEachNode((node: RowNode) => {
    if (node.data && !node.group && !node.groupData) {
      rowCount++;
      const data = node.data;

      columnDefs.forEach((col) => {
        if (
          col.type === "numberColumn" &&
          col.field &&
          data[col.field] !== undefined
        ) {
          const field = col.field;
          if (!totals[field]) {
            totals[field] = 0;
          }
          totals[field] = (totals[field] as number) + (data[field] || 0);
        }
      });
    }
  });

  totals._rowCount = rowCount;
  return totals;
}

function updateTotalsRow() {
  if (!gridApi) return;

  const totals = calculateTotals();
  gridApi.setGridOption("pinnedBottomRowData", [totals]);
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
    let selectedDept: string | null = null;
    let selectedTeam: string | null = null;

    // Check of er een geselecteerde rij is
    const selectedRows = gridApi.getSelectedRows();
    const selectedNodes = gridApi.getSelectedNodes();

    // Verplicht: er moet een selectie zijn
    if (selectedNodes.length === 0) {
      alert(
        "Selecteer eerst een rij of groep om een nieuwe rij toe te voegen."
      );
      return;
    }

    if (selectedNodes.length > 0) {
      const selectedNode = selectedNodes[0];

      if (selectedNode.group) {
        // Group row is geselecteerd - gebruik group data
        console.log("Group row geselecteerd:", selectedNode);

        // Probeer department en team uit group key te halen
        if (selectedNode.key) {
          // Check of dit department of team level is
          const allNodes: any[] = [];
          gridApi.forEachNode((node: RowNode) => {
            if (node.data && !node.group) {
              allNodes.push(node.data);
            }
          });

          // Zoek een rij in deze group om department/team te bepalen
          if (
            selectedNode.childrenAfterGroup &&
            selectedNode.childrenAfterGroup.length > 0
          ) {
            const firstChild = selectedNode.childrenAfterGroup[0];
            if (firstChild.data) {
              selectedDept = firstChild.data.department;
              selectedTeam = firstChild.data.team;
              console.log("Group info gevonden:", selectedDept, selectedTeam);
            }
          } else {
            // Probeer via group key
            const matchingNode = allNodes.find((node: any) => {
              if (selectedNode.level === 0) {
                return node.department === selectedNode.key;
              } else if (selectedNode.level === 1) {
                return node.team === selectedNode.key;
              }
              return false;
            });

            if (matchingNode) {
              if (selectedNode.level === 0) {
                selectedDept = matchingNode.department;
                // Neem eerste team van dit department
                if (selectedDept) {
                  const deptTeams = teams[selectedDept] || [];
                  selectedTeam = deptTeams[0] || null;
                }
              } else {
                selectedDept = matchingNode.department;
                selectedTeam = matchingNode.team;
              }
              console.log(
                "Group info via matching:",
                selectedDept,
                selectedTeam
              );
            }
          }
        }
      } else if (selectedNode.data) {
        // Normale rij is geselecteerd - gebruik department en team van die rij
        selectedDept = selectedNode.data.department;
        selectedTeam = selectedNode.data.team;
        console.log("Rij geselecteerd:", selectedDept, selectedTeam);
      }
    } else if (selectedRows.length > 0 && selectedRows[0]) {
      // Fallback: gebruik eerste geselecteerde rij data
      selectedDept = selectedRows[0].department;
      selectedTeam = selectedRows[0].team;
      console.log("Geselecteerde rij data:", selectedDept, selectedTeam);
    }

    // Als geen selectie, gebruik random (fallback)
    if (!selectedDept || !selectedTeam) {
      const dept = departments[Math.floor(Math.random() * departments.length)];
      const deptTeams = teams[dept.name] || [];
      selectedDept = dept.name;
      selectedTeam = deptTeams[Math.floor(Math.random() * deptTeams.length)];
      console.log("Geen selectie, gebruik random:", selectedDept, selectedTeam);
    }

    // Genereer nieuwe employee in dezelfde groep
    if (!selectedDept || !selectedTeam) {
      console.error("Kan geen department of team bepalen");
      return;
    }

    const teamRoles = roles[selectedDept] || [];
    const role = teamRoles[Math.floor(Math.random() * teamRoles.length)];

    const newEmployee = generateEmployee(
      nextId++,
      selectedDept,
      selectedTeam,
      role
    );

    console.log("Nieuwe employee gegenereerd in groep:", newEmployee);

    // Vind de index van de geselecteerde rij in rowData
    let insertIndex = -1;
    const selectedNode = selectedNodes[0];

    if (selectedNode.data) {
      // Normale rij - vind index in rowData
      insertIndex = rowData.findIndex(
        (row: any) => row.id === selectedNode.data.id
      );
      if (insertIndex !== -1) {
        insertIndex += 1; // Voeg toe direct na de geselecteerde rij
      }
    } else if (selectedNode.group) {
      // Group row - vind eerste child en gebruik die index
      if (
        selectedNode.childrenAfterGroup &&
        selectedNode.childrenAfterGroup.length > 0
      ) {
        const firstChild = selectedNode.childrenAfterGroup[0];
        if (firstChild.data) {
          insertIndex = rowData.findIndex(
            (row: any) => row.id === firstChild.data.id
          );
          if (insertIndex !== -1) {
            // Voeg toe na de laatste child in deze group
            let lastIndexInGroup = insertIndex;
            for (let i = insertIndex; i < rowData.length; i++) {
              const row = rowData[i];
              if (selectedNode.level === 0) {
                // Department level - check of nog inzelfde department
                if (row.department !== selectedDept) {
                  break;
                }
                lastIndexInGroup = i;
              } else if (selectedNode.level === 1) {
                // Team level - check of nog inzelfde team
                if (
                  row.team !== selectedTeam ||
                  row.department !== selectedDept
                ) {
                  break;
                }
                lastIndexInGroup = i;
              }
            }
            insertIndex = lastIndexInGroup + 1;
          }
        }
      }
    }

    // Als index niet gevonden, voeg toe aan einde
    if (insertIndex === -1) {
      insertIndex = rowData.length;
    }

    console.log("Insert index:", insertIndex);

    // Voeg toe aan rowData array op de juiste positie
    rowData.splice(insertIndex, 0, newEmployee);

    // Update grid met nieuwe data
    const transactionStart = performance.now();
    const result = gridApi.applyTransaction({
      add: [newEmployee],
      addIndex: insertIndex,
    });
    const transactionEnd = performance.now();
    const transactionTime = transactionEnd - transactionStart;

    console.log("Transaction tijd:", transactionTime.toFixed(2), "ms");
    console.log("Transaction result:", result);

    // Update totals
    const totalsStart = performance.now();
    setTimeout(() => {
      updateTotalsRow();
      const totalsEnd = performance.now();
      console.log(
        "Totals update tijd:",
        (totalsEnd - totalsStart).toFixed(2),
        "ms"
      );
    }, 100);

    // Refresh grid om nieuwe rij te tonen
    const refreshStart = performance.now();
    gridApi.refreshCells({ force: true });
    const refreshEnd = performance.now();
    console.log("Refresh tijd:", (refreshEnd - refreshStart).toFixed(2), "ms");

    console.log(
      "Nieuwe rij toegevoegd op index:",
      insertIndex,
      "in groep:",
      selectedDept,
      selectedTeam
    );

    // Wacht tot grid volledig gerenderd is
    const renderStart = performance.now();

    // Selecteer de nieuwe rij en scroll ernaar
    setTimeout(() => {
      gridApi.forEachNode((node: RowNode) => {
        if (node.data && node.data.id === newEmployee.id) {
          node.setSelected(true);
          gridApi.ensureNodeVisible(node, "middle");
        }
      });

      // Wacht op volgende frame om zeker te zijn dat alles gerenderd is
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const renderEnd = performance.now();
          const totalTime = renderEnd - performanceStart;
          const endMemory = (performance as any).memory
            ? (performance as any).memory.usedJSHeapSize
            : 0;

          console.log("=== PERFORMANCE RESULTATEN: RIJ TOEVOEGEN ===");
          console.log("Transaction tijd:", transactionTime.toFixed(2), "ms");
          console.log(
            "Refresh tijd:",
            (refreshEnd - refreshStart).toFixed(2),
            "ms"
          );
          console.log(
            "Render tijd:",
            (renderEnd - renderStart).toFixed(2),
            "ms"
          );
          console.log("TOTALE TIJD:", totalTime.toFixed(2), "ms");

          if (startMemory && endMemory) {
            const memoryDiff = endMemory - startMemory;
            console.log(
              "Geheugen gebruik:",
              (memoryDiff / 1024 / 1024).toFixed(2),
              "MB"
            );
          }

          // Toon resultaat in UI
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

  const totalsStart = performance.now();
  setTimeout(() => {
    updateTotalsRow();
    const totalsEnd = performance.now();
    console.log(
      "Totals update tijd:",
      (totalsEnd - totalsStart).toFixed(2),
      "ms"
    );
  }, 100);

  const refreshStart = performance.now();
  gridApi.refreshCells({ force: true });
  const refreshEnd = performance.now();
  const refreshTime = refreshEnd - refreshStart;
  console.log("Refresh tijd:", refreshTime.toFixed(2), "ms");

  console.log("Rijen verwijderd:", selectedRows.length);

  // Wacht tot grid volledig stabiel is
  const renderStart = performance.now();

  // Wacht even zodat grid kan stabiliseren
  setTimeout(() => {
    // Wacht op volgende frames om zeker te zijn dat alles gerenderd en stabiel is
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const renderEnd = performance.now();
        const renderTime = renderEnd - renderStart;
        const totalTime = renderEnd - performanceStart;
        const endMemory = (performance as any).memory
          ? (performance as any).memory.usedJSHeapSize
          : 0;

        console.log(
          "=== PERFORMANCE RESULTATEN: MEERDERE RIJEN VERWIJDEREN ==="
        );
        console.log("Aantal rijen:", selectedRows.length);
        console.log("Transaction tijd:", transactionTime.toFixed(2), "ms");
        console.log("Refresh tijd:", refreshTime.toFixed(2), "ms");
        console.log("Render tijd:", renderTime.toFixed(2), "ms");
        console.log("TOTALE TIJD:", totalTime.toFixed(2), "ms");

        if (startMemory && endMemory) {
          const memoryDiff = startMemory - endMemory; // Negatief omdat geheugen vrijkomt
          console.log(
            "Geheugen vrijgekomen:",
            (Math.abs(memoryDiff) / 1024 / 1024).toFixed(2),
            "MB"
          );
        }

        // Toon resultaat in UI
        showPerformanceResult(
          `Rijen Verwijderen (${selectedRows.length})`,
          totalTime.toFixed(2) + " ms",
          "rij-verwijderen"
        );
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
  setTimeout(updateTotalsRow, 100);

  // Auto-size de kolom waarvan de waarde is gewijzigd
  if (gridApi && params.column) {
    setTimeout(() => {
      gridApi.autoSizeColumns([params.column]);
    }, 50);
  }
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
    resizable: false,
    sortable: false,
    filter: false,
    editable: false,
    autoHeaderHeight: false,
    wrapHeaderText: false,
    minWidth: 80,
    maxWidth: 300,
  },
  // Virtualisatie instellingen
  suppressColumnVirtualisation: false, // Column virtualization AAN
  suppressRowVirtualisation: false, // Row virtualization AAN (standaard al aan)
  // Performance optimalisaties
  debounceVerticalScrollbar: true,
  suppressScrollOnNewData: false,
  // Grouping instellingen
  groupDefaultExpanded: -1, // Alle groepen standaard uitgeklapt (toon alle rijen)
  groupDisplayType: "multipleColumns",
  suppressRowGroupHidesColumns: false,
  autoGroupColumnDef: {
    hide: true,
  },
  animateRows: false,
  rowSelection: "multiple",
  enableRangeSelection: true,
  onSelectionChanged: function () {
    const selectedRows = gridApi?.getSelectedRows() || [];
    const selectedNodes = gridApi?.getSelectedNodes() || [];
    const selectedCountEl = document.getElementById("selectedCount");
    const deleteBtn = document.getElementById(
      "deleteRowsBtn"
    ) as HTMLButtonElement;
    const addRowBtn = document.getElementById("addRowBtn") as HTMLButtonElement;

    // Check of er een selectie is (rij of group row)
    const hasSelection = selectedNodes.length > 0;

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
  },
  onCellValueChanged: onCellValueChanged,
  getRowStyle: function (params: any) {
    if (params.node.rowPinned === "bottom") {
      return { fontWeight: "bold", backgroundColor: "#f0f0f0" };
    }
    return null;
  },
  processRowPostCreate: function (params: any) {
    // Voeg data-test attribuut toe aan de rij voor test automation
    if (params.node.data && params.node.data.id && !params.node.group) {
      const rowElement = params.eRow;
      if (rowElement) {
        rowElement.setAttribute("data-test", `rij-${params.node.data.id}`);
      }
    }
  },
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

        // Zet data via API om zeker te zijn dat het werkt
        if (rowData && rowData.length > 0) {
          console.log("Setting rowData via API...");
          gridApi.setGridOption("rowData", rowData);
          console.log("RowData set via API");

          // Expand alle groepen om rijen zichtbaar te maken
          setTimeout(() => {
            gridApi.expandAll();
            console.log("All groups expanded");

            // Auto-size kolommen na expand
            setTimeout(() => {
              gridApi.autoSizeAllColumns();
              console.log("Kolommen aangepast na expand");
            }, 200);
          }, 100);
        } else {
          console.warn("Geen rowData beschikbaar!");
        }

        // Zorg ervoor dat grid zichtbaar is en correct gerenderd
        const gridDiv = document.querySelector("#myGrid") as HTMLElement;
        if (gridDiv) {
          gridDiv.style.display = "block";
          gridDiv.style.visibility = "visible";
          gridDiv.style.opacity = "1";
        }

        // Auto-size kolommen op basis van celinhoud (alleen zichtbare kolommen voor performance)
        setTimeout(() => {
          // Auto-size alleen zichtbare kolommen voor betere performance met 500 kolommen
          const allColumns = gridApi.getColumns();
          if (allColumns) {
            // Auto-size alle kolommen, maar met skipHeader voor snellere performance
            gridApi.autoSizeAllColumns({ skipHeader: false });
            console.log("Kolommen aangepast aan celinhoud");
          }
        }, 300);

        // Check hoeveel rijen er zijn
        const rowCount = gridApi.getDisplayedRowCount();
        const modelRowCount = gridApi.getModel()?.getRowCount() || 0;
        console.log("Displayed rows:", rowCount);
        console.log("Model row count:", modelRowCount);

        // Log group informatie
        let groupCount = 0;
        let dataRowCount = 0;
        gridApi.forEachNode((node: any) => {
          if (node.group) {
            groupCount++;
          } else if (node.data) {
            dataRowCount++;
          }
        });
        console.log("Group nodes:", groupCount);
        console.log("Data nodes:", dataRowCount);

        const totalsStart = performance.now();
        updateTotalsRow();
        const totalsEnd = performance.now();
        console.log(
          "Initial totals update tijd:",
          (totalsEnd - totalsStart).toFixed(2),
          "ms"
        );

        // Update statistieken
        const allNodes: any[] = [];
        gridApi.forEachNode((node: RowNode) => {
          if (node.data && !node.group) {
            allNodes.push(node.data);
          }
        });

        const departmentsSet = new Set(allNodes.map((e: any) => e.department));
        const teamsSet = new Set(allNodes.map((e: any) => e.team));

        const totalEmployeesEl = document.getElementById("totalEmployees");
        const totalDepartmentsEl = document.getElementById("totalDepartments");
        const totalTeamsEl = document.getElementById("totalTeams");

        if (totalEmployeesEl) {
          totalEmployeesEl.textContent = allNodes.length.toString();
        }
        if (totalDepartmentsEl) {
          totalDepartmentsEl.textContent = departmentsSet.size.toString();
        }
        if (totalTeamsEl) {
          totalTeamsEl.textContent = teamsSet.size.toString();
        }

        // Wacht tot grid volledig stabiel is
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
                "Totals update tijd:",
                (totalsEnd - totalsStart).toFixed(2),
                "ms"
              );
              console.log(
                "TOTALE GRID STABIEL TIJD:",
                totalGridInitTime.toFixed(2),
                "ms"
              );

                const endMemory = (performance as any).memory
                ? (performance as any).memory.usedJSHeapSize
                : 0;


                 const numemoty = endMemory ;
                console.log(
                  "Geheugen gebruikt: na Generatie",
                  (numemoty / 1024 / 1024).toFixed(2),
                  "MB"
                );

      




              console.log("Rijen geladen:", rowCount);
              console.log("Kolommen:", columnDefs.length);

              // Toon grid init tijd
              showPerformanceResult(
                "Grid Stabiel",
                totalGridInitTime.toFixed(2) + " ms",
                "grid-stabiel"
              );

              // Totale tijd (data generatie + grid init)
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

    // Setup event handlers na een korte delay om zeker te zijn dat DOM klaar is
    setTimeout(() => {
      console.log("Setting up event handlers after 100ms");
      setupEventHandlers();

      // Initialiseer add row button als disabled (geen selectie)
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
