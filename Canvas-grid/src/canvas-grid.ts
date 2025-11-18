// ============================================
// Canvas Grid Implementation
// ============================================

import { GridData } from "./data-generator.js";

export interface GridConfig {
  rowHeight: number;
  headerHeight: number;
  sumHeight: number;
  columnWidth: number;
  scrollbarSize: number;
}

export class CanvasGrid {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private data: GridData[];
  private config: GridConfig;

  private scrollTop: number = 0;
  private scrollLeft: number = 0;
  private selectedRowIndex: number = -1;
  private columnSums: Map<string, number> = new Map();

  private columns: string[];
  private visibleRows: number;
  private visibleColumns: number;

  // Mouse tracking
  private isDragging: boolean = false;
  private lastMouseX: number = 0;
  private lastMouseY: number = 0;

  // Callbacks
  public onDataChange?: () => void;
  public onSelectionChange?: (rowIndex: number) => void;

  constructor(
    canvas: HTMLCanvasElement,
    data: GridData[],
    config: GridConfig = {
      rowHeight: 30,
      headerHeight: 40,
      sumHeight: 35,
      columnWidth: 120,
      scrollbarSize: 15,
    }
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.data = data;
    this.config = config;

    // Extract column names
    this.columns = data.length > 0 ? Object.keys(data[0]) : [];

    // Calculate visible rows/columns
    this.visibleRows = Math.ceil(canvas.height / config.rowHeight) + 1;
    this.visibleColumns = Math.ceil(canvas.width / config.columnWidth) + 1;

    this.setupEventListeners();

    // Defer sum calculation and initial render to not block
    requestAnimationFrame(() => {
      this.calculateAllColumnSums();
      this.render();
    });
  }

  private calculateAllColumnSums(): void {
    this.columnSums.clear();

    // Only calculate sums for numeric columns (skip id and name)
    // Use a more efficient single-pass calculation
    const sums: { [key: string]: number } = {};

    // Initialize sums for numeric columns
    this.columns.forEach((col) => {
      if (col !== "id" && col !== "name") {
        sums[col] = 0;
      }
    });

    // Single pass through data
    for (let i = 0; i < this.data.length; i++) {
      const row = this.data[i];
      for (const col in sums) {
        const value = row[col];
        if (typeof value === "number") {
          sums[col] += value;
        }
      }
    }

    // Store in map
    for (const col in sums) {
      this.columnSums.set(col, sums[col]);
    }
  }

  private setupEventListeners(): void {
    // Mouse wheel scrolling
    this.canvas.addEventListener("wheel", (e) => {
      e.preventDefault();

      if (e.shiftKey) {
        // Horizontal scroll
        this.scrollLeft = Math.max(
          0,
          Math.min(
            this.scrollLeft + e.deltaY,
            this.columns.length * this.config.columnWidth - this.canvas.width
          )
        );
      } else {
        // Vertical scroll
        this.scrollTop = Math.max(
          0,
          Math.min(
            this.scrollTop + e.deltaY,
            this.data.length * this.config.rowHeight -
              this.canvas.height +
              this.config.headerHeight +
              this.config.sumHeight
          )
        );
      }

      this.render();
    });

    // Mouse click - select row or start editing
    this.canvas.addEventListener("click", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if click is in data area (not header or sum row)
      if (y > this.config.headerHeight + this.config.sumHeight) {
        const rowIndex = Math.floor(
          (y -
            this.config.headerHeight -
            this.config.sumHeight +
            this.scrollTop) /
            this.config.rowHeight
        );
        const colIndex = Math.floor(
          (x + this.scrollLeft) / this.config.columnWidth
        );

        if (
          rowIndex >= 0 &&
          rowIndex < this.data.length &&
          colIndex >= 0 &&
          colIndex < this.columns.length
        ) {
          // Select row
          this.selectedRowIndex = rowIndex;
          if (this.onSelectionChange) {
            this.onSelectionChange(rowIndex);
          }
          this.render();
        }
      }
    });

