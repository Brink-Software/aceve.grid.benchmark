import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

// Helper functie om performance data op te slaan
function savePerformanceData(
  operation: string,
  time: string,
  timestamp: string
) {
  // Performance results directory is in playwright/Ag-grid/performance-results
  const dataDir = path.join(__dirname, "performance-results");

  // Maak directory aan als deze niet bestaat
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const filePath = path.join(dataDir, "performance-data-10000Rijen.json");

  // Lees bestaande data of maak nieuwe array
  let data: Array<{
    operation: string;
    time: string;
    timeMs: number;
    timestamp: string;
    testFile: string;
  }> = [];

  if (fs.existsSync(filePath)) {
    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      data = JSON.parse(fileContent);
    } catch (e) {
      console.warn("Kon bestaande performance data niet lezen:", e);
    }
  }

  // Parse tijd van "1234.56 ms" naar number
  const timeMs = parseFloat(time.replace(" ms", ""));

  // Voeg nieuwe meting toe
  data.push({
    operation,
    time,
    timeMs,
    timestamp,
    testFile: "ag-grid.spec.ts",
  });

  // Sla data op
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Performance data opgeslagen: ${operation} - ${time}`);
}

// Helper functie om te wachten tot de grid ready/stabiel is
async function waitForGridReady(page: any, timeout: number = 400000) {
  // Wacht tot de performance indicator zichtbaar is met "Grid Stabiel"
  const gridStabielIndicator = page.locator(
    '[data-test="performance-indicator-grid-stabiel"]'
  );

  // Wacht tot het element zichtbaar is
  await expect(gridStabielIndicator).toBeVisible({ timeout });

  // Verifieer dat de operation tekst "Grid Stabiel" is
  const operationText = await gridStabielIndicator
    .locator("div")
    .first()
    .textContent();
  expect(operationText).toContain("Grid Stable");

  // Verifieer dat de grid container zichtbaar is
  const gridContainer = page.locator('[data-test="ag-grid"]');
  await expect(gridContainer).toBeVisible();

  // Lees de tijd uit (optioneel)
  const timeElement = gridStabielIndicator.locator(
    '[data-test="performance-tijd"]'
  );
  const timeText = await timeElement.textContent();

  return {
    ready: true,
    time: timeText ? timeText.trim() : null,
    indicator: gridStabielIndicator,
  };
}

test.describe("AG Grid Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigeer naar de AG Grid pagina
    // Navigeer naar de AG Grid pagina
    await page.goto("http://localhost:8000/Ag-grid");
  });

  test("pagina laadt correct", async ({ page }) => {
    // Check of de pagina geladen is
    await expect(page).toHaveTitle(/AG Grid/i);
  });

  test("AG Grid is zichtbaar", async ({ page }) => {
    // Start tijd meten
    test.slow();
    const startTime = Date.now();

    // Wacht tot grid ready is
    const result = await waitForGridReady(page);

    if (result.time) {
      // Bereken totale tijd (vanaf page load)
      const totalTime = Date.now() - startTime;
      const timestamp = new Date().toISOString();

      // Sla de tijd op in JSON bestand
      savePerformanceData("Grid Stabiel", result.time, timestamp);

      console.log(`Grid Stabiel tijd: ${result.time}`);
      console.log(`Totale laadtijd (page load tot stabiel): ${totalTime} ms`);
    }
  });

  test("rij selecteren en verwijderen", async ({ page }) => {
    test.slow();
    // Wacht tot grid ready is
    await waitForGridReady(page);

    // Wacht tot er rijen zijn
    const firstRow = page.locator('[row-index="12"]').first();
    await expect(firstRow).toBeVisible({ timeout: 10000 });

    // Selecteer eerste rij
    await firstRow.click();

    // Verifieer dat selected count is bijgewerkt
    const selectedCount = page.locator('[data-test="selected-count"]');
    await expect(selectedCount).toHaveText("1");

    const deleteButton = page.locator(
      `[data-test="verwijderen-geselecteerde"]`
    );

    await page.waitForTimeout(2000);
    await deleteButton.click();

    // Wacht tot performance indicator verschijnt
    const perfIndicator = page.locator(
      '[data-test="performance-indicator-rijen-verwijderen"]'
    );
    await expect(perfIndicator).toBeVisible({ timeout: 10000 });

    // Lees de tijd uit
    const timeElement = perfIndicator.locator('[data-test="performance-tijd"]');

    const timeText = await timeElement.textContent();

    console.log("Gevonden rij ID voor verwijdering:", timeElement);
    if (timeText) {
      const timestamp = new Date().toISOString();
      savePerformanceData("Rij Verwijderen", timeText.trim(), timestamp);
      console.log(`Rij Verwijderen tijd: ${timeText.trim()}`);
    }
  });

  test("rij toevoegen", async ({ page }) => {
    test.slow();
    // Wacht tot grid ready is
    await waitForGridReady(page);

    // Wacht tot er rijen zijn
    const firstRow = page.locator('[data-test="rij-1"]');

    // Selecteer eerste rij
    await firstRow.click();
    await page.waitForTimeout(2000);

    // Verifieer dat selected count is bijgewerkt
    const addButton = page.locator('[data-test="nieuw-rij-toevoegen"]');
    await addButton.click();

    const perfIndicator = page.locator(
      '[data-test="performance-indicator-rij-toevoegen"]'
    );
    await expect(perfIndicator).toBeVisible({ timeout: 20000 });

    // Lees de tijd uit
    const timeElement = perfIndicator.locator('[data-test="performance-tijd"]');
    const timeText = await timeElement.textContent();
    if (timeText) {
      const timestamp = new Date().toISOString();
      savePerformanceData("Rij Toevoegen", timeText.trim(), timestamp);
      console.log(`Rij Toevoegen tijd: ${timeText.trim()}`);
    }
  });
});
