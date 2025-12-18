import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

// Helper functie om performance data op te slaan
function savePerformanceData(
  operation: string,
  time: string,
  timestamp: string
) {
  const dataDir = path.join(__dirname, "performance-results");

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const filePath = path.join(dataDir, "performance-data.json");

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

  const timeMs = parseFloat(time.replace(" ms", ""));

  data.push({
    operation,
    time,
    timeMs,
    timestamp,
    testFile: "mudblazor-grid.spec.ts",
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Performance data opgeslagen: ${operation} - ${time}`);
}

// Helper functie om te wachten tot de grid ready/stabiel is
async function waitForGridReady(page: any, timeout: number = 300000) {
  // Wacht tot de performance indicator zichtbaar is met "Grid Stable"
  const gridStabielIndicator = page.locator(
    '[data-test="performance-indicator-grid-stabiel"]'
  );

  await expect(gridStabielIndicator).toBeVisible({ timeout });

  // Verifieer dat de grid container zichtbaar is
  const gridContainer = page.locator('[data-test="mudblazor-datagrid"]');
  await expect(gridContainer).toBeVisible();

  // Lees de tijd uit
  const timeElement = gridStabielIndicator.locator(
    '[data-test="performance-tijd"]'
  );
  const timeText = await timeElement.textContent();

  return timeText || "0 ms";
}

test.describe("MudBlazor DataGrid Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Extended timeout voor Blazor WASM
    test.setTimeout(360000); // 6 minuten

    // Ga naar de MudBlazor grid pagina
    await page.goto("http://localhost:8001");
  });

  test("Grid laadt en is stabiel", async ({ page }) => {
    console.log(
      "Waiting for grid to be ready (this may take 30-60 seconds)..."
    );

    // Wacht tot grid ready is
    const gridStableTime = await waitForGridReady(page);

    console.log(`Grid Stable Time: ${gridStableTime}`);

    // Verifieer dat er data is
    const totalEmployees = await page.locator("#totalEmployees").textContent();
    console.log(`Total Employees: ${totalEmployees}`);

    expect(parseInt(totalEmployees || "0")).toBeGreaterThan(0);

    // Sla performance data op
    savePerformanceData(
      "Grid Stable",
      gridStableTime,
      new Date().toISOString()
    );
  });

  test("Rij toevoegen", async ({ page }) => {
    // Wacht tot grid ready is
    await waitForGridReady(page);

    // Klik op "Add Row" button
    const addButton = page.locator('[data-test="add-row-btn"]');
    await expect(addButton).toBeEnabled();
    await addButton.click();

    // Wacht op performance indicator
    const perfIndicator = page.locator(
      '[data-test="performance-indicator-rij-toevoegen"]'
    );
    await expect(perfIndicator).toBeVisible({ timeout: 5000 });

    // Lees performance tijd
    const timeElement = perfIndicator.locator('[data-test="performance-tijd"]');
    const timeText = await timeElement.textContent();

    console.log(`Add Row Time: ${timeText}`);

    // Sla performance data op
    savePerformanceData(
      "Rij Toevoegen",
      timeText || "0 ms",
      new Date().toISOString()
    );
  });

  test("Rij selecteren", async ({ page }) => {
    // Wacht tot grid ready is
    await waitForGridReady(page);

    // Selecteer eerste checkbox (na header checkbox)
    const firstRowCheckbox = page.locator('[type="checkbox"]').nth(1); // Index 0 is header, 1 is eerste rij
    await firstRowCheckbox.click();

    // Wacht even voor state update
    await page.waitForTimeout(500);

    // Verifieer dat selected count > 0
    const selectedCount = await page.locator("#selectedCount").textContent();
    console.log(`Selected Count: ${selectedCount}`);

    expect(parseInt(selectedCount || "0")).toBeGreaterThan(0);
  });

  test("Rij verwijderen", async ({ page }) => {
    // Wacht tot grid ready is
    await waitForGridReady(page);

    // Get initial count
    const initialCount = parseInt(
      (await page.locator("#totalEmployees").textContent()) || "0"
    );

    // Selecteer eerste rij
    const firstRowCheckbox = page.locator('[type="checkbox"]').nth(1);
    await firstRowCheckbox.click();
    await page.waitForTimeout(500);

    // Klik delete button
    const deleteButton = page.locator('[data-test="delete-rows-btn"]');
    await expect(deleteButton).toBeEnabled();
    await deleteButton.click();

    // Wacht op performance indicator
    const perfIndicator = page.locator(
      '[data-test="performance-indicator-rijen-verwijderen"]'
    );
    await expect(perfIndicator).toBeVisible({ timeout: 5000 });

    // Lees performance tijd
    const timeElement = perfIndicator.locator('[data-test="performance-tijd"]');
    const timeText = await timeElement.textContent();

    console.log(`Delete Row Time: ${timeText}`);

    // Verifieer dat count is verminderd
    await page.waitForTimeout(1000);
    const newCount = parseInt(
      (await page.locator("#totalEmployees").textContent()) || "0"
    );
    expect(newCount).toBeLessThan(initialCount);

    // Sla performance data op
    savePerformanceData(
      "Rij Verwijderen",
      timeText || "0 ms",
      new Date().toISOString()
    );
  });

  test("Meerdere rijen verwijderen", async ({ page }) => {
    // Wacht tot grid ready is
    await waitForGridReady(page);

    // Get initial count
    const initialCount = parseInt(
      (await page.locator("#totalEmployees").textContent()) || "0"
    );

    // Selecteer eerste 5 rijen
    for (let i = 1; i <= 5; i++) {
      await page.locator('[type="checkbox"]').nth(i).click();
      await page.waitForTimeout(100);
    }

    await page.waitForTimeout(500);

    // Klik delete button
    const deleteButton = page.locator('[data-test="delete-rows-btn"]');
    await expect(deleteButton).toBeEnabled();
    await deleteButton.click();

    // Wacht op performance indicator
    const perfIndicator = page.locator(
      '[data-test="performance-indicator-rijen-verwijderen"]'
    );
    await expect(perfIndicator).toBeVisible({ timeout: 5000 });

    // Lees performance tijd
    const timeElement = perfIndicator.locator('[data-test="performance-tijd"]');
    const timeText = await timeElement.textContent();

    console.log(`Delete Multiple Rows Time: ${timeText}`);

    // Verifieer dat count is verminderd met 5
    await page.waitForTimeout(1000);
    const newCount = parseInt(
      (await page.locator("#totalEmployees").textContent()) || "0"
    );
    expect(newCount).toBeLessThanOrEqual(initialCount - 5);

    // Sla performance data op
    savePerformanceData(
      "Meerdere Rijen Verwijderen",
      timeText || "0 ms",
      new Date().toISOString()
    );
  });
});