    // Double click - start editing
    this.canvas.addEventListener("dblclick", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (y > this.config.headerHeight + this.config.sumHeight) {
        const rowIndex = Math.floor(
          (y -
            this.config.headerHeight -
            this.config.sumHeight +
            this.scrollTop) /
            this.config.rowHeight
        );
        const colIndex = Math.floor(
          (x + this.scrollLeft) / this.config.columnWidth
        );

        if (
          rowIndex >= 0 &&
          rowIndex < this.data.length &&
          colIndex >= 0 &&
          colIndex < this.columns.length
        ) {
          this.startEditing(rowIndex, colIndex);
        }
      }
    });

    // Mouse drag for scrolling
    this.canvas.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    this.canvas.addEventListener("mousemove", (e) => {
      if (this.isDragging) {
        const deltaX = e.clientX - this.lastMouseX;
        const deltaY = e.clientY - this.lastMouseY;

        this.scrollLeft = Math.max(
          0,
          Math.min(
            this.scrollLeft - deltaX,
            Math.max(
              0,
              this.columns.length * this.config.columnWidth - this.canvas.width
            )
          )
        );

        this.scrollTop = Math.max(
          0,
          Math.min(
            this.scrollTop - deltaY,
            Math.max(
              0,
              this.data.length * this.config.rowHeight -
                this.canvas.height +
                this.config.headerHeight +
                this.config.sumHeight
            )
          )
        );

        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;

        this.render();
      }
    });

    this.canvas.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    this.canvas.addEventListener("mouseleave", () => {
      this.isDragging = false;
    });

    // Keyboard navigation
    window.addEventListener("keydown", (e) => {
      if (this.selectedRowIndex >= 0) {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            if (this.selectedRowIndex < this.data.length - 1) {
              this.selectedRowIndex++;
              this.ensureRowVisible(this.selectedRowIndex);
              if (this.onSelectionChange) {
                this.onSelectionChange(this.selectedRowIndex);
              }
              this.render();
            }
            break;
          case "ArrowUp":
            e.preventDefault();
            if (this.selectedRowIndex > 0) {
              this.selectedRowIndex--;
              this.ensureRowVisible(this.selectedRowIndex);
              if (this.onSelectionChange) {
                this.onSelectionChange(this.selectedRowIndex);
              }
              this.render();
            }
            break;
          case "Delete":
            if (this.selectedRowIndex >= 0) {
              this.deleteSelectedRow();
            }
            break;
        }
      }
    });
  }

  private ensureRowVisible(rowIndex: number): void {
    const rowTop = rowIndex * this.config.rowHeight;
    const rowBottom = rowTop + this.config.rowHeight;
    const viewportTop = this.scrollTop;
    const viewportBottom =
      this.scrollTop +
      this.canvas.height -
      this.config.headerHeight -
      this.config.sumHeight;

    if (rowTop < viewportTop) {
      this.scrollTop = rowTop;
    } else if (rowBottom > viewportBottom) {
      this.scrollTop =
        rowBottom -
        (this.canvas.height - this.config.headerHeight - this.config.sumHeight);
    }
  }

  private startEditing(rowIndex: number, colIndex: number): void {
    const columnKey = this.columns[colIndex];
    const currentValue = this.data[rowIndex][columnKey];

    // Create input element
    const input = document.createElement("input");
    input.type = "text";
    input.value = currentValue?.toString() || "";
    input.style.position = "absolute";

    const rect = this.canvas.getBoundingClientRect();
    const x = colIndex * this.config.columnWidth - this.scrollLeft;
    const y =
      this.config.headerHeight +
      this.config.sumHeight +
      rowIndex * this.config.rowHeight -
      this.scrollTop;

    input.style.left = `${rect.left + x}px`;
    input.style.top = `${rect.top + y}px`;
    input.style.width = `${this.config.columnWidth - 4}px`;
    input.style.height = `${this.config.rowHeight - 4}px`;
    input.style.fontSize = "14px";
    input.style.padding = "2px";
    input.style.border = "2px solid #0078d4";
    input.style.zIndex = "1000";

    document.body.appendChild(input);
    input.focus();
    input.select();

    const finishEditing = () => {
      const newValue = input.value;

      // Update data
      if (columnKey === "name") {
        this.data[rowIndex][columnKey] = newValue;
      } else {
        const numValue = parseFloat(newValue);
        this.data[rowIndex][columnKey] = isNaN(numValue) ? 0 : numValue;
      }

      // Recalculate sums
      this.calculateAllColumnSums();

      document.body.removeChild(input);
      this.render();

      if (this.onDataChange) {
        this.onDataChange();
      }
    };

    input.addEventListener("blur", finishEditing);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        finishEditing();
      } else if (e.key === "Escape") {
        document.body.removeChild(input);
      }
    });
  }

  public deleteSelectedRow(): void {
    if (
      this.selectedRowIndex >= 0 &&
      this.selectedRowIndex < this.data.length
    ) {
      const startTime = performance.now();

      this.data.splice(this.selectedRowIndex, 1);

      // Recalculate sums
      this.calculateAllColumnSums();

      // Adjust selection
      if (this.selectedRowIndex >= this.data.length) {
        this.selectedRowIndex = this.data.length - 1;
      }

      const endTime = performance.now();
      console.log(`Rij verwijderd in ${(endTime - startTime).toFixed(2)}ms`);

      this.render();

      if (this.onDataChange) {
        this.onDataChange();
      }
      if (this.onSelectionChange) {
        this.onSelectionChange(this.selectedRowIndex);
      }
    }
  }

  public addRow(): void {
    const startTime = performance.now();

    const newRow: GridData = {
      id:
        this.data.length > 0 ? Math.max(...this.data.map((r) => r.id)) + 1 : 1,
      name: `Nieuwe Rij ${this.data.length + 1}`,
    };

    // Add default values for other columns
    this.columns.forEach((col) => {
      if (col !== "id" && col !== "name") {
        newRow[col] = Math.round(Math.random() * 1000 * 100) / 100;
      }
    });

    // Insert after selected row or at end
    const insertIndex =
      this.selectedRowIndex >= 0 ? this.selectedRowIndex + 1 : this.data.length;
    this.data.splice(insertIndex, 0, newRow);

    // Select new row
    this.selectedRowIndex = insertIndex;

    // Recalculate sums
    this.calculateAllColumnSums();

    // Scroll to new row
    this.ensureRowVisible(insertIndex);

    const endTime = performance.now();
    console.log(`Rij toegevoegd in ${(endTime - startTime).toFixed(2)}ms`);

    this.render();

    if (this.onDataChange) {
      this.onDataChange();
    }
    if (this.onSelectionChange) {
      this.onSelectionChange(this.selectedRowIndex);
    }
  }

  private render(): void {
    const startTime = performance.now();

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Calculate visible range
    const startRow = Math.floor(this.scrollTop / this.config.rowHeight);
    const endRow = Math.min(startRow + this.visibleRows, this.data.length);

    const startCol = Math.floor(this.scrollLeft / this.config.columnWidth);
    const endCol = Math.min(
      startCol + this.visibleColumns,
      this.columns.length
    );

    // Draw sum row
    this.drawSumRow(startCol, endCol);

    // Draw header
    this.drawHeader(startCol, endCol);

    // Draw data rows
    this.drawRows(startRow, endRow, startCol, endCol);

    // Draw gridlines
    this.drawGridlines(startRow, endRow, startCol, endCol);

    const endTime = performance.now();
    // Only log occasionally to avoid console spam
    if (Math.random() < 0.01) {
      console.log(`Render tijd: ${(endTime - startTime).toFixed(2)}ms`);
    }
  }

  private drawSumRow(startCol: number, endCol: number): void {
    // Background
    this.ctx.fillStyle = "#f8f8f8";
    this.ctx.fillRect(
      0,
      this.config.headerHeight,
      this.canvas.width,
      this.config.sumHeight
    );

    this.ctx.font = "bold 13px Arial";
    this.ctx.fillStyle = "#333";
    this.ctx.textAlign = "right";
    this.ctx.textBaseline = "middle";

    for (let i = startCol; i < endCol; i++) {
      const col = this.columns[i];
      const x = i * this.config.columnWidth - this.scrollLeft;
      const sum = this.columnSums.get(col);

      if (sum !== undefined) {
        const text = `Σ ${sum.toLocaleString("nl-NL", {
          maximumFractionDigits: 2,
        })}`;
        this.ctx.fillText(
          text,
          x + this.config.columnWidth - 5,
          this.config.headerHeight + this.config.sumHeight / 2
        );
      } else if (col === "id") {
        this.ctx.fillStyle = "#666";
        this.ctx.textAlign = "center";
        this.ctx.fillText(
          "Som →",
          x + this.config.columnWidth / 2,
          this.config.headerHeight + this.config.sumHeight / 2
        );
        this.ctx.textAlign = "right";
        this.ctx.fillStyle = "#333";
      }
    }
  }

  private drawHeader(startCol: number, endCol: number): void {
    // Background
    this.ctx.fillStyle = "#0078d4";
    this.ctx.fillRect(0, 0, this.canvas.width, this.config.headerHeight);

    this.ctx.font = "bold 14px Arial";
    this.ctx.fillStyle = "#fff";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    for (let i = startCol; i < endCol; i++) {
      const col = this.columns[i];
      const x = i * this.config.columnWidth - this.scrollLeft;

      let headerText = col;
      if (col === "id") headerText = "ID";
      else if (col === "name") headerText = "Naam";
      else if (col.startsWith("col_")) headerText = `Kolom ${col.substring(4)}`;

      this.ctx.fillText(
        headerText,
        x + this.config.columnWidth / 2,
        this.config.headerHeight / 2
      );
    }
  }

  private drawRows(
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number
  ): void {
    this.ctx.font = "13px Arial";
    this.ctx.textBaseline = "middle";

    for (let rowIdx = startRow; rowIdx < endRow; rowIdx++) {
      const row = this.data[rowIdx];
      const y =
        this.config.headerHeight +
        this.config.sumHeight +
        rowIdx * this.config.rowHeight -
        this.scrollTop;

      // Row background (highlight selected)
      if (rowIdx === this.selectedRowIndex) {
        this.ctx.fillStyle = "#e3f2fd";
        this.ctx.fillRect(0, y, this.canvas.width, this.config.rowHeight);
      } else if (rowIdx % 2 === 0) {
        this.ctx.fillStyle = "#fafafa";
        this.ctx.fillRect(0, y, this.canvas.width, this.config.rowHeight);
      }

      // Cell text
      for (let colIdx = startCol; colIdx < endCol; colIdx++) {
        const col = this.columns[colIdx];
        const x = colIdx * this.config.columnWidth - this.scrollLeft;
        const value = row[col];

        if (col === "id" || col === "name") {
          this.ctx.fillStyle = "#000";
          this.ctx.textAlign = "left";
          this.ctx.fillText(
            value?.toString() || "",
            x + 5,
            y + this.config.rowHeight / 2,
            this.config.columnWidth - 10
          );
        } else {
          this.ctx.fillStyle = "#333";
          this.ctx.textAlign = "right";
          const text =
            typeof value === "number"
              ? value.toLocaleString("nl-NL", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "";
          this.ctx.fillText(
            text,
            x + this.config.columnWidth - 5,
            y + this.config.rowHeight / 2,
            this.config.columnWidth - 10
          );
        }
      }
    }
  }

  private drawGridlines(
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number
  ): void {
    this.ctx.strokeStyle = "#ddd";
    this.ctx.lineWidth = 1;

    // Vertical lines
    for (let i = startCol; i <= endCol; i++) {
      const x = i * this.config.columnWidth - this.scrollLeft;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    // Horizontal lines
    // Header bottom
    this.ctx.strokeStyle = "#fff";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.config.headerHeight);
    this.ctx.lineTo(this.canvas.width, this.config.headerHeight);
    this.ctx.stroke();

    // Sum row bottom
    this.ctx.strokeStyle = "#999";
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.config.headerHeight + this.config.sumHeight);
    this.ctx.lineTo(
      this.canvas.width,
      this.config.headerHeight + this.config.sumHeight
    );
    this.ctx.stroke();

    // Data rows
    this.ctx.strokeStyle = "#ddd";
    this.ctx.lineWidth = 1;
    for (let rowIdx = startRow; rowIdx <= endRow; rowIdx++) {
      const y =
        this.config.headerHeight +
        this.config.sumHeight +
        rowIdx * this.config.rowHeight -
        this.scrollTop;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  public updateData(newData: GridData[]): void {
    this.data = newData;
    this.calculateAllColumnSums();
    this.selectedRowIndex = -1;
    this.scrollTop = 0;
    this.scrollLeft = 0;
    this.render();
  }

  public refresh(): void {
    this.render();
  }

  public getSelectedRow(): GridData | null {
    return this.selectedRowIndex >= 0 ? this.data[this.selectedRowIndex] : null;
  }

  public getDataCount(): number {
    return this.data.length;
  }
}
