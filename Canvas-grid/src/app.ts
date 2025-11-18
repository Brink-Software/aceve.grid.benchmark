// ============================================
// Canvas Grid Application
// ============================================

import { CanvasGrid } from "./canvas-grid.js";
import { generateData } from "./data-generator.js";

console.log("Canvas Grid App wordt geladen...");

let grid: CanvasGrid | null = null;
let gridData: any[] = [];

// UI Elements
let totalRowsEl: HTMLElement;
let totalColsEl: HTMLElement;
let selectedRowEl: HTMLElement;
let addRowBtn: HTMLButtonElement;
let deleteRowBtn: HTMLButtonElement;
let loadingSpinner: HTMLElement;
let canvas: HTMLCanvasElement;

function showSpinner() {
  if (loadingSpinner) {
    loadingSpinner.style.display = "flex";
  }
  if (canvas) {
    canvas.style.display = "none";
  }
}

function hideSpinner() {
  if (loadingSpinner) {
    loadingSpinner.style.display = "none";
  }
  if (canvas) {
    canvas.style.display = "block";
  }
}

function updateStats() {
  if (totalRowsEl) {
    totalRowsEl.textContent = gridData.length.toLocaleString("nl-NL");
  }

  if (totalColsEl && gridData.length > 0) {
    totalColsEl.textContent = Object.keys(gridData[0]).length.toLocaleString(
      "nl-NL"
    );
  }
}

function updateSelectedRow(rowIndex: number) {
  if (selectedRowEl) {
    if (rowIndex >= 0 && gridData[rowIndex]) {
      const row = gridData[rowIndex];
      selectedRowEl.textContent = `Rij ${rowIndex + 1}: ${row.name || row.id}`;
    } else {
      selectedRowEl.textContent = "Geen selectie";
    }
  }

  if (deleteRowBtn) {
    deleteRowBtn.disabled = rowIndex < 0;
  }
}

function setupEventListeners() {
  if (addRowBtn) {
    addRowBtn.addEventListener("click", () => {
      if (grid) {
        const startTime = performance.now();
        grid.addRow();
        const endTime = performance.now();

        updateStats();

        showPerformanceResult(
          "Rij Toevoegen",
          `${(endTime - startTime).toFixed(2)} ms`
        );
      }
    });
  }

  if (deleteRowBtn) {
    deleteRowBtn.addEventListener("click", () => {
      if (grid) {
        const startTime = performance.now();
        grid.deleteSelectedRow();
        const endTime = performance.now();

        updateStats();

        showPerformanceResult(
          "Rij Verwijderen",
          `${(endTime - startTime).toFixed(2)} ms`
        );
      }
    });
  }
}

function showPerformanceResult(operation: string, time: string) {
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
    <div style="font-size: 18px;">${time}</div>
  `;

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

async function initializeApp() {
  console.log("Applicatie wordt geïnitialiseerd...");

  // Get UI elements
  canvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
  loadingSpinner = document.getElementById("loadingSpinner") as HTMLElement;
  totalRowsEl = document.getElementById("totalRows") as HTMLElement;
  totalColsEl = document.getElementById("totalCols") as HTMLElement;
  selectedRowEl = document.getElementById("selectedRow") as HTMLElement;
  addRowBtn = document.getElementById("addRowBtn") as HTMLButtonElement;
  deleteRowBtn = document.getElementById("deleteRowBtn") as HTMLButtonElement;

  if (!canvas) {
    console.error("Canvas element niet gevonden!");
    return;
  }

  // Set canvas size to fill container
  const container = canvas.parentElement;
  if (container) {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight - 10; // Kleine marge
  }

  // Setup event listeners
  setupEventListeners();

  // Show spinner
  showSpinner();

  // Generate data
  console.log("Genereren van data...");
  const dataStartTime = performance.now();

  await new Promise((resolve) => setTimeout(resolve, 100)); // Laat UI updaten

  // Update progress function
  const updateProgress = (count: number) => {
    const progressEl = document.getElementById("loadingProgress");
    if (progressEl) {
      progressEl.textContent = count.toLocaleString("nl-NL");
    }
  };

  gridData = await generateData(200000, 500, updateProgress);

  const dataEndTime = performance.now();
  const dataGenTime = dataEndTime - dataStartTime;

  console.log(`Data gegenereerd in ${dataGenTime.toFixed(2)}ms`);
  showPerformanceResult("Data Generatie", `${dataGenTime.toFixed(2)} ms`);

  // Initialize grid
  console.log("Grid wordt geïnitialiseerd...");
  const gridStartTime = performance.now();

  grid = new CanvasGrid(canvas, gridData);

  // Setup callbacks
  grid.onSelectionChange = (rowIndex: number) => {
    updateSelectedRow(rowIndex);
  };

  grid.onDataChange = () => {
    updateStats();
  };

  const gridEndTime = performance.now();
  const gridInitTime = gridEndTime - gridStartTime;

  console.log(`Grid geïnitialiseerd in ${gridInitTime.toFixed(2)}ms`);

  // Hide spinner
  hideSpinner();

  // Update stats
  updateStats();
  updateSelectedRow(-1);

  // Show total time
  const totalTime = gridEndTime - dataStartTime;
  console.log(`Totale initialisatie tijd: ${totalTime.toFixed(2)}ms`);

  setTimeout(() => {
    showPerformanceResult("Grid Gereed", `${totalTime.toFixed(2)} ms`);
  }, 3500);

  console.log("Canvas Grid applicatie gereed!");
}

// Start initialization when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}

// Handle window resize
window.addEventListener("resize", () => {
  if (canvas && grid) {
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight - 10;
      grid.refresh();
    }
  }
});
