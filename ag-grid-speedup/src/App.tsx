import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent, GridApi } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';

import { generateColumnDefinitions } from './columns';
import { Employee, NextIdState } from './types';

// Import shared data generator
// @ts-ignore - TypeScript might complain about path resolution
import {
  roles,
  generateEmployee,
  generateChunk,
} from '../../src/data';

import './App.css';

function App() {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [selectedCount, setSelectedCount] = useState(0);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const nextIdRef = useRef(1);
  const gridInitStartRef = useRef<number>(0);

  // Memoized column definitions - only created once
  const columnDefs = useMemo<ColDef[]>(() => generateColumnDefinitions(), []);

  // Optimized grid options - no grouping, no aggregations, minimal overhead
  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    editable: true,
    minWidth: 80,
    maxWidth: 300,
  }), []);

  // Grid ready callback
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    
    // Log AG Grid rendering time (excluding data generation)
    if (gridInitStartRef.current > 0) {
      const gridRenderTime = performance.now() - gridInitStartRef.current;
      console.log('=== PERFORMANCE: AG GRID RENDERING ===');
      console.log(`AG Grid Init Time: ${gridRenderTime.toFixed(2)}ms`);
      console.log('Grid is ready to use');
    }
  }, []);

  // Selection changed callback
  const onSelectionChanged = useCallback(() => {
    if (!gridApi) return;
    const selectedRows = gridApi.getSelectedRows();
    setSelectedCount(selectedRows.length);
  }, [gridApi]);

  // Generate data on mount
  useEffect(() => {
    const generateData = async () => {
      const dataGenStart = performance.now();
      console.log('=== PERFORMANCE: DATA GENERATION START ===');

      const targetRows = 200000;
      const data: Employee[] = [];
      
      const nextIdState: NextIdState = {
        value: nextIdRef.current,
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

      const updateProgress = (count: number) => {
        setProgress(count);
      };

      try {
        await generateChunk(data, targetRows, nextIdState, updateProgress, 10000);
        nextIdRef.current = nextIdState.getValue();

        const dataGenEnd = performance.now();
        const dataGenTime = dataGenEnd - dataGenStart;
        
        console.log('=== PERFORMANCE: DATA GENERATION COMPLETE ===');
        console.log(`Generated ${data.length} rows in ${dataGenTime.toFixed(2)}ms`);
        console.log(`Speed: ${(data.length / (dataGenTime / 1000)).toFixed(0)} rows/sec`);

        // Mark when we start loading the grid (after data generation)
        gridInitStartRef.current = performance.now();
        
        setRowData(data);
        setLoading(false);

        // Wait for grid to fully stabilize
        setTimeout(() => {
          const totalTime = performance.now() - dataGenStart;
          console.log('=== PERFORMANCE: TOTAL TIME (DATA GENERATION + AG GRID RENDERING) ===');
          console.log(`Total Time: ${totalTime.toFixed(2)}ms`);
        }, 1000);
      } catch (error) {
        console.error('Error generating data:', error);
        setLoading(false);
      }
    };

    generateData();
  }, []);

  // CRUD: Add new row
  const addNewRow = useCallback(() => {
    if (!gridApi) return;

    const perfStart = performance.now();
    console.log('=== PERFORMANCE: ADD ROW START ===');

    const selectedRows = gridApi.getSelectedRows();
    let selectedDept = 'Engineering';
    let selectedTeam = 'Frontend Team';

    // Use selected row's department/team if available
    if (selectedRows.length > 0 && selectedRows[0]) {
      selectedDept = selectedRows[0].department;
      selectedTeam = selectedRows[0].team;
    }

    const teamRoles = roles[selectedDept] || [];
    const role = teamRoles[Math.floor(Math.random() * teamRoles.length)] || 'Developer';

    const newEmployee = generateEmployee(
      nextIdRef.current++,
      selectedDept,
      selectedTeam,
      role
    );

    // Use transaction API for optimal performance
    const transaction = gridApi.applyTransaction({
      add: [newEmployee],
      addIndex: 0, // Add at top for visibility
    });

    const perfEnd = performance.now();
    console.log('=== PERFORMANCE: ADD ROW COMPLETE ===');
    console.log(`Time: ${(perfEnd - perfStart).toFixed(2)}ms`);
    console.log('Transaction result:', transaction);

    // Select the new row
    if (transaction?.add && transaction.add.length > 0) {
      transaction.add[0].setSelected(true);
      gridApi.ensureNodeVisible(transaction.add[0], 'top');
    }
  }, [gridApi]);

  // CRUD: Delete selected rows
  const deleteSelectedRows = useCallback(() => {
    if (!gridApi) return;

    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      alert('Please select rows to delete');
      return;
    }

    const perfStart = performance.now();
    console.log('=== PERFORMANCE: DELETE ROWS START ===');
    console.log(`Deleting ${selectedRows.length} rows`);

    // Use transaction API for optimal performance
    const transaction = gridApi.applyTransaction({
      remove: selectedRows,
    });

    const perfEnd = performance.now();
    console.log('=== PERFORMANCE: DELETE ROWS COMPLETE ===');
    console.log(`Time: ${(perfEnd - perfStart).toFixed(2)}ms`);
    console.log('Transaction result:', transaction);
  }, [gridApi]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">
          Generating data... {progress.toLocaleString('nl-NL')} rows
        </p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-top">
          <a href="/" className="back-link">← Back to Home</a>
        </div>
        <h1>🚀 AG Grid Speedup - Optimized Performance</h1>
        <p>200,000 rows × 500 columns with React</p>
      </header>

      <div className="toolbar">
        <div className="toolbar-info">
          <span className="info-badge">
            📊 {rowData.length.toLocaleString('nl-NL')} Rows
          </span>
          <span className="info-badge">
            📋 {columnDefs.length} Columns
          </span>
          <span className="info-badge">
            ✓ {selectedCount} Selected
          </span>
        </div>
        <div className="toolbar-actions">
          <button
            className="btn btn-primary"
            onClick={addNewRow}
            disabled={!gridApi}
          >
            ➕ Add Row
          </button>
          <button
            className="btn btn-danger"
            onClick={deleteSelectedRows}
            disabled={selectedCount === 0}
          >
            🗑️ Delete ({selectedCount})
          </button>
        </div>
      </div>

      <div className="grid-wrapper">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          onSelectionChanged={onSelectionChanged}
          
          // Performance optimizations
          animateRows={false}
          suppressColumnVirtualisation={false}
          suppressRowVirtualisation={false}
          rowBuffer={10}
          debounceVerticalScrollbar={false}
          
          // Selection
          rowSelection="multiple"
          suppressRowClickSelection={false}
          
          // Other settings
          enableCellTextSelection={true}
          ensureDomOrder={false}
          suppressRowHoverHighlight={false}
          
          // React-specific optimizations
          getRowId={(params) => params.data.id.toString()}
        />
      </div>

      <div className="info-panel">
        <strong>💡 Optimizations:</strong> No row grouping • No aggregations • 
        Simple formatters • Column virtualization • Row virtualization • 
        No animations • Transaction-based updates
      </div>
    </div>
  );
}

export default App;

